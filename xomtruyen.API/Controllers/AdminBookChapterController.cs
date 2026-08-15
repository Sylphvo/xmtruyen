using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;

namespace XomTruyen.API.Controllers;

[ApiController]
public class AdminBookChapterController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminBookChapterController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("api/admin/book-chapters")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetChapters([FromQuery] Guid publicationId)
    {
        var chapters = await _context.BookChapters
            .Where(c => c.PublicationId == publicationId)
            .OrderBy(c => c.ChapterNumber)
            .Select(c => new
            {
                c.Id,
                c.PublicationId,
                c.ChapterNumber,
                c.Title,
                c.IsLocked,
                c.CoinPrice,
                c.ViewCount,
                c.CreatedAt,
                // Don't fetch full content in list view for performance
                ContentPreview = c.Content != null ? (c.Content.Length > 100 ? c.Content.Substring(0, 100) + "..." : c.Content) : ""
            })
            .ToListAsync();
        return Ok(chapters);
    }
    
    [HttpGet("api/admin/book-chapters/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetChapter(Guid id)
    {
        var chapter = await _context.BookChapters.FindAsync(id);
        if (chapter == null) return NotFound();
        return Ok(chapter);
    }

    [HttpPost("api/admin/book-chapters")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateChapter([FromBody] BookChapter chapter)
    {
        chapter.Id = Guid.NewGuid();
        chapter.CreatedAt = DateTime.UtcNow;
        chapter.ViewCount = 0;

        _context.BookChapters.Add(chapter);
        await _context.SaveChangesAsync();
        return Ok(chapter);
    }

    [HttpPut("api/admin/book-chapters/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateChapter(Guid id, [FromBody] BookChapter req)
    {
        var chapter = await _context.BookChapters.FindAsync(id);
        if (chapter == null) return NotFound();

        chapter.ChapterNumber = req.ChapterNumber;
        chapter.Title = req.Title;
        chapter.Content = req.Content;
        chapter.IsLocked = req.IsLocked;
        chapter.CoinPrice = req.CoinPrice;

        await _context.SaveChangesAsync();
        return Ok(chapter);
    }

    [HttpDelete("api/admin/book-chapters/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteChapter(Guid id)
    {
        var chapter = await _context.BookChapters.FindAsync(id);
        if (chapter == null) return NotFound();

        _context.BookChapters.Remove(chapter);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Deleted" });
    }
}
