using Microsoft.EntityFrameworkCore;
using Xmtruyen.API.Data;
using Xmtruyen.API.Models;
using Xmtruyen.API.Repositories.Interfaces;

namespace Xmtruyen.API.Repositories.Implementations;

public class ChapterRepository : IChapterRepository
{
    private readonly ApplicationDbContext _context;

    public ChapterRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<BookChapter?> GetChapterByIdAsync(Guid chapterId, CancellationToken cancellationToken = default)
    {
        var bookChapter = await _context.BookChapters
            .FirstOrDefaultAsync(c => c.Id == chapterId, cancellationToken);

        if (bookChapter != null) return bookChapter;

        var comicChapter = await _context.ComicChapters
            .FirstOrDefaultAsync(c => c.Id == chapterId, cancellationToken);

        if (comicChapter != null)
        {
            return new BookChapter
            {
                Id = comicChapter.Id,
                PublicationId = comicChapter.PublicationId,
                ChapterNumber = comicChapter.ChapterNumber,
                Title = comicChapter.Title,
                IsLocked = comicChapter.IsLocked,
                CoinPrice = comicChapter.CoinPrice,
                ViewCount = comicChapter.ViewCount,
                CreatedAt = comicChapter.CreatedAt,
                Content = null
            };
        }

        return null;
    }

    public async Task<List<string>> GetComicPagesAsync(Guid chapterId, CancellationToken cancellationToken = default)
    {
        return await _context.ComicPages
            .Where(ci => ci.ComicChapterId == chapterId)
            .OrderBy(ci => ci.OrderIndex)
            .Select(ci => ci.ImageUrl)
            .ToListAsync(cancellationToken);
    }
}


