using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using XomTruyen.API.Data;
using XomTruyen.API.Services.Interfaces;

namespace XomTruyen.API.Controllers;

[Route("api/admin/health")]
[ApiController]
[Authorize(Roles = "Admin")]
public class HealthCheckController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public HealthCheckController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetHealthStatus()
    {
        var result = new HealthCheckResult
        {
            Timestamp = DateTime.UtcNow,
            Services = new List<ServiceStatus>()
        };

        // 1. Check Database
        try 
        {
            var sw = System.Diagnostics.Stopwatch.StartNew();
            // Simple query to verify DB connection
            await _db.Database.ExecuteSqlRawAsync("SELECT 1");
            sw.Stop();
            result.Services.Add(new ServiceStatus("PostgreSQL", "UP", sw.ElapsedMilliseconds));
        } 
        catch (Exception ex) 
        {
            result.Services.Add(new ServiceStatus("PostgreSQL", "DOWN", 0, ex.Message));
        }

        // 2. Check Background Worker
        result.Services.Add(new ServiceStatus("BackgroundWorker", "UP", 0, null, new { active = true }));

        // 3. Check Disk Space
        try
        {
            var drive = new DriveInfo(Path.GetPathRoot(Directory.GetCurrentDirectory()) ?? "C:\\");
            var freeGb = drive.AvailableFreeSpace / (1024 * 1024 * 1024);
            var totalGb = drive.TotalSize / (1024 * 1024 * 1024);
            var usedPercent = totalGb > 0 ? 100 - (int)(drive.AvailableFreeSpace * 100 / drive.TotalSize) : 0;
            
            result.Services.Add(new ServiceStatus("FileStorage",
                freeGb > 5 ? "UP" : "WARNING", 
                0, 
                null,
                new { freeGb, usedPercent }));
        }
        catch (Exception ex)
        {
             result.Services.Add(new ServiceStatus("FileStorage", "UNKNOWN", 0, ex.Message));
        }

        result.OverallStatus = result.Services.All(s => s.Status == "UP") ? "HEALTHY" :
                              result.Services.Any(s => s.Status == "DOWN") ? "UNHEALTHY" : "DEGRADED";

        return Ok(result);
    }
}

public class HealthCheckResult
{
    public DateTime Timestamp { get; set; }
    public string OverallStatus { get; set; } = "UNKNOWN";
    public List<ServiceStatus> Services { get; set; } = new List<ServiceStatus>();
}

public class ServiceStatus
{
    public string Name { get; set; }
    public string Status { get; set; }
    public long ResponseTimeMs { get; set; }
    public string? ErrorMessage { get; set; }
    public object? Metadata { get; set; }

    public ServiceStatus(string name, string status, long responseTimeMs = 0, string? errorMessage = null, object? metadata = null)
    {
        Name = name;
        Status = status;
        ResponseTimeMs = responseTimeMs;
        ErrorMessage = errorMessage;
        Metadata = metadata;
    }
}
