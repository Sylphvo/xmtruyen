namespace Xmtruyen.API.Models.Requests;

public class SubscriptionPlanRequest
{
    public string Name { get; set; } = null!;
    public int Price { get; set; }
    public int DurationDays { get; set; }
    public bool IsUnlimited { get; set; }
    public int? MaxChaptersPerDay { get; set; }
    public bool RemoveAds { get; set; }
}
