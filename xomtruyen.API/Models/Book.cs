using XomTruyen.API.Models.Enums;

namespace XomTruyen.API.Models;

public class Book
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public FormatType FormatType { get; set; } = FormatType.Text;
    public AccessLevel AccessLevel { get; set; } = AccessLevel.Free;
    public string? Author { get; set; }
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
    
    public ICollection<BookCategory> BookCategories { get; set; } = new List<BookCategory>();
    public ICollection<BookTopic> BookTopics { get; set; } = new List<BookTopic>();
    public ICollection<Chapter> Chapters { get; set; } = new List<Chapter>();
}
