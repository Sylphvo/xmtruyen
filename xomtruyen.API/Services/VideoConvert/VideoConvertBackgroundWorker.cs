using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using XomTruyen.API.Data;
using XomTruyen.API.Models;

namespace XomTruyen.API.Services.VideoConvert
{
    public class VideoConvertBackgroundWorker : BackgroundService
    {
        private readonly IVideoConvertJobQueue _taskQueue;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<VideoConvertBackgroundWorker> _logger;

        public VideoConvertBackgroundWorker(
            IVideoConvertJobQueue taskQueue,
            IServiceProvider serviceProvider,
            ILogger<VideoConvertBackgroundWorker> logger)
        {
            _taskQueue = taskQueue;
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("VideoConvertBackgroundWorker is running.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    var taskId = await _taskQueue.DequeueAsync(stoppingToken);

                    using var scope = _serviceProvider.CreateScope();
                    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                    var task = await dbContext.ComicVideoTasks.FindAsync(new object[] { taskId }, stoppingToken);
                    if (task == null) continue;

                    await ProcessVideoConvertAsync(task, dbContext, stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    // Prevent throwing if stoppingToken is canceled
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred executing VideoConvert task.");
                }
            }
        }

        private async Task ProcessVideoConvertAsync(ComicVideoTask task, ApplicationDbContext dbContext, CancellationToken token)
        {
            try
            {
                task.Status = "Processing";
                task.CurrentStep = "Khởi tạo thư mục làm việc";
                task.ProgressPercent = 5;
                await dbContext.SaveChangesAsync(token);

                string tempDir = Path.Combine(Path.GetTempPath(), "ComicVideo", task.Id.ToString());
                Directory.CreateDirectory(tempDir);

                // Mocking the pipeline steps
                task.CurrentStep = "Tải ảnh comic pages";
                task.ProgressPercent = 15;
                await dbContext.SaveChangesAsync(token);
                await Task.Delay(1000, token); // Simulate downloading pages

                // Generate segments
                int numPages = 10;
                task.TotalPages = numPages;
                task.TotalAudioSegments = numPages;

                for (int i = 0; i < numPages; i++)
                {
                    var segment = new ComicVideoSegment
                    {
                        TaskId = task.Id,
                        OrderIndex = i,
                        ImageUrl = $"https://example.com/comic/page_{i}.webp",
                        TextContent = $"Nội dung lời thoại mẫu cho trang {i}",
                        AudioDurationSeconds = 4.5,
                        SubtitleText = $"Nội dung lời thoại mẫu cho trang {i}",
                        Status = "Completed"
                    };
                    dbContext.ComicVideoSegments.Add(segment);
                }

                task.CurrentStep = "Gọi TTS API tạo audio";
                task.ProgressPercent = 40;
                await dbContext.SaveChangesAsync(token);
                await Task.Delay(2000, token); // Simulate TTS

                task.CurrentStep = "Ghép video với FFmpeg";
                task.ProgressPercent = 70;
                await dbContext.SaveChangesAsync(token);
                await Task.Delay(3000, token); // Simulate FFmpeg video processing

                task.CurrentStep = "Tạo Thumbnail và mã hóa";
                task.ProgressPercent = 90;
                await dbContext.SaveChangesAsync(token);
                await Task.Delay(1000, token);

                task.Status = "Completed";
                task.CurrentStep = "Hoàn thành";
                task.ProgressPercent = 100;
                task.OutputVideoUrl = $"/uploads/videos/comic_{task.Id}.mp4";
                task.CompletedAt = DateTime.UtcNow;

                await dbContext.SaveChangesAsync(token);

                // Cleanup
                if (Directory.Exists(tempDir))
                {
                    Directory.Delete(tempDir, true);
                }
            }
            catch (Exception ex)
            {
                task.Status = "Failed";
                task.ErrorMessage = ex.Message;
                task.CurrentStep = "Lỗi trong quá trình xử lý";
                await dbContext.SaveChangesAsync(CancellationToken.None);
            }
        }
    }
}
