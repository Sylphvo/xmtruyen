using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.IO;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Jpeg;
using Xmtruyen.API.Services.Interfaces;

namespace Xmtruyen.API.Services.Implementations
{
    public class FileService : IFileService
    {
        private readonly string _basePath;

        public FileService(Microsoft.Extensions.Configuration.IConfiguration configuration)
        {
            _basePath = configuration.GetValue<string>("UploadSettings:BasePath") ?? "C:\\Uploads";
        }

        public async Task<string> UploadFileAsync(IFormFile file, string subDirectory)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty or null.");

            // Determine the base path from configuration
            var rootPath = _basePath;
            
            // The directory where files will be saved (e.g., wwwroot/uploads/Publications)
            var uploadsFolder = Path.Combine(rootPath, "uploads", subDirectory);

            // Create the directory if it doesn't exist
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            // Generate a unique filename to prevent overwriting
            var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // Save the file to the directory
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            // Return the relative path (useful for saving to database and accessing via HTTP)
            return Path.Combine("uploads", subDirectory, uniqueFileName).Replace("\\", "/");
        }

        public async Task<string> UploadBookFileAsync(IFormFile file, string PublicationId)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty or null.");

            var rootPath = _basePath;
            var bookFolder = Path.Combine(rootPath, "Publications", PublicationId);
            var rawFolder = Path.Combine(bookFolder, "FileRaw");
            var coverFolder = Path.Combine(bookFolder, "File_cover");
            var processFolder = Path.Combine(bookFolder, "FileProcess");

            if (!Directory.Exists(bookFolder)) Directory.CreateDirectory(bookFolder);
            if (!Directory.Exists(rawFolder)) Directory.CreateDirectory(rawFolder);
            if (!Directory.Exists(coverFolder)) Directory.CreateDirectory(coverFolder);
            if (!Directory.Exists(processFolder)) Directory.CreateDirectory(processFolder);

            var extension = Path.GetExtension(file.FileName);
            if (string.IsNullOrEmpty(extension)) extension = ".zip";
            var filePath = Path.Combine(rawFolder, $"original{extension}");

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return $"Publications/{PublicationId}/FileRaw/original{extension}";
        }

        public async Task<string> UploadCoverImageAsync(IFormFile file, string publicationId)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty or null.");

            var rootPath = _basePath;
            var coverFolder = Path.Combine(rootPath, "Publications", publicationId, "File_cover");

            if (!Directory.Exists(coverFolder))
            {
                Directory.CreateDirectory(coverFolder);
            }

            var uniqueFileName = Guid.NewGuid().ToString() + ".jpg";
            var filePath = Path.Combine(coverFolder, uniqueFileName);

            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                memoryStream.Position = 0;

                using (var image = await Image.LoadAsync(memoryStream))
                {
                    image.Mutate(x => x.Resize(new ResizeOptions
                    {
                        Size = new Size(600, 900),
                        Mode = ResizeMode.Crop
                    }));

                    await image.SaveAsJpegAsync(filePath, new JpegEncoder { Quality = 85 });
                }
            }

            return $"Publications/{publicationId}/File_cover/{uniqueFileName}";
        }

        public async Task<string> UploadChapterPageAsync(IFormFile file, string chapterId)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty or null.");

            var rootPath = _basePath;
            var chapterFolder = Path.Combine(rootPath, "uploads", "chapters", chapterId);

            if (!Directory.Exists(chapterFolder))
            {
                Directory.CreateDirectory(chapterFolder);
            }

            var extension = Path.GetExtension(file.FileName);
            if (string.IsNullOrEmpty(extension)) extension = ".jpg";
            var uniqueFileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(chapterFolder, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return $"uploads/chapters/{chapterId}/{uniqueFileName}";
        }

        public async Task<List<object>> GetFilesAsync(string subDirectory)
        {
            var rootPath = _basePath;
            var uploadsFolder = Path.Combine(rootPath, "uploads", subDirectory);

            if (!Directory.Exists(uploadsFolder))
                return new List<object>();

            var files = Directory.GetFiles(uploadsFolder);
            var result = files.Select(file => {
                var info = new FileInfo(file);
                return (object)new {
                    Name = info.Name,
                    Path = Path.Combine("uploads", subDirectory, info.Name).Replace("\\", "/"),
                    Size = info.Length,
                    CreatedAt = info.CreationTime
                };
            }).ToList();

            return await Task.FromResult(result);
        }

        public async Task<bool> DeleteFileAsync(string fileName, string subDirectory)
        {
            var rootPath = _basePath;
            var filePath = Path.Combine(rootPath, "uploads", subDirectory, fileName);

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
                return await Task.FromResult(true);
            }
            return await Task.FromResult(false);
        }
    }
}


