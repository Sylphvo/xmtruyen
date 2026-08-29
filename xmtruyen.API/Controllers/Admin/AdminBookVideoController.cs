using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xmtruyen.API.Data;
using Xmtruyen.API.Models;

namespace Xmtruyen.API.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/book-video")]
    // [Authorize(Roles = "Admin")] // Giả lập auth
    public class AdminBookVideoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly Xmtruyen.API.Services.BookVideo.IBookVideoJobQueue _queue;

        public AdminBookVideoController(ApplicationDbContext context, Xmtruyen.API.Services.BookVideo.IBookVideoJobQueue queue)
        {
            _context = context;
            _queue = queue;
        }

        // POST: /api/admin/book-video/create
        [HttpPost("create")]
        public async Task<IActionResult> CreateTask([FromBody] CreateBookVideoRequest request)
        {
            if (request == null || request.PublicationId == Guid.Empty || request.ChapterIds == null || request.ChapterIds.Count == 0)
            {
                return BadRequest(ApiResponse<object>.Error("Dữ liệu không hợp lệ."));
            }

            var task = new BookVideoTask
            {
                PublicationId = request.PublicationId,
                ChapterIds = System.Text.Json.JsonSerializer.Serialize(request.ChapterIds),
                ImageSource = request.ImageSource ?? "stable-diffusion",
                ArtStyle = request.ArtStyle,
                SegmentWordCount = request.SegmentWordCount > 0 ? request.SegmentWordCount : 150,
                Language = request.Language ?? "vi-VN",
                VoiceId = request.VoiceId ?? "vi-VN-NamMinhNeural",
                SpeechRate = request.SpeechRate ?? "+0%",
                EnableMultiVoice = request.EnableMultiVoice,
                Resolution = request.Resolution ?? "1080p",
                Transition = request.Transition ?? "kenburns",
                AddSubtitles = request.AddSubtitles,
                AddIntroOutro = request.AddIntroOutro,
                BgmEnabled = request.BackgroundMusic?.Enabled ?? false,
                BgmGenre = request.BackgroundMusic?.Genre,
                BgmVolume = request.BackgroundMusic?.Volume ?? 0.2,
                Status = "Queued",
                CreatedAt = DateTime.UtcNow
            };

            _context.BookVideoTasks.Add(task);
            await _context.SaveChangesAsync();

            _queue.QueueBackgroundWorkItem(task.Id);

            return Ok(ApiResponse<Guid>.Ok(task.Id, "Đã đưa vào hàng đợi tạo Video"));
        }

        // GET: /api/admin/book-video/list
        [HttpGet("list")]
        public async Task<IActionResult> GetList([FromQuery] int page = 1, [FromQuery] int limit = 10)
        {
            var query = _context.BookVideoTasks.Include(t => t.Publication).AsQueryable();
            var total = await query.CountAsync();
            var items = await query.OrderByDescending(t => t.CreatedAt)
                                   .Skip((page - 1) * limit)
                                   .Take(limit)
                                   .Select(t => new
                                   {
                                       t.Id,
                                       PublicationTitle = t.Publication.Title,
                                       t.Status,
                                       t.ProgressPercent,
                                       t.CurrentStep,
                                       t.CreatedAt,
                                       t.OutputVideoUrl,
                                       t.TotalSegments,
                                       t.CompletedSegments
                                   })
                                   .ToListAsync();

            return Ok(new
            {
                Success = true,
                Data = new { items, total, page, limit }
            });
        }

        // GET: /api/admin/book-video/{id}/status
        [HttpGet("{id}/status")]
        public async Task<IActionResult> GetStatus(Guid id)
        {
            var task = await _context.BookVideoTasks.FindAsync(id);
            if (task == null) return NotFound(ApiResponse<object>.Error("Không tìm thấy task"));

            return Ok(ApiResponse<object>.Ok(new
            {
                task.Id,
                task.Status,
                task.ProgressPercent,
                task.CurrentStep,
                task.ErrorMessage,
                task.TotalSegments,
                task.CompletedSegments
            }));
        }

        // GET: /api/admin/book-video/{id}/preview
        [HttpGet("{id}/preview")]
        public async Task<IActionResult> GetPreview(Guid id)
        {
            var segments = await _context.BookVideoSegments
                                         .Where(s => s.TaskId == id)
                                         .OrderBy(s => s.OrderIndex)
                                         .ToListAsync();

            return Ok(ApiResponse<List<BookVideoSegment>>.Ok(segments));
        }
    }

    public class CreateBookVideoRequest
    {
        public Guid PublicationId { get; set; }
        public List<Guid>? ChapterIds { get; set; }
        public string? ImageSource { get; set; }
        public string? ArtStyle { get; set; }
        public int SegmentWordCount { get; set; }
        public string? Language { get; set; }
        public string? VoiceId { get; set; }
        public string? SpeechRate { get; set; }
        public bool EnableMultiVoice { get; set; }
        public string? Resolution { get; set; }
        public string? Transition { get; set; }
        public bool AddSubtitles { get; set; }
        public bool AddIntroOutro { get; set; }
        public BackgroundMusicConfig? BackgroundMusic { get; set; }
    }

    public class BackgroundMusicConfig
    {
        public bool Enabled { get; set; }
        public string? Genre { get; set; }
        public double Volume { get; set; }
    }
}
