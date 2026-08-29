using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xmtruyen.API.Data;
using Xmtruyen.API.Models;
using System.Security.Claims;

namespace Xmtruyen.API.Controllers;

[Authorize]
[ApiController]
[Route("api/reader-preferences")]
public class ReaderPreferenceController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReaderPreferenceController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetPreferences()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out Guid userId))
        {
            return Unauthorized();
        }

        var pref = await _context.ReaderPreferences.FindAsync(userId);
        if (pref == null)
        {
            // Return defaults if not set
            pref = new ReaderPreference { UserId = userId };
        }

        return Ok(pref);
    }

    [HttpPut]
    public async Task<IActionResult> UpdatePreferences([FromBody] ReaderPreferenceRequest request)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out Guid userId))
        {
            return Unauthorized();
        }

        var pref = await _context.ReaderPreferences.FindAsync(userId);
        if (pref == null)
        {
            pref = new ReaderPreference { UserId = userId };
            _context.ReaderPreferences.Add(pref);
        }

        pref.Theme = request.Theme;
        pref.FontFamily = request.FontFamily;
        pref.FontSize = request.FontSize;
        pref.LineHeight = request.LineHeight;
        pref.Contrast = request.Contrast;
        pref.EnableBreakReminder = request.EnableBreakReminder;
        pref.BreakReminderIntervalMinutes = request.BreakReminderIntervalMinutes;
        pref.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(pref);
    }
}

public class ReaderPreferenceRequest
{
    public string Theme { get; set; } = "light";
    public string FontFamily { get; set; } = "Arial";
    public int FontSize { get; set; } = 16;
    public float LineHeight { get; set; } = 1.5f;
    public float Contrast { get; set; } = 1.0f;
    public bool EnableBreakReminder { get; set; } = false;
    public int BreakReminderIntervalMinutes { get; set; } = 60;
}
