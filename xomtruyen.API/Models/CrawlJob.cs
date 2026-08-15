using System;

namespace XomTruyen.API.Models;

public class CrawlJob
{
    public Guid Id { get; set; }
    public string SourceName { get; set; } = null!;
    public string TargetUrl { get; set; } = null!;
    public string Status { get; set; } = "Pending"; // Pending, Running, Completed, Failed
    public int TotalItems { get; set; }
    public int CrawledItems { get; set; }
    public string? ErrorMessage { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
