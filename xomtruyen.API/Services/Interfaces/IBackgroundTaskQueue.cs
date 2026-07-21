using System.Threading.Channels;
using System.Threading.Tasks;
using XomTruyen.API.Models.BookProcessing;

namespace XomTruyen.API.Services.Interfaces
{
    public interface IBackgroundTaskQueue
    {
        ValueTask QueueBackgroundWorkItemAsync(BookProcessingTask workItem);
        ValueTask<BookProcessingTask> DequeueAsync(CancellationToken cancellationToken);
    }
}


