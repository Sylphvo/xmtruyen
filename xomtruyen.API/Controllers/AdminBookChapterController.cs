using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XomTruyen.API.Models.Requests;
using XomTruyen.API.Services.Interfaces;

namespace XomTruyen.API.Controllers;

[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminBookChapterController : BaseApiController
{
    private readonly IBookChapterManagementService _chapterService;

    public AdminBookChapterController(IBookChapterManagementService chapterService)
    {
        _chapterService = chapterService;
    }

    [HttpGet("publication/{publicationId}")]
    public async Task<IActionResult> GetChapters(Guid publicationId)
    {
        var chapters = await _chapterService.GetChaptersByPublicationIdAsync(publicationId);
        return Ok(new { success = true, data = chapters });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var chapter = await _chapterService.GetChapterByIdAsync(id);
        if (chapter == null) return NotFound(new { success = false, message = "Chapter not found" });
        return Ok(new { success = true, data = chapter });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] BookChapterRequest request)
    {
        try
        {
            var chapter = await _chapterService.CreateChapterAsync(request);
            return Ok(new { success = true, data = chapter });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] BookChapterRequest request)
    {
        try
        {
            await _chapterService.UpdateChapterAsync(id, request);
            return Ok(new { success = true });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { success = false, message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _chapterService.DeleteChapterAsync(id);
            return Ok(new { success = true });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { success = false, message = ex.Message });
        }
    }

    [HttpDelete("publication/{publicationId}")]
    public async Task<IActionResult> DeleteAllChapters(Guid publicationId)
    {
        try
        {
            await _chapterService.DeleteAllChaptersByPublicationAsync(publicationId);
            return Ok(new { success = true, message = "Đã xóa toàn bộ chương chữ." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = $"Lỗi xóa chương: {ex.Message}" });
        }
    }

    [HttpPatch("publication/{publicationId}/reorder")]
    public async Task<IActionResult> ReorderChapters(Guid publicationId, [FromBody] IEnumerable<BookChapterReorderRequest> requests)
    {
        try
        {
            await _chapterService.ReorderChaptersAsync(publicationId, requests);
            return Ok(new { success = true });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = $"Lỗi sắp xếp chương: {ex.Message}" });
        }
    }
}
