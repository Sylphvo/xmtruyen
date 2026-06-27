using XomTruyen.API.Models.Enums;

namespace XomTruyen.API.Models.Responses;

public class BookListResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string? Author { get; set; }
    public string? CoverImageUrl { get; set; }
    public FormatType FormatType { get; set; }
    public AccessLevel AccessLevel { get; set; }
    public int? ViewCount { get; set; }
    public decimal? AverageRating { get; set; }
    public bool? IsRecommended { get; set; }
    public bool? IsExclusive { get; set; }
    public DateTime? CreatedAt { get; set; }
    
    public List<string> Categories { get; set; } = new List<string>();
}
