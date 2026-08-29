using Xmtruyen.API.Models;
using Xmtruyen.API.Models.Requests;

namespace Xmtruyen.API.Repositories.Interfaces;

public interface ITopicRepository
{
    Task<Topic> CreateAsync(Topic topic);
    Task<Topic?> GetByIdAsync(int id);
    Task<Topic?> GetBySlugAsync(string slug);
    Task UpdateAsync(Topic topic);
    Task DeleteAsync(Topic topic);
    Task<(IEnumerable<Topic> Topics, int TotalCount)> GetTopicsAsync(TopicFilterRequest filter);
}


