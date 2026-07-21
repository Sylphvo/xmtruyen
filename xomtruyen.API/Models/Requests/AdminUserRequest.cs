using System.ComponentModel.DataAnnotations;

namespace XomTruyen.API.Models.Requests;

public class AdminUserRequest
{
    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = null!;

    public string? Password { get; set; }
    
    [MaxLength(100)]
    public string? FullName { get; set; }
    
    public string? AvatarUrl { get; set; }
    
    public int? CoinBalance { get; set; }
    
    public int? CurrentPlanId { get; set; }
    
    public DateTime? PlanExpiredAt { get; set; }
    
    public bool IsActive { get; set; } = true;
}


