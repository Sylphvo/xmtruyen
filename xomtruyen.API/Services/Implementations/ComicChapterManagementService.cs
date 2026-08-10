using System.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using XomTruyen.API.Data;
using XomTruyen.API.Models;
using XomTruyen.API.Models.Requests;
using XomTruyen.API.Models.Responses;
using XomTruyen.API.Repositories.Interfaces;
using XomTruyen.API.Services.Interfaces;
using XomTruyen.API.Utils;

namespace XomTruyen.API.Services.Implementations;

public class ComicChapterManagementService : IComicChapterManagementService
{
    private readonly IComicChapterRepository _chapterRepository;
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _webHostEnvironment;
    private readonly ILogger<ComicChapterManagementService> _logger;

    public ComicChapterManagementService(
        IComicChapterRepository chapterRepository,
        ApplicationDbContext context,
        IWebHostEnvironment webHostEnvironment,
        ILogger<ComicChapterManagementService> logger)
    {
        _chapterRepository = chapterRepository;
        _context = context;
        _webHostEnvironment = webHostEnvironment;
        _logger = logger;
    }

    public async Task<List<ComicChapterResponse>> GetChaptersByPublicationIdAsync(Guid publicationId, CancellationToken cancellationToken = default)
    {
        var chapters = await _chapterRepository.GetChaptersByPublicationIdAsync(publicationId, cancellationToken);
        return chapters.Select(c => new ComicChapterResponse
        {
            Id = c.Id,
            PublicationId = c.PublicationId,
            ChapterNumber = c.ChapterNumber,
            Title = c.Title,
            IsLocked = c.IsLocked,
            CoinPrice = c.CoinPrice,
            ViewCount = c.ViewCount,
            CreatedAt = c.CreatedAt,
            ImageCount = c.Pages?.Count ?? 0
        }).ToList();
    }

    public async Task<ComicChapterResponse?> GetChapterByIdAsync(Guid chapterId, CancellationToken cancellationToken = default)
    {
        var c = await _chapterRepository.GetChapterByIdAsync(chapterId, cancellationToken);
        if (c == null) return null;

        return new ComicChapterResponse
        {
            Id = c.Id,
            PublicationId = c.PublicationId,
            ChapterNumber = c.ChapterNumber,
            Title = c.Title,
            IsLocked = c.IsLocked,
            CoinPrice = c.CoinPrice,
            ViewCount = c.ViewCount,
            CreatedAt = c.CreatedAt,
            ImageCount = c.Pages?.Count ?? 0
        };
    }

    public async Task<ComicChapterResponse> CreateChapterAsync(ComicChapterRequest request, CancellationToken cancellationToken = default)
    {
        var chapter = new ComicChapter
        {
            PublicationId = request.PublicationId,
            ChapterNumber = request.ChapterNumber,
            Title = request.Title,
            IsLocked = request.IsLocked,
            CoinPrice = request.CoinPrice,
            CreatedAt = DateTime.UtcNow,
            ViewCount = 0
        };

        await _chapterRepository.CreateChapterAsync(chapter, cancellationToken);

        return new ComicChapterResponse
        {
            Id = chapter.Id,
            PublicationId = chapter.PublicationId,
            ChapterNumber = chapter.ChapterNumber,
            Title = chapter.Title,
            IsLocked = chapter.IsLocked,
            CoinPrice = chapter.CoinPrice,
            ViewCount = chapter.ViewCount,
            CreatedAt = chapter.CreatedAt,
            ImageCount = 0
        };
    }

    public async Task UpdateChapterAsync(Guid id, ComicChapterRequest request, CancellationToken cancellationToken = default)
    {
        var chapter = await _chapterRepository.GetChapterByIdAsync(id, cancellationToken);
        if (chapter == null) throw new KeyNotFoundException("Chapter not found");

        chapter.ChapterNumber = request.ChapterNumber;
        chapter.Title = request.Title;
        chapter.IsLocked = request.IsLocked;
        chapter.CoinPrice = request.CoinPrice;

        await _chapterRepository.UpdateChapterAsync(chapter, cancellationToken);
    }

    public async Task DeleteChapterAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var chapter = await _chapterRepository.GetChapterByIdAsync(id, cancellationToken);
        if (chapter == null) throw new KeyNotFoundException("Chapter not found");

