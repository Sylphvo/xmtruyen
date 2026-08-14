using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XomTruyen.API.Models.Requests;
using XomTruyen.API.Services.Interfaces;

namespace XomTruyen.API.Controllers;

[Route("api/[controller]")]
[Authorize]
public class BookmarkController : BaseApiController
{
    private readonly IEngagementService _engagementService;

    public BookmarkController(IEngagementService engagementService)
    {
        _engagementService = engagementService;
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var userId) ? userId : Guid.Empty;
    }

    [HttpPost]
    public async Task<IActionResult> ToggleBookmark([FromBody] BookmarkRequest request)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var result = await _engagementService.ToggleBookmarkAsync(userId, request);
        return Ok(new { success = true, data = result, message = result == null ? "Removed bookmark" : "Added bookmark" });
    }

    [HttpGet]
    public async Task<IActionResult> GetBookmarks([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var (bookmarks, totalCount) = await _engagementService.GetBookmarksAsync(userId, page, pageSize);
        return Ok(new
        {
            success = true,
            data = bookmarks,
            totalCount,
            page,
            pageSize
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBookmark(Guid id)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        await _engagementService.DeleteBookmarkAsync(userId, id);
        return Ok(new { success = true, message = "Bookmark deleted" });
    }
}
