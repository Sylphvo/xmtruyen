using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using XomTruyen.API.Services.Interfaces;
using XomTruyen.API.Models.BookProcessing;
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
                        
                        // TODO: Update Database (e.g. change Publication status from PROCESSING to READY)
                        // var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                        // var Publication = await dbContext.Publications.FindAsync(workItem.PublicationId);
                        // Publication.Status = "READY";
                        // await dbContext.SaveChangesAsync();
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


