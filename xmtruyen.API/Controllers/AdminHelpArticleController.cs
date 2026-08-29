using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xmtruyen.API.Data;
using Xmtruyen.API.Models;

namespace Xmtruyen.API.Controllers;

[ApiController]
public class AdminHelpArticleController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminHelpArticleController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("api/admin/help-articles")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetArticles()
    {
        var articles = await _context.HelpArticles
            .Include(a => a.Author)
            .OrderBy(a => a.Category)
            .ThenBy(a => a.OrderIndex)
            .Select(a => new
            {
                a.Id,
                a.Title,
                a.Slug,
                a.Category,
                a.ViewCount,
                a.OrderIndex,
                a.IsPublished,
                a.CreatedAt,
                a.UpdatedAt,
                AuthorName = a.Author != null ? (a.Author.FullName ?? a.Author.Email) : null
            })
            .ToListAsync();
        return Ok(articles);
    }
    
    [HttpGet("api/admin/help-articles/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetArticle(Guid id)
    {
        var article = await _context.HelpArticles.FindAsync(id);
        if (article == null) return NotFound();
        return Ok(article);
    }

    [HttpPost("api/admin/help-articles")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateArticle([FromBody] HelpArticle article)
    {
        if (await _context.HelpArticles.AnyAsync(a => a.Slug == article.Slug))
            return BadRequest(new { message = "Slug already exists" });

        var currentUserIdStr = User.FindFirst("Id")?.Value;
        if (Guid.TryParse(currentUserIdStr, out var currentUserId))
        {
            article.AuthorId = currentUserId;
        }

        article.CreatedAt = DateTime.UtcNow;
        article.UpdatedAt = DateTime.UtcNow;

        _context.HelpArticles.Add(article);
        await _context.SaveChangesAsync();
        return Ok(article);
    }

    [HttpPut("api/admin/help-articles/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateArticle(Guid id, [FromBody] HelpArticle req)
    {
        var article = await _context.HelpArticles.FindAsync(id);
        if (article == null) return NotFound();

        if (req.Slug != article.Slug && await _context.HelpArticles.AnyAsync(a => a.Slug == req.Slug))
            return BadRequest(new { message = "Slug already exists" });

        article.Title = req.Title;
        article.Slug = req.Slug;
        article.Category = req.Category;
        article.ContentHtml = req.ContentHtml;
        article.OrderIndex = req.OrderIndex;
        article.IsPublished = req.IsPublished;
        article.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(article);
    }

    [HttpDelete("api/admin/help-articles/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteArticle(Guid id)
    {
        var article = await _context.HelpArticles.FindAsync(id);
        if (article == null) return NotFound();

        _context.HelpArticles.Remove(article);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Deleted" });
    }
}
