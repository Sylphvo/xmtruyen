using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;

namespace XomTruyen.API.Controllers;

[ApiController]
public class AdminReviewController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminReviewController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("api/admin/reviews")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetReviews([FromQuery] Guid? publicationId, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        var query = _context.Reviews
            .Include(r => r.User)
            .Include(r => r.Publication)
            .AsQueryable();

        if (publicationId.HasValue && publicationId.Value != Guid.Empty)
        {
            query = query.Where(r => r.PublicationId == publicationId.Value);
        }

        var total = await query.CountAsync();
        var reviews = await query
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new
            {
                r.Id,
                r.PublicationId,
                PublicationTitle = r.Publication.Title,
                r.UserId,
                UserName = r.User.FullName ?? r.User.Email,
                r.Rating,
                r.Content,
                r.CreatedAt,
                r.UpdatedAt
            })
            .ToListAsync();

        return Ok(new
        {
            TotalItems = total,
            TotalPages = (int)Math.Ceiling(total / (double)pageSize),
            CurrentPage = page,
            Items = reviews
        });
    }

    [HttpDelete("api/admin/reviews/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteReview(Guid id)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null) return NotFound();

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Deleted" });
    }
}
