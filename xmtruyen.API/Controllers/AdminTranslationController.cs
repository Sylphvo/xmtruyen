using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xmtruyen.API.Data;
using Xmtruyen.API.Models;

namespace Xmtruyen.API.Controllers;

[ApiController]
public class AdminTranslationController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminTranslationController(ApplicationDbContext context)
    {
        _context = context;
    }

    // ─── JOB MANAGEMENT ───
    [HttpGet("api/admin/translation/jobs")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetJobs()
    {
        var jobs = await _context.TranslationJobs
            .Include(j => j.Publication)
            .OrderByDescending(j => j.CreatedAt)
            .ToListAsync();
        return Ok(jobs);
    }

    [HttpGet("api/admin/translation/jobs/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetJobDetail(Guid id)
    {
        var job = await _context.TranslationJobs
            .Include(j => j.Publication)
            .Include(j => j.Chapters)
            .FirstOrDefaultAsync(j => j.Id == id);
            
        if (job == null) return NotFound();
        return Ok(job);
    }
    
    public class CreateJobRequest
    {
        public Guid PublicationId { get; set; }
        public string SourceLanguage { get; set; } = null!;
        public string TargetLanguage { get; set; } = null!;
    }

    [HttpPost("api/admin/translation/jobs")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateJob([FromBody] CreateJobRequest req)
    {
        var job = new TranslationJob
        {
            PublicationId = req.PublicationId,
            SourceLanguage = req.SourceLanguage,
            TargetLanguage = req.TargetLanguage,
            Status = "imported",
            TotalChapters = 1, // Mock
            TotalPages = 20, // Mock
            CreatedAt = DateTime.UtcNow
        };
        
        // Mock a chapter
        job.Chapters.Add(new TranslationChapter
        {
            ChapterNumber = 1,
            Title = "Chapter 1 (Mock Upload)",
            Status = "imported",
            PageCount = 20
        });

        _context.TranslationJobs.Add(job);
        await _context.SaveChangesAsync();
        
        return Ok(job);
    }

    // ─── CHAPTER REVIEW ───
    [HttpGet("api/admin/translation/chapters/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetChapterDetail(Guid id)
    {
        var chapter = await _context.TranslationChapters
            .Include(c => c.Pages)
                .ThenInclude(p => p.TextBlocks)
            .FirstOrDefaultAsync(c => c.Id == id);
            
        if (chapter == null) return NotFound();
        return Ok(chapter);
    }

    // ─── GLOSSARY ───
    [HttpGet("api/admin/translation/glossary")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetGlossaries()
    {
        var glossaries = await _context.TranslationGlossaries
            .OrderByDescending(g => g.CreatedAt)
            .ToListAsync();
        return Ok(glossaries);
    }

    [HttpPost("api/admin/translation/glossary")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateGlossary([FromBody] TranslationGlossary glossary)
    {
        _context.TranslationGlossaries.Add(glossary);
        await _context.SaveChangesAsync();
        return Ok(glossary);
    }
}
