using XomTruyen.API.Models.Enums;

namespace XomTruyen.API.Models.Requests;

public class PublicationFilterRequest
{
    public string? SearchKeyword { get; set; } // Title
    public FormatType? FormatType { get; set; }
    public AccessLevel? AccessLevel { get; set; }
    public int? CategoryId { get; set; }
    public bool? IsRecommended { get; set; }
    public bool? IsExclusive { get; set; }
    
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    
    public string? SortBy { get; set; } = "CreatedAt";
    public bool IsDescending { get; set; } = true;
}


