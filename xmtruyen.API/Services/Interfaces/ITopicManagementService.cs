using Xmtruyen.API.Models;
using Xmtruyen.API.Models.Requests;

namespace Xmtruyen.API.Services.Interfaces;

public interface ITopicManagementService
{
    Task<Topic> CreateTopicAsync(TopicRequest request);
    Task UpdateTopicAsync(int id, TopicRequest request);
    Task DeleteTopicAsync(int id);
    Task<Topic?> GetTopicByIdAsync(int id);
    Task<(IEnumerable<Topic> Topics, int TotalCount)> GetTopicsAsync(TopicFilterRequest filter);
}


