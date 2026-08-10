using Microsoft.AspNetCore.Http;

namespace XomTruyen.API.Models.Requests;

public class BulkUploadChapterRequest
{
    public IFormFile File { get; set; } = null!;
    public bool OverwriteExisting { get; set; } = true;
    public int? DefaultCoinPrice { get; set; } = 0;
    public bool IsLocked { get; set; } = false;
    public int? ImagesPerChapter { get; set; }
}
