using System;
using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;

namespace Xmtruyen.API.Services.BookVideo
{
    public interface IBookVideoJobQueue
    {
        void QueueBackgroundWorkItem(Guid taskId);
        Task<Guid> DequeueAsync(CancellationToken cancellationToken);
    }

    public class BookVideoJobQueue : IBookVideoJobQueue
    {
        private readonly Channel<Guid> _queue;

        public BookVideoJobQueue(int capacity = 100)
        {
            var options = new BoundedChannelOptions(capacity)
            {
                FullMode = BoundedChannelFullMode.Wait
            };
            _queue = Channel.CreateBounded<Guid>(options);
        }

        public void QueueBackgroundWorkItem(Guid taskId)
        {
            if (taskId == Guid.Empty) throw new ArgumentNullException(nameof(taskId));
            _queue.Writer.TryWrite(taskId);
        }

        public async Task<Guid> DequeueAsync(CancellationToken cancellationToken)
        {
            return await _queue.Reader.ReadAsync(cancellationToken);
        }
    }
}
