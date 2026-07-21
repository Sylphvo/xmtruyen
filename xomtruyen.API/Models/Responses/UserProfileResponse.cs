namespace XomTruyen.API.Models.Responses;

public class UserProfileResponse
{
    public Guid Id { get; set; }
    public string? Email { get; set; }
    public string? FullName { get; set; }
    public string? AvatarUrl { get; set; }
    public int? CoinBalance { get; set; }
    public string? Provider { get; set; }
    
    // Plan Info
    public int? CurrentPlanId { get; set; }
    public string? PlanName { get; set; }
    public bool IsUnlimited { get; set; }
    public DateTime? PlanExpiredAt { get; set; }
    
    // Reading stats
    public int? TotalGuestReads { get; set; }
    public int? DailyReadCount { get; set; }
    public DateTime? CreatedAt { get; set; }
}


