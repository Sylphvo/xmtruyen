using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;

namespace XomTruyen.API.Controllers;

[Route("api/admin/reviews")]
[ApiController]
[Authorize(Roles = "Admin")]
public class AdminReviewController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminReviewController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllReviews([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var query = _context.Reviews
            .Include(r => r.User)
            .Include(r => r.Publication)
            .OrderByDescending(r => r.CreatedAt);

        var totalCount = await query.CountAsync();

        var reviews = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new
            {
                r.Id,
                r.Rating,
                r.Content,
                r.CreatedAt,
                User = new { r.User.Id, r.User.Email, r.User.FullName },
                Publication = new { r.Publication.Id, r.Publication.Title }
            })
            .ToListAsync();

        return Ok(new
        {
            success = true,
            data = reviews,
            totalCount,
            page,
            pageSize
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReview(Guid id)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null) return NotFound(new { success = false, message = "Review not found" });

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Review deleted successfully" });
    }
}
