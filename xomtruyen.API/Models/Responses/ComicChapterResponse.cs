namespace XomTruyen.API.Models.Responses;

public class ComicChapterResponse
{
    public Guid Id { get; set; }
    public Guid PublicationId { get; set; }
    public float ChapterNumber { get; set; }
    public string? Title { get; set; }
    public bool IsLocked { get; set; }
    public int? CoinPrice { get; set; }
    public int? ViewCount { get; set; }
    public DateTime? CreatedAt { get; set; }
    public int ImageCount { get; set; }
}

public class ComicPageResponse
{
    public Guid Id { get; set; }
    public Guid? ComicChapterId { get; set; }
    public string ImageUrl { get; set; } = null!;
    public int OrderIndex { get; set; }
}
