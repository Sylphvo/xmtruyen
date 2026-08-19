using XomTruyen.API.Models.Responses;
using XomTruyen.API.Models.Enums;

namespace XomTruyen.API.Services.Interfaces;

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
