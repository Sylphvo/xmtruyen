using XomTruyen.API.Models;
using XomTruyen.API.Models.Responses;
using XomTruyen.API.Models.Enums;
using XomTruyen.API.Models.Requests;
namespace XomTruyen.API.Repositories.Interfaces;

public interface IPublicationRepository
{
    Task<Publication> CreateAsync(Publication publication, List<int> categoryIds, List<int> topicIds);
    Task<Publication?> GetByIdAsync(Guid id);
    Task UpdateAsync(Publication publication, List<int> categoryIds, List<int> topicIds);
    Task DeleteAsync(Publication publication);
    Task<(IEnumerable<PublicationListResponse> Publications, int TotalCount)> GetPublicationsAsync(PublicationFilterRequest filter);
}


