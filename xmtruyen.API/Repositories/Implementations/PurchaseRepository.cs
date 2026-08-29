using Microsoft.EntityFrameworkCore;
using Xmtruyen.API.Data;
using Xmtruyen.API.Models;
using Xmtruyen.API.Repositories.Interfaces;

namespace Xmtruyen.API.Repositories.Implementations;

public class PurchaseRepository : IPurchaseRepository
{
    private readonly ApplicationDbContext _context;

    public PurchaseRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> HasPurchasedChapterAsync(Guid userId, Guid chapterId, CancellationToken cancellationToken = default)
    {
        return await _context.UserPurchasedChapters
            .AnyAsync(p => p.UserId == userId && p.ChapterId == chapterId, cancellationToken);
    }

    public async Task AddPurchaseAsync(Guid userId, Guid chapterId, int coinPaid, CancellationToken cancellationToken = default)
    {
        var purchase = new UserPurchasedChapter
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            ChapterId = chapterId,
            CoinPaid = coinPaid,
            PurchasedAt = DateTime.UtcNow
        };

        _context.UserPurchasedChapters.Add(purchase);
        await _context.SaveChangesAsync(cancellationToken);
    }
}


