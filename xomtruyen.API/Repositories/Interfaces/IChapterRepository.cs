using XomTruyen.API.Models;

namespace XomTruyen.API.Repositories.Interfaces;

public interface IChapterRepository
{
    Task<Chapter?> GetChapterByIdAsync(Guid chapterId, CancellationToken cancellationToken = default);
    Task<List<string>> GetChapterImagesAsync(Guid chapterId, CancellationToken cancellationToken = default);
}
