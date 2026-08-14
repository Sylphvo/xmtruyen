using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;
using XomTruyen.API.Models.Requests;
using XomTruyen.API.Services.Interfaces;

namespace XomTruyen.API.Services.Implementations;

public class EngagementService : IEngagementService
{
    private readonly ApplicationDbContext _context;

    public EngagementService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Bookmark> ToggleBookmarkAsync(Guid userId, BookmarkRequest request)
    {
        var existing = await _context.Bookmarks
            .FirstOrDefaultAsync(b => b.UserId == userId && b.ChapterId == request.ChapterId);

        if (existing != null)
        {
            _context.Bookmarks.Remove(existing);
            await _context.SaveChangesAsync();
            return null!; // null means it was removed
        }

        var bookmark = new Bookmark
        {
            UserId = userId,
            ChapterId = request.ChapterId,
            ChapterType = request.ChapterType,
            CreatedAt = DateTime.UtcNow
        };

        _context.Bookmarks.Add(bookmark);
        await _context.SaveChangesAsync();
        return bookmark;
    }

    public async Task<(IEnumerable<object> Bookmarks, int TotalCount)> GetBookmarksAsync(Guid userId, int page, int pageSize)
    {
        var query = _context.Bookmarks
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.CreatedAt);

        var totalCount = await query.CountAsync();
        
        var bookmarks = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        // Let's enrich with chapter details manually since it's polymorphic
        var result = new List<object>();
        foreach (var b in bookmarks)
        {
            string chapterTitle = "Unknown";
            string publicationTitle = "Unknown";
            Guid? publicationId = null;

            if (b.ChapterType == Models.Enums.ChapterType.Comic && b.ChapterId.HasValue)
            {
                var chapter = await _context.ComicChapters.Include(c => c.Publication).FirstOrDefaultAsync(c => c.Id == b.ChapterId.Value);
                if (chapter != null)
                {
                    chapterTitle = chapter.Title ?? $"Chapter {chapter.ChapterNumber}";
                    publicationTitle = chapter.Publication.Title;
                    publicationId = chapter.PublicationId;
                }
            }
            else if (b.ChapterType == Models.Enums.ChapterType.Book && b.ChapterId.HasValue)
            {
                var chapter = await _context.BookChapters.Include(c => c.Publication).FirstOrDefaultAsync(c => c.Id == b.ChapterId.Value);
                if (chapter != null)
                {
                    chapterTitle = chapter.Title ?? $"Chapter {chapter.ChapterNumber}";
                    publicationTitle = chapter.Publication.Title;
                    publicationId = chapter.PublicationId;
                }
            }

            result.Add(new
            {
                b.Id,
                b.ChapterId,
                b.ChapterType,
                b.CreatedAt,
                ChapterTitle = chapterTitle,
                PublicationTitle = publicationTitle,
                PublicationId = publicationId
            });
        }

