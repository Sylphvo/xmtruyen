namespace XomTruyen.API.Models;

public class Transaction
{
    public Guid Id { get; set; }
    
    public Guid? UserId { get; set; }
    public User? User { get; set; }
    
    public int Amount { get; set; }
    public string TransactionType { get; set; } = null!;
    public string Status { get; set; } = null!;
    public DateTime? CreatedAt { get; set; }
}
