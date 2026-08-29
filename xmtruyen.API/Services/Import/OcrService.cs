using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Xmtruyen.API.Data;
using Xmtruyen.API.Models;

namespace Xmtruyen.API.Services.Import;

public interface IOcrService
{
    Task<ImportJob> ProcessImageOcrAsync(Guid jobId, string imageUrl);
}

public class OcrService : IOcrService
{
    private readonly ApplicationDbContext _context;
    private readonly HttpClient _httpClient;

    public OcrService(ApplicationDbContext context, IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _httpClient = httpClientFactory.CreateClient("PythonWorker");
    }

    public async Task<ImportJob> ProcessImageOcrAsync(Guid jobId, string imageUrl)
    {
        var job = await _context.ImportJobs.FindAsync(jobId);
        if (job == null) throw new ArgumentException("Job not found");

        job.Status = "Processing";
        await _context.SaveChangesAsync();

        // Simulate call to python-worker for OCR
        // In reality, this would be: await _httpClient.PostAsJsonAsync("/api/ocr", new { imageUrl });
        
        var row = new NormalizedImportRow
        {
            ImportJobId = jobId,
            RowIndex = 1,
            Title = "OCR Extracted Title",
            Description = "OCR Extracted Content from image.",
            Status = "Preview",
            ConfidenceScore = 0.85f // Example confidence score
        };

        _context.NormalizedImportRows.Add(row);
        
        job.TotalRows = 1;
        job.Status = "Preview";
        await _context.SaveChangesAsync();

        return job;
    }
}
