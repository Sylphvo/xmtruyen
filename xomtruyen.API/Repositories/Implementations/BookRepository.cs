using Dapper;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;
using XomTruyen.API.Models.Enums;
using XomTruyen.API.Models.Requests;
using XomTruyen.API.Models.Responses;
using XomTruyen.API.Repositories.Interfaces;

namespace XomTruyen.API.Repositories.Implementations;

public class BookRepository : IBookRepository
{
    private readonly ApplicationDbContext _context;

    public BookRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Book> CreateAsync(Book book, List<int> categoryIds)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            await _context.Books.AddAsync(book);
            await _context.SaveChangesAsync();

            var bookCategories = categoryIds.Select(cid => new BookCategory
            {
                BookId = book.Id,
                CategoryId = cid
            }).ToList();

            await _context.BookCategories.AddRangeAsync(bookCategories);
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();
            return book;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<Book?> GetByIdAsync(Guid id)
    {
        return await _context.Books
            .Include(b => b.BookCategories)
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task UpdateAsync(Book book, List<int> categoryIds)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            _context.Books.Update(book);

            var existingCategories = await _context.BookCategories
                .Where(bc => bc.BookId == book.Id)
                .ToListAsync();
            _context.BookCategories.RemoveRange(existingCategories);

            var newCategories = categoryIds.Select(cid => new BookCategory
            {
                BookId = book.Id,
                CategoryId = cid
            }).ToList();
            
            await _context.BookCategories.AddRangeAsync(newCategories);
            
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task DeleteAsync(Book book)
    {
        _context.Books.Remove(book);
        await _context.SaveChangesAsync();
    }

    public async Task<(IEnumerable<BookListResponse> Books, int TotalCount)> GetBooksAsync(BookFilterRequest filter)
    {
        using var connection = _context.Database.GetDbConnection();
        var parameters = new DynamicParameters();
        
        var whereClause = "WHERE 1=1";
        
        if (filter.FormatType.HasValue)
        {
            whereClause += " AND b.\"FormatType\" = @FormatType";
            parameters.Add("FormatType", (int)filter.FormatType.Value);
        }

        if (filter.AccessLevel.HasValue)
        {
            whereClause += " AND b.\"AccessLevel\" = @AccessLevel";
            parameters.Add("AccessLevel", (int)filter.AccessLevel.Value);
        }

        if (filter.IsRecommended.HasValue)
        {
            whereClause += " AND b.\"IsRecommended\" = @IsRecommended";
            parameters.Add("IsRecommended", filter.IsRecommended.Value);
        }

        if (filter.IsExclusive.HasValue)
        {
            whereClause += " AND b.\"IsExclusive\" = @IsExclusive";
            parameters.Add("IsExclusive", filter.IsExclusive.Value);
        }

        if (filter.CategoryId.HasValue)
        {
            whereClause += " AND b.\"Id\" IN (SELECT \"BookId\" FROM \"BookCategories\" WHERE \"CategoryId\" = @CategoryId)";
            parameters.Add("CategoryId", filter.CategoryId.Value);
        }

        if (!string.IsNullOrWhiteSpace(filter.SearchKeyword))
        {
            whereClause += " AND b.\"Title\" ILIKE @SearchKeyword";
            parameters.Add("SearchKeyword", $"%{filter.SearchKeyword}%");
        }

        var countSql = $@"
            SELECT COUNT(*)
            FROM ""Books"" b
            {whereClause}
        ";

        var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

        var orderBy = "ORDER BY b.\"CreatedAt\" DESC";
        if (!string.IsNullOrWhiteSpace(filter.SortBy))
        {
            var sortCol = filter.SortBy.ToLower() switch
            {
                "title" => "b.\"Title\"",
                "viewcount" => "b.\"ViewCount\"",
                "averagerating" => "b.\"AverageRating\"",
                _ => "b.\"CreatedAt\""
            };
            var direction = filter.IsDescending ? "DESC" : "ASC";
            orderBy = $"ORDER BY {sortCol} {direction}";
        }

        var dataSql = $@"
            SELECT 
                b.""Id"", b.""Title"", b.""Slug"", b.""Author"", b.""Description"", b.""CoverImageUrl"",
                b.""FormatType"", b.""AccessLevel"", b.""ViewCount"", b.""AverageRating"",
                b.""IsRecommended"", b.""IsExclusive"", b.""CreatedAt"",
                (
                    SELECT COALESCE(json_agg(json_build_object('Id', c.""Id"", 'Name', c.""Name"", 'Slug', c.""Slug"")), '[]'::json)
                    FROM ""BookCategories"" bc
                    JOIN ""Categories"" c ON bc.""CategoryId"" = c.""Id""
                    WHERE bc.""BookId"" = b.""Id""
                ) as ""CategoriesJson""
            FROM ""Books"" b
            {whereClause}
            {orderBy}
            LIMIT @PageSize OFFSET @Offset
        ";

        parameters.Add("PageSize", filter.PageSize);
        parameters.Add("Offset", (filter.Page - 1) * filter.PageSize);

        var books = await connection.QueryAsync<BookListResponse>(dataSql, parameters);
        return (books, totalCount);
    }
}
