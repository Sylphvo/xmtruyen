using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Webp;
using XomTruyen.API.Models.BookProcessing;
using XomTruyen.API.Services.Interfaces;
using SharpCompress.Archives;

namespace XomTruyen.API.Services.Implementations
{
    public class ArchiveBookProcessor : IBookProcessor
    {
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<ArchiveBookProcessor> _logger;

        private readonly string[] _validImageExtensions = { ".jpg", ".jpeg", ".png", ".webp" };

        public ArchiveBookProcessor(IWebHostEnvironment env, ILogger<ArchiveBookProcessor> logger)
        {
            _env = env;
            _logger = logger;
        }

        public bool CanProcess(BookProcessingTask task)
        {
            if (string.IsNullOrEmpty(task.FileName)) return false;
            return task.FileName.EndsWith(".cbz", StringComparison.OrdinalIgnoreCase) ||
                   task.FileName.EndsWith(".zip", StringComparison.OrdinalIgnoreCase) ||
                   task.FileName.EndsWith(".cbr", StringComparison.OrdinalIgnoreCase) ||
                   task.FileName.EndsWith(".rar", StringComparison.OrdinalIgnoreCase);
        }

        public async Task<BookProcessingResultMessage> ProcessAsync(BookProcessingTask task, CancellationToken cancellationToken)
        {
            var sw = Stopwatch.StartNew();
            _logger.LogInformation("Starting to process archive Publication {PublicationId} from {SourceUrl}", task.PublicationId, task.SourceUrl);

            try
            {
                var rootPath = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var rawFilePath = Path.Combine(rootPath, task.SourceUrl);
                var bookFolder = Path.Combine(rootPath, "Publications", task.PublicationId);
                var rawFolder = Path.Combine(bookFolder, "FileRaw");
                var processFolder = Path.Combine(bookFolder, "FileProcess");
                var coverFolder = Path.Combine(bookFolder, "File_cover");

                if (!Directory.Exists(bookFolder)) Directory.CreateDirectory(bookFolder);
                if (!Directory.Exists(rawFolder)) Directory.CreateDirectory(rawFolder);
                if (!Directory.Exists(processFolder)) Directory.CreateDirectory(processFolder);
                if (!Directory.Exists(coverFolder)) Directory.CreateDirectory(coverFolder);

                var extension = Path.GetExtension(task.FileName);
                var originalOutPath = Path.Combine(rawFolder, $"original{extension}");
                
                // Copy original file to FileRaw if it's not already there
                if (File.Exists(rawFilePath) && Path.GetFullPath(rawFilePath) != Path.GetFullPath(originalOutPath))
                {
                    File.Copy(rawFilePath, originalOutPath, true);
                }

                int totalPages = 0;
                var tocNodes = new List<TocNode>();

                if (File.Exists(rawFilePath))
                {
                    bool isRarOrCbr = extension.Equals(".rar", StringComparison.OrdinalIgnoreCase) || extension.Equals(".cbr", StringComparison.OrdinalIgnoreCase);

                    if (isRarOrCbr)
                    {
                        using (var archive = SharpCompress.Archives.ArchiveFactory.OpenArchive(rawFilePath))
                        {
                            var imageEntries = archive.Entries
                                .Where(e => !e.IsDirectory && e.Key != null && _validImageExtensions.Contains(Path.GetExtension(e.Key).ToLowerInvariant()))
                                .OrderBy(e => e.Key)
                                .ToList();

                            totalPages = imageEntries.Count;

                            for (int i = 0; i < totalPages; i++)
                            {
                                cancellationToken.ThrowIfCancellationRequested();

                                var entry = imageEntries[i];
                                var pageFileName = $"page_{i + 1:D3}.webp";
                                var pageFilePath = Path.Combine(processFolder, pageFileName);

                                using (var entryStream = entry.OpenEntryStream())
                                using (var ms = new MemoryStream())
                                {
                                    await entryStream.CopyToAsync(ms, cancellationToken);
                                    ms.Position = 0;
                                    using (var image = await Image.LoadAsync(ms, cancellationToken))
                                    {
                                        await image.SaveAsWebpAsync(pageFilePath, cancellationToken);
                                    }
                                }

                                if (i == 0 && task.Options.GenerateThumbnails)
                                {
                                    var coverFileName = "cover.webp";
                                    var coverFilePath = Path.Combine(coverFolder, coverFileName);
                                    var processCoverFilePath = Path.Combine(processFolder, coverFileName);
                                    
                                    using (var coverImage = await Image.LoadAsync(pageFilePath, cancellationToken))
                                    {
                                        coverImage.Mutate(x => x.Resize(new ResizeOptions
                                        {
                                            Size = new Size(600, 900),
                                            Mode = ResizeMode.Max
                                        }));
                                        await coverImage.SaveAsWebpAsync(coverFilePath, cancellationToken);
                                        await coverImage.SaveAsWebpAsync(processCoverFilePath, cancellationToken);
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        using (var zipArchive = ZipFile.OpenRead(rawFilePath))
                        {
                            var imageEntries = zipArchive.Entries
                                .Where(e => _validImageExtensions.Contains(Path.GetExtension(e.FullName).ToLowerInvariant()))
                                .OrderBy(e => e.FullName) // Sort alphabetically (standard for cbz)
                                .ToList();

                            totalPages = imageEntries.Count;

                            for (int i = 0; i < totalPages; i++)
                            {
                                cancellationToken.ThrowIfCancellationRequested();

                                var entry = imageEntries[i];
                                var pageFileName = $"page_{i + 1:D3}.webp";
                                var pageFilePath = Path.Combine(processFolder, pageFileName);

                                using (var entryStream = entry.Open())
                                using (var image = await Image.LoadAsync(entryStream, cancellationToken))
                                {
                                    // Convert and save as WebP
                                    await image.SaveAsWebpAsync(pageFilePath, cancellationToken);
                                }

                                // Generate Cover from the first page
                                if (i == 0 && task.Options.GenerateThumbnails)
                                {
                                    var coverFileName = "cover.webp";
                                    var coverFilePath = Path.Combine(coverFolder, coverFileName);
                                    var processCoverFilePath = Path.Combine(processFolder, coverFileName);
                                    
                                    using (var coverImage = await Image.LoadAsync(pageFilePath, cancellationToken))
                                    {
                                        coverImage.Mutate(x => x.Resize(new ResizeOptions
                                        {
                                            Size = new Size(600, 900),
                                            Mode = ResizeMode.Max
                                        }));
                                        await coverImage.SaveAsWebpAsync(coverFilePath, cancellationToken);
                                        await coverImage.SaveAsWebpAsync(processCoverFilePath, cancellationToken);
                                    }
                                }
                            }
                        }
                    }
                }
                else
                {
                    _logger.LogWarning("Archive file not found at {RawFilePath}.", rawFilePath);
                    throw new FileNotFoundException("Original archive file not found", rawFilePath);
                }

                // Save Metadata and TOC
                var metaPath = Path.Combine(processFolder, "metadata.json");
                await File.WriteAllTextAsync(metaPath, JsonSerializer.Serialize(new { 
                    PublicationId = task.PublicationId, 
                    FileName = task.FileName,
                    TotalPages = totalPages,
                    ProcessedAt = DateTime.UtcNow
                }), cancellationToken);

                var tocPath = Path.Combine(processFolder, "toc.json");
                await File.WriteAllTextAsync(tocPath, JsonSerializer.Serialize(tocNodes), cancellationToken);

                sw.Stop();
                return new BookProcessingResultMessage
                {
                    TaskId = task.TaskId,
                    PublicationId = task.PublicationId,
                    Status = "COMPLETED",
                    Message = "Archive processed successfully",
                    ProcessingTimeMs = sw.ElapsedMilliseconds,
                    Output = new BookProcessingOutput
                    {
                        PdfUrl = $"Publications/{task.PublicationId}/FileRaw/original{extension}",
                        ImageUrl = $"Publications/{task.PublicationId}/File_cover/cover.webp",
                        PagesUrl = $"Publications/{task.PublicationId}/FileProcess/",
                        TotalPage = totalPages,
                        Toc = tocNodes
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing archive Publication {PublicationId}", task.PublicationId);
                return new BookProcessingResultMessage
                {
                    TaskId = task.TaskId,
                    PublicationId = task.PublicationId,
                    Status = "FAILED",
                    Message = ex.Message,
                    ProcessingTimeMs = sw.ElapsedMilliseconds
                };
            }
        }
    }
}


