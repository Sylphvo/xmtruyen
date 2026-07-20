using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using XomTruyen.API.Services.Interfaces;
using XomTruyen.API.Models.BookProcessing;

namespace XomTruyen.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IFileService _fileService;
        private readonly IBackgroundTaskQueue _taskQueue;

        public UploadController(IFileService fileService, IBackgroundTaskQueue taskQueue)
        {
            _fileService = fileService;
            _taskQueue = taskQueue;
        }

        [HttpPost("book-file")]
        [RequestSizeLimit(524288000)] // 500 MB
        [RequestFormLimits(MultipartBodyLengthLimit = 524288000)] // 500 MB
        public async Task<IActionResult> UploadBookFile(IFormFile file, [FromForm] string bookId, [FromForm] string? ownerId)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { success = false, message = "No file uploaded." });
                }

                if (string.IsNullOrEmpty(bookId))
                {
                    bookId = Guid.NewGuid().ToString(); // Temporary ID if not provided
                }

                // 1. Save raw file directly to book folder
                var fileUrl = await _fileService.UploadBookFileAsync(file, bookId);
                
                var taskId = Guid.NewGuid().ToString();

                // 2. Create Background Task
                var task = new BookProcessingTask
                {
                    TaskId = taskId,
                    BookId = bookId,
                    OwnerId = ownerId,
                    FileName = file.FileName,
                    SourceUrl = fileUrl,
                    FileType = file.ContentType,
                    Options = new BookProcessingOptions
                    {
                        ExtractToc = true,
                        GenerateThumbnails = true,
                        EnableEncryption = false
                    }
                };

                // 3. Queue the task
                await _taskQueue.QueueBackgroundWorkItemAsync(task);

                // 4. Return success immediately
                return Ok(new 
                {
                    success = true,
                    taskId = taskId,
                    bookId = bookId,
                    status = "PROCESSING",
                    message = "Book uploaded successfully and queued for processing."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("files")]
        public async Task<IActionResult> GetFiles([FromQuery] string subDirectory = "raw-uploads")
        {
            try
            {
                var files = await _fileService.GetFilesAsync(subDirectory);
                return Ok(new { success = true, data = files });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("files/{fileName}")]
        public async Task<IActionResult> DeleteFile(string fileName, [FromQuery] string subDirectory = "raw-uploads")
        {
            try
            {
                var success = await _fileService.DeleteFileAsync(fileName, subDirectory);
                if (success)
                    return Ok(new { success = true, message = "File deleted successfully" });
                return NotFound(new { success = false, message = "File not found" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}
