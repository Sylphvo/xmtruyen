namespace Xmtruyen.API.Models.Requests;

public class UserFilterRequest
{
    public string? SearchKeyword { get; set; } // Search in Email, FullName
    public string? Provider { get; set; }
    public bool? IsActive { get; set; }
    public int? MinCoinBalance { get; set; }
    public int? MaxCoinBalance { get; set; }
    public int? CurrentPlanId { get; set; }
    
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    
    public string? SortBy { get; set; } = "CreatedAt";
    public bool IsDescending { get; set; } = true;
}


