using XomTruyen.API.Models;
using XomTruyen.API.Models.Enums;
using XomTruyen.API.Models.Requests;
using XomTruyen.API.Models.Responses;

namespace XomTruyen.API.Services.Interfaces;

public interface IBookManagementService
{
    Task<Book> CreateBookAsync(BookRequest request);
    Task UpdateBookAsync(Guid id, BookRequest request);
    Task PartialUpdateBookAsync(Guid id, BookUpdateRequest request);
    Task DeleteBookAsync(Guid id);
    Task<Book?> GetBookByIdAsync(Guid id);
    Task<(IEnumerable<BookListResponse> Books, int TotalCount)> GetBooksAsync(BookFilterRequest filter);
    Task ToggleRecommendedAsync(Guid id, bool isRecommended);
    Task ToggleExclusiveAsync(Guid id, bool isExclusive);
    Task ToggleStatusAsync(Guid id, string status);
}
