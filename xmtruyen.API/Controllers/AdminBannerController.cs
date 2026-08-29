using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xmtruyen.API.Data;
using Xmtruyen.API.Models;

namespace Xmtruyen.API.Controllers;

[ApiController]
public class AdminBannerController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminBannerController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("api/admin/banners")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetBanners()
    {
        var banners = await _context.Banners
            .OrderBy(b => b.OrderIndex)
            .ThenByDescending(b => b.CreatedAt)
            .ToListAsync();
        return Ok(banners);
    }

    [HttpPost("api/admin/banners")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateBanner([FromBody] Banner banner)
    {
        _context.Banners.Add(banner);
        await _context.SaveChangesAsync();
        return Ok(banner);
    }

    [HttpPut("api/admin/banners/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateBanner(Guid id, [FromBody] Banner req)
    {
        var banner = await _context.Banners.FindAsync(id);
        if (banner == null) return NotFound();

        banner.ImageUrl = req.ImageUrl;
        banner.LinkUrl = req.LinkUrl;
        banner.Title = req.Title;
        banner.Subtitle = req.Subtitle;
        banner.IsActive = req.IsActive;
        banner.OrderIndex = req.OrderIndex;
        banner.Position = req.Position;

        await _context.SaveChangesAsync();
        return Ok(banner);
    }

    [HttpDelete("api/admin/banners/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteBanner(Guid id)
    {
        var banner = await _context.Banners.FindAsync(id);
        if (banner == null) return NotFound();

        _context.Banners.Remove(banner);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Deleted" });
    }
}
