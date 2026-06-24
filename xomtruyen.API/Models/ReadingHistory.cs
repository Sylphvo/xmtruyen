namespace XomTruyen.API.Models;

public class ReadingHistory
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public Guid BookId { get; set; }
    public Book Book { get; set; } = null!;
    
    public Guid? LastReadChapterId { get; set; }
    public Chapter? LastReadChapter { get; set; }
    
    public DateTime? UpdatedAt { get; set; }
}