        await _chapterRepository.DeleteChapterAsync(chapter, cancellationToken);
    }

    public async Task DeleteAllChaptersByPublicationAsync(Guid publicationId, CancellationToken cancellationToken = default)
    {
        // Use ExecuteDeleteAsync for high performance bulk deletion
        await _context.ComicChapters
            .Where(c => c.PublicationId == publicationId)
            .ExecuteDeleteAsync(cancellationToken);
    }

    public async Task<List<ComicPageResponse>> GetPagesByChapterIdAsync(Guid chapterId, CancellationToken cancellationToken = default)
    {
        var pages = await _chapterRepository.GetPagesByChapterIdAsync(chapterId, cancellationToken);
        return pages.Select(p => new ComicPageResponse
        {
            Id = p.Id,
            ComicChapterId = p.ComicChapterId,
            ImageUrl = p.ImageUrl,
            OrderIndex = p.OrderIndex
        }).ToList();
    }

    public async Task<ComicPageResponse> AddPageAsync(Guid chapterId, ComicPageRequest request, CancellationToken cancellationToken = default)
    {
        var page = new ComicPage
        {
            ComicChapterId = chapterId,
            ImageUrl = request.ImageUrl,
            OrderIndex = request.OrderIndex
        };

        await _chapterRepository.CreatePageAsync(page, cancellationToken);

        return new ComicPageResponse
        {
            Id = page.Id,
            ComicChapterId = page.ComicChapterId,
            ImageUrl = page.ImageUrl,
            OrderIndex = page.OrderIndex
        };
    }

    public async Task DeletePageAsync(Guid chapterId, Guid pageId, CancellationToken cancellationToken = default)
    {
        var page = await _chapterRepository.GetPageByIdAsync(pageId, cancellationToken);
        if (page == null || page.ComicChapterId != chapterId)
            throw new KeyNotFoundException("Page not found");

        await _chapterRepository.DeletePageAsync(page, cancellationToken);
    }

    public async Task UpdatePageOrdersAsync(Guid chapterId, List<ComicPageRequest> requests, CancellationToken cancellationToken = default)
    {
        var pages = await _chapterRepository.GetPagesByChapterIdAsync(chapterId, cancellationToken);
        var updatedPages = new List<ComicPage>();
        foreach (var req in requests)
        {
            var page = pages.FirstOrDefault(p => p.ImageUrl == req.ImageUrl);
            if (page != null)
            {
                page.OrderIndex = req.OrderIndex;
                updatedPages.Add(page);
            }
        }
        
        if (updatedPages.Count > 0)
        {
            await _chapterRepository.UpdatePagesAsync(updatedPages, cancellationToken);
        }
    }

    public async Task<BulkUploadChapterResult> BulkUploadChaptersAsync(
        Guid publicationId,
        IFormFile file,
        BulkUploadChapterRequest? options = null,
        CancellationToken cancellationToken = default)
    {
        if (file == null || file.Length == 0)
        {
            throw new ArgumentException("Vui lòng chọn file nén để tải lên.");
        }

        if (!ArchiveHelper.IsValidArchive(file.FileName))
        {
            throw new ArgumentException("Định dạng file không hợp lệ. Hệ thống chỉ hỗ trợ các định dạng .zip, .cbz, .rar, .cbr.");
        }

        var publication = await _context.Publications.FindAsync(new object[] { publicationId }, cancellationToken);
        if (publication == null)
        {
            throw new KeyNotFoundException($"Không tìm thấy truyện với ID '{publicationId}'.");
        }

        var sw = Stopwatch.StartNew();
        _logger.LogInformation("Starting bulk upload chapters for publication {PublicationId}, file: {FileName} ({SizeMB:F2} MB)",
            publicationId, file.FileName, file.Length / (1024.0 * 1024.0));

        // 1. Extract and group entries by chapter
        using var fileStream = file.OpenReadStream();
        var chapterGroups = ArchiveHelper.ExtractAndGroupArchive(fileStream, file.FileName, options?.ImagesPerChapter);

        if (chapterGroups.Count == 0)
        {
            throw new InvalidOperationException("Không tìm thấy thư mục chapter hoặc hình ảnh hợp lệ (.jpg, .png, .webp, .avif) trong file nén.");
        }

        var rootPath = _webHostEnvironment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var createdFilePaths = new List<string>();

        // 2. Perform DB operations in a Transaction
        using var transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
        try
        {
            int chaptersCreated = 0;
            int chaptersUpdated = 0;
            int totalPagesCreated = 0;
            var processedChapterNames = new List<string>();

            // Get existing chapters for this publication
            var existingChapters = await _context.ComicChapters
                .Include(c => c.Pages)
                .Where(c => c.PublicationId == publicationId)
                .ToListAsync(cancellationToken);

            foreach (var group in chapterGroups)
            {
                cancellationToken.ThrowIfCancellationRequested();

                var existingChapter = existingChapters.FirstOrDefault(c => Math.Abs(c.ChapterNumber - group.ChapterNumber) < 0.001f);
                ComicChapter chapter;

                if (existingChapter == null)
                {
                    chapter = new ComicChapter
                    {
                        Id = Guid.NewGuid(),
                        PublicationId = publicationId,
                        ChapterNumber = group.ChapterNumber,
                        Title = group.Title,
                        IsLocked = options?.IsLocked ?? false,
                        CoinPrice = options?.DefaultCoinPrice ?? 0,
                        CreatedAt = DateTime.UtcNow,
                        ViewCount = 0
                    };
                    await _context.ComicChapters.AddAsync(chapter, cancellationToken);
                    chaptersCreated++;
                }
                else
                {
                    chapter = existingChapter;
                    if (options?.OverwriteExisting ?? true)
                    {
                        if (!string.IsNullOrEmpty(group.Title))
                        {
                            chapter.Title = group.Title;
                        }
                        if (chapter.Pages.Count > 0)
                        {
                            _context.ComicPages.RemoveRange(chapter.Pages);
                            chapter.Pages.Clear();
                        }
                        chaptersUpdated++;
                    }
                }

                // Prepare physical directory wwwroot/uploads/chapters/{chapter.Id}
                var chapterDir = Path.Combine(rootPath, "uploads", "chapters", chapter.Id.ToString());
                if (!Directory.Exists(chapterDir))
                {
                    Directory.CreateDirectory(chapterDir);
                }

                var newPages = new List<ComicPage>();
                int pageOrder = 1;

                foreach (var imgEntry in group.Images)
                {
                    cancellationToken.ThrowIfCancellationRequested();

                    var ext = Path.GetExtension(imgEntry.FileName);
                    if (string.IsNullOrEmpty(ext)) ext = ".jpg";

                    var safeFileName = $"page_{pageOrder:D3}{ext.ToLowerInvariant()}";
                    var physicalPath = Path.Combine(chapterDir, safeFileName);

                    using (var entryStream = imgEntry.OpenStream())
                    using (var destStream = new FileStream(physicalPath, FileMode.Create, FileAccess.Write))
                    {
                        await entryStream.CopyToAsync(destStream, cancellationToken);
                    }

                    createdFilePaths.Add(physicalPath);

                    var relativeUrl = $"uploads/chapters/{chapter.Id}/{safeFileName}".Replace("\\", "/");
                    newPages.Add(new ComicPage
                    {
                        Id = Guid.NewGuid(),
                        ComicChapterId = chapter.Id,
                        ImageUrl = relativeUrl,
                        OrderIndex = pageOrder++
                    });
                }

                if (newPages.Count > 0)
                {
                    await _context.ComicPages.AddRangeAsync(newPages, cancellationToken);
                    totalPagesCreated += newPages.Count;
                }

                processedChapterNames.Add($"Chap {group.ChapterNumber} ({newPages.Count} trang)");
            }

            await _context.SaveChangesAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);

            sw.Stop();
            _logger.LogInformation("Bulk upload completed for publication {PublicationId} in {ElapsedMs}ms. Created {Created}, Updated {Updated}, Pages {Pages}",
                publicationId, sw.ElapsedMilliseconds, chaptersCreated, chaptersUpdated, totalPagesCreated);

            return new BulkUploadChapterResult
            {
                TotalChaptersCreated = chaptersCreated,
                TotalChaptersUpdated = chaptersUpdated,
                TotalPagesCreated = totalPagesCreated,
                ProcessedChapters = processedChapterNames,
                ElapsedMilliseconds = sw.ElapsedMilliseconds,
                Message = $"Đã tải lên và xử lý thành công {processedChapterNames.Count} chapter với {totalPagesCreated} trang ảnh."
            };
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync(cancellationToken);

            // Clean up newly created physical files if transaction fails
            foreach (var filePath in createdFilePaths)
            {
                try
                {
                    if (File.Exists(filePath)) File.Delete(filePath);
                }
                catch { /* ignore cleanup error */ }
            }

            _logger.LogError(ex, "Error occurred during bulk upload of chapters for publication {PublicationId}", publicationId);
            throw;
        }
    }
}
