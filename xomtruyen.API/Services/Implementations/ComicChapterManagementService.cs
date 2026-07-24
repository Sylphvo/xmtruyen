using XomTruyen.API.Models;
using XomTruyen.API.Models.Requests;
using XomTruyen.API.Models.Responses;
using XomTruyen.API.Repositories.Interfaces;
using XomTruyen.API.Services.Interfaces;

namespace XomTruyen.API.Services.Implementations;

public class ComicChapterManagementService : IComicChapterManagementService
{
    private readonly IComicChapterRepository _chapterRepository;

    public ComicChapterManagementService(IComicChapterRepository chapterRepository)
    {
        _chapterRepository = chapterRepository;
    }

    public async Task<List<ComicChapterResponse>> GetChaptersByPublicationIdAsync(Guid publicationId, CancellationToken cancellationToken = default)
    {
        var chapters = await _chapterRepository.GetChaptersByPublicationIdAsync(publicationId, cancellationToken);
        return chapters.Select(c => new ComicChapterResponse
        {
            Id = c.Id,
            PublicationId = c.PublicationId,
            ChapterNumber = c.ChapterNumber,
            Title = c.Title,
            IsLocked = c.IsLocked,
            CoinPrice = c.CoinPrice,
            ViewCount = c.ViewCount,
            CreatedAt = c.CreatedAt,
            ImageCount = c.Pages?.Count ?? 0
        }).ToList();
    }

    public async Task<ComicChapterResponse?> GetChapterByIdAsync(Guid chapterId, CancellationToken cancellationToken = default)
    {
        var c = await _chapterRepository.GetChapterByIdAsync(chapterId, cancellationToken);
        if (c == null) return null;

        return new ComicChapterResponse
        {
            Id = c.Id,
            PublicationId = c.PublicationId,
            ChapterNumber = c.ChapterNumber,
            Title = c.Title,
            IsLocked = c.IsLocked,
            CoinPrice = c.CoinPrice,
            ViewCount = c.ViewCount,
            CreatedAt = c.CreatedAt,
            ImageCount = c.Pages?.Count ?? 0
        };
    }

    public async Task<ComicChapterResponse> CreateChapterAsync(ComicChapterRequest request, CancellationToken cancellationToken = default)
    {
        var chapter = new ComicChapter
        {
            PublicationId = request.PublicationId,
            ChapterNumber = request.ChapterNumber,
            Title = request.Title,
            IsLocked = request.IsLocked,
            CoinPrice = request.CoinPrice,
            CreatedAt = DateTime.UtcNow,
            ViewCount = 0
        };

        await _chapterRepository.CreateChapterAsync(chapter, cancellationToken);

        return new ComicChapterResponse
        {
            Id = chapter.Id,
            PublicationId = chapter.PublicationId,
            ChapterNumber = chapter.ChapterNumber,
            Title = chapter.Title,
            IsLocked = chapter.IsLocked,
            CoinPrice = chapter.CoinPrice,
            ViewCount = chapter.ViewCount,
            CreatedAt = chapter.CreatedAt,
            ImageCount = 0
        };
    }

    public async Task UpdateChapterAsync(Guid id, ComicChapterRequest request, CancellationToken cancellationToken = default)
    {
        var chapter = await _chapterRepository.GetChapterByIdAsync(id, cancellationToken);
        if (chapter == null) throw new KeyNotFoundException("Chapter not found");

        chapter.ChapterNumber = request.ChapterNumber;
        chapter.Title = request.Title;
        chapter.IsLocked = request.IsLocked;
        chapter.CoinPrice = request.CoinPrice;

        await _chapterRepository.UpdateChapterAsync(chapter, cancellationToken);
    }

    public async Task DeleteChapterAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var chapter = await _chapterRepository.GetChapterByIdAsync(id, cancellationToken);
        if (chapter == null) throw new KeyNotFoundException("Chapter not found");

        await _chapterRepository.DeleteChapterAsync(chapter, cancellationToken);
    }

    public async Task<List<ComicPageResponse>> GetPagesByChapterIdAsync(Guid chapterId, CancellationToken cancellationToken = default)
    {
        var pages = await _chapterRepository.GetPagesByChapterIdAsync(chapterId, cancellationToken);
        return pages.Select(p => new ComicPageResponse
        {
            Id = p.Id,
            ComicChapterId = p.ComicChapterId,
            ImageUrl = p.ImageUrl,
            OrderIndex = p.OrderIndex
        }).ToList();
    }

    public async Task<ComicPageResponse> AddPageAsync(Guid chapterId, ComicPageRequest request, CancellationToken cancellationToken = default)
    {
        var page = new ComicPage
        {
            ComicChapterId = chapterId,
            ImageUrl = request.ImageUrl,
            OrderIndex = request.OrderIndex
        };

        await _chapterRepository.CreatePageAsync(page, cancellationToken);

        return new ComicPageResponse
        {
            Id = page.Id,
            ComicChapterId = page.ComicChapterId,
            ImageUrl = page.ImageUrl,
            OrderIndex = page.OrderIndex
        };
    }

    public async Task DeletePageAsync(Guid chapterId, Guid pageId, CancellationToken cancellationToken = default)
    {
        var page = await _chapterRepository.GetPageByIdAsync(pageId, cancellationToken);
        if (page == null || page.ComicChapterId != chapterId)
            throw new KeyNotFoundException("Page not found");

        await _chapterRepository.DeletePageAsync(page, cancellationToken);
    }

    public async Task UpdatePageOrdersAsync(Guid chapterId, List<ComicPageRequest> requests, CancellationToken cancellationToken = default)
    {
        var pages = await _chapterRepository.GetPagesByChapterIdAsync(chapterId, cancellationToken);
        var updatedPages = new List<ComicPage>();
        foreach (var req in requests)
        {
            var page = pages.FirstOrDefault(p => p.ImageUrl == req.ImageUrl);
            if (page != null)
            {
                page.OrderIndex = req.OrderIndex;
                updatedPages.Add(page);
            }
        }
        
        if (updatedPages.Count > 0)
        {
            await _chapterRepository.UpdatePagesAsync(updatedPages, cancellationToken);
        }
    }
}
