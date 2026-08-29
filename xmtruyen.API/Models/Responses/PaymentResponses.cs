namespace Xmtruyen.API.Models.Responses;

public class PaymentOrderResponse
{
    public string? PaymentUrl { get; set; }
    public string OrderId { get; set; } = null!;
    public string? Message { get; set; }
}

public class WalletResponse
{
    public int CoinBalance { get; set; }
    
    public int? CurrentPlanId { get; set; }
    public string? PlanName { get; set; }
    public DateTime? PlanExpiredAt { get; set; }
    public bool IsUnlimited { get; set; }
}
