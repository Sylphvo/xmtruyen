using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using XomTruyen.API.Data;
using XomTruyen.API.Models;

namespace XomTruyen.API.Services.Import;

public interface IPasteParserService
{
    Task<ImportJob> ProcessPastedTextAsync(Guid jobId, string pastedText);
}

public class PasteParserService : IPasteParserService
{
    private readonly ApplicationDbContext _context;

    public PasteParserService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ImportJob> ProcessPastedTextAsync(Guid jobId, string pastedText)
    {
        var job = await _context.ImportJobs.FindAsync(jobId);
        if (job == null) throw new ArgumentException("Job not found");

        job.Status = "Processing";
        await _context.SaveChangesAsync();

        var lines = pastedText.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        int rowIndex = 1;

        foreach (var line in lines)
        {
            var parts = line.Split('\t');
            if (parts.Length == 0) continue;

            var row = new NormalizedImportRow
            {
                ImportJobId = jobId,
                RowIndex = rowIndex++,
                Title = parts.Length > 0 ? parts[0].Trim() : null,
                Author = parts.Length > 1 ? parts[1].Trim() : null,
                Description = parts.Length > 2 ? parts[2].Trim() : null,
                Status = "Preview"
            };

            _context.NormalizedImportRows.Add(row);
        }

        job.TotalRows = rowIndex - 1;
        job.Status = "Preview";
        await _context.SaveChangesAsync();

        return job;
    }
}
