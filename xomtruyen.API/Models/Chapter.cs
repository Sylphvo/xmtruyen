namespace XomTruyen.API.Models;

public class Chapter
{
    public Guid Id { get; set; }
    public Guid BookId { get; set; }
    public Book Book { get; set; } = null!;
    
    public int ChapterNumber { get; set; }
    public string? Title { get; set; }
    public string? Content { get; set; }
    public int? CoinPrice { get; set; }
    public int? ViewCount { get; set; }
    public DateTime? CreatedAt { get; set; }
    
    public ICollection<ChapterImage> Images { get; set; } = new List<ChapterImage>();
}
