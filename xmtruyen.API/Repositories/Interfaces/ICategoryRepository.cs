using Xmtruyen.API.Models;
using Xmtruyen.API.Models.Requests;

namespace Xmtruyen.API.Repositories.Interfaces;

public interface ICategoryRepository
{
    Task<Category> CreateAsync(Category category);
    Task<Category?> GetByIdAsync(int id);
    Task<Category?> GetBySlugAsync(string slug);
    Task UpdateAsync(Category category);
    Task DeleteAsync(Category category);
    Task<bool> HasBooksAsync(int categoryId);
    Task<(IEnumerable<Category> Categories, int TotalCount)> GetCategoriesAsync(CategoryFilterRequest filter);
}


