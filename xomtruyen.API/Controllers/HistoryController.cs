using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XomTruyen.API.Models.Requests;
using XomTruyen.API.Services.Interfaces;

namespace XomTruyen.API.Controllers;

[Route("api/[controller]")]
[Authorize]
public class HistoryController : BaseApiController
{
    private readonly IEngagementService _engagementService;

    public HistoryController(IEngagementService engagementService)
    {
        _engagementService = engagementService;
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var userId) ? userId : Guid.Empty;
    }

    [HttpPost]
    public async Task<IActionResult> SaveHistory([FromBody] HistoryRequest request)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var result = await _engagementService.SaveHistoryAsync(userId, request);
        return Ok(new { success = true, data = result });
    }

    [HttpGet]
    public async Task<IActionResult> GetHistory([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var (histories, totalCount) = await _engagementService.GetHistoryAsync(userId, page, pageSize);
        return Ok(new
        {
            success = true,
            data = histories,
            totalCount,
            page,
            pageSize
        });
    }

    [HttpDelete("{publicationId}")]
    public async Task<IActionResult> DeleteHistory(Guid publicationId)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        await _engagementService.DeleteHistoryAsync(userId, publicationId);
        return Ok(new { success = true, message = "History deleted" });
    }

    [HttpDelete("clear")]
    public async Task<IActionResult> ClearHistory()
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        await _engagementService.ClearHistoryAsync(userId);
        return Ok(new { success = true, message = "All history cleared" });
    }
}
