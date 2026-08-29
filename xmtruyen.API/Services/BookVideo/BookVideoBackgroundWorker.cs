using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Xmtruyen.API.Data;
using Xmtruyen.API.Models;

namespace Xmtruyen.API.Services.BookVideo
{
    public class BookVideoBackgroundWorker : BackgroundService
    {
        private readonly IBookVideoJobQueue _taskQueue;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<BookVideoBackgroundWorker> _logger;

        public BookVideoBackgroundWorker(
            IBookVideoJobQueue taskQueue,
            IServiceProvider serviceProvider,
            ILogger<BookVideoBackgroundWorker> logger)
        {
            _taskQueue = taskQueue;
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("BookVideoBackgroundWorker is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                var taskId = await _taskQueue.DequeueAsync(stoppingToken);

                try
                {
                    await ProcessVideoTaskAsync(taskId, stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error occurred executing Video Task {taskId}.");
                    await MarkTaskAsFailedAsync(taskId, ex.Message);
                }
            }

            _logger.LogInformation("BookVideoBackgroundWorker is stopping.");
        }

        private async Task ProcessVideoTaskAsync(Guid taskId, CancellationToken stoppingToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var sceneDescService = scope.ServiceProvider.GetRequiredService<SceneDescriptionService>();
            var imageGenService = scope.ServiceProvider.GetRequiredService<IImageGenerationService>();
            var composeService = scope.ServiceProvider.GetRequiredService<BookVideoComposeService>();

            var task = await dbContext.BookVideoTasks
                                      .Include(t => t.Publication)
                                      .FirstOrDefaultAsync(t => t.Id == taskId, stoppingToken);

            if (task == null) return;

            try
            {
                // Step 1: Initialize
                task.Status = "Processing";
                task.CurrentStep = "Fetching Chapters";
                task.ProgressPercent = 5;
                await dbContext.SaveChangesAsync(stoppingToken);

                // Fetch chapter contents (Mocked for this implementation, ideally we fetch BookChapters)
                var chapterIds = JsonSerializer.Deserialize<List<Guid>>(task.ChapterIds);
                var fullText = "Lâm Động đứng trên đỉnh núi, nhìn xa xăm. Gió thổi mạnh qua tà áo. Cô gái từ từ bước tới."; // Mock content
                
                // Real Implementation would be:
                // var fullText = "";
                // foreach(var cid in chapterIds) { var chap = await dbContext.BookChapters.FindAsync(cid); fullText += chap.Content + "\n"; }

                // Step 2: Scene Description
                task.CurrentStep = "Analyzing Text";
                task.ProgressPercent = 15;
                await dbContext.SaveChangesAsync(stoppingToken);

                var segments = await sceneDescService.AnalyzeAndSplitAsync(fullText, "Tiên Hiệp", task.ArtStyle, task.SegmentWordCount);
                
                var dbSegments = new List<BookVideoSegment>();
                for (int i = 0; i < segments.Count; i++)
                {
                    var dbSeg = new BookVideoSegment
                    {
                        TaskId = task.Id,
                        OrderIndex = i,
                        TextContent = segments[i].Text,
                        SceneDescription = segments[i].SceneDescription,
                        Status = "Pending"
                    };
                    dbContext.BookVideoSegments.Add(dbSeg);
                    dbSegments.Add(dbSeg);
                }
                task.TotalSegments = dbSegments.Count;
                await dbContext.SaveChangesAsync(stoppingToken);

                // Step 3: Image Generation
                task.CurrentStep = "Generating Images";
                task.ProgressPercent = 20;
                await dbContext.SaveChangesAsync(stoppingToken);

                var workingDir = Path.Combine(Path.GetTempPath(), "XmtruyenVideo", task.Id.ToString());
                Directory.CreateDirectory(workingDir);

                for (int i = 0; i < dbSegments.Count; i++)
                {
                    var seg = dbSegments[i];
                    var imgPath = Path.Combine(workingDir, $"img_{i:D3}.png");
                    
                    try 
                    {
                        await imageGenService.GenerateImageAsync(seg.SceneDescription, imgPath, task.ImageSource);
                        seg.ImageUrl = imgPath;
                        seg.Status = "ImageReady";
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"Image gen failed for segment {i}: {ex.Message}");
                    }
                    
                    task.ProgressPercent = 20 + (int)(30.0 * (i + 1) / dbSegments.Count);
                    await dbContext.SaveChangesAsync(stoppingToken);
                }

                // Step 4: TTS Generation
                task.CurrentStep = "Generating Audio";
                for (int i = 0; i < dbSegments.Count; i++)
                {
                    var seg = dbSegments[i];
                    var audPath = Path.Combine(workingDir, $"aud_{i:D3}.mp3");
                    
                    // MOCK TTS
                    await File.WriteAllTextAsync(audPath, "DUMMY MP3");
                    seg.AudioUrl = audPath;
                    seg.AudioDurationSeconds = segments[i].EstimatedDurationSeconds;
                    seg.SubtitleText = segments[i].Text;
                    seg.Status = "AudioReady";
                    
                    task.ProgressPercent = 50 + (int)(20.0 * (i + 1) / dbSegments.Count);
                    await dbContext.SaveChangesAsync(stoppingToken);
                }

                // Step 5: FFmpeg Compose
                task.CurrentStep = "Composing Video";
                task.ProgressPercent = 75;
                await dbContext.SaveChangesAsync(stoppingToken);

                var composeReq = new BookVideoComposeRequest
                {
                    Task = task,
                    Segments = dbSegments,
                    WorkingDir = workingDir,
                    BookTitle = task.Publication.Title,
                    ChapterTitle = "Các Chương Đã Chọn",
                    AuthorName = "Tác Giả"
                };

                var finalVideo = await composeService.ComposeBookVideoAsync(composeReq);
                
                // Move final video to a served path (e.g., wwwroot)
                var finalDest = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "videos", $"{task.Id}.mp4");
                Directory.CreateDirectory(Path.GetDirectoryName(finalDest)!);
                
                if (File.Exists(finalVideo))
                {
                    File.Move(finalVideo, finalDest, true);
                    task.OutputVideoUrl = $"/videos/{task.Id}.mp4";
                }
                
                // Step 6: Done
                task.Status = "Completed";
                task.CurrentStep = "Done";
                task.ProgressPercent = 100;
                task.CompletedAt = DateTime.UtcNow;
                
                await dbContext.SaveChangesAsync(stoppingToken);
                
                _logger.LogInformation($"Task {taskId} completed successfully.");
            }
            catch (Exception ex)
            {
                throw new Exception($"Pipeline error: {ex.Message}", ex);
            }
        }

        private async Task MarkTaskAsFailedAsync(Guid taskId, string error)
        {
            using var scope = _serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var task = await dbContext.BookVideoTasks.FindAsync(taskId);
            if (task != null)
            {
                task.Status = "Failed";
                task.ErrorMessage = error;
                await dbContext.SaveChangesAsync();
            }
        }
    }
}
