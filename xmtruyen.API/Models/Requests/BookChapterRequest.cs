using System.ComponentModel.DataAnnotations;

namespace Xmtruyen.API.Models.Requests;

public class BookChapterRequest
{
    [Required]
    public Guid PublicationId { get; set; }

    [Required]
    [Range(0.1, 10000)]
    public float ChapterNumber { get; set; }

    [Required]
    [StringLength(255)]
    public string Title { get; set; } = null!;

    public string? Content { get; set; }

    public bool IsLocked { get; set; }
    
    public int? CoinPrice { get; set; }
}

public class BookChapterReorderRequest
{
    [Required]
    public Guid ChapterId { get; set; }
    
    [Required]
    public float NewChapterNumber { get; set; }
}
