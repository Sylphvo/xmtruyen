using System.Threading;
using System.Threading.Tasks;
using XomTruyen.API.Models.BookProcessing;

namespace XomTruyen.API.Services.Interfaces
{
    public interface IBookProcessor
    {
        bool CanProcess(BookProcessingTask task);
        Task<BookProcessingResultMessage> ProcessAsync(BookProcessingTask task, CancellationToken cancellationToken);
    }
}


