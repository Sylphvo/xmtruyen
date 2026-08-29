using Microsoft.EntityFrameworkCore;
using Xmtruyen.API.Data;
using Xmtruyen.API.Models;
using Xmtruyen.API.Repositories.Interfaces;

namespace Xmtruyen.API.Repositories.Implementations;

public class ComicChapterRepository : IComicChapterRepository
{
    private readonly ApplicationDbContext _context;

    public ComicChapterRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ComicChapter>> GetChaptersByPublicationIdAsync(Guid publicationId, CancellationToken cancellationToken = default)
    {
        return await _context.ComicChapters
            .Include(c => c.Pages)
            .Where(c => c.PublicationId == publicationId)
            .OrderByDescending(c => c.ChapterNumber)
            .ToListAsync(cancellationToken);
    }

    public async Task<ComicChapter?> GetChapterByIdAsync(Guid chapterId, CancellationToken cancellationToken = default)
    {
        return await _context.ComicChapters
            .Include(c => c.Pages)
            .FirstOrDefaultAsync(c => c.Id == chapterId, cancellationToken);
    }

    public async Task<ComicChapter> CreateChapterAsync(ComicChapter chapter, CancellationToken cancellationToken = default)
    {
        _context.ComicChapters.Add(chapter);
        await _context.SaveChangesAsync(cancellationToken);
        return chapter;
    }

    public async Task UpdateChapterAsync(ComicChapter chapter, CancellationToken cancellationToken = default)
    {
        _context.ComicChapters.Update(chapter);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteChapterAsync(ComicChapter chapter, CancellationToken cancellationToken = default)
    {
        _context.ComicChapters.Remove(chapter);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<ComicPage>> GetPagesByChapterIdAsync(Guid chapterId, CancellationToken cancellationToken = default)
    {
        return await _context.ComicPages
            .Where(p => p.ComicChapterId == chapterId)
            .OrderBy(p => p.OrderIndex)
            .ToListAsync(cancellationToken);
    }

    public async Task<ComicPage> CreatePageAsync(ComicPage page, CancellationToken cancellationToken = default)
    {
        _context.ComicPages.Add(page);
        await _context.SaveChangesAsync(cancellationToken);
        return page;
    }

    public async Task DeletePageAsync(ComicPage page, CancellationToken cancellationToken = default)
    {
        _context.ComicPages.Remove(page);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<ComicPage?> GetPageByIdAsync(Guid pageId, CancellationToken cancellationToken = default)
    {
        return await _context.ComicPages.FirstOrDefaultAsync(p => p.Id == pageId, cancellationToken);
    }

    public async Task DeletePagesAsync(IEnumerable<ComicPage> pages, CancellationToken cancellationToken = default)
    {
        _context.ComicPages.RemoveRange(pages);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdatePagesAsync(IEnumerable<ComicPage> pages, CancellationToken cancellationToken = default)
    {
        _context.ComicPages.UpdateRange(pages);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task CreatePagesAsync(IEnumerable<ComicPage> pages, CancellationToken cancellationToken = default)
    {
        await _context.ComicPages.AddRangeAsync(pages, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<ComicChapter?> GetChapterByNumberAsync(Guid publicationId, float chapterNumber, CancellationToken cancellationToken = default)
    {
        return await _context.ComicChapters
            .Include(c => c.Pages)
            .FirstOrDefaultAsync(c => c.PublicationId == publicationId && Math.Abs(c.ChapterNumber - chapterNumber) < 0.001f, cancellationToken);
    }
}
