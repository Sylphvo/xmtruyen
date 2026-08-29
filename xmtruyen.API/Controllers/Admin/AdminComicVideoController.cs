using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xmtruyen.API.Data;
using Xmtruyen.API.Models;
using Xmtruyen.API.Services.VideoConvert;

namespace Xmtruyen.API.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/comic-video")]
    [Authorize(Roles = "Admin")]
    public class AdminComicVideoController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IVideoConvertJobQueue _queue;

        public AdminComicVideoController(ApplicationDbContext context, IVideoConvertJobQueue queue)
        {
            _context = context;
            _queue = queue;
        }

        public class CreateTaskRequest
        {
            public Guid PublicationId { get; set; }
            public List<string> ChapterIds { get; set; } = new();
            public string Language { get; set; } = "vi-VN";
            public string VoiceId { get; set; } = "vi-VN-HoaiMyNeural";
            public string SpeechRate { get; set; } = "+0%";
            public string Resolution { get; set; } = "1080p";
            public string Transition { get; set; } = "kenburns";
            public string NarrationSource { get; set; } = "text_chapter";
            public bool AddSubtitles { get; set; } = true;
            public string? BackgroundMusicUrl { get; set; }
            public double BackgroundMusicVolume { get; set; } = 0.3;
        }

        // POST: /api/admin/comic-video/create
        [HttpPost("create")]
        public async Task<IActionResult> CreateTask([FromBody] CreateTaskRequest request)
        {
            if (request == null || request.PublicationId == Guid.Empty || request.ChapterIds == null || request.ChapterIds.Count == 0)
            {
                return BadRequest(ApiResponse<object>.Error("Dữ liệu không hợp lệ."));
            }

            var task = new ComicVideoTask
            {
                PublicationId = request.PublicationId,
                ChapterIds = string.Join(",", request.ChapterIds),
                Language = request.Language,
                VoiceId = request.VoiceId,
                SpeechRate = request.SpeechRate,
                Resolution = request.Resolution,
                Transition = request.Transition,
                NarrationSource = request.NarrationSource,
                AddSubtitles = request.AddSubtitles,
                BackgroundMusicUrl = request.BackgroundMusicUrl,
                BackgroundMusicVolume = request.BackgroundMusicVolume,
                Status = "Queued",
                CurrentStep = "Đã vào hàng đợi"
            };

            _context.ComicVideoTasks.Add(task);
            await _context.SaveChangesAsync();

            _queue.QueueBackgroundWorkItem(task.Id);

            return Ok(ApiResponse<Guid>.Ok(task.Id, "Đã đưa vào hàng đợi tạo Video"));
        }

        // GET: /api/admin/comic-video/list
        [HttpGet("list")]
        public async Task<IActionResult> GetList(int page = 1, int limit = 10)
        {
            var query = _context.ComicVideoTasks.Include(t => t.Publication).AsQueryable();

            var total = await query.CountAsync();
            var tasks = await query.OrderByDescending(t => t.CreatedAt)
                                   .Skip((page - 1) * limit)
                                   .Take(limit)
                                   .Select(t => new
                                   {
                                       t.Id,
                                       PublicationTitle = t.Publication != null ? t.Publication.Title : "Unknown",
                                       t.Language,
                                       t.VoiceId,
                                       t.Status,
                                       t.ProgressPercent,
                                       t.CurrentStep,
                                       t.CreatedAt,
                                       t.OutputVideoUrl,
                                       t.TotalPages,
                                       t.TotalAudioSegments
                                   })
                                   .ToListAsync();

            return Ok(ApiResponse<object>.Ok(new { items = tasks, total, page, limit }));
        }

        // GET: /api/admin/comic-video/{id}/status
        [HttpGet("{id}/status")]
        public async Task<IActionResult> GetStatus(Guid id)
        {
            var task = await _context.ComicVideoTasks.FindAsync(id);
            if (task == null) return NotFound(ApiResponse<object>.Error("Không tìm thấy task"));

            return Ok(ApiResponse<object>.Ok(new
            {
                task.Id,
                task.Status,
                task.ProgressPercent,
                task.CurrentStep,
                task.ErrorMessage,
                task.TotalPages,
                task.TotalAudioSegments,
                task.OutputVideoUrl
            }));
        }

        // GET: /api/admin/comic-video/{id}/preview
        [HttpGet("{id}/preview")]
        public async Task<IActionResult> GetPreview(Guid id)
        {
            var segments = await _context.ComicVideoSegments
                                         .Where(s => s.TaskId == id)
                                         .OrderBy(s => s.OrderIndex)
                                         .ToListAsync();

            return Ok(ApiResponse<List<ComicVideoSegment>>.Ok(segments));
        }
    }
}
