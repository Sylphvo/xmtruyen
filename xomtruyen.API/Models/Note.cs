namespace XomTruyen.API.Models;

public class Note
{
    public Guid Id { get; set; }
    
    public Guid? UserId { get; set; }
    public User? User { get; set; }
    
    public Guid? ChapterId { get; set; }
    public Chapter? Chapter { get; set; }
    
    public string Content { get; set; } = null!;
    public DateTime? CreatedAt { get; set; }
}
