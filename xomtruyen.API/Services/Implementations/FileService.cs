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
using XomTruyen.API.Services.Interfaces;

namespace XomTruyen.API.Services.Implementations
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public FileService(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        public async Task<string> UploadFileAsync(IFormFile file, string subDirectory)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty or null.");

            // Determine the base path (wwwroot). If it doesn't exist, use a default "wwwroot" folder in the current directory.
            var rootPath = _webHostEnvironment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            
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

            var rootPath = _webHostEnvironment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var bookFolder = Path.Combine(rootPath, "Publications", PublicationId, "FileRaw");

            if (!Directory.Exists(bookFolder))
            {
                Directory.CreateDirectory(bookFolder);
            }

            var filePath = Path.Combine(bookFolder, "original.pdf");

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return $"Publications/{PublicationId}/FileRaw/original.pdf";
        }

        public async Task<string> UploadCoverImageAsync(IFormFile file, string publicationId)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty or null.");

            var rootPath = _webHostEnvironment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
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

        public async Task<List<object>> GetFilesAsync(string subDirectory)
        {
            var rootPath = _webHostEnvironment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
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
            var rootPath = _webHostEnvironment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
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


