namespace XomTruyen.API.Models;

public class BookChapter
{
    public Guid Id { get; set; }
    public Guid PublicationId { get; set; }
    public Publication Publication { get; set; } = null!;
    
    public float ChapterNumber { get; set; }
    public string? Title { get; set; }
    
    // Antigravity: Text content for the book chapter
    public string? Content { get; set; }
    
    public bool IsLocked { get; set; }
    public int? CoinPrice { get; set; }
    public int? ViewCount { get; set; }
    public DateTime? CreatedAt { get; set; }
}
