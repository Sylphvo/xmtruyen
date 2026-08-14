using XomTruyen.API.Models;
using XomTruyen.API.Models.Requests;

namespace XomTruyen.API.Services.Interfaces;

public interface IBookChapterManagementService
{
    Task<IEnumerable<BookChapter>> GetChaptersByPublicationIdAsync(Guid publicationId);
    Task<BookChapter> GetChapterByIdAsync(Guid id);
    Task<BookChapter> CreateChapterAsync(BookChapterRequest request);
    Task UpdateChapterAsync(Guid id, BookChapterRequest request);
    Task DeleteChapterAsync(Guid id);
    Task DeleteAllChaptersByPublicationAsync(Guid publicationId);
    Task ReorderChaptersAsync(Guid publicationId, IEnumerable<BookChapterReorderRequest> requests);
}
