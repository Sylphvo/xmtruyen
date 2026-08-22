using System;
using System.IO;
using System.Threading.Tasks;
using XomTruyen.API.Models;

namespace XomTruyen.API.Services.Import;

public interface IImportService
{
    Task<ImportJob> CreateImportJobAsync(Guid userId, string name, string sourceType);
    Task<ImportJob> ProcessCsvUploadAsync(Guid jobId, Stream fileStream);
    Task<ImportJob> ConfirmImportAsync(Guid jobId);
    Task<ImportJob?> GetJobStatusAsync(Guid jobId);
}
