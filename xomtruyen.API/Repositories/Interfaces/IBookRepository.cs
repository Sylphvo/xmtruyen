using XomTruyen.API.Models;
using XomTruyen.API.Models.Responses;
using XomTruyen.API.Models.Enums;
using XomTruyen.API.Models.Requests;
namespace XomTruyen.API.Repositories.Interfaces;

public interface IBookRepository
{
    Task<Book> CreateAsync(Book book, List<int> categoryIds, List<int> topicIds);
    Task<Book?> GetByIdAsync(Guid id);
    Task UpdateAsync(Book book, List<int> categoryIds, List<int> topicIds);
    Task DeleteAsync(Book book);
    Task<(IEnumerable<BookListResponse> Books, int TotalCount)> GetBooksAsync(BookFilterRequest filter);
}
