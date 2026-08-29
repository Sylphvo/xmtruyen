using Xmtruyen.API.Models.Enums;

namespace Xmtruyen.API.Models;

public class UserPurchasedChapter
{
    public Guid Id { get; set; }
    
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public Guid ChapterId { get; set; }
    public ChapterType ChapterType { get; set; }
    
    public int CoinPaid { get; set; }
    public DateTime? PurchasedAt { get; set; }
}
