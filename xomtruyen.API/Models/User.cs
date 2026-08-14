namespace XomTruyen.API.Models;

public class User
{
    public Guid Id { get; set; }
    public string? Email { get; set; }
    public string? PasswordHash { get; set; }
    public string? FullName { get; set; }
    public string? AvatarUrl { get; set; }
    public string? Provider { get; set; }
    public string? ProviderId { get; set; }
    public int? CoinBalance { get; set; }
    
    public int? CurrentPlanId { get; set; }
    public SubscriptionPlan? CurrentPlan { get; set; }
    
    public DateTime? PlanExpiredAt { get; set; }
    public int? TotalGuestReads { get; set; }
    public int? DailyReadCount { get; set; }
    public DateOnly? LastReadDate { get; set; }
    public DateTime? CreatedAt { get; set; }
    public bool IsActive { get; set; } = true;
    public string Role { get; set; } = "User";
}
