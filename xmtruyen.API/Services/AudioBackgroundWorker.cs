using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Xmtruyen.API.Data;
using Xmtruyen.API.Models;

namespace Xmtruyen.API.Services;

public class AudioBackgroundWorker : BackgroundService
{
    private readonly AudioJobQueue _queue;
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<AudioBackgroundWorker> _logger;
    private readonly IWebHostEnvironment _env;

    public AudioBackgroundWorker(
        AudioJobQueue queue,
        IServiceProvider serviceProvider,
        ILogger<AudioBackgroundWorker> logger,
        IWebHostEnvironment env)
    {
        _queue = queue;
        _serviceProvider = serviceProvider;
        _logger = logger;
        _env = env;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("AudioBackgroundWorker is starting.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                var jobId = await _queue.DequeueJobAsync(stoppingToken);
                await ProcessJobAsync(jobId, stoppingToken);
            }
            catch (OperationCanceledException)
            {
                // Prevent throwing if stoppingToken is canceled
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred processing audio job queue.");
            }
        }
    }

    private async Task ProcessJobAsync(Guid jobId, CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var httpClientFactory = scope.ServiceProvider.GetRequiredService<IHttpClientFactory>();

        var job = await db.AudioJobs.FindAsync(new object[] { jobId }, cancellationToken);
        if (job == null || job.Status != "pending" && job.Status != "preprocessing")
            return;

        try
        {
            job.Status = "generating";
            await db.SaveChangesAsync(cancellationToken);

            var segments = await db.AudioSegments
                .Where(s => s.JobId == jobId)
                .OrderBy(s => s.OrderIndex)
                .ToListAsync(cancellationToken);

            if (!segments.Any())
            {
                throw new Exception("No segments found for this job.");
            }

            var ttsSegments = segments.Select(s => new
            {
                text = s.Text ?? "",
                voice = s.VoiceProfileId ?? "vi-VN-NamMinhNeural",
                speed = s.Speed ?? 1.0m,
                provider = "edge_tts",
                pauseAfter = s.PauseAfterMs ?? 500
            }).ToList();

            var outputPathRelative = $"/uploads/audio/jobs/{jobId}/full.mp3";
            var outputPathAbsolute = Path.Combine(_env.WebRootPath, "uploads", "audio", "jobs", jobId.ToString(), "full.mp3");

            var requestBody = new
            {
                segments = ttsSegments,
                outputFormat = "mp3",
                outputPath = outputPathAbsolute
            };

            var client = httpClientFactory.CreateClient("PythonWorker");
            var response = await client.PostAsJsonAsync("/tts/generate", requestBody, cancellationToken);
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: cancellationToken);
            var isSuccess = result.GetProperty("success").GetBoolean();

            if (isSuccess)
            {
                job.Status = "review"; // Or done, but review is safer before publish
                job.ProcessedSegments = job.TotalSegments;
                job.CompletedAt = DateTime.UtcNow;
            }
            else
            {
                job.Status = "failed";
                job.ErrorMessage = "Python worker returned success=false";
            }

            foreach (var segment in segments)
            {
                segment.Status = "done";
            }

            await db.SaveChangesAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing Audio Job {JobId}", jobId);
            if (job != null)
            {
                job.Status = "failed";
                job.ErrorMessage = ex.Message;
                await db.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
