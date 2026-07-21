namespace XomTruyen.API.Models;

public class UserPublication
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public Guid PublicationId { get; set; }
    public Publication Publication { get; set; } = null!;
    
    public DateTime? PurchasedAt { get; set; }
}
