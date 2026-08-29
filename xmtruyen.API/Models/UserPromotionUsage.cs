using System;

namespace Xmtruyen.API.Models;

public class UserPromotionUsage
{
    public Guid Id { get; set; }
    
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public Guid PromotionId { get; set; }
    public Promotion Promotion { get; set; } = null!;
    
    public DateTime UsedAt { get; set; } = DateTime.UtcNow;
}
