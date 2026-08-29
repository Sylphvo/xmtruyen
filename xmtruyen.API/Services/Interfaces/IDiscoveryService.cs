using Xmtruyen.API.Models.Responses;
using Xmtruyen.API.Models.Enums;

namespace Xmtruyen.API.Services.Interfaces;

public interface IDiscoveryService
{
    Task<(IEnumerable<PublicationListResponse> Publications, int TotalCount)> SearchPublicationsAsync(
        string? keyword, 
        string? categorySlug, 
        FormatType? formatType, 
        AccessLevel? accessLevel, 
        string? displayLabel,
        int page, 
        int pageSize);
        
    Task<IEnumerable<PublicationListResponse>> GetTrendingPublicationsAsync(string period, int limit);
    Task<IEnumerable<PublicationListResponse>> GetSimilarPublicationsAsync(Guid publicationId, int limit);
    Task IncrementViewCountAsync(Guid publicationId);
}
