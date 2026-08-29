using Xmtruyen.API.Models;
using Xmtruyen.API.Models.Responses;
using Xmtruyen.API.Repositories.Interfaces;
using Xmtruyen.API.Services.Interfaces;

namespace Xmtruyen.API.Services.Implementations;

public class ReadingService : IReadingService
{
    private readonly IChapterRepository _chapterRepository;
    private readonly IUserRepository _userRepository;
    private readonly IPurchaseRepository _purchaseRepository;

    public ReadingService(
        IChapterRepository chapterRepository,
        IUserRepository userRepository,
        IPurchaseRepository purchaseRepository)
    {
        _chapterRepository = chapterRepository;
        _userRepository = userRepository;
        _purchaseRepository = purchaseRepository;
    }

    public async Task<ChapterContentResponse> GetChapterContentAsync(Guid chapterId, Guid? userId, CancellationToken cancellationToken = default)
    {
        var chapter = await _chapterRepository.GetChapterByIdAsync(chapterId, cancellationToken);
        if (chapter == null)
            throw new Exception("Chapter not found");

        var images = await _chapterRepository.GetComicPagesAsync(chapterId, cancellationToken);

        var response = new ChapterContentResponse
        {
            ChapterId = chapterId,
            Title = chapter.Title,
            Content = chapter.Content,
            ImageUrls = images,
            ShowAds = true // Default
        };

        User? user = null;
        if (userId.HasValue)
        {
            user = await _userRepository.GetUserByIdAsync(userId.Value, cancellationToken);
        }

        // Ads Logic
        if (user != null && user.CurrentPlan != null && user.CurrentPlan.RemoveAds)
        {
            response.ShowAds = false;
        }

        // 1. Free chapter
        if (chapter.CoinPrice == 0 || chapter.CoinPrice == null)
        {
            return response;
        }

        // 2. Guest Logic
        if (user == null || user.Provider == "guest")
        {
            if (user == null)
                throw new Exception("Vui lòng đăng nhập (hoặc sử dụng guest login)");

            if ((user.TotalGuestReads ?? 0) < 10)
            {
                user.TotalGuestReads = (user.TotalGuestReads ?? 0) + 1;
                await _userRepository.UpdateUserAsync(user, cancellationToken);
                return response;
            }
            else
            {
                throw new Exception("Bạn đã hết lượt đọc thử, vui lòng đăng nhập");
            }
        }

        // 3. VIP User
        if (user.CurrentPlan != null && user.CurrentPlan.IsUnlimited)
        {
            return response;
        }

        // 4. Basic User
        if (user.CurrentPlan != null && !user.CurrentPlan.IsUnlimited)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            if (user.LastReadDate != today)
            {
                user.DailyReadCount = 0;
                user.LastReadDate = today;
            }

            var maxChapters = user.CurrentPlan.MaxChaptersPerDay ?? 0;
            if ((user.DailyReadCount ?? 0) < maxChapters)
            {
                user.DailyReadCount = (user.DailyReadCount ?? 0) + 1;
                await _userRepository.UpdateUserAsync(user, cancellationToken);
                return response;
            }
        }

        // 5. Regular User (or Basic out of daily limits)
        bool hasPurchased = await _purchaseRepository.HasPurchasedChapterAsync(user.Id, chapterId, cancellationToken);
        if (hasPurchased)
        {
            return response;
        }

        var price = chapter.CoinPrice ?? 0;
        throw new Exception($"LOCKED_CHAPTER|{price}");
    }

    public async Task<bool> PurchaseChapterAsync(Guid chapterId, Guid userId, CancellationToken cancellationToken = default)
    {
        var chapter = await _chapterRepository.GetChapterByIdAsync(chapterId, cancellationToken);
        if (chapter == null) throw new Exception("Chapter not found");

        var user = await _userRepository.GetUserByIdAsync(userId, cancellationToken);
        if (user == null) throw new Exception("User not found");

        bool hasPurchased = await _purchaseRepository.HasPurchasedChapterAsync(userId, chapterId, cancellationToken);
        if (hasPurchased) return true;

        var price = chapter.CoinPrice ?? 0;
        if ((user.CoinBalance ?? 0) >= price)
        {
            user.CoinBalance -= price;
            await _userRepository.UpdateUserAsync(user, cancellationToken);
            await _purchaseRepository.AddPurchaseAsync(userId, chapterId, price, cancellationToken);
            return true;
        }

        throw new Exception("Tài khoản không đủ xu, vui lòng nạp thêm");
    }
}


