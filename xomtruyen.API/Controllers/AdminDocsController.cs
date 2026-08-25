using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;
using XomTruyen.API.Models.Enums;
using XomTruyen.API.Models.Requests;
using XomTruyen.API.Models.Responses;

namespace XomTruyen.API.Controllers;

[ApiController]
[Authorize(Roles = "SuperAdmin,Editor,Moderator")]
public class AdminDocsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminDocsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("api/admin/{resource}/docs")]
    public async Task<IActionResult> GetDocs(string resource, [FromQuery] DocumentFilterRequest filter)
    {
        var query = _context.Documents
            .Include(d => d.Owner)
            .Where(d => d.WorkspaceId == resource && !d.IsDeleted);

        if (!string.IsNullOrEmpty(filter.Search))
        {
            query = query.Where(d => d.Title.Contains(filter.Search) || d.ContentMarkdown.Contains(filter.Search));
        }

        if (filter.Type.HasValue)
        {
            query = query.Where(d => d.Type == filter.Type.Value);
        }

        if (filter.Status.HasValue)
        {
            query = query.Where(d => d.Status == filter.Status.Value);
        }

        var totalItems = await query.CountAsync();

        if (filter.SortBy.Equals("UpdatedAt", StringComparison.OrdinalIgnoreCase))
        {
            query = filter.SortDesc ? query.OrderByDescending(d => d.UpdatedAt ?? d.CreatedAt) : query.OrderBy(d => d.UpdatedAt ?? d.CreatedAt);
        }
        else
        {
            query = filter.SortDesc ? query.OrderByDescending(d => d.CreatedAt) : query.OrderBy(d => d.CreatedAt);
        }

        var docs = await query
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(d => new DocumentResponse
            {
                Id = d.Id,
                WorkspaceId = d.WorkspaceId,
                Title = d.Title,
                Slug = d.Slug,
                Type = d.Type.ToString(),
                Status = d.Status.ToString(),
                ContentMarkdown = d.ContentMarkdown,
                OwnerId = d.OwnerId,
                OwnerName = d.Owner != null ? d.Owner.FullName : null,
                CreatedAt = d.CreatedAt,
                UpdatedAt = d.UpdatedAt,
                PublishedAt = d.PublishedAt
            })
            .ToListAsync();

        return Ok(new
        {
            Items = docs,
            TotalItems = totalItems,
            Page = filter.Page,
            PageSize = filter.PageSize,
            TotalPages = (int)Math.Ceiling(totalItems / (double)filter.PageSize)
        });
    }

    [HttpGet("api/admin/docs/{id}")]
    public async Task<IActionResult> GetDoc(int id)
    {
        var d = await _context.Documents
            .Include(x => x.Owner)
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);

        if (d == null) return NotFound();

        var response = new DocumentResponse
        {
            Id = d.Id,
            WorkspaceId = d.WorkspaceId,
            Title = d.Title,
            Slug = d.Slug,
            Type = d.Type.ToString(),
            Status = d.Status.ToString(),
            ContentMarkdown = d.ContentMarkdown,
            OwnerId = d.OwnerId,
            OwnerName = d.Owner != null ? d.Owner.FullName : null,
            CreatedAt = d.CreatedAt,
            UpdatedAt = d.UpdatedAt,
            PublishedAt = d.PublishedAt
        };

        return Ok(response);
    }

    [HttpPost("api/admin/docs")]
    public async Task<IActionResult> CreateDoc([FromBody] CreateDocumentRequest req)
    {
        Guid? userId = null;
        var nameIdentifier = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (Guid.TryParse(nameIdentifier, out Guid parsedId))
        {
            userId = parsedId;
        }

        var doc = new Document
        {
            WorkspaceId = req.WorkspaceId,
            Title = req.Title,
            Slug = req.Slug,
            Type = req.Type,
            ContentMarkdown = req.ContentMarkdown,
            Status = DocumentStatus.DRAFT,
            OwnerId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Documents.Add(doc);
        await _context.SaveChangesAsync();

        return Ok(new { doc.Id });
    }

    [HttpPut("api/admin/docs/{id}")]
    public async Task<IActionResult> UpdateDoc(int id, [FromBody] UpdateDocumentRequest req)
    {
        var doc = await _context.Documents.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
        if (doc == null) return NotFound();

        doc.Title = req.Title;
        doc.Slug = req.Slug;
        doc.Type = req.Type;
        doc.ContentMarkdown = req.ContentMarkdown;
        doc.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Updated successfully" });
    }

    [HttpPost("api/admin/docs/{id}/publish")]
    public async Task<IActionResult> PublishDoc(int id)
    {
        var doc = await _context.Documents.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
        if (doc == null) return NotFound();

        doc.Status = DocumentStatus.PUBLISHED;
        doc.PublishedAt = DateTime.UtcNow;
        doc.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Published successfully" });
    }

    [HttpPost("api/admin/docs/{id}/archive")]
    public async Task<IActionResult> ArchiveDoc(int id)
    {
        var doc = await _context.Documents.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
        if (doc == null) return NotFound();

        doc.Status = DocumentStatus.ARCHIVED;
        doc.ArchivedAt = DateTime.UtcNow;
        doc.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Archived successfully" });
    }

    [HttpDelete("api/admin/docs/{id}")]
    public async Task<IActionResult> DeleteDoc(int id)
    {
        var doc = await _context.Documents.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
        if (doc == null) return NotFound();

        doc.IsDeleted = true;
        doc.DeletedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Deleted successfully" });
    }
}
