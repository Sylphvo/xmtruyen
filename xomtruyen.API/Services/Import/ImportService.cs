using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;

namespace XomTruyen.API.Services.Import;

public class ImportService : IImportService
{
    private readonly ApplicationDbContext _context;

    public ImportService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ImportJob> CreateImportJobAsync(Guid userId, string name, string sourceType)
    {
        var job = new ImportJob
        {
            Name = name,
            SourceType = sourceType,
            CreatedByUserId = userId,
            Status = "Pending"
        };

        _context.ImportJobs.Add(job);
        await _context.SaveChangesAsync();

        return job;
    }

    public async Task<ImportJob> ProcessCsvUploadAsync(Guid jobId, Stream fileStream)
    {
        var job = await _context.ImportJobs.FindAsync(jobId);
        if (job == null) throw new ArgumentException("Job not found");

        job.Status = "Processing";
        await _context.SaveChangesAsync();

        // Basic CSV processing (stub)
        using var reader = new StreamReader(fileStream);
        string? header = await reader.ReadLineAsync();
        
        int rowIndex = 1;
        while (!reader.EndOfStream)
        {
            var line = await reader.ReadLineAsync();
            if (string.IsNullOrWhiteSpace(line)) continue;

            // Simplified: split by comma (a real CSV parser like CsvHelper should be used)
            var parts = line.Split(',');
            
            var row = new NormalizedImportRow
            {
                ImportJobId = jobId,
                RowIndex = rowIndex++,
                Title = parts.Length > 0 ? parts[0] : null,
                Author = parts.Length > 1 ? parts[1] : null,
                Status = "Preview"
            };

            _context.NormalizedImportRows.Add(row);
        }

        job.TotalRows = rowIndex - 1;
        job.Status = "Preview";
        await _context.SaveChangesAsync();

        return job;
    }

    public async Task<ImportJob> ConfirmImportAsync(Guid jobId)
    {
        var job = await _context.ImportJobs.FindAsync(jobId);
        if (job == null) throw new ArgumentException("Job not found");

        job.Status = "Confirmed";
        // Actually move data to Book/Chapter tables (stubbed for Phase 1)
        
        await _context.SaveChangesAsync();
        return job;
    }

    public async Task<ImportJob?> GetJobStatusAsync(Guid jobId)
    {
        return await _context.ImportJobs
            .Include(j => j.Rows)
            .FirstOrDefaultAsync(j => j.Id == jobId);
    }
}
