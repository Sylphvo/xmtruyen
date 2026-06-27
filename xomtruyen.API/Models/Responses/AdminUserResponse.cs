namespace XomTruyen.API.Models.Responses;

public class AdminUserResponse
{
    public Guid Id { get; set; }
    public string? Email { get; set; }
    public string? FullName { get; set; }
    public string? AvatarUrl { get; set; }
    public string? Provider { get; set; }
    public int? CoinBalance { get; set; }
    public int? CurrentPlanId { get; set; }
    public string? CurrentPlanName { get; set; }
    public DateTime? PlanExpiredAt { get; set; }
    public int? TotalGuestReads { get; set; }
    public int? DailyReadCount { get; set; }
    public DateTime? CreatedAt { get; set; }
    public bool IsActive { get; set; }
}
