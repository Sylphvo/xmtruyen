using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Xmtruyen.API.Models.Requests;
using Xmtruyen.API.Services;
using Xmtruyen.API.Data;
using Microsoft.EntityFrameworkCore;

namespace Xmtruyen.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;
    private readonly ApplicationDbContext _context;

    public PaymentController(IPaymentService paymentService, ApplicationDbContext context)
    {
        _paymentService = paymentService;
        _context = context;
    }

    private Guid GetUserId()
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user token.");
        }
        return userId;
    }

    [Authorize]
    [HttpPost("top-up")]
    public async Task<IActionResult> TopUp([FromBody] TopUpRequest request)
    {
        try
        {
            var userId = GetUserId();
            var response = await _paymentService.CreateTopUpOrderAsync(userId, request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = Xmtruyen.API.Helpers.ExceptionHelper.GetFriendlyMessage(ex) });
        }
    }

    [Authorize]
    [HttpPost("subscribe")]
    public async Task<IActionResult> Subscribe([FromBody] PurchaseSubscriptionRequest request)
    {
        try
        {
            var userId = GetUserId();
            var response = await _paymentService.CreateSubscriptionOrderAsync(userId, request);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = Xmtruyen.API.Helpers.ExceptionHelper.GetFriendlyMessage(ex) });
        }
    }

    // Webhook from gateway
    [HttpPost("callback/{gateway}")]
    public async Task<IActionResult> Callback(string gateway, [FromBody] PaymentCallbackRequest request)
    {
        try
        {
            // Usually gateway validates signatures here
            var success = await _paymentService.ProcessCallbackAsync(request);
            if (success) return Ok(new { message = "Success" });
            return BadRequest(new { message = "Failed to process callback" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = Xmtruyen.API.Helpers.ExceptionHelper.GetFriendlyMessage(ex) });
        }
    }

    [Authorize]
    [HttpGet("wallet")]
    public async Task<IActionResult> GetWallet()
    {
        try
        {
            var userId = GetUserId();
            var wallet = await _paymentService.GetWalletAsync(userId);
            return Ok(wallet);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = Xmtruyen.API.Helpers.ExceptionHelper.GetFriendlyMessage(ex) });
        }
    }

    [Authorize]
    [HttpGet("history")]
    public async Task<IActionResult> GetHistory([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        try
        {
            var userId = GetUserId();
            var query = _context.Transactions.Where(t => t.UserId == userId).OrderByDescending(t => t.CreatedAt);
            
            var totalCount = await query.CountAsync();
            var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            return Ok(new
            {
                Data = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = Xmtruyen.API.Helpers.ExceptionHelper.GetFriendlyMessage(ex) });
        }
    }
}

