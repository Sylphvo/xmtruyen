namespace Xmtruyen.API.Models;

public class ComicPage
{
    public Guid Id { get; set; }
    public Guid? ComicChapterId { get; set; }
    public ComicChapter? ComicChapter { get; set; }
    
    public string ImageUrl { get; set; } = null!;
    public int OrderIndex { get; set; }
}
