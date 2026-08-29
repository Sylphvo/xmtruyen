using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xmtruyen.API.Data;
using Xmtruyen.API.Models;

namespace Xmtruyen.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Requires login
public class UserInteractionController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UserInteractionController(ApplicationDbContext context)
    {
        _context = context;
    }

    private Guid GetUserId()
    {
        var idStr = User.FindFirst("Id")?.Value;
        return Guid.TryParse(idStr, out var id) ? id : Guid.Empty;
    }

    // --- FAVORITES ---
    
    [HttpGet("favorites")]
    public async Task<IActionResult> GetFavorites()
    {
        var userId = GetUserId();
        var favorites = await _context.UserFavorites
            .Include(f => f.Publication)
            .Where(f => f.UserId == userId)
            .Select(f => new
            {
                f.PublicationId,
                PublicationTitle = f.Publication.Title,
                f.CreatedAt
            })
            .ToListAsync();
        return Ok(favorites);
    }

    [HttpPost("favorites/{publicationId}")]
    public async Task<IActionResult> AddFavorite(Guid publicationId)
    {
        var userId = GetUserId();
        if (await _context.UserFavorites.AnyAsync(f => f.UserId == userId && f.PublicationId == publicationId))
            return BadRequest(new { message = "Already in favorites" });

        var favorite = new UserFavorite
        {
            UserId = userId,
            PublicationId = publicationId,
            CreatedAt = DateTime.UtcNow
        };

        _context.UserFavorites.Add(favorite);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Added to favorites" });
    }

    [HttpDelete("favorites/{publicationId}")]
    public async Task<IActionResult> RemoveFavorite(Guid publicationId)
    {
        var userId = GetUserId();
        var favorite = await _context.UserFavorites
            .FirstOrDefaultAsync(f => f.UserId == userId && f.PublicationId == publicationId);
        
        if (favorite == null) return NotFound();

        _context.UserFavorites.Remove(favorite);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Removed from favorites" });
    }

    // --- BOOKMARKS ---

    [HttpGet("bookmarks")]
    public async Task<IActionResult> GetBookmarks()
    {
        var userId = GetUserId();
        var bookmarks = await _context.Bookmarks
            .Where(b => b.UserId == userId)
            .Select(b => new
            {
                b.Id,
                b.ChapterId,
                b.ChapterType,
                b.CreatedAt
            })
            .ToListAsync();
        return Ok(bookmarks);
    }

    [HttpPost("bookmarks")]
    public async Task<IActionResult> AddOrUpdateBookmark([FromBody] Bookmark req)
    {
        var userId = GetUserId();
        var bookmark = await _context.Bookmarks
            .FirstOrDefaultAsync(b => b.UserId == userId && b.ChapterId == req.ChapterId);

        if (bookmark != null)
        {
            bookmark.ChapterType = req.ChapterType;
            // No updated at field on bookmark
        }
        else
        {
            bookmark = new Bookmark
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                ChapterId = req.ChapterId,
                ChapterType = req.ChapterType,
                CreatedAt = DateTime.UtcNow
            };
            _context.Bookmarks.Add(bookmark);
        }

        await _context.SaveChangesAsync();
        return Ok(bookmark);
    }

    // --- READING HISTORY ---

    [HttpGet("history")]
    public async Task<IActionResult> GetReadingHistory()
    {
        var userId = GetUserId();
        var history = await _context.ReadingHistories
            .Include(h => h.Publication)
            .Where(h => h.UserId == userId)
            .OrderByDescending(h => h.UpdatedAt)
            .Take(50) // Keep recent 50
            .Select(h => new
            {
                h.PublicationId,
                PublicationTitle = h.Publication.Title,
                h.LastReadChapterId,
                h.LastReadChapterType,
                h.UpdatedAt
            })
            .ToListAsync();
        return Ok(history);
    }
}
