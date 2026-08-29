using Microsoft.EntityFrameworkCore;
using Xmtruyen.API.Data;
using Xmtruyen.API.Models;
using Xmtruyen.API.Models.Requests;
using Xmtruyen.API.Services.Interfaces;

namespace Xmtruyen.API.Services.Implementations;

public class BookChapterManagementService : IBookChapterManagementService
{
    private readonly ApplicationDbContext _context;

    public BookChapterManagementService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<BookChapter>> GetChaptersByPublicationIdAsync(Guid publicationId)
    {
        return await _context.BookChapters
            .Where(c => c.PublicationId == publicationId)
            .OrderBy(c => c.ChapterNumber)
            .ToListAsync();
    }

    public async Task<BookChapter> GetChapterByIdAsync(Guid id)
    {
        return (await _context.BookChapters.FindAsync(id))!;
    }

    public async Task<BookChapter> CreateChapterAsync(BookChapterRequest request)
    {
        // Check if publication exists
        var pubExists = await _context.Publications.AnyAsync(p => p.Id == request.PublicationId);
        if (!pubExists) throw new ArgumentException("Publication not found");

        var chapter = new BookChapter
        {
            PublicationId = request.PublicationId,
            ChapterNumber = request.ChapterNumber,
            Title = request.Title,
            Content = request.Content,
            IsLocked = request.IsLocked,
            CoinPrice = request.CoinPrice,
            CreatedAt = DateTime.UtcNow,
            ViewCount = 0
        };

        _context.BookChapters.Add(chapter);
        
        // Update publication timestamp
        var pub = await _context.Publications.FindAsync(request.PublicationId);
        if (pub != null)
        {
            pub.UpdatedAt = DateTime.UtcNow;
            _context.Publications.Update(pub);
        }

        await _context.SaveChangesAsync();
        return chapter;
    }

    public async Task UpdateChapterAsync(Guid id, BookChapterRequest request)
    {
        var chapter = await _context.BookChapters.FindAsync(id);
        if (chapter == null) throw new KeyNotFoundException("Chapter not found");

        chapter.ChapterNumber = request.ChapterNumber;
        chapter.Title = request.Title;
        chapter.Content = request.Content;
        chapter.IsLocked = request.IsLocked;
        chapter.CoinPrice = request.CoinPrice;

        _context.BookChapters.Update(chapter);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteChapterAsync(Guid id)
    {
        var chapter = await _context.BookChapters.FindAsync(id);
        if (chapter == null) throw new KeyNotFoundException("Chapter not found");

        _context.BookChapters.Remove(chapter);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAllChaptersByPublicationAsync(Guid publicationId)
    {
        var chapters = await _context.BookChapters.Where(c => c.PublicationId == publicationId).ToListAsync();
        if (chapters.Any())
        {
            _context.BookChapters.RemoveRange(chapters);
            await _context.SaveChangesAsync();
        }
    }

    public async Task ReorderChaptersAsync(Guid publicationId, IEnumerable<BookChapterReorderRequest> requests)
    {
        var chapters = await _context.BookChapters.Where(c => c.PublicationId == publicationId).ToListAsync();
        
        foreach (var req in requests)
        {
            var chapter = chapters.FirstOrDefault(c => c.Id == req.ChapterId);
            if (chapter != null)
            {
                chapter.ChapterNumber = req.NewChapterNumber;
            }
        }
        
        _context.BookChapters.UpdateRange(chapters);
        await _context.SaveChangesAsync();
    }
}
