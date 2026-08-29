using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Xmtruyen.API.Services.Interfaces;
using Xmtruyen.API.Models.BookProcessing;

namespace Xmtruyen.API.Controllers
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

        [HttpPost("publication-file")]
        [HttpPost("book-file")]
        [RequestSizeLimit(524288000)] // 500 MB
        [RequestFormLimits(MultipartBodyLengthLimit = 524288000)] // 500 MB
        public async Task<IActionResult> UploadBookFile(IFormFile file, [FromForm] string? PublicationId, [FromForm] string? publicationId, [FromForm] string? bookId, [FromForm] string? ownerId)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { success = false, message = "No file uploaded." });
                }

                var targetId = !string.IsNullOrEmpty(PublicationId) ? PublicationId :
                               !string.IsNullOrEmpty(publicationId) ? publicationId :
                               !string.IsNullOrEmpty(bookId) ? bookId :
                               Guid.NewGuid().ToString();

                // 1. Save raw file directly to Publication folder
                var fileUrl = await _fileService.UploadBookFileAsync(file, targetId);
                
                var taskId = Guid.NewGuid().ToString();

                // 2. Create Background Task
                var task = new BookProcessingTask
                {
                    TaskId = taskId,
                    PublicationId = targetId,
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
                    PublicationId = targetId,
                    bookId = targetId,
                    status = "PROCESSING",
                    message = "Publication uploaded successfully and queued for processing."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = Xmtruyen.API.Helpers.ExceptionHelper.GetFriendlyMessage(ex) });
            }
        }

        [HttpPost("cover-image")]
        [RequestSizeLimit(10485760)] // 10 MB
        [RequestFormLimits(MultipartBodyLengthLimit = 10485760)]
        public async Task<IActionResult> UploadCoverImage(IFormFile file, [FromForm] string? publicationId, [FromForm] string? bookId)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { success = false, message = "No file uploaded." });
                }

                var targetId = !string.IsNullOrEmpty(publicationId) ? publicationId : bookId;

                if (string.IsNullOrEmpty(targetId) || targetId == "NEW")
                {
                    targetId = Guid.NewGuid().ToString(); // Generate ID for new book
                }

                var fileUrl = await _fileService.UploadCoverImageAsync(file, targetId);
                
                return Ok(new 
                {
                    success = true,
                    url = fileUrl,
                    publicationId = targetId,
                    bookId = targetId,
                    message = "Cover image uploaded and resized successfully."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = Xmtruyen.API.Helpers.ExceptionHelper.GetFriendlyMessage(ex) });
            }
        }

        [HttpPost("chapter-page")]
        [RequestSizeLimit(52428800)] // 50 MB
        [RequestFormLimits(MultipartBodyLengthLimit = 52428800)]
        public async Task<IActionResult> UploadChapterPage(IFormFile file, [FromForm] string chapterId)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest(new { success = false, message = "No file uploaded." });
                }

                if (string.IsNullOrEmpty(chapterId))
                {
                    return BadRequest(new { success = false, message = "chapterId is required." });
                }

                var fileUrl = await _fileService.UploadChapterPageAsync(file, chapterId);

                return Ok(new
                {
                    success = true,
                    url = fileUrl,
                    chapterId = chapterId,
                    message = "Chapter page image uploaded successfully."
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = Xmtruyen.API.Helpers.ExceptionHelper.GetFriendlyMessage(ex) });
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
                return BadRequest(new { success = false, message = Xmtruyen.API.Helpers.ExceptionHelper.GetFriendlyMessage(ex) });
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
                return BadRequest(new { success = false, message = Xmtruyen.API.Helpers.ExceptionHelper.GetFriendlyMessage(ex) });
            }
        }
    }
}



