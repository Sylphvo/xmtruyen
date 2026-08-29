using System.ComponentModel.DataAnnotations;

namespace Xmtruyen.API.Models.Requests;

public class TopUpRequest
{
    [Required]
    public string PackageId { get; set; } = null!; // e.g. "pack_50", "pack_120"
    
    [Required]
    public string PaymentMethod { get; set; } = null!; // e.g. "MoMo", "VNPay", "Manual"
    
    public string? ReturnUrl { get; set; } // Web/App return URL
}

public class PurchaseSubscriptionRequest
{
    [Required]
    public int PlanId { get; set; }
    
    [Required]
    public string PaymentMethod { get; set; } = null!; // e.g. "MoMo", "VNPay", "Coin"
    
    public string? ReturnUrl { get; set; }
}

public class ManualTopUpRequest
{
    [Required]
    public Guid UserId { get; set; }
    
    [Required]
    [Range(1, 100000)]
    public int CoinAmount { get; set; }
    
    public string? Note { get; set; }
}

public class PaymentCallbackRequest
{
    // This will depend on the gateway (MoMo/VNPay). 
    // We can leave this generic or use specific classes later.
    // E.g., for MoMo:
    public string? PartnerCode { get; set; }
    public string? OrderId { get; set; }
    public string? RequestId { get; set; }
    public long Amount { get; set; }
    public string? OrderInfo { get; set; }
    public string? OrderType { get; set; }
    public long TransId { get; set; }
    public int ResultCode { get; set; }
    public string? Message { get; set; }
    public string? PayType { get; set; }
    public long ResponseTime { get; set; }
    public string? ExtraData { get; set; }
    public string? Signature { get; set; }
}
