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

        return await _bookRepository.CreateAsync(book, request.CategoryIds, request.TopicIds);
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

        await _bookRepository.UpdateAsync(book, request.CategoryIds, request.TopicIds);
    }

    public async Task PartialUpdateBookAsync(Guid id, BookUpdateRequest request)
    {
        var book = await _bookRepository.GetByIdAsync(id);
        if (book == null) throw new KeyNotFoundException("Book not found");

        if (request.Title != null) book.Title = request.Title;
        if (request.Author != null) book.Author = request.Author;
        if (request.Description != null) book.Description = request.Description;
        if (request.CoverImageUrl != null) book.CoverImageUrl = request.CoverImageUrl;
        if (request.FormatType.HasValue) book.FormatType = request.FormatType.Value;
        if (request.AccessLevel.HasValue) book.AccessLevel = request.AccessLevel.Value;
        if (request.Status != null) book.Status = request.Status;

        var catIds = request.CategoryIds ?? book.BookCategories.Select(bc => bc.CategoryId).ToList();
        var topicIds = request.TopicIds ?? book.BookTopics.Select(bt => bt.TopicId).ToList();

        // Validate categories if they were updated
        if (request.CategoryIds != null)
        {
            foreach (var catId in request.CategoryIds)
            {
                var cat = await _categoryRepository.GetByIdAsync(catId);
                if (cat == null) throw new ArgumentException($"Category with ID {catId} does not exist.");
            }
        }

        await _bookRepository.UpdateAsync(book, catIds, topicIds);
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
        var existingTopics = book.BookTopics.Select(bt => bt.TopicId).ToList();
        await _bookRepository.UpdateAsync(book, existingCategories, existingTopics);
    }

    public async Task ToggleExclusiveAsync(Guid id, bool isExclusive)
    {
        var book = await _bookRepository.GetByIdAsync(id);
        if (book == null) throw new KeyNotFoundException("Book not found");

        book.IsExclusive = isExclusive;
        
        var existingCategories = book.BookCategories.Select(bc => bc.CategoryId).ToList();
        var existingTopics = book.BookTopics.Select(bt => bt.TopicId).ToList();
        await _bookRepository.UpdateAsync(book, existingCategories, existingTopics);
    }

    public async Task ToggleStatusAsync(Guid id, string status)
    {
        var book = await _bookRepository.GetByIdAsync(id);
        if (book == null) throw new KeyNotFoundException("Book not found");

        book.Status = status;
        
        var existingCategories = book.BookCategories.Select(bc => bc.CategoryId).ToList();
        var existingTopics = book.BookTopics.Select(bt => bt.TopicId).ToList();
        await _bookRepository.UpdateAsync(book, existingCategories, existingTopics);
    }
}