        return (result, totalCount);
    }

    public async Task DeleteBookmarkAsync(Guid userId, Guid id)
    {
        var bookmark = await _context.Bookmarks.FirstOrDefaultAsync(b => b.UserId == userId && b.Id == id);
        if (bookmark != null)
        {
            _context.Bookmarks.Remove(bookmark);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<UserFavorite> ToggleFavoriteAsync(Guid userId, Guid publicationId)
    {
        var existing = await _context.UserFavorites
            .FirstOrDefaultAsync(f => f.UserId == userId && f.PublicationId == publicationId);

        if (existing != null)
        {
            _context.UserFavorites.Remove(existing);
            await _context.SaveChangesAsync();
            return null!;
        }

        var favorite = new UserFavorite
        {
            UserId = userId,
            PublicationId = publicationId,
            CreatedAt = DateTime.UtcNow
        };

        _context.UserFavorites.Add(favorite);
        await _context.SaveChangesAsync();
        return favorite;
    }

    public async Task<(IEnumerable<object> Favorites, int TotalCount)> GetFavoritesAsync(Guid userId, int page, int pageSize)
    {
        var query = _context.UserFavorites
            .Include(f => f.Publication)
            .Where(f => f.UserId == userId)
            .OrderByDescending(f => f.CreatedAt);

        var totalCount = await query.CountAsync();
        var favorites = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(f => new
            {
                f.PublicationId,
                f.CreatedAt,
                Publication = new
                {
                    f.Publication.Id,
                    f.Publication.Title,
                    f.Publication.CoverImageUrl,
                    f.Publication.Author,
                    f.Publication.FormatType,
                    f.Publication.ViewCount,
                    f.Publication.AverageRating
                }
            })
            .ToListAsync();

        return (favorites, totalCount);
    }

    public async Task<bool> CheckFavoriteAsync(Guid userId, Guid publicationId)
    {
        return await _context.UserFavorites.AnyAsync(f => f.UserId == userId && f.PublicationId == publicationId);
    }

    public async Task<ReadingHistory> SaveHistoryAsync(Guid userId, HistoryRequest request)
    {
        var existing = await _context.ReadingHistories
            .FirstOrDefaultAsync(h => h.UserId == userId && h.PublicationId == request.PublicationId);

        if (existing != null)
        {
            existing.LastReadChapterId = request.LastReadChapterId;
            existing.LastReadChapterType = request.LastReadChapterType;
            existing.UpdatedAt = DateTime.UtcNow;
            _context.ReadingHistories.Update(existing);
            await _context.SaveChangesAsync();
            return existing;
        }

        var history = new ReadingHistory
        {
            UserId = userId,
            PublicationId = request.PublicationId,
            LastReadChapterId = request.LastReadChapterId,
            LastReadChapterType = request.LastReadChapterType,
            UpdatedAt = DateTime.UtcNow
        };

        _context.ReadingHistories.Add(history);
        await _context.SaveChangesAsync();
        return history;
    }

    public async Task<(IEnumerable<object> Histories, int TotalCount)> GetHistoryAsync(Guid userId, int page, int pageSize)
    {
        var query = _context.ReadingHistories
            .Include(h => h.Publication)
            .Where(h => h.UserId == userId)
            .OrderByDescending(h => h.UpdatedAt);

        var totalCount = await query.CountAsync();
        var histories = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var result = new List<object>();
        foreach(var h in histories)
        {
            string chapterTitle = "Unknown";
            
            if (h.LastReadChapterType == Models.Enums.ChapterType.Comic && h.LastReadChapterId.HasValue)
            {
                var chapter = await _context.ComicChapters.FindAsync(h.LastReadChapterId.Value);
                if (chapter != null) chapterTitle = chapter.Title ?? $"Chapter {chapter.ChapterNumber}";
            }
            else if (h.LastReadChapterType == Models.Enums.ChapterType.Book && h.LastReadChapterId.HasValue)
            {
                var chapter = await _context.BookChapters.FindAsync(h.LastReadChapterId.Value);
                if (chapter != null) chapterTitle = chapter.Title ?? $"Chapter {chapter.ChapterNumber}";
            }

            result.Add(new
            {
                h.PublicationId,
                h.LastReadChapterId,
                h.LastReadChapterType,
                h.UpdatedAt,
                ChapterTitle = chapterTitle,
                Publication = new
                {
                    h.Publication.Id,
                    h.Publication.Title,
                    h.Publication.CoverImageUrl,
                    h.Publication.FormatType
                }
            });
        }

        return (result, totalCount);
    }

    public async Task DeleteHistoryAsync(Guid userId, Guid publicationId)
    {
        var history = await _context.ReadingHistories
            .FirstOrDefaultAsync(h => h.UserId == userId && h.PublicationId == publicationId);
        if (history != null)
        {
            _context.ReadingHistories.Remove(history);
            await _context.SaveChangesAsync();
        }
    }

    public async Task ClearHistoryAsync(Guid userId)
    {
        var histories = await _context.ReadingHistories.Where(h => h.UserId == userId).ToListAsync();
        if (histories.Any())
        {
            _context.ReadingHistories.RemoveRange(histories);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<Review> CreateReviewAsync(Guid userId, ReviewRequest request)
    {
        var review = new Review
        {
            UserId = userId,
            PublicationId = request.PublicationId,
            Rating = request.Rating,
            Content = request.Content,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        await UpdatePublicationRatingAsync(request.PublicationId);

        return review;
    }

    public async Task<(IEnumerable<object> Reviews, int TotalCount)> GetReviewsAsync(Guid publicationId, int page, int pageSize)
    {
        var query = _context.Reviews
            .Include(r => r.User)
            .Where(r => r.PublicationId == publicationId)
            .OrderByDescending(r => r.CreatedAt);

        var totalCount = await query.CountAsync();
        var reviews = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new
            {
                r.Id,
                r.Rating,
                r.Content,
                r.CreatedAt,
                r.UpdatedAt,
                User = new {
                    r.UserId,
                    Username = r.User.FullName,
                    r.User.FullName,
                    r.User.AvatarUrl
                }
            })
            .ToListAsync();

        return (reviews, totalCount);
    }

    public async Task<(IEnumerable<object> Reviews, int TotalCount)> GetMyReviewsAsync(Guid userId, int page, int pageSize)
    {
        var query = _context.Reviews
            .Include(r => r.Publication)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.CreatedAt);

        var totalCount = await query.CountAsync();
        var reviews = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => new
            {
                r.Id,
                r.Rating,
                r.Content,
                r.CreatedAt,
                r.UpdatedAt,
                Publication = new {
                    r.PublicationId,
                    r.Publication.Title
                }
            })
            .ToListAsync();

        return (reviews, totalCount);
    }

    public async Task<Review> UpdateReviewAsync(Guid userId, Guid id, ReviewUpdateRequest request)
    {
        var review = await _context.Reviews.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);
        if (review == null) throw new KeyNotFoundException("Review not found or not owned by user");

        review.Rating = request.Rating;
        review.Content = request.Content;
        review.UpdatedAt = DateTime.UtcNow;

        _context.Reviews.Update(review);
        await _context.SaveChangesAsync();

        await UpdatePublicationRatingAsync(review.PublicationId);

        return review;
    }

    public async Task DeleteReviewAsync(Guid userId, Guid id)
    {
        var review = await _context.Reviews.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);
        if (review != null)
        {
            var pubId = review.PublicationId;
            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            await UpdatePublicationRatingAsync(pubId);
        }
    }

    private async Task UpdatePublicationRatingAsync(Guid publicationId)
    {
        var publication = await _context.Publications.FindAsync(publicationId);
        if (publication == null) return;

        var avg = await _context.Reviews
            .Where(r => r.PublicationId == publicationId)
            .AverageAsync(r => (decimal?)r.Rating) ?? 0;

        publication.AverageRating = Math.Round(avg, 1);
        _context.Publications.Update(publication);
        await _context.SaveChangesAsync();
    }
}
