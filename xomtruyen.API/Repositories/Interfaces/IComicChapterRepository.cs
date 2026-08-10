using XomTruyen.API.Models;
using XomTruyen.API.Models.Requests;

namespace XomTruyen.API.Repositories.Interfaces;

public interface IComicChapterRepository
{
    Task<List<ComicChapter>> GetChaptersByPublicationIdAsync(Guid publicationId, CancellationToken cancellationToken = default);
    Task<ComicChapter?> GetChapterByIdAsync(Guid chapterId, CancellationToken cancellationToken = default);
    Task<ComicChapter> CreateChapterAsync(ComicChapter chapter, CancellationToken cancellationToken = default);
    Task UpdateChapterAsync(ComicChapter chapter, CancellationToken cancellationToken = default);
    Task DeleteChapterAsync(ComicChapter chapter, CancellationToken cancellationToken = default);
    
    Task<List<ComicPage>> GetPagesByChapterIdAsync(Guid chapterId, CancellationToken cancellationToken = default);
    Task<ComicPage> CreatePageAsync(ComicPage page, CancellationToken cancellationToken = default);
    Task CreatePagesAsync(IEnumerable<ComicPage> pages, CancellationToken cancellationToken = default);
    Task DeletePageAsync(ComicPage page, CancellationToken cancellationToken = default);
    Task<ComicPage?> GetPageByIdAsync(Guid pageId, CancellationToken cancellationToken = default);
    Task DeletePagesAsync(IEnumerable<ComicPage> pages, CancellationToken cancellationToken = default);
    Task UpdatePagesAsync(IEnumerable<ComicPage> pages, CancellationToken cancellationToken = default);
    Task<ComicChapter?> GetChapterByNumberAsync(Guid publicationId, float chapterNumber, CancellationToken cancellationToken = default);
}
