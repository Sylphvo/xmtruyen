using XomTruyen.API.Models;
using XomTruyen.API.Models.Enums;
using XomTruyen.API.Models.Requests;
using XomTruyen.API.Models.Responses;
using XomTruyen.API.Repositories.Interfaces;
using XomTruyen.API.Services.Interfaces;
using XomTruyen.API.Utils;

namespace XomTruyen.API.Services.Implementations;

public class BookManagementService : IBookManagementService
{
    private readonly IBookRepository _bookRepository;
    private readonly ICategoryRepository _categoryRepository;

    public BookManagementService(IBookRepository bookRepository, ICategoryRepository categoryRepository)
    {
        _bookRepository = bookRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<Book> CreateBookAsync(BookRequest request)
    {
        // Validate categories
        foreach (var catId in request.CategoryIds)
        {
            var cat = await _categoryRepository.GetByIdAsync(catId);
            if (cat == null) throw new ArgumentException($"Category with ID {catId} does not exist.");
        }

        var book = new Book
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Slug = SlugHelper.GenerateSlugWithRandomSuffix(request.Title),
            Author = request.Author,
            Description = request.Description,
            CoverImageUrl = request.CoverImageUrl,
            FormatType = request.FormatType,
            AccessLevel = request.AccessLevel,
            CreatedAt = DateTime.UtcNow,
            ViewCount = 0,
            AverageRating = 0
        };

        return await _bookRepository.CreateAsync(book, request.CategoryIds);
    }

    public async Task UpdateBookAsync(Guid id, BookRequest request)
    {
        var book = await _bookRepository.GetByIdAsync(id);
        if (book == null) throw new KeyNotFoundException("Book not found");

        // Validate categories
        foreach (var catId in request.CategoryIds)
        {
            var cat = await _categoryRepository.GetByIdAsync(catId);
            if (cat == null) throw new ArgumentException($"Category with ID {catId} does not exist.");
        }

        book.Title = request.Title;
        book.Author = request.Author;
        book.Description = request.Description;
        book.CoverImageUrl = request.CoverImageUrl;
        book.FormatType = request.FormatType;
        book.AccessLevel = request.AccessLevel;

        await _bookRepository.UpdateAsync(book, request.CategoryIds);
    }

    public async Task DeleteBookAsync(Guid id)
    {
        var book = await _bookRepository.GetByIdAsync(id);
        if (book == null) throw new KeyNotFoundException("Book not found");

        await _bookRepository.DeleteAsync(book);
    }

    public async Task<Book?> GetBookByIdAsync(Guid id)
    {
        return await _bookRepository.GetByIdAsync(id);
    }

    public async Task<(IEnumerable<BookListResponse> Books, int TotalCount)> GetBooksAsync(BookFilterRequest filter)
    {
        return await _bookRepository.GetBooksAsync(filter);
    }

    public async Task ToggleRecommendedAsync(Guid id, bool isRecommended)
    {
        var book = await _bookRepository.GetByIdAsync(id);
        if (book == null) throw new KeyNotFoundException("Book not found");

        book.IsRecommended = isRecommended;
        
        var existingCategories = book.BookCategories.Select(bc => bc.CategoryId).ToList();
        await _bookRepository.UpdateAsync(book, existingCategories);
    }

    public async Task ToggleExclusiveAsync(Guid id, bool isExclusive)
    {
        var book = await _bookRepository.GetByIdAsync(id);
        if (book == null) throw new KeyNotFoundException("Book not found");

        book.IsExclusive = isExclusive;
        
        var existingCategories = book.BookCategories.Select(bc => bc.CategoryId).ToList();
        await _bookRepository.UpdateAsync(book, existingCategories);
    }
}
