using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using XomTruyen.API.Models;
using XomTruyen.API.Models.Responses;
using XomTruyen.API.Services.Interfaces;

namespace XomTruyen.API.Controllers;

public class ReadingController : BaseApiController
{
    private readonly IReadingService _readingService;

    public ReadingController(IReadingService readingService)
    {
        _readingService = readingService;
    }

    [AllowAnonymous]
    [HttpGet("chapter/{chapterId}")]
    public async Task<ActionResult<ApiResponse<ChapterContentResponse>>> GetChapterContent(Guid chapterId)
    {
        try
        {
            Guid? userId = null;
            if (User.Identity != null && User.Identity.IsAuthenticated)
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (Guid.TryParse(userIdClaim, out var parsedId))
                {
                    userId = parsedId;
                }
            }

            var result = await _readingService.GetChapterContentAsync(chapterId, userId);
            return Ok(ApiResponse<ChapterContentResponse>.Ok(result));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<ChapterContentResponse>.Error(ex.Message));
        }
    }
    [Authorize]
    [HttpPost("chapter/{chapterId}/purchase")]
    public async Task<ActionResult<ApiResponse<bool>>> PurchaseChapter(Guid chapterId)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized(ApiResponse<bool>.Error("Invalid user token"));

            var success = await _readingService.PurchaseChapterAsync(chapterId, userId);
            return Ok(ApiResponse<bool>.Ok(success));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<bool>.Error(ex.Message));
        }
    }
}


