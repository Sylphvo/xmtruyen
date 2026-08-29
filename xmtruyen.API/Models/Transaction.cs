namespace Xmtruyen.API.Models;

public class Transaction
{
    public Guid Id { get; set; }
    
    public Guid? UserId { get; set; }
    public User? User { get; set; }
    
    public int Amount { get; set; }
    public int? CoinAmount { get; set; }
    public string TransactionType { get; set; } = null!;
    public string? PaymentMethod { get; set; }
    public string? ExternalTransactionId { get; set; }
    public string Status { get; set; } = null!;
    
    public int? SubscriptionPlanId { get; set; }
    public SubscriptionPlan? SubscriptionPlan { get; set; }
    
    public string? Note { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? CreatedAt { get; set; }
}
