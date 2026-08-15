using System;

namespace XomTruyen.API.Models;

public class Promotion
{
    public Guid Id { get; set; }
    public string Code { get; set; } = null!;
    public string Description { get; set; } = null!;
    public int DiscountPercent { get; set; }
    public int MaxDiscountAmount { get; set; }
    public int MinPurchaseAmount { get; set; }
    
    public DateTime ValidFrom { get; set; }
    public DateTime ValidTo { get; set; }
    
    public int UsageLimit { get; set; }
    public int UsedCount { get; set; }
    
    public bool IsActive { get; set; } = true;
    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
}
