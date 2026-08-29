using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xmtruyen.API.Data;
using Xmtruyen.API.Models;

namespace Xmtruyen.API.Controllers;

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

    [HttpDelete("api/admin/book-chapters/publication/{publicationId}/all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAllChapters(Guid publicationId)
    {
        var chapters = await _context.BookChapters
            .Where(c => c.PublicationId == publicationId)
            .ToListAsync();

        _context.BookChapters.RemoveRange(chapters);
        await _context.SaveChangesAsync();
        return Ok(new { deletedCount = chapters.Count });
    }

    [HttpPatch("api/admin/book-chapters/reorder")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ReorderChapters([FromBody] List<ChapterOrderRequest> requests)
    {
        if (requests.Count == 0) return BadRequest(new { message = "Danh sách chương không được trống" });

        var ids = requests.Select(r => r.Id).ToList();
        var chapters = await _context.BookChapters.Where(c => ids.Contains(c.Id)).ToListAsync();
        foreach (var request in requests)
        {
            var chapter = chapters.FirstOrDefault(c => c.Id == request.Id);
            if (chapter != null) chapter.ChapterNumber = request.ChapterNumber;
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("api/admin/book-chapters/publication/{publicationId}/bulk-create")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> BulkCreateChapters(Guid publicationId, [FromBody] List<BulkChapterRequest> requests)
    {
        if (requests.Count == 0) return BadRequest(new { message = "Danh sách chương không được trống" });

        var chapters = requests.Select(request => new BookChapter
        {
            Id = Guid.NewGuid(),
            PublicationId = publicationId,
            ChapterNumber = request.ChapterNumber,
            Title = request.Title,
            Content = request.Content,
            IsLocked = request.IsLocked,
            CoinPrice = request.CoinPrice,
            ViewCount = 0,
            CreatedAt = DateTime.UtcNow
        }).ToList();

        _context.BookChapters.AddRange(chapters);
        await _context.SaveChangesAsync();
        return Ok(chapters);
    }

    public class ChapterOrderRequest
    {
        public Guid Id { get; set; }
        public float ChapterNumber { get; set; }
    }

    public class BulkChapterRequest
    {
        public float ChapterNumber { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public bool IsLocked { get; set; }
        public int? CoinPrice { get; set; }
    }
}
