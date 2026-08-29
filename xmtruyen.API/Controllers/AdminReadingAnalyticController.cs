using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xmtruyen.API.Data;
using Xmtruyen.API.Models;

namespace Xmtruyen.API.Controllers;

[ApiController]
public class AdminReadingAnalyticController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminReadingAnalyticController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("api/admin/analytics/reading")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetReadingAnalytics([FromQuery] int days = 7)
    {
        var startDate = DateTime.UtcNow.AddDays(-days);

        // Raw records for recent list
        var recentLogs = await _context.ReadingAnalytics
            .Include(a => a.User)
            .Include(a => a.Publication)
            .Where(a => a.ReadAt >= startDate)
            .OrderByDescending(a => a.ReadAt)
            .Take(100)
            .Select(a => new
            {
                a.Id,
                a.ReadAt,
                a.ReadingDurationSeconds,
                a.Country,
                a.DeviceInfo,
                PublicationTitle = a.Publication.Title,
                FormatType = a.Publication.FormatType.ToString(),
                UserName = a.User != null ? (a.User.FullName ?? a.User.Email) : "Khách (Guest)",
                IsGuest = a.User == null
            })
            .ToListAsync();

        // Chart data: reads per day
        var chartDataRaw = await _context.ReadingAnalytics
            .Where(a => a.ReadAt >= startDate)
            .GroupBy(a => a.ReadAt.Date)
            .Select(g => new
            {
                Date = g.Key,
                Count = g.Count(),
                TotalDuration = g.Sum(a => a.ReadingDurationSeconds)
            })
            .OrderBy(x => x.Date)
            .ToListAsync();

        // Top read publications
        var topPublications = await _context.ReadingAnalytics
            .Where(a => a.ReadAt >= startDate)
            .GroupBy(a => new { a.PublicationId, a.Publication.Title })
            .Select(g => new
            {
                PublicationId = g.Key.PublicationId,
                Title = g.Key.Title,
                ReadCount = g.Count(),
                AvgDuration = g.Average(a => a.ReadingDurationSeconds)
            })
            .OrderByDescending(x => x.ReadCount)
            .Take(10)
            .ToListAsync();

        return Ok(new
        {
            recentLogs,
            chartData = chartDataRaw.Select(x => new { Date = x.Date.ToString("yyyy-MM-dd"), x.Count, x.TotalDuration }),
            topPublications
        });
    }
}
