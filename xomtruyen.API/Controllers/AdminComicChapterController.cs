using Microsoft.AspNetCore.Mvc;
using XomTruyen.API.Models.Requests;
using XomTruyen.API.Services.Interfaces;

namespace XomTruyen.API.Controllers;

[Route("api/[controller]")]
public class AdminComicChapterController : BaseApiController
{
    private readonly IComicChapterManagementService _chapterService;

    public AdminComicChapterController(IComicChapterManagementService chapterService)
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
    public async Task<IActionResult> Create([FromBody] ComicChapterRequest request)
    {
        var chapter = await _chapterService.CreateChapterAsync(request);
        return Ok(new { success = true, data = chapter });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] ComicChapterRequest request)
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

    [HttpGet("{id}/pages")]
    public async Task<IActionResult> GetPages(Guid id)
    {
        var pages = await _chapterService.GetPagesByChapterIdAsync(id);
        return Ok(new { success = true, data = pages });
    }

    [HttpPost("{id}/pages")]
    public async Task<IActionResult> AddPage(Guid id, [FromBody] ComicPageRequest request)
    {
        var page = await _chapterService.AddPageAsync(id, request);
        return Ok(new { success = true, data = page });
    }

    [HttpDelete("{id}/pages/{pageId}")]
    public async Task<IActionResult> DeletePage(Guid id, Guid pageId)
    {
        try
        {
            await _chapterService.DeletePageAsync(id, pageId);
            return Ok(new { success = true });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { success = false, message = ex.Message });
        }
    }
}
