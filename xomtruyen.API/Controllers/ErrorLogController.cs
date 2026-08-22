using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using XomTruyen.API.Data;
using XomTruyen.API.Models;

namespace XomTruyen.API.Controllers;

[Route("api/admin/error-logs")]
[ApiController]
[Authorize(Roles = "Admin")]
public class ErrorLogController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public ErrorLogController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetErrorLogs([FromQuery] string? severity, [FromQuery] string? category, [FromQuery] int page = 1, [FromQuery] int limit = 50)
    {
        var query = _db.ErrorLogs.AsQueryable();

        if (!string.IsNullOrEmpty(severity) && severity != "All")
        {
            query = query.Where(e => e.Severity == severity.ToLower());
        }

        if (!string.IsNullOrEmpty(category) && category != "All")
        {
            query = query.Where(e => e.Category == category.ToUpper());
        }

        var total = await query.CountAsync();
        var logs = await query.OrderByDescending(e => e.CreatedAt)
                              .Skip((page - 1) * limit)
                              .Take(limit)
                              .ToListAsync();

        return Ok(new
        {
            success = true,
            total,
            page,
            limit,
            data = logs
        });
    }

    [HttpPost("batch")]
    [AllowAnonymous] // To allow frontend to send logs without auth if needed, or we can use [Authorize]
    public async Task<IActionResult> BatchCreateErrorLogs([FromBody] BatchErrorLogRequest request)
    {
        if (request?.Errors == null || !request.Errors.Any())
        {
            return BadRequest(new { success = false, message = "No errors provided." });
        }

        foreach (var error in request.Errors)
        {
            var errorLog = new ErrorLog
            {
                Id = Guid.NewGuid(), // Assuming frontend sends id as string, better to generate new or parse
                Severity = error.Severity ?? "low",
                Category = error.Type ?? "UNKNOWN",
                Message = error.Message ?? "Unknown Error",
                StackTrace = error.Stack ?? "",
                ComponentStack = error.ComponentStack ?? "",
                Endpoint = error.Endpoint ?? "",
                StatusCode = error.StatusCode,
                Url = error.Url ?? "",
                RequestBody = error.RequestBody ?? "",
                ResponseBody = error.ResponseBody ?? "",
                UserId = error.UserId ?? "",
                IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "",
                UserAgent = error.UserAgent ?? HttpContext.Request.Headers["User-Agent"].ToString(),
                CreatedAt = DateTime.TryParse(error.Timestamp, out var parsedDate) ? parsedDate : DateTime.UtcNow
            };

            _db.ErrorLogs.Add(errorLog);
        }

        await _db.SaveChangesAsync();

        return Ok(new { success = true });
    }
}

public class BatchErrorLogRequest
{
    public List<FrontendErrorLog> Errors { get; set; } = new List<FrontendErrorLog>();
}

public class FrontendErrorLog
{
    public string? Id { get; set; }
    public string? Type { get; set; }
    public string? Severity { get; set; }
    public string? Message { get; set; }
    public string? Stack { get; set; }
    public string? ComponentStack { get; set; }
    public string? Url { get; set; }
    public string? Endpoint { get; set; }
    public int? StatusCode { get; set; }
    public string? RequestBody { get; set; }
    public string? ResponseBody { get; set; }
    public string? Timestamp { get; set; }
    public string? UserAgent { get; set; }
    public string? UserId { get; set; }
}
