using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Hubs;
using XomTruyen.API.Models;

namespace XomTruyen.API.Controllers;

[ApiController]
public class NotificationController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IHubContext<NotificationHub> _hubContext;

    public NotificationController(ApplicationDbContext context, IHubContext<NotificationHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    // ==========================================
    // ADMIN ENDPOINTS
    // ==========================================

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

        // Broadcast Real-time
        if (notification.UserId.HasValue && notification.UserId.Value != Guid.Empty)
        {
            await _hubContext.Clients.Group(notification.UserId.Value.ToString()).SendAsync("ReceiveNotification", notification);
        }
        else
        {
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", notification);
        }
        
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

    // ==========================================
    // USER ENDPOINTS
    // ==========================================

    [HttpGet("api/notification/my")]
    [Authorize]
    public async Task<IActionResult> GetMyNotifications([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
            return Unauthorized();

        var query = _context.Notifications
            .Where(n => n.UserId == userId || n.UserId == null) // Broadcasted or specific to me
            .OrderByDescending(n => n.CreatedAt);

        var totalCount = await query.CountAsync();
        var unreadCount = await query.CountAsync(n => !n.IsRead);

        var notifications = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new
        {
            Success = true,
            Data = notifications,
            TotalCount = totalCount,
            UnreadCount = unreadCount,
            Page = page,
            PageSize = pageSize
        });
    }

    [HttpPatch("api/notification/{id}/read")]
    [Authorize]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
            return Unauthorized();

        var notification = await _context.Notifications.FirstOrDefaultAsync(n => n.Id == id && (n.UserId == userId || n.UserId == null));
        if (notification == null) return NotFound();

        notification.IsRead = true;
        await _context.SaveChangesAsync();

        return Ok(new { Success = true });
    }

    [HttpPatch("api/notification/read-all")]
    [Authorize]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
            return Unauthorized();

        var unreadNotifications = await _context.Notifications
            .Where(n => (n.UserId == userId || n.UserId == null) && !n.IsRead)
            .ToListAsync();

        foreach (var n in unreadNotifications)
        {
            n.IsRead = true;
        }

        await _context.SaveChangesAsync();

        return Ok(new { Success = true });
    }
}
