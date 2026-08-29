namespace Xmtruyen.API.Models.Requests;

public class CategoryFilterRequest
{
    public string? SearchKeyword { get; set; } // Name
    
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    
    public string? SortBy { get; set; } = "Name";
    public bool IsDescending { get; set; } = false;
}


