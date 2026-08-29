using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Xmtruyen.API.Services.Interfaces;

namespace Xmtruyen.API.Controllers;

[Route("api/[controller]")]
[Authorize]
public class FavoriteController : BaseApiController
{
    private readonly IEngagementService _engagementService;

    public FavoriteController(IEngagementService engagementService)
    {
        _engagementService = engagementService;
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.TryParse(claim, out var userId) ? userId : Guid.Empty;
    }

    [HttpPost("toggle/{publicationId}")]
    public async Task<IActionResult> ToggleFavorite(Guid publicationId)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var result = await _engagementService.ToggleFavoriteAsync(userId, publicationId);
        return Ok(new { success = true, data = result, message = result == null ? "Removed from favorites" : "Added to favorites" });
    }

    [HttpGet]
    public async Task<IActionResult> GetFavorites([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var (favorites, totalCount) = await _engagementService.GetFavoritesAsync(userId, page, pageSize);
        return Ok(new
        {
            success = true,
            data = favorites,
            totalCount,
            page,
            pageSize
        });
    }

    [HttpGet("check/{publicationId}")]
    public async Task<IActionResult> CheckFavorite(Guid publicationId)
    {
        var userId = GetUserId();
        if (userId == Guid.Empty) return Unauthorized();

        var isFavorite = await _engagementService.CheckFavoriteAsync(userId, publicationId);
        return Ok(new { success = true, data = isFavorite });
    }
}
