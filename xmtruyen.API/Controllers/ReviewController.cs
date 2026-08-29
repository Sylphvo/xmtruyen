using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Xmtruyen.API.Models.Requests;
using Xmtruyen.API.Services.Interfaces;

namespace Xmtruyen.API.Controllers;

[Route("api/[controller]")]
public class ReviewController : BaseApiController
{
    private readonly IEngagementService _engagementService;

    public ReviewController(IEngagementService engagementService)
    {
        _engagementService = engagementService;
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var userId) ? userId : Guid.Empty;
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateReview([FromBody] ReviewRequest request)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        try
        {
            var result = await _engagementService.CreateReviewAsync(userId, request);
            return Ok(new { success = true, data = result });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = Xmtruyen.API.Helpers.ExceptionHelper.GetFriendlyMessage(ex) });
        }
    }

    [HttpGet("publication/{publicationId}")]
    public async Task<IActionResult> GetReviews(Guid publicationId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var (reviews, totalCount) = await _engagementService.GetReviewsAsync(publicationId, page, pageSize);
        return Ok(new
        {
            success = true,
            data = reviews,
            totalCount,
            page,
            pageSize
        });
    }

    [Authorize]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyReviews([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var (reviews, totalCount) = await _engagementService.GetMyReviewsAsync(userId, page, pageSize);
        return Ok(new
        {
            success = true,
            data = reviews,
            totalCount,
            page,
            pageSize
        });
    }

    [Authorize]
    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateReview(Guid id, [FromBody] ReviewUpdateRequest request)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        try
        {
            var result = await _engagementService.UpdateReviewAsync(userId, id, request);
            return Ok(new { success = true, data = result });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { success = false, message = Xmtruyen.API.Helpers.ExceptionHelper.GetFriendlyMessage(ex) });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = Xmtruyen.API.Helpers.ExceptionHelper.GetFriendlyMessage(ex) });
        }
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReview(Guid id)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        await _engagementService.DeleteReviewAsync(userId, id);
        return Ok(new { success = true, message = "Review deleted" });
    }
}

