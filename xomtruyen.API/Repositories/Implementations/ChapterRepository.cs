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

    public async Task<Chapter?> GetChapterByIdAsync(Guid chapterId, CancellationToken cancellationToken = default)
    {
        return await _context.Chapters
            .FirstOrDefaultAsync(c => c.Id == chapterId, cancellationToken);
    }

    public async Task<List<string>> GetChapterImagesAsync(Guid chapterId, CancellationToken cancellationToken = default)
    {
        return await _context.ChapterImages
            .Where(ci => ci.ChapterId == chapterId)
            .OrderBy(ci => ci.OrderIndex)
            .Select(ci => ci.ImageUrl)
            .ToListAsync(cancellationToken);
    }
}
