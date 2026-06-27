using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XomTruyen.API.Models.Enums;
using XomTruyen.API.Models.Requests;
using XomTruyen.API.Services.Interfaces;

namespace XomTruyen.API.Controllers;

[Route("api/admin/books")]
// [Authorize(Roles = "Admin")] // Uncomment when roles are implemented
public class AdminBookController : BaseApiController
{
    private readonly IBookManagementService _bookService;

    public AdminBookController(IBookManagementService bookService)
    {
        _bookService = bookService;
    }

    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] BookFilterRequest filter)
    {
        var (books, totalCount) = await _bookService.GetBooksAsync(filter);
        return Ok(new
        {
            Data = books,
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize
        });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var book = await _bookService.GetBookByIdAsync(id);
        if (book == null) return NotFound(new { Message = "Book not found" });
        return Ok(book);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] BookRequest request)
    {
        try
        {
            var book = await _bookService.CreateBookAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = book.Id }, book);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] BookRequest request)
    {
        try
        {
            await _bookService.UpdateBookAsync(id, request);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _bookService.DeleteBookAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
    }

    [HttpPatch("{id}/recommended")]
    public async Task<IActionResult> ToggleRecommended(Guid id, [FromBody] bool isRecommended)
    {
        try
        {
            await _bookService.ToggleRecommendedAsync(id, isRecommended);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
    }

    [HttpPatch("{id}/exclusive")]
    public async Task<IActionResult> ToggleExclusive(Guid id, [FromBody] bool isExclusive)
    {
        try
        {
            await _bookService.ToggleExclusiveAsync(id, isExclusive);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
    }
}
