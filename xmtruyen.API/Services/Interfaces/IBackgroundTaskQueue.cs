using System.Threading.Channels;
using System.Threading.Tasks;
using Xmtruyen.API.Models.BookProcessing;

namespace Xmtruyen.API.Services.Interfaces
{
    public interface IBackgroundTaskQueue
    {
        ValueTask QueueBackgroundWorkItemAsync(BookProcessingTask workItem);
        ValueTask<BookProcessingTask> DequeueAsync(CancellationToken cancellationToken);
    }
}


