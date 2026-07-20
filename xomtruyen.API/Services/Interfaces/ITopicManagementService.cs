using XomTruyen.API.Models;
using XomTruyen.API.Models.Requests;

namespace XomTruyen.API.Services.Interfaces;

public interface ITopicManagementService
{
    Task<Topic> CreateTopicAsync(TopicRequest request);
    Task UpdateTopicAsync(int id, TopicRequest request);
    Task DeleteTopicAsync(int id);
    Task<Topic?> GetTopicByIdAsync(int id);
    Task<(IEnumerable<Topic> Topics, int TotalCount)> GetTopicsAsync(TopicFilterRequest filter);
}
