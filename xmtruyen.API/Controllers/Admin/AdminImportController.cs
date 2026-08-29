using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Xmtruyen.API.Services.Import;

namespace Xmtruyen.API.Controllers.Admin;

[Authorize(Roles = "Admin,Moderator")]
[ApiController]
[Route("api/admin/import")]
public class AdminImportController : ControllerBase
{
    private readonly IImportService _importService;
    private readonly IPasteParserService _pasteParserService;
    private readonly IOcrService _ocrService;

    public AdminImportController(
        IImportService importService,
        IPasteParserService pasteParserService,
        IOcrService ocrService)
    {
        _importService = importService;
        _pasteParserService = pasteParserService;
        _ocrService = ocrService;
    }

    [HttpPost("jobs")]
    public async Task<IActionResult> CreateImportJob([FromBody] CreateImportJobRequest request)
    {
        // Get user ID from claims (placeholder Guid for demo if claims not set)
        var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out Guid userId))
        {
            // Default to a fake GUID if running without proper auth context in development
            userId = Guid.NewGuid();
        }

        var job = await _importService.CreateImportJobAsync(userId, request.Name, request.SourceType);
        return Ok(job);
    }

    [HttpPost("jobs/{jobId}/upload-csv")]
    [RequestSizeLimit(1073741824)] // 1GB
    public async Task<IActionResult> UploadCsv(Guid jobId, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("File is empty");

        using var stream = file.OpenReadStream();
        var job = await _importService.ProcessCsvUploadAsync(jobId, stream);
        
        return Ok(job);
    }

    [HttpPost("jobs/{jobId}/upload-paste")]
    public async Task<IActionResult> UploadPaste(Guid jobId, [FromBody] UploadPasteRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Text))
            return BadRequest("Text is empty");

        var job = await _pasteParserService.ProcessPastedTextAsync(jobId, request.Text);
        return Ok(job);
    }

    [HttpPost("jobs/{jobId}/upload-ocr")]
    public async Task<IActionResult> UploadOcr(Guid jobId, [FromBody] UploadOcrRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.ImageUrl))
            return BadRequest("ImageUrl is empty");

        var job = await _ocrService.ProcessImageOcrAsync(jobId, request.ImageUrl);
        return Ok(job);
    }

    [HttpPost("jobs/{jobId}/confirm")]
    public async Task<IActionResult> ConfirmImport(Guid jobId)
    {
        var job = await _importService.ConfirmImportAsync(jobId);
        return Ok(job);
    }

    [HttpGet("jobs/{jobId}")]
    public async Task<IActionResult> GetJobStatus(Guid jobId)
    {
        var job = await _importService.GetJobStatusAsync(jobId);
        if (job == null) return NotFound();

        return Ok(job);
    }
}

public class CreateImportJobRequest
{
    public string Name { get; set; } = string.Empty;
    public string SourceType { get; set; } = "CSV";
}

public class UploadPasteRequest
{
    public string Text { get; set; } = string.Empty;
}

public class UploadOcrRequest
{
    public string ImageUrl { get; set; } = string.Empty;
}
