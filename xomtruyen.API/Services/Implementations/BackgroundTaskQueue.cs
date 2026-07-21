using System;
using System.Threading.Channels;
using System.Threading.Tasks;
using XomTruyen.API.Models.BookProcessing;
using XomTruyen.API.Services.Interfaces;

namespace XomTruyen.API.Services.Implementations
{
    public class BackgroundTaskQueue : IBackgroundTaskQueue
    {
        private readonly Channel<BookProcessingTask> _queue;

        public BackgroundTaskQueue(int capacity = 100)
        {
            var options = new BoundedChannelOptions(capacity)
            {
                FullMode = BoundedChannelFullMode.Wait
            };
            _queue = Channel.CreateBounded<BookProcessingTask>(options);
        }

        public async ValueTask QueueBackgroundWorkItemAsync(BookProcessingTask workItem)
        {
            if (workItem == null)
            {
                throw new ArgumentNullException(nameof(workItem));
            }

            await _queue.Writer.WriteAsync(workItem);
        }

        public async ValueTask<BookProcessingTask> DequeueAsync(CancellationToken cancellationToken)
        {
            return await _queue.Reader.ReadAsync(cancellationToken);
        }
    }
}


