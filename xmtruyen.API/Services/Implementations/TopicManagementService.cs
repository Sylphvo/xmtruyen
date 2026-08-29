using Xmtruyen.API.Models;
using Xmtruyen.API.Models.Requests;
using Xmtruyen.API.Repositories.Interfaces;
using Xmtruyen.API.Services.Interfaces;
using Xmtruyen.API.Utils;

namespace Xmtruyen.API.Services.Implementations;

public class TopicManagementService : ITopicManagementService
{
    private readonly ITopicRepository _topicRepository;

    public TopicManagementService(ITopicRepository topicRepository)
    {
        _topicRepository = topicRepository;
    }

    public async Task<Topic> CreateTopicAsync(TopicRequest request)
    {
        var slug = SlugHelper.GenerateSlug(request.Name);
        var existing = await _topicRepository.GetBySlugAsync(slug);
        
        if (existing != null)
        {
            throw new ArgumentException("A topic with a similar name already exists.");
        }

        var topic = new Topic
        {
            Name = request.Name,
            Slug = slug
        };

        return await _topicRepository.CreateAsync(topic);
    }

    public async Task UpdateTopicAsync(int id, TopicRequest request)
    {
        var topic = await _topicRepository.GetByIdAsync(id);
        if (topic == null) throw new KeyNotFoundException("Topic not found");

        topic.Name = request.Name;
        // Business logic says we only update name, slug can be kept same to avoid dead links.
        
        await _topicRepository.UpdateAsync(topic);
    }

    public async Task DeleteTopicAsync(int id)
    {
        var topic = await _topicRepository.GetByIdAsync(id);
        if (topic == null) throw new KeyNotFoundException("Topic not found");

        await _topicRepository.DeleteAsync(topic);
    }

    public async Task<Topic?> GetTopicByIdAsync(int id)
    {
        return await _topicRepository.GetByIdAsync(id);
    }

    public async Task<(IEnumerable<Topic> Topics, int TotalCount)> GetTopicsAsync(TopicFilterRequest filter)
    {
        return await _topicRepository.GetTopicsAsync(filter);
    }
}


