using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XomTruyen.API.Models.Enums;
using XomTruyen.API.Services.Interfaces;

namespace XomTruyen.API.Controllers;

[Route("api/[controller]")]
[AllowAnonymous]
public class DiscoveryController : BaseApiController
{
    private readonly IDiscoveryService _discoveryService;

    public DiscoveryController(IDiscoveryService discoveryService)
    {
        _discoveryService = discoveryService;
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search(
        [FromQuery] string? q,
        [FromQuery] string? categorySlug,
        [FromQuery] FormatType? formatType,
        [FromQuery] AccessLevel? accessLevel,
        [FromQuery] string? displayLabel,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var (publications, totalCount) = await _discoveryService.SearchPublicationsAsync(q, categorySlug, formatType, accessLevel, displayLabel, page, pageSize);
        return Ok(new
        {
            Data = publications,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        });
    }

    [HttpGet("trending")]
    public async Task<IActionResult> GetTrending([FromQuery] string period = "week", [FromQuery] int limit = 10)
    {
        var publications = await _discoveryService.GetTrendingPublicationsAsync(period, limit);
        return Ok(new { Data = publications });
    }

    [HttpGet("{id}/similar")]
    public async Task<IActionResult> GetSimilar(Guid id, [FromQuery] int limit = 6)
    {
        var publications = await _discoveryService.GetSimilarPublicationsAsync(id, limit);
        return Ok(new { Data = publications });
    }

    [HttpPost("{id}/view")]
    public async Task<IActionResult> IncrementViewCount(Guid id)
    {
        await _discoveryService.IncrementViewCountAsync(id);
        return NoContent();
    }
}
