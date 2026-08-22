using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;

namespace XomTruyen.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PagesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PagesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetPageBySlug(string slug)
    {
        var page = await _context.StaticPages
            .Where(p => p.Status == "Published" && p.Slug == slug)
            .FirstOrDefaultAsync();

        if (page == null)
            return NotFound();

        return Ok(page);
    }
}

[ApiController]
[Route("api/admin/pages")]
[Authorize(Roles = "Admin")]
public class AdminPagesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminPagesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllPages()
    {
        var pages = await _context.StaticPages.OrderByDescending(p => p.UpdatedAt).ToListAsync();
        return Ok(pages);
    }

    [HttpPost]
    public async Task<IActionResult> CreatePage(StaticPage page)
    {
        page.CreatedAt = DateTimeOffset.UtcNow;
        page.UpdatedAt = DateTimeOffset.UtcNow;
        _context.StaticPages.Add(page);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAllPages), new { id = page.Id }, page);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePage(Guid id, StaticPage updatedPage)
    {
        var page = await _context.StaticPages.FindAsync(id);
        if (page == null) return NotFound();

        page.Slug = updatedPage.Slug;
        page.Title = updatedPage.Title;
        page.Content = updatedPage.Content;
        page.MetaTitle = updatedPage.MetaTitle;
        page.MetaDescription = updatedPage.MetaDescription;
        page.Status = updatedPage.Status;
        page.UpdatedAt = DateTimeOffset.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePage(Guid id)
    {
        var page = await _context.StaticPages.FindAsync(id);
        if (page == null) return NotFound();

        _context.StaticPages.Remove(page);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
