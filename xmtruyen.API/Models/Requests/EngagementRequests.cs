using System.ComponentModel.DataAnnotations;
using Xmtruyen.API.Models.Enums;

namespace Xmtruyen.API.Models.Requests;

public class BookmarkRequest
{
    [Required]
    public Guid ChapterId { get; set; }
    
    [Required]
    public ChapterType ChapterType { get; set; }
}

public class HistoryRequest
{
    [Required]
    public Guid PublicationId { get; set; }
    
    [Required]
    public Guid LastReadChapterId { get; set; }
    
    [Required]
    public ChapterType LastReadChapterType { get; set; }
}

public class ReviewRequest
{
    [Required]
    public Guid PublicationId { get; set; }
    
    [Required]
    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
    public int Rating { get; set; }
    
    public string? Content { get; set; }
}

public class ReviewUpdateRequest
{
    [Required]
    [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
    public int Rating { get; set; }
    
    public string? Content { get; set; }
}
