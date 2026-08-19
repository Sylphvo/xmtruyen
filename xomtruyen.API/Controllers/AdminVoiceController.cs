using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;

namespace XomTruyen.API.Controllers;

[ApiController]
[Route("api/admin/audio/voices")]
[Authorize(Roles = "Admin")]
public class AdminVoiceController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminVoiceController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetVoices()
    {
        var voices = await _context.VoiceProfiles.ToListAsync();
        return Ok(voices);
    }

    [HttpPost]
    public async Task<IActionResult> CreateVoice([FromBody] VoiceProfile req)
    {
        if (await _context.VoiceProfiles.AnyAsync(v => v.Id == req.Id))
        {
            return BadRequest(new { message = "Voice ID already exists." });
        }
        
        _context.VoiceProfiles.Add(req);
        await _context.SaveChangesAsync();
        return Ok(req);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateVoice(string id, [FromBody] VoiceProfile req)
    {
        var voice = await _context.VoiceProfiles.FindAsync(id);
        if (voice == null) return NotFound();

        voice.DisplayName = req.DisplayName;
        voice.VoiceType = req.VoiceType;
        voice.Gender = req.Gender;
        voice.TtsProvider = req.TtsProvider;
        voice.TtsVoiceId = req.TtsVoiceId;
        voice.Settings = req.Settings;
        voice.SampleAudioUrl = req.SampleAudioUrl;
        voice.IsActive = req.IsActive;

        await _context.SaveChangesAsync();
        return Ok(voice);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVoice(string id)
    {
        var voice = await _context.VoiceProfiles.FindAsync(id);
        if (voice == null) return NotFound();

        _context.VoiceProfiles.Remove(voice);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Deleted successfully" });
    }
}
