using XomTruyen.API.Models;
using XomTruyen.API.Models.Requests;
using XomTruyen.API.Repositories.Interfaces;
using XomTruyen.API.Services.Interfaces;
using XomTruyen.API.Utils;

namespace XomTruyen.API.Services.Implementations;

public class CategoryManagementService : ICategoryManagementService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryManagementService(ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<Category> CreateCategoryAsync(CategoryRequest request)
    {
        var slug = SlugHelper.GenerateSlug(request.Name);
        var existing = await _categoryRepository.GetBySlugAsync(slug);
        
        if (existing != null)
        {
            throw new ArgumentException("A category with a similar name already exists.");
        }

        var category = new Category
        {
            Name = request.Name,
            Slug = slug
        };

        return await _categoryRepository.CreateAsync(category);
    }

    public async Task UpdateCategoryAsync(int id, CategoryRequest request)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category == null) throw new KeyNotFoundException("Category not found");

        category.Name = request.Name;
        // Business logic says we only update name, slug can be kept same to avoid dead links.
        
        await _categoryRepository.UpdateAsync(category);
    }

    public async Task DeleteCategoryAsync(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category == null) throw new KeyNotFoundException("Category not found");

        if (await _categoryRepository.HasBooksAsync(id))
        {
            throw new InvalidOperationException("Cannot delete category with associated Publications");
        }

        await _categoryRepository.DeleteAsync(category);
    }

    public async Task<Category?> GetCategoryByIdAsync(int id)
    {
        return await _categoryRepository.GetByIdAsync(id);
    }

    public async Task<(IEnumerable<Category> Categories, int TotalCount)> GetCategoriesAsync(CategoryFilterRequest filter)
    {
        return await _categoryRepository.GetCategoriesAsync(filter);
    }
}


