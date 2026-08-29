namespace Xmtruyen.API.Models;

public class Review
{
    public Guid Id { get; set; }
    
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public Guid PublicationId { get; set; }
    public Publication Publication { get; set; } = null!;
    
    public int Rating { get; set; }
    public string? Content { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
