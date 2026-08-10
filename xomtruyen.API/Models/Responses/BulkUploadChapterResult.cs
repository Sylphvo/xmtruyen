namespace XomTruyen.API.Models.Responses;

public class BulkUploadChapterResult
{
    public int TotalChaptersCreated { get; set; }
    public int TotalChaptersUpdated { get; set; }
    public int TotalPagesCreated { get; set; }
    public List<string> ProcessedChapters { get; set; } = new();
    public long ElapsedMilliseconds { get; set; }
    public string Message { get; set; } = string.Empty;
}
