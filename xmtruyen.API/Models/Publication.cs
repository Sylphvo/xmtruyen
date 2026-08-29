using Xmtruyen.API.Models.Enums;

namespace Xmtruyen.API.Models;

public class Publication
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public FormatType FormatType { get; set; } = FormatType.Text;
    public AccessLevel AccessLevel { get; set; } = AccessLevel.Free;
    public string? DisplayLabel { get; set; }
    
    // Author relation
    public Guid? AuthorId { get; set; }
    public Author? Author { get; set; }
    
    public string? AuthorName { get; set; }
    public string? Description { get; set; }
    public string? CoverImageUrl { get; set; }
    public int? ViewCount { get; set; }
    public decimal? AverageRating { get; set; }
    public bool? IsRecommended { get; set; }
    public bool? IsExclusive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public string? UpdatedBy { get; set; }
    
    public Guid? OwnerId { get; set; }
    public User? Owner { get; set; }
    
    public string Status { get; set; } = "Active";
    
    public ICollection<PublicationCategory> PublicationCategories { get; set; } = new List<PublicationCategory>();
    public ICollection<PublicationTopic> PublicationTopics { get; set; } = new List<PublicationTopic>();
    
    // Antigravity Architecture: Relationships to specific content types
    public ICollection<BookChapter> BookChapters { get; set; } = new List<BookChapter>();
    public ICollection<ComicChapter> ComicChapters { get; set; } = new List<ComicChapter>();
}
