using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xmtruyen.API.Data;
using Xmtruyen.API.Models;

namespace Xmtruyen.API.Controllers;

[ApiController]
public class AdminReportController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminReportController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("api/admin/reports")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetReports()
    {
        var reports = await _context.Reports
            .Include(r => r.Reporter)
            .OrderBy(r => r.Status == "Pending" ? 0 : 1) // Pending first
            .ThenByDescending(r => r.CreatedAt)
            .Select(r => new
            {
                r.Id,
                r.TargetType,
                r.TargetId,
                r.Reason,
                r.Description,
                r.Status,
                r.CreatedAt,
                r.ResolvedAt,
                ReporterName = r.Reporter.FullName ?? r.Reporter.Email
            })
            .ToListAsync();
        return Ok(reports);
    }

    [HttpGet("api/admin/reports/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetReport(Guid id)
    {
        var report = await _context.Reports
            .Include(r => r.Reporter)
            .FirstOrDefaultAsync(r => r.Id == id);
            
        if (report == null) return NotFound();
        
        return Ok(new
        {
            report.Id,
            report.TargetType,
            report.TargetId,
            report.Reason,
            report.Description,
            report.Status,
            report.ResolutionNote,
            report.ResolvedBy,
            report.CreatedAt,
            report.ResolvedAt,
            ReporterName = report.Reporter.FullName ?? report.Reporter.Email,
            ReporterId = report.Reporter.Id
        });
    }

    public class ResolveReportRequest
    {
        public string Status { get; set; } = null!; // 'Resolved', 'Dismissed'
        public string? ResolutionNote { get; set; }
    }

    [HttpPut("api/admin/reports/{id}/resolve")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ResolveReport(Guid id, [FromBody] ResolveReportRequest req)
    {
        var report = await _context.Reports.FindAsync(id);
        if (report == null) return NotFound();

        var currentUserId = User.FindFirst("Id")?.Value;

        report.Status = req.Status;
        report.ResolutionNote = req.ResolutionNote;
        report.ResolvedBy = currentUserId; // Could be admin name or ID
        report.ResolvedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return Ok(report);
    }
}
