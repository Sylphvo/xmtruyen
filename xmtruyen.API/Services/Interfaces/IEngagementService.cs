using Xmtruyen.API.Models;
using Xmtruyen.API.Models.Requests;

namespace Xmtruyen.API.Services.Interfaces;

public interface IEngagementService
{
    // Bookmarks
    Task<Bookmark> ToggleBookmarkAsync(Guid userId, BookmarkRequest request);
    Task<(IEnumerable<object> Bookmarks, int TotalCount)> GetBookmarksAsync(Guid userId, int page, int pageSize);
    Task DeleteBookmarkAsync(Guid userId, Guid id);

    // Favorites
    Task<UserFavorite> ToggleFavoriteAsync(Guid userId, Guid publicationId);
    Task<(IEnumerable<object> Favorites, int TotalCount)> GetFavoritesAsync(Guid userId, int page, int pageSize);
    Task<bool> CheckFavoriteAsync(Guid userId, Guid publicationId);

    // History
    Task<ReadingHistory> SaveHistoryAsync(Guid userId, HistoryRequest request);
    Task<(IEnumerable<object> Histories, int TotalCount)> GetHistoryAsync(Guid userId, int page, int pageSize);
    Task DeleteHistoryAsync(Guid userId, Guid publicationId);
    Task ClearHistoryAsync(Guid userId);

    // Reviews
    Task<Review> CreateReviewAsync(Guid userId, ReviewRequest request);
    Task<(IEnumerable<object> Reviews, int TotalCount)> GetReviewsAsync(Guid publicationId, int page, int pageSize);
    Task<(IEnumerable<object> Reviews, int TotalCount)> GetMyReviewsAsync(Guid userId, int page, int pageSize);
    Task<Review> UpdateReviewAsync(Guid userId, Guid id, ReviewUpdateRequest request);
    Task DeleteReviewAsync(Guid userId, Guid id);
}
