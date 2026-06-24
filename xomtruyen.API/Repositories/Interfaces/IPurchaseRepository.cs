namespace XomTruyen.API.Repositories.Interfaces;

public interface IPurchaseRepository
{
    Task<bool> HasPurchasedChapterAsync(Guid userId, Guid chapterId, CancellationToken cancellationToken = default);
    Task AddPurchaseAsync(Guid userId, Guid chapterId, int coinPaid, CancellationToken cancellationToken = default);
}
