namespace XomTruyen.API.Models.Requests;

public class ComicChapterRequest
{
    public Guid PublicationId { get; set; }
    public float ChapterNumber { get; set; }
    public string? Title { get; set; }
    public bool IsLocked { get; set; }
    public int? CoinPrice { get; set; }
}

public class ComicPageRequest
{
    public string ImageUrl { get; set; } = null!;
    public int OrderIndex { get; set; }
}
