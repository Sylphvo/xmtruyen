using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xmtruyen.API.Data;
using Xmtruyen.API.Models;

namespace Xmtruyen.API.Controllers;

[ApiController]
public class AdminHomeSectionController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminHomeSectionController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("api/admin/home-sections")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetHomeSections()
    {
        var sections = await _context.HomeSections
            .OrderBy(s => s.OrderIndex)
            .ThenByDescending(s => s.CreatedAt)
            .ToListAsync();
        return Ok(sections);
    }

    [HttpPost("api/admin/home-sections")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateHomeSection([FromBody] HomeSection section)
    {
        _context.HomeSections.Add(section);
        await _context.SaveChangesAsync();
        return Ok(section);
    }

    [HttpPut("api/admin/home-sections/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateHomeSection(Guid id, [FromBody] HomeSection req)
    {
        var section = await _context.HomeSections.FindAsync(id);
        if (section == null) return NotFound();

        section.Title = req.Title;
        section.Description = req.Description;
        section.Type = req.Type;
        section.IsActive = req.IsActive;
        section.OrderIndex = req.OrderIndex;
        section.PublicationIds = req.PublicationIds;
        section.QueryType = req.QueryType;
        section.ItemLimit = req.ItemLimit;

        await _context.SaveChangesAsync();
        return Ok(section);
    }

    [HttpDelete("api/admin/home-sections/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteHomeSection(Guid id)
    {
        var section = await _context.HomeSections.FindAsync(id);
        if (section == null) return NotFound();

        _context.HomeSections.Remove(section);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Deleted" });
    }
}
