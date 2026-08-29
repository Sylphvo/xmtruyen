using Xmtruyen.API.Models;

namespace Xmtruyen.API.Repositories.Interfaces;

public interface IChapterRepository
{
    Task<BookChapter?> GetChapterByIdAsync(Guid chapterId, CancellationToken cancellationToken = default);
    Task<List<string>> GetComicPagesAsync(Guid chapterId, CancellationToken cancellationToken = default);
}


