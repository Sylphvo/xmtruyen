using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;

namespace XomTruyen.API.Controllers;

[ApiController]
public class CrawlerController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CrawlerController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("api/admin/crawlers")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetCrawlJobs()
    {
        var jobs = await _context.CrawlJobs
            .OrderByDescending(j => j.CreatedAt)
            .ToListAsync();
        return Ok(jobs);
    }

    [HttpPost("api/admin/crawlers/start")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> StartCrawlJob([FromBody] CrawlJob jobReq)
    {
        jobReq.Id = Guid.NewGuid();
        jobReq.CreatedAt = DateTime.UtcNow;
        jobReq.StartedAt = DateTime.UtcNow;
        jobReq.Status = "Running";
        jobReq.TotalItems = new Random().Next(10, 500); // Mock data for now
        jobReq.CrawledItems = 0;
        
        _context.CrawlJobs.Add(jobReq);
        await _context.SaveChangesAsync();
        
        // Triggers background job here...
        
        return Ok(jobReq);
    }
    
    [HttpDelete("api/admin/crawlers/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteCrawlJob(Guid id)
    {
        var job = await _context.CrawlJobs.FindAsync(id);
        if (job == null) return NotFound();

        _context.CrawlJobs.Remove(job);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Deleted" });
    }
}
