using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;

namespace XomTruyen.API.Controllers;

[ApiController]
[Route("api/admin/audio/characters")]
[Authorize(Roles = "Admin")]
public class AdminCharacterVoiceController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminCharacterVoiceController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetMappings([FromQuery] Guid publicationId)
    {
        var mappings = await _context.CharacterVoiceMappings
            .Where(m => m.PublicationId == publicationId)
            .ToListAsync();
        return Ok(mappings);
    }

    [HttpPost]
    public async Task<IActionResult> CreateMapping([FromBody] CharacterVoiceMapping req)
    {
        req.Id = Guid.NewGuid();
        _context.CharacterVoiceMappings.Add(req);
        await _context.SaveChangesAsync();
        return Ok(req);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMapping(Guid id, [FromBody] CharacterVoiceMapping req)
    {
        var mapping = await _context.CharacterVoiceMappings.FindAsync(id);
        if (mapping == null) return NotFound();

        mapping.CharacterName = req.CharacterName;
        mapping.VoiceProfileId = req.VoiceProfileId;
        mapping.Notes = req.Notes;

        await _context.SaveChangesAsync();
        return Ok(mapping);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMapping(Guid id)
    {
        var mapping = await _context.CharacterVoiceMappings.FindAsync(id);
        if (mapping == null) return NotFound();

        _context.CharacterVoiceMappings.Remove(mapping);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Deleted successfully" });
    }
}
