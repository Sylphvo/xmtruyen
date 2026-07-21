namespace XomTruyen.API.Models.Responses;

public class ChapterContentResponse
{
    public Guid ChapterId { get; set; }
    public string? Title { get; set; }
    public string? Content { get; set; }
    public List<string> ImageUrls { get; set; } = new List<string>();
    public bool ShowAds { get; set; }
}


