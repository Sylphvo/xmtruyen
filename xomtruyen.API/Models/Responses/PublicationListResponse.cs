using XomTruyen.API.Models.Enums;

namespace XomTruyen.API.Models.Responses;

public class PublicationListResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string? Author { get; set; }
    public string? CoverImageUrl { get; set; }
    public FormatType FormatType { get; set; }
    public AccessLevel AccessLevel { get; set; }
    public string? DisplayLabel { get; set; }
    public string Status { get; set; } = null!;
    public int? ViewCount { get; set; }
    public decimal? AverageRating { get; set; }
    public bool? IsRecommended { get; set; }
    public bool? IsExclusive { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public string? UpdatedBy { get; set; }
    
    public List<BookCategoryResponse> Categories { get; set; } = new List<BookCategoryResponse>();
    public List<BookTopicResponse> Topics { get; set; } = new List<BookTopicResponse>();
}

public class BookCategoryResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
}

public class BookTopicResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
}


