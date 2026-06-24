namespace XomTruyen.API.Models;

public class Bookmark
{
    public Guid Id { get; set; }
    
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public Guid? ChapterId { get; set; }
    public Chapter? Chapter { get; set; }
    
    public DateTime? CreatedAt { get; set; }
}
