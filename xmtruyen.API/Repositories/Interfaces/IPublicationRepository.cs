using Xmtruyen.API.Models;
using Xmtruyen.API.Models.Responses;
using Xmtruyen.API.Models.Enums;
using Xmtruyen.API.Models.Requests;
namespace Xmtruyen.API.Repositories.Interfaces;

public interface IPublicationRepository
{
    Task<Publication> CreateAsync(Publication publication, List<int> categoryIds, List<int> topicIds);
    Task<Publication?> GetByIdAsync(Guid id);
    Task UpdateAsync(Publication publication, List<int> categoryIds, List<int> topicIds);
    Task DeleteAsync(Publication publication);
    Task<(IEnumerable<PublicationListResponse> Publications, int TotalCount)> GetPublicationsAsync(PublicationFilterRequest filter);
}


