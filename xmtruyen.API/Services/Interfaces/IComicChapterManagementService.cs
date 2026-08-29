using Xmtruyen.API.Models;
using Xmtruyen.API.Models.Requests;
using Xmtruyen.API.Models.Responses;

namespace Xmtruyen.API.Services.Interfaces;

public interface IComicChapterManagementService
{
    Task<List<ComicChapterResponse>> GetChaptersByPublicationIdAsync(Guid publicationId, CancellationToken cancellationToken = default);
    Task<ComicChapterResponse?> GetChapterByIdAsync(Guid chapterId, CancellationToken cancellationToken = default);
    Task<ComicChapterResponse> CreateChapterAsync(ComicChapterRequest request, CancellationToken cancellationToken = default);
    Task UpdateChapterAsync(Guid id, ComicChapterRequest request, CancellationToken cancellationToken = default);
    Task DeleteChapterAsync(Guid id, CancellationToken cancellationToken = default);
    Task DeleteAllChaptersByPublicationAsync(Guid publicationId, CancellationToken cancellationToken = default);

    Task<List<ComicPageResponse>> GetPagesByChapterIdAsync(Guid chapterId, CancellationToken cancellationToken = default);
    Task<ComicPageResponse> AddPageAsync(Guid chapterId, ComicPageRequest request, CancellationToken cancellationToken = default);
    Task DeletePageAsync(Guid chapterId, Guid pageId, CancellationToken cancellationToken = default);
    Task UpdatePageOrdersAsync(Guid chapterId, List<ComicPageRequest> requests, CancellationToken cancellationToken = default);

    Task<BulkUploadChapterResult> BulkUploadChaptersAsync(Guid publicationId, IFormFile file, BulkUploadChapterRequest? options = null, CancellationToken cancellationToken = default);
}
