using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xmtruyen.API.Data;
using Xmtruyen.API.Models.Requests;
using Xmtruyen.API.Services;

namespace Xmtruyen.API.Controllers;

[Route("api/admin/payment")]
[ApiController]
[Authorize(Roles = "Admin")]
public class AdminPaymentController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IPaymentService _paymentService;

    public AdminPaymentController(ApplicationDbContext context, IPaymentService paymentService)
    {
        _context = context;
        _paymentService = paymentService;
    }

    [HttpGet("transactions")]
    public async Task<IActionResult> GetTransactions([FromQuery] string? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var query = _context.Transactions.Include(t => t.User).AsQueryable();

        if (!string.IsNullOrEmpty(status))
        {
            query = query.Where(t => t.Status == status);
        }

        var totalCount = await query.CountAsync();
        var items = await query.OrderByDescending(t => t.CreatedAt)
                               .Skip((page - 1) * pageSize)
                               .Take(pageSize)
                               .Select(t => new
                               {
                                   t.Id,
                                   t.Amount,
                                   t.CoinAmount,
                                   t.TransactionType,
                                   t.Status,
                                   t.PaymentMethod,
                                   t.CreatedAt,
                                   t.CompletedAt,
                                   t.Note,
                                   User = new { t.User!.Id, t.User.FullName, t.User.Email }
                               })
                               .ToListAsync();

        return Ok(new
        {
            Data = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        });
    }

    [HttpPost("manual-topup")]
    public async Task<IActionResult> ManualTopUp([FromBody] ManualTopUpRequest request)
    {
        try
        {
            var transaction = await _paymentService.CreateManualTopUpAsync(request);
            return Ok(new { message = "Manual top-up successful", transactionId = transaction.Id });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = Xmtruyen.API.Helpers.ExceptionHelper.GetFriendlyMessage(ex) });
        }
    }

    [HttpPatch("{id}/approve")]
    public async Task<IActionResult> ApproveTransaction(Guid id)
    {
        var transaction = await _context.Transactions.Include(t => t.User).FirstOrDefaultAsync(t => t.Id == id);
        if (transaction == null) return NotFound();
        if (transaction.Status == "Completed") return BadRequest("Already completed.");

        transaction.Status = "Completed";
        transaction.CompletedAt = DateTime.UtcNow;

        if (transaction.TransactionType == "TopUp" && transaction.CoinAmount.HasValue)
        {
            transaction.User!.CoinBalance = (transaction.User.CoinBalance ?? 0) + transaction.CoinAmount.Value;
        }
        else if (transaction.TransactionType == "Subscription" && transaction.SubscriptionPlanId.HasValue)
        {
            var plan = await _context.SubscriptionPlans.FindAsync(transaction.SubscriptionPlanId.Value);
            if (plan != null)
            {
                transaction.User!.CurrentPlanId = plan.Id;
                transaction.User.PlanExpiredAt = DateTime.UtcNow.AddDays(plan.DurationDays);
            }
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Transaction approved." });
    }

    [HttpGet("revenue-summary")]
    public async Task<IActionResult> GetRevenueSummary()
    {
        var totalRevenue = await _context.Transactions
            .Where(t => t.Status == "Completed")
            .SumAsync(t => t.Amount);

        var todayRevenue = await _context.Transactions
            .Where(t => t.Status == "Completed" && t.CompletedAt >= DateTime.UtcNow.Date)
            .SumAsync(t => t.Amount);

        return Ok(new { TotalRevenue = totalRevenue, TodayRevenue = todayRevenue });
    }
}

