using Xmtruyen.API.Models;
using Xmtruyen.API.Models.Requests;

namespace Xmtruyen.API.Services.Interfaces;

public interface ICategoryManagementService
{
    Task<Category> CreateCategoryAsync(CategoryRequest request);
    Task UpdateCategoryAsync(int id, CategoryRequest request);
    Task DeleteCategoryAsync(int id);
    Task<Category?> GetCategoryByIdAsync(int id);
    Task<(IEnumerable<Category> Categories, int TotalCount)> GetCategoriesAsync(CategoryFilterRequest filter);
}


