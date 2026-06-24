namespace XomTruyen.API.Models;

public class ChapterImage
{
    public Guid Id { get; set; }
    public Guid? ChapterId { get; set; }
    public Chapter? Chapter { get; set; }
    
    public string ImageUrl { get; set; } = null!;
    public int OrderIndex { get; set; }
}
