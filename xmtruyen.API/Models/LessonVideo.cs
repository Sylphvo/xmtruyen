using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Xmtruyen.API.Models;

public class LessonVideo
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid LessonId { get; set; }
    public string OriginalUrl { get; set; } = string.Empty;
    public string? Url480p { get; set; }
    public string? Url720p { get; set; }
    public string? Url1080p { get; set; }
    public string? ThumbnailUrl { get; set; }
    public int DurationSeconds { get; set; }
    public long FileSizeBytes { get; set; }
    public string? Resolution { get; set; }
    public string? Codec { get; set; }
    public string Status { get; set; } = "Ready";

    public Lesson Lesson { get; set; } = null!;
}
