using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;

namespace XomTruyen.API.Controllers;

[Route("api/admin/transactions")]
[Authorize(Roles = "Admin")]
public class AdminTransactionController : BaseApiController
{
    private readonly ApplicationDbContext _context;

    public AdminTransactionController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTransactions(
        [FromQuery] string? userId,
        [FromQuery] string? transactionType,
        [FromQuery] string? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = _context.Transactions
            .Include(t => t.User)
            .Include(t => t.SubscriptionPlan)
            .AsQueryable();

        if (!string.IsNullOrEmpty(userId) && Guid.TryParse(userId, out var uid))
        {
            query = query.Where(t => t.UserId == uid);
        }

        if (!string.IsNullOrEmpty(transactionType))
        {
            query = query.Where(t => t.TransactionType == transactionType);
        }

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(t => t.Status == status);
        }

        var totalCount = await query.CountAsync();

        var transactions = await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new
            {
                t.Id,
                t.UserId,
                UserEmail = t.User != null ? t.User.Email : null,
                t.Amount,
                t.CoinAmount,
                t.TransactionType,
                t.PaymentMethod,
                t.Status,
                t.Note,
                t.CreatedAt,
                t.CompletedAt,
                PlanName = t.SubscriptionPlan != null ? t.SubscriptionPlan.Name : null
            })
            .ToListAsync();

        return Ok(new
        {
            Data = transactions,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTransactionById(Guid id)
    {
        var transaction = await _context.Transactions
            .Include(t => t.User)
            .Include(t => t.SubscriptionPlan)
            .Select(t => new
            {
                t.Id,
                t.UserId,
                UserEmail = t.User != null ? t.User.Email : null,
                UserFullName = t.User != null ? t.User.FullName : null,
                t.Amount,
                t.CoinAmount,
                t.TransactionType,
                t.PaymentMethod,
                t.ExternalTransactionId,
                t.Status,
                t.Note,
                t.CreatedAt,
                t.CompletedAt,
                PlanName = t.SubscriptionPlan != null ? t.SubscriptionPlan.Name : null
            })
            .FirstOrDefaultAsync(t => t.Id == id);

        if (transaction == null)
            return NotFound();

        return Ok(transaction);
    }

    [HttpGet("revenue-summary")]
    public async Task<IActionResult> GetRevenueSummary()
    {
        var today = DateTime.UtcNow.Date;
        
        var totalRevenue = await _context.Transactions
            .Where(t => t.Status == "Success" || t.Status == "Completed")
            .SumAsync(t => t.Amount);

        var todayRevenue = await _context.Transactions
            .Where(t => (t.Status == "Success" || t.Status == "Completed") && t.CreatedAt >= today)
            .SumAsync(t => t.Amount);

        return Ok(new
        {
            totalRevenue,
            todayRevenue
        });
    }

    [HttpPatch("{id}/approve")]
    public async Task<IActionResult> ApproveTransaction(Guid id)
    {
        var transaction = await _context.Transactions.FindAsync(id);
        if (transaction == null) return NotFound(new { message = "Giao dịch không tồn tại" });
        if (transaction.Status != "Pending") return BadRequest(new { message = "Giao dịch không ở trạng thái chờ duyệt" });

        transaction.Status = "Completed";
        transaction.CompletedAt = DateTime.UtcNow;

        if (transaction.TransactionType == "TopUp" && transaction.CoinAmount.HasValue && transaction.UserId.HasValue)
        {
            var user = await _context.Users.FindAsync(transaction.UserId);
            if (user != null)
            {
                user.CoinBalance += transaction.CoinAmount.Value;
            }
        }
        else if (transaction.TransactionType == "Subscription" && transaction.SubscriptionPlanId.HasValue && transaction.UserId.HasValue)
        {
            var user = await _context.Users.FindAsync(transaction.UserId);
            var plan = await _context.SubscriptionPlans.FindAsync(transaction.SubscriptionPlanId);
            if (user != null && plan != null)
            {
                user.CurrentPlanId = plan.Id;
                user.PlanExpiredAt = DateTime.UtcNow.AddDays(plan.DurationDays);
            }
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Duyệt giao dịch thành công" });
    }
}
