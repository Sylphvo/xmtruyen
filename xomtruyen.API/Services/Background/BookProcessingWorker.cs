using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.SignalR;
using XomTruyen.API.Hubs;
using XomTruyen.API.Models;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using XomTruyen.API.Services.Interfaces;
using XomTruyen.API.Models.BookProcessing;
using XomTruyen.API.Data;
using System.Linq;
using System.Text.Json;

namespace XomTruyen.API.Services.Background
{
    public class BookProcessingWorker : BackgroundService
    {
        private readonly ILogger<BookProcessingWorker> _logger;
        private readonly IBackgroundTaskQueue _taskQueue;
        private readonly IServiceProvider _serviceProvider;

        public BookProcessingWorker(
            ILogger<BookProcessingWorker> logger,
            IBackgroundTaskQueue taskQueue,
            IServiceProvider serviceProvider)
        {
            _logger = logger;
            _taskQueue = taskQueue;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Publication Processing Worker is running.");

            while (!stoppingToken.IsCancellationRequested)
            {
                var workItem = await _taskQueue.DequeueAsync(stoppingToken);

                try
                {
                    _logger.LogInformation("Dequeued Publication processing task {TaskId} for Publication {PublicationId}.", workItem.TaskId, workItem.PublicationId);

                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var processors = scope.ServiceProvider.GetRequiredService<IEnumerable<IBookProcessor>>();
                        var processor = processors.FirstOrDefault(p => p.CanProcess(workItem));

                        if (processor == null)
                        {
                            _logger.LogWarning("No suitable IBookProcessor found for file: {FileName}", workItem.FileName);
                            continue;
                        }

                        var result = await processor.ProcessAsync(workItem, stoppingToken);

                        _logger.LogInformation("Processing completed for Task {TaskId}. Result: \n{ResultJson}", 
                            workItem.TaskId, 
                            JsonSerializer.Serialize(result, new JsonSerializerOptions { WriteIndented = true }));
                        
                        // Update Database: set CoverImageUrl and update Status
                        if (result.Status == "COMPLETED" && Guid.TryParse(workItem.PublicationId, out var pubGuid))
                        {
                            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                            var publication = await dbContext.Publications.FindAsync(new object[] { pubGuid }, stoppingToken);
                            if (publication != null)
                            {
                                if (string.IsNullOrEmpty(publication.CoverImageUrl) || !string.IsNullOrEmpty(result.Output?.ImageUrl))
                                {
                                    publication.CoverImageUrl = result.Output?.ImageUrl ?? publication.CoverImageUrl;
                                }
                                publication.Status = "Active";
                                publication.UpdatedAt = DateTime.UtcNow;

                                // Antigravity: Create Chapter if it's a comic archive and has pages
                                if (result.Output?.TotalPage > 0 && workItem.FileName != null)
                                {
                                    float nextChapterNumber = 1;
                                    var maxChapter = dbContext.ComicChapters.Where(c => c.PublicationId == pubGuid).Max(c => (float?)c.ChapterNumber);
                                    if (maxChapter.HasValue) nextChapterNumber = maxChapter.Value + 1;

                                    var chapterId = Guid.NewGuid();
                                    var isLocked = publication.AccessLevel == XomTruyen.API.Models.Enums.AccessLevel.Vip;
                                    var chapter = new XomTruyen.API.Models.ComicChapter
                                    {
                                        Id = chapterId,
                                        PublicationId = pubGuid,
                                        ChapterNumber = nextChapterNumber,
                                        Title = Path.GetFileNameWithoutExtension(workItem.FileName),
                                        CreatedAt = DateTime.UtcNow,
                                        IsLocked = isLocked,
                                        CoinPrice = isLocked ? 100 : 0
                                    };

                                    var pages = new List<XomTruyen.API.Models.ComicPage>();
                                    for (int i = 0; i < result.Output.TotalPage; i++)
                                    {
                                        pages.Add(new XomTruyen.API.Models.ComicPage
                                        {
                                            Id = Guid.NewGuid(),
                                            ComicChapterId = chapterId,
                                            OrderIndex = i + 1,
                                            ImageUrl = $"{result.Output.PagesUrl}page_{i + 1:D3}.webp"
                                        });
                                    }

                                    dbContext.ComicChapters.Add(chapter);
                                    dbContext.ComicPages.AddRange(pages);
                                    _logger.LogInformation("Created ComicChapter {ChapterId} with {TotalPages} pages for Publication {PublicationId}", chapterId, result.Output.TotalPage, pubGuid);
                                }

await dbContext.SaveChangesAsync(stoppingToken);
                                _logger.LogInformation("Updated Publication {PublicationId} CoverImageUrl to {CoverImageUrl}", pubGuid, publication.CoverImageUrl);

                                // Broadcast Notification
                                try
                                {
                                    var hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<NotificationHub>>();
                                    var notif = new Notification
                                    {
                                        Id = Guid.NewGuid(),
                                        Title = "Chương mới cập nhật",
                                        Message = $"Truyện {publication.Title} vừa có chương mới. Vào đọc ngay nhé!",
                                        Type = "NEW_CHAPTER",
                                        ReferenceId = publication.Id,
                                        ReferenceType = "PUBLICATION",
                                        IsRead = false,
                                        CreatedAt = DateTime.UtcNow
                                    };
                                    dbContext.Notifications.Add(notif);
                                    await dbContext.SaveChangesAsync(stoppingToken);
                                    await hubContext.Clients.All.SendAsync("ReceiveNotification", notif, cancellationToken: stoppingToken);
                                }
                                catch (Exception ex)
                                {
                                    _logger.LogError(ex, "Failed to send notification for publication {PublicationId}", pubGuid);
                                }
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred executing task {TaskId}.", workItem.TaskId);
                }
            }
        }
    }
}


