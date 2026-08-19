using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using System.IO;

namespace XomTruyen.API.Controllers;

[ApiController]
[Route("api/audio")]
public class ClientAudioController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _env;

    public ClientAudioController(ApplicationDbContext context, IWebHostEnvironment env)
    {
        _context = context;
        _env = env;
    }

    [HttpGet("publication/{pubId}/chapters")]
    public async Task<IActionResult> GetPublicationAudioChapters(Guid pubId)
    {
        var chapters = await _context.AudioChapters
            .Where(c => c.PublicationId == pubId)
            .OrderBy(c => c.ChapterNumber)
            .ToListAsync();
        
        return Ok(chapters);
    }

    [HttpGet("chapters/{id}/info")]
    public async Task<IActionResult> GetChapterInfo(Guid id)
    {
        var chapter = await _context.AudioChapters.FindAsync(id);
        if (chapter == null) return NotFound();
        return Ok(chapter);
    }

    [HttpGet("chapters/{id}/stream")]
    // [Authorize] -> You might want to enable Authorize if the audiobook is paid
    public async Task<IActionResult> StreamChapter(Guid id)
    {
        var chapter = await _context.AudioChapters.FindAsync(id);
        if (chapter == null) return NotFound();

        // AudioUrl is stored as relative path like "/uploads/audio/jobs/xxx/full.mp3"
        // Convert to absolute path
        var relativePath = chapter.AudioUrl.TrimStart('/');
        var absolutePath = Path.Combine(_env.WebRootPath, relativePath);

        if (!System.IO.File.Exists(absolutePath))
        {
            return NotFound("Audio file not found on server.");
        }

        var stream = new FileStream(absolutePath, FileMode.Open, FileAccess.Read, FileShare.Read);
        
        // Return FileStreamResult with enableRangeProcessing = true
        // This is crucial for audio players to be able to seek (tua)
        return File(stream, "audio/mpeg", enableRangeProcessing: true);
    }

    [HttpPost("chapters/{id}/listen-progress")]
    [Authorize]
    public IActionResult UpdateListenProgress(Guid id, [FromBody] ListenProgressRequest req)
    {
        // Placeholder for user listen progress tracking
        return Ok();
    }
}

public class ListenProgressRequest
{
    public int ProgressSeconds { get; set; }
}
