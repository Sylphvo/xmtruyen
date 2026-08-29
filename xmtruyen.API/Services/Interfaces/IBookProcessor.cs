using System.Threading;
using System.Threading.Tasks;
using Xmtruyen.API.Models.BookProcessing;

namespace Xmtruyen.API.Services.Interfaces
{
    public interface IBookProcessor
    {
        bool CanProcess(BookProcessingTask task);
        Task<BookProcessingResultMessage> ProcessAsync(BookProcessingTask task, CancellationToken cancellationToken);
    }
}


