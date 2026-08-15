using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;

namespace XomTruyen.API.Controllers;

[ApiController]
public class NotificationController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public NotificationController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("api/admin/notifications")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllNotifications([FromQuery] string? type, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var query = _context.Notifications.AsQueryable();
        
        if (!string.IsNullOrEmpty(type))
        {
            query = query.Where(n => n.Type == type);
        }

        var totalCount = await query.CountAsync();
        
        var notifications = await query
            .OrderByDescending(n => n.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(n => new {
                n.Id,
                n.UserId,
                n.Title,
                n.Message,
                n.Type,
                n.ReferenceId,
                n.ReferenceType,
                n.IsRead,
                n.CreatedAt
            })
            .ToListAsync();

        return Ok(new
        {
            Data = notifications,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        });
    }

    [HttpPost("api/admin/notifications")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateNotification([FromBody] Notification notification)
    {
        notification.Id = Guid.NewGuid();
        notification.CreatedAt = DateTime.UtcNow;
        notification.IsRead = false;
        
        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();
        
        return Ok(notification);
    }
    
    [HttpDelete("api/admin/notifications/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteNotification(Guid id)
    {
        var notification = await _context.Notifications.FindAsync(id);
        if (notification == null) return NotFound();

        _context.Notifications.Remove(notification);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Deleted" });
    }
}
