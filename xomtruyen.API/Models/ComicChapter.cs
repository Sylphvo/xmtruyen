namespace XomTruyen.API.Models;

public class ComicChapter
{
    public Guid Id { get; set; }
    public Guid PublicationId { get; set; }
    public Publication Publication { get; set; } = null!;
    
    public float ChapterNumber { get; set; }
    public string? Title { get; set; }
    
    public bool IsLocked { get; set; }
    public int? CoinPrice { get; set; }
    public int? ViewCount { get; set; }
    public DateTime? CreatedAt { get; set; }
    
    // Antigravity: Relationship to comic pages
    public ICollection<ComicPage> Pages { get; set; } = new List<ComicPage>();
}
