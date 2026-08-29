using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xmtruyen.API.Data;
using Xmtruyen.API.Models;
using Xmtruyen.API.Services;

namespace Xmtruyen.API.Controllers;

[ApiController]
[Route("api/admin/audio")]
[Authorize(Roles = "Admin")]
public class AdminAudioController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly AudioJobQueue _jobQueue;
    private readonly IWebHostEnvironment _env;

    public AdminAudioController(
        ApplicationDbContext context, 
        IHttpClientFactory httpClientFactory,
        AudioJobQueue jobQueue,
        IWebHostEnvironment env)
    {
        _context = context;
        _httpClientFactory = httpClientFactory;
        _jobQueue = jobQueue;
        _env = env;
    }

    [HttpPost("jobs/from-book-chapters")]
    public async Task<IActionResult> CreateJobFromBookChapter([FromBody] CreateJobRequest req)
    {
        var pub = await _context.Publications.FindAsync(req.PublicationId);
        if (pub == null) return NotFound("Publication not found");

        var chapters = await _context.BookChapters
            .Where(c => req.SourceChapterIds.Contains(c.Id))
            .OrderBy(c => c.ChapterNumber)
            .ToListAsync();

        if (!chapters.Any()) return BadRequest("No valid chapters selected");

        // Create job record
        var job = new AudioJob
        {
            Id = Guid.NewGuid(),
            PublicationId = req.PublicationId,
            SourceType = "book_chapter",
            SourceChapterIds = string.Join(",", req.SourceChapterIds),
            TargetLanguage = "vi",
            Status = "preprocessing",
            TtsProvider = "edge_tts",
            NarratorVoiceId = "narrator_male",
            CreatedAt = DateTime.UtcNow,
            CreatedBy = User.Identity?.Name ?? "Admin"
        };
        _context.AudioJobs.Add(job);
        
        // Combine chapter content
        var fullContent = string.Join("\n\n", chapters.Select(c => $"<h2>{c.Title}</h2>\n{c.Content}"));

        // Call Python worker to preprocess
        var client = _httpClientFactory.CreateClient("PythonWorker");
        var pyReq = new
        {
            sourceType = "book_chapter",
            content = fullContent,
            defaultNarrator = "narrator_male",
            language = "vi"
        };

        var pyRes = await client.PostAsJsonAsync("/audio/preprocess", pyReq);
        if (!pyRes.IsSuccessStatusCode)
        {
            return StatusCode(500, "Failed to call python worker for preprocessing");
        }

        var resData = await pyRes.Content.ReadFromJsonAsync<JsonElement>();
        var segments = resData.GetProperty("segments");
        
        var order = 0;
        foreach (var seg in segments.EnumerateArray())
        {
            _context.AudioSegments.Add(new AudioSegment
            {
                Id = Guid.NewGuid(),
                JobId = job.Id,
                OrderIndex = order++,
                SegmentType = seg.GetProperty("type").GetString() ?? "narration",
                Text = seg.GetProperty("text").GetString(),
                VoiceProfileId = seg.GetProperty("voice").GetString(),
                Speaker = seg.TryGetProperty("speaker", out var speakerVal) ? speakerVal.GetString() : null,
                Speed = (decimal?)seg.GetProperty("speed").GetDouble(),
                PauseAfterMs = seg.GetProperty("pauseAfter").GetInt32(),
                Status = "pending"
            });
        }

        job.TotalSegments = order;
        job.Status = "pending";
        await _context.SaveChangesAsync();

        return Ok(job);
    }

    [HttpPost("jobs/{id}/start")]
    public async Task<IActionResult> StartJob(Guid id)
    {
        var job = await _context.AudioJobs.FindAsync(id);
        if (job == null) return NotFound();

        if (job.Status != "pending")
        {
            return BadRequest($"Job is currently {job.Status}, cannot start.");
        }

        await _jobQueue.EnqueueJobAsync(job.Id);
        return Ok(new { message = "Job queued successfully" });
    }

    [HttpGet("jobs/{id}/progress")]
    public async Task<IActionResult> GetJobProgress(Guid id)
    {
        var job = await _context.AudioJobs.FindAsync(id);
        if (job == null) return NotFound();

        return Ok(new
        {
            job.Id,
            job.Status,
            job.TotalSegments,
            job.ProcessedSegments,
            job.ErrorMessage,
            job.CreatedAt,
            job.CompletedAt
        });
    }

    [HttpGet("jobs/{id}/segments")]
    public async Task<IActionResult> GetJobSegments(Guid id)
    {
        var segments = await _context.AudioSegments
            .Where(s => s.JobId == id)
            .OrderBy(s => s.OrderIndex)
            .ToListAsync();
        return Ok(segments);
    }

    [HttpPatch("segments/{id}")]
    public async Task<IActionResult> UpdateSegment(Guid id, [FromBody] UpdateSegmentRequest req)
    {
        var segment = await _context.AudioSegments.FindAsync(id);
        if (segment == null) return NotFound();

        if (req.Text != null) segment.Text = req.Text;
        if (req.VoiceProfileId != null) segment.VoiceProfileId = req.VoiceProfileId;
        if (req.Speed.HasValue) segment.Speed = req.Speed;
        
        await _context.SaveChangesAsync();
        return Ok(segment);
    }

    [HttpPost("jobs/{id}/publish")]
    public async Task<IActionResult> PublishJob(Guid id)
    {
        var job = await _context.AudioJobs.FindAsync(id);
        if (job == null) return NotFound();

        if (job.Status != "review" && job.Status != "generating")
        {
            return BadRequest($"Job must be in review state to publish. Current: {job.Status}");
        }

        var sourceIds = job.SourceChapterIds?.Split(',').Select(Guid.Parse).ToList() ?? new List<Guid>();
        if (!sourceIds.Any()) return BadRequest("No source chapters linked");

        var firstChapterId = sourceIds.First();
        var bookChapter = await _context.BookChapters.FindAsync(firstChapterId);
        
        var relativePath = $"/uploads/audio/jobs/{job.Id}/full.mp3";

        var audioChapter = new AudioChapter
        {
            Id = Guid.NewGuid(),
            PublicationId = job.PublicationId,
            ChapterNumber = bookChapter != null ? (decimal)bookChapter.ChapterNumber : 1m,
            Title = bookChapter?.Title ?? "Audio Chapter",
            AudioUrl = relativePath,
            Duration = 0, // Should read from final mp3 in real world
            IsLocked = bookChapter?.IsLocked ?? false,
            CoinPrice = bookChapter?.CoinPrice,
            ListenCount = 0,
            CreatedAt = DateTime.UtcNow
        };

        _context.AudioChapters.Add(audioChapter);
        
        job.Status = "published";
        await _context.SaveChangesAsync();

        return Ok(audioChapter);
    }
}

public class CreateJobRequest
{
    public Guid PublicationId { get; set; }
    public List<Guid> SourceChapterIds { get; set; } = new();
}

public class UpdateSegmentRequest
{
    public string? Text { get; set; }
    public string? VoiceProfileId { get; set; }
    public decimal? Speed { get; set; }
}
