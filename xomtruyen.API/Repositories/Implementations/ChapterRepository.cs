using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;
using XomTruyen.API.Repositories.Interfaces;

namespace XomTruyen.API.Repositories.Implementations;

public class ChapterRepository : IChapterRepository
{
    private readonly ApplicationDbContext _context;

    public ChapterRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<BookChapter?> GetChapterByIdAsync(Guid ComicChapterId, CancellationToken cancellationToken = default)
    {
        return await _context.BookChapters
            .FirstOrDefaultAsync(c => c.Id == ComicChapterId, cancellationToken);
    }

    public async Task<List<string>> GetComicPagesAsync(Guid ComicChapterId, CancellationToken cancellationToken = default)
    {
        return await _context.ComicPages
            .Where(ci => ci.ComicChapterId == ComicChapterId)
            .OrderBy(ci => ci.OrderIndex)
            .Select(ci => ci.ImageUrl)
            .ToListAsync(cancellationToken);
    }
}


