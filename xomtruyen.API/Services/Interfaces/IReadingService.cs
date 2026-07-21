using XomTruyen.API.Models.Responses;

namespace XomTruyen.API.Services.Interfaces;

public interface IReadingService
{
    Task<ChapterContentResponse> GetChapterContentAsync(Guid chapterId, Guid? userId, CancellationToken cancellationToken = default);
}


