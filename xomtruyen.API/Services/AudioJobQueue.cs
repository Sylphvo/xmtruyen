using System.Threading.Channels;

namespace XomTruyen.API.Services;

public class AudioJobQueue
{
    private readonly Channel<Guid> _queue;

    public AudioJobQueue()
    {
        var options = new BoundedChannelOptions(100)
        {
            FullMode = BoundedChannelFullMode.Wait
        };
        _queue = Channel.CreateBounded<Guid>(options);
    }

    public async ValueTask EnqueueJobAsync(Guid jobId, CancellationToken cancellationToken = default)
    {
        await _queue.Writer.WriteAsync(jobId, cancellationToken);
    }

    public async ValueTask<Guid> DequeueJobAsync(CancellationToken cancellationToken)
    {
        return await _queue.Reader.ReadAsync(cancellationToken);
    }
}
