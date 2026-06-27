using Dapper;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;
using XomTruyen.API.Models.Requests;
using XomTruyen.API.Repositories.Interfaces;

namespace XomTruyen.API.Repositories.Implementations;

public class CategoryRepository : ICategoryRepository
{
    private readonly ApplicationDbContext _context;

    public CategoryRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Category> CreateAsync(Category category)
    {
        await _context.Categories.AddAsync(category);
        await _context.SaveChangesAsync();
        return category;
    }

    public async Task<Category?> GetByIdAsync(int id)
    {
        return await _context.Categories.FindAsync(id);
    }

    public async Task<Category?> GetBySlugAsync(string slug)
    {
        return await _context.Categories.FirstOrDefaultAsync(c => c.Slug == slug);
    }

    public async Task UpdateAsync(Category category)
    {
        _context.Categories.Update(category);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Category category)
    {
        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> HasBooksAsync(int categoryId)
    {
        return await _context.BookCategories.AnyAsync(bc => bc.CategoryId == categoryId);
    }

    public async Task<(IEnumerable<Category> Categories, int TotalCount)> GetCategoriesAsync(CategoryFilterRequest filter)
    {
        using var connection = _context.Database.GetDbConnection();
        var parameters = new DynamicParameters();
        
        var whereClause = "WHERE 1=1";
        if (!string.IsNullOrWhiteSpace(filter.SearchKeyword))
        {
            whereClause += " AND \"Name\" ILIKE @SearchKeyword";
            parameters.Add("SearchKeyword", $"%{filter.SearchKeyword}%");
        }

        var countSql = $"SELECT COUNT(*) FROM \"Categories\" {whereClause}";
        var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

        var orderBy = "ORDER BY \"Name\" ASC";
        if (!string.IsNullOrWhiteSpace(filter.SortBy))
        {
            var sortCol = filter.SortBy.ToLower() == "id" ? "\"Id\"" : "\"Name\"";
            var direction = filter.IsDescending ? "DESC" : "ASC";
            orderBy = $"ORDER BY {sortCol} {direction}";
        }

        var dataSql = $@"
            SELECT * FROM ""Categories""
            {whereClause}
            {orderBy}
            LIMIT @PageSize OFFSET @Offset
        ";
        
        parameters.Add("PageSize", filter.PageSize);
        parameters.Add("Offset", (filter.Page - 1) * filter.PageSize);

        var categories = await connection.QueryAsync<Category>(dataSql, parameters);
        return (categories, totalCount);
    }
}
