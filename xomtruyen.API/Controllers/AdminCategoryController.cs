using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XomTruyen.API.Models.Requests;
using XomTruyen.API.Services.Interfaces;

namespace XomTruyen.API.Controllers;

[Route("api/categories")]
[Authorize(Roles = "Admin")]
public class AdminCategoryController : BaseApiController
{
    private readonly ICategoryManagementService _categoryService;

    public AdminCategoryController(ICategoryManagementService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] CategoryFilterRequest filter)
    {
        var (categories, totalCount) = await _categoryService.GetCategoriesAsync(filter);
        return Ok(new
        {
            Data = categories,
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize
        });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var category = await _categoryService.GetCategoryByIdAsync(id);
        if (category == null) return NotFound(new { Message = "Category not found" });
        return Ok(category);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CategoryRequest request)
    {
        try
        {
            var category = await _categoryService.CreateCategoryAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CategoryRequest request)
    {
        try
        {
            await _categoryService.UpdateCategoryAsync(id, request);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _categoryService.DeleteCategoryAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }
}


