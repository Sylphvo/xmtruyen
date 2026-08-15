using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;

namespace XomTruyen.API.Controllers;

[ApiController]
public class AdminAuthorController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminAuthorController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("api/admin/authors")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAuthors()
    {
        var authors = await _context.Authors
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new
            {
                a.Id,
                a.Name,
                a.Description,
                a.AvatarUrl,
                a.Website,
                a.Twitter,
                a.CreatedAt,
                PublicationCount = _context.Publications.Count(p => p.AuthorId == a.Id)
            })
            .ToListAsync();
        return Ok(authors);
    }

    [HttpGet("api/admin/authors/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAuthor(Guid id)
    {
        var author = await _context.Authors
            .Include(a => a.Publications)
            .FirstOrDefaultAsync(a => a.Id == id);
            
        if (author == null) return NotFound();
        return Ok(author);
    }

    [HttpPost("api/admin/authors")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateAuthor([FromBody] Author author)
    {
        _context.Authors.Add(author);
        await _context.SaveChangesAsync();
        return Ok(author);
    }

    [HttpPut("api/admin/authors/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateAuthor(Guid id, [FromBody] Author req)
    {
        var author = await _context.Authors.FindAsync(id);
        if (author == null) return NotFound();

        author.Name = req.Name;
        author.Description = req.Description;
        author.AvatarUrl = req.AvatarUrl;
        author.Website = req.Website;
        author.Twitter = req.Twitter;

        await _context.SaveChangesAsync();
        return Ok(author);
    }

    [HttpDelete("api/admin/authors/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAuthor(Guid id)
    {
        var author = await _context.Authors.FindAsync(id);
        if (author == null) return NotFound();

        _context.Authors.Remove(author);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Deleted" });
    }
}
