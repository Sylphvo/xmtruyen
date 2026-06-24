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
}
