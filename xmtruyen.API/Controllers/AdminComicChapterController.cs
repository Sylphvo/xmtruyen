using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Xmtruyen.API.Models.Requests;
using Xmtruyen.API.Services.Interfaces;

namespace Xmtruyen.API.Controllers;

[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
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
            return NotFound(new { success = false, message = Xmtruyen.API.Helpers.ExceptionHelper.GetFriendlyMessage(ex) });
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
            return NotFound(new { success = false, message = Xmtruyen.API.Helpers.ExceptionHelper.GetFriendlyMessage(ex) });
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
            return NotFound(new { success = false, message = Xmtruyen.API.Helpers.ExceptionHelper.GetFriendlyMessage(ex) });
        }
    }

    [HttpDelete("publication/{publicationId}/chapters")]
    public async Task<IActionResult> DeleteAllChapters(Guid publicationId)
    {
        try
        {
            await _chapterService.DeleteAllChaptersByPublicationAsync(publicationId);
            return Ok(new { success = true, message = "Đã xóa toàn bộ chapters." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = $"Lỗi xóa chapters: {Xmtruyen.API.Helpers.ExceptionHelper.GetFriendlyMessage(ex)}" });
        }
    }

    [HttpPost("publication/{publicationId}/bulk-upload")]
    [HttpPost("{publicationId}/bulk-upload")]
    [RequestSizeLimit(1073741824)] // 1GB
    [RequestFormLimits(MultipartBodyLengthLimit = 1073741824)]
    public async Task<IActionResult> BulkUploadChapters(
        [FromRoute] Guid publicationId,
        [FromForm] IFormFile file,
        [FromForm] bool overwriteExisting = true,
        [FromForm] int? defaultCoinPrice = 0,
        [FromForm] bool isLocked = false,
        [FromForm] int? imagesPerChapter = null)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { success = false, message = "Vui lòng chọn file nén (.zip, .cbz, .rar, .cbr) để tải lên." });
        }

        try
        {
            var options = new BulkUploadChapterRequest
            {
                File = file,
                OverwriteExisting = overwriteExisting,
                DefaultCoinPrice = defaultCoinPrice,
                IsLocked = isLocked,
                ImagesPerChapter = imagesPerChapter
            };

            var result = await _chapterService.BulkUploadChaptersAsync(publicationId, file, options);
            return Ok(new { success = true, message = result.Message, data = result });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { success = false, message = Xmtruyen.API.Helpers.ExceptionHelper.GetFriendlyMessage(ex) });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { success = false, message = Xmtruyen.API.Helpers.ExceptionHelper.GetFriendlyMessage(ex) });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = $"Lỗi xử lý file nén: {Xmtruyen.API.Helpers.ExceptionHelper.GetFriendlyMessage(ex)}" });
        }
    }
}

