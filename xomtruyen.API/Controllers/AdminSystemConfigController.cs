using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;

namespace XomTruyen.API.Controllers;

[ApiController]
public class AdminSystemConfigController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminSystemConfigController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("api/admin/configs")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetConfigs()
    {
        var configs = await _context.SystemConfigs
            .OrderBy(c => c.Category)
            .ThenBy(c => c.Key)
            .ToListAsync();
        return Ok(configs);
    }

    [HttpPost("api/admin/configs")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateConfig([FromBody] SystemConfig config)
    {
        if (await _context.SystemConfigs.AnyAsync(c => c.Key == config.Key))
            return BadRequest(new { message = "Key already exists" });

        var currentUserId = User.FindFirst("Id")?.Value;
        config.UpdatedBy = currentUserId;
        config.UpdatedAt = DateTime.UtcNow;

        _context.SystemConfigs.Add(config);
        await _context.SaveChangesAsync();
        return Ok(config);
    }

    [HttpPut("api/admin/configs/{key}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateConfig(string key, [FromBody] SystemConfig req)
    {
        var config = await _context.SystemConfigs.FirstOrDefaultAsync(c => c.Key == key);
        if (config == null) return NotFound();

        var currentUserId = User.FindFirst("Id")?.Value;
        
        config.Value = req.Value;
        config.Description = req.Description;
        config.Category = req.Category;
        config.DataType = req.DataType;
        config.UpdatedAt = DateTime.UtcNow;
        config.UpdatedBy = currentUserId;

        await _context.SaveChangesAsync();
        return Ok(config);
    }

    [HttpDelete("api/admin/configs/{key}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteConfig(string key)
    {
        var config = await _context.SystemConfigs.FirstOrDefaultAsync(c => c.Key == key);
        if (config == null) return NotFound();

        _context.SystemConfigs.Remove(config);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Deleted" });
    }
}
