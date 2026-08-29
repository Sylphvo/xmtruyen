using Xmtruyen.API.Models;
using Xmtruyen.API.Models.Enums;
using Xmtruyen.API.Models.Requests;
using Xmtruyen.API.Models.Responses;

namespace Xmtruyen.API.Services.Interfaces;

public interface IPublicationManagementService
{
    Task<Publication> CreateBookAsync(PublicationRequest request);
    Task UpdateBookAsync(Guid id, PublicationRequest request);
    Task PartialUpdateBookAsync(Guid id, PublicationUpdateRequest request);
    Task DeleteBookAsync(Guid id);
    Task<Publication?> GetBookByIdAsync(Guid id);
    Task<(IEnumerable<PublicationListResponse> Publications, int TotalCount)> GetPublicationsAsync(PublicationFilterRequest filter);
    Task ToggleRecommendedAsync(Guid id, bool isRecommended);
    Task ToggleExclusiveAsync(Guid id, bool isExclusive);
    Task ToggleStatusAsync(Guid id, string status);
}


