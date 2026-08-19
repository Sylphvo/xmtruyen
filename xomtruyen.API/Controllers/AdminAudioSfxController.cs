using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;

namespace XomTruyen.API.Controllers;

[ApiController]
[Route("api/admin/audio/sfx")]
[Authorize(Roles = "Admin")]
public class AdminAudioSfxController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminAudioSfxController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetSfx()
    {
        var sfx = await _context.AudioSfxLibrary.ToListAsync();
        return Ok(sfx);
    }

    [HttpPost]
    public async Task<IActionResult> CreateSfx([FromBody] AudioSfx req)
    {
        req.Id = Guid.NewGuid();
        _context.AudioSfxLibrary.Add(req);
        await _context.SaveChangesAsync();
        return Ok(req);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSfx(Guid id)
    {
        var sfx = await _context.AudioSfxLibrary.FindAsync(id);
        if (sfx == null) return NotFound();

        _context.AudioSfxLibrary.Remove(sfx);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Deleted successfully" });
    }
}
