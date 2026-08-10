using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace XomTruyen.API.Services.Interfaces
{
    public interface IFileService
    {
        Task<string> UploadFileAsync(IFormFile file, string subDirectory);
        Task<string> UploadBookFileAsync(IFormFile file, string PublicationId);
        Task<string> UploadCoverImageAsync(IFormFile file, string publicationId);
        Task<string> UploadChapterPageAsync(IFormFile file, string chapterId);
        Task<List<object>> GetFilesAsync(string subDirectory);
        Task<bool> DeleteFileAsync(string fileName, string subDirectory);
    }
}


