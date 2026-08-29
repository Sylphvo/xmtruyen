using System;

namespace Xmtruyen.API.Models;

public class CoinPackage
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public int CoinAmount { get; set; }
    public int BonusCoins { get; set; }
    public int PriceVND { get; set; }
    public bool IsPopular { get; set; }
    public bool IsActive { get; set; } = true;
    public int OrderIndex { get; set; }
    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
}
