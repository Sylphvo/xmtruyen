using XomTruyen.API.Models.Enums;

namespace XomTruyen.API.Models.Requests;

public class BookUpdateRequest
{
    public string? Title { get; set; }
    public string? Author { get; set; }
    public string? Description { get; set; }
    public string? CoverImageUrl { get; set; }
    public FormatType? FormatType { get; set; }
    public AccessLevel? AccessLevel { get; set; }
    public List<int>? CategoryIds { get; set; }
    public List<int>? TopicIds { get; set; }
    public string? Status { get; set; }
}
