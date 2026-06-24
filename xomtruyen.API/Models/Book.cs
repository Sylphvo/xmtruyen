namespace XomTruyen.API.Models;

public class Book
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string? BookType { get; set; }
    public string? Author { get; set; }
    public string? Description { get; set; }
    public string? CoverImageUrl { get; set; }
    public int? ViewCount { get; set; }
    public decimal? AverageRating { get; set; }
    public bool? IsRecommended { get; set; }
    public bool? IsExclusive { get; set; }
    public DateTime? CreatedAt { get; set; }
    
    public ICollection<BookCategory> BookCategories { get; set; } = new List<BookCategory>();
    public ICollection<Chapter> Chapters { get; set; } = new List<Chapter>();
}
