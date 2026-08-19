using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;
using XomTruyen.API.Models.Enums;
using XomTruyen.API.Models.Responses;
using XomTruyen.API.Services.Interfaces;

namespace XomTruyen.API.Services;

public class DiscoveryService : IDiscoveryService
{
    private readonly ApplicationDbContext _context;

    public DiscoveryService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<(IEnumerable<PublicationListResponse> Publications, int TotalCount)> SearchPublicationsAsync(
        string? keyword, 
        string? categorySlug, 
        FormatType? formatType, 
        AccessLevel? accessLevel, 
        string? displayLabel,
        int page, 
        int pageSize)
    {
        var query = _context.Publications
            .Include(p => p.PublicationCategories)
            .ThenInclude(pc => pc.Category)
            .Include(p => p.PublicationTopics)
            .ThenInclude(pt => pt.Topic)
            .Where(p => p.Status == "Active")
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(keyword))
        {
            query = query.Where(p => 
                EF.Functions.ILike(p.Title, $"%{keyword}%") || 
                EF.Functions.ILike(p.AuthorName ?? "", $"%{keyword}%"));
        }

        if (!string.IsNullOrWhiteSpace(categorySlug))
        {
            query = query.Where(p => p.PublicationCategories.Any(pc => pc.Category.Slug == categorySlug));
        }

        if (formatType.HasValue)
        {
            query = query.Where(p => p.FormatType == formatType.Value);
        }

        if (accessLevel.HasValue)
        {
            query = query.Where(p => p.AccessLevel == accessLevel.Value);
        }

        if (!string.IsNullOrWhiteSpace(displayLabel))
        {
            query = query.Where(p => p.DisplayLabel == displayLabel);
        }

        var totalCount = await query.CountAsync();

        var publications = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new PublicationListResponse
            {
                Id = p.Id,
                Title = p.Title,
                Slug = p.Slug,
                Author = p.AuthorName,
                CoverImageUrl = p.CoverImageUrl,
                FormatType = p.FormatType,
                AccessLevel = p.AccessLevel,
                Status = p.Status,
                ViewCount = p.ViewCount,
                AverageRating = p.AverageRating,
                IsRecommended = p.IsRecommended,
                IsExclusive = p.IsExclusive,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                CreatedBy = p.CreatedBy,
                UpdatedBy = p.UpdatedBy,
                Categories = p.PublicationCategories.Select(pc => new BookCategoryResponse
                {
                    Id = pc.CategoryId,
                    Name = pc.Category.Name
                }).ToList(),
                Topics = p.PublicationTopics.Select(pt => new BookTopicResponse
                {
                    Id = pt.TopicId,
                    Name = pt.Topic.Name
                }).ToList()
            })
            .ToListAsync();

        return (publications, totalCount);
    }

    public async Task<IEnumerable<PublicationListResponse>> GetTrendingPublicationsAsync(string period, int limit)
    {
        var query = _context.Publications
            .Include(p => p.PublicationCategories)
            .ThenInclude(pc => pc.Category)
            .Include(p => p.PublicationTopics)
            .ThenInclude(pt => pt.Topic)
            .Where(p => p.Status == "Active")
            .AsQueryable();

        // Ideally we would join with ReadingHistory for the specific period (e.g. week, month)
        // For MVP, we sort by all-time ViewCount and updated recently
        query = query.OrderByDescending(p => p.ViewCount).ThenByDescending(p => p.UpdatedAt);

        return await query
            .Take(limit)
            .Select(p => new PublicationListResponse
            {
                Id = p.Id,
                Title = p.Title,
                Slug = p.Slug,
                Author = p.AuthorName,
                CoverImageUrl = p.CoverImageUrl,
                FormatType = p.FormatType,
                AccessLevel = p.AccessLevel,
                Status = p.Status,
                ViewCount = p.ViewCount,
                AverageRating = p.AverageRating,
                IsRecommended = p.IsRecommended,
                IsExclusive = p.IsExclusive,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                CreatedBy = p.CreatedBy,
                UpdatedBy = p.UpdatedBy,
                Categories = p.PublicationCategories.Select(pc => new BookCategoryResponse
                {
                    Id = pc.CategoryId,
                    Name = pc.Category.Name
                }).ToList(),
                Topics = p.PublicationTopics.Select(pt => new BookTopicResponse
                {
                    Id = pt.TopicId,
                    Name = pt.Topic.Name
                }).ToList()
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<PublicationListResponse>> GetSimilarPublicationsAsync(Guid publicationId, int limit)
    {
        // Find category IDs of the target publication
        var categoryIds = await _context.PublicationCategories
            .Where(pc => pc.PublicationId == publicationId)
            .Select(pc => pc.CategoryId)
            .ToListAsync();

        if (!categoryIds.Any()) return new List<PublicationListResponse>();

        var query = _context.Publications
            .Include(p => p.PublicationCategories)
            .ThenInclude(pc => pc.Category)
            .Include(p => p.PublicationTopics)
            .ThenInclude(pt => pt.Topic)
            .Where(p => p.Id != publicationId && p.Status == "Active")
            .Where(p => p.PublicationCategories.Any(pc => categoryIds.Contains(pc.CategoryId)))
            .OrderByDescending(p => p.ViewCount);

        return await query
            .Take(limit)
            .Select(p => new PublicationListResponse
            {
                Id = p.Id,
                Title = p.Title,
                Slug = p.Slug,
                Author = p.AuthorName,
                CoverImageUrl = p.CoverImageUrl,
                FormatType = p.FormatType,
                AccessLevel = p.AccessLevel,
                Status = p.Status,
                ViewCount = p.ViewCount,
                AverageRating = p.AverageRating,
                IsRecommended = p.IsRecommended,
                IsExclusive = p.IsExclusive,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                CreatedBy = p.CreatedBy,
                UpdatedBy = p.UpdatedBy,
                Categories = p.PublicationCategories.Select(pc => new BookCategoryResponse
                {
                    Id = pc.CategoryId,
                    Name = pc.Category.Name
                }).ToList(),
                Topics = p.PublicationTopics.Select(pt => new BookTopicResponse
                {
                    Id = pt.TopicId,
                    Name = pt.Topic.Name
                }).ToList()
            })
            .ToListAsync();
    }

    public async Task IncrementViewCountAsync(Guid publicationId)
    {
        var pub = await _context.Publications.FindAsync(publicationId);
        if (pub != null)
        {
            pub.ViewCount = (pub.ViewCount ?? 0) + 1;
            _context.Publications.Update(pub);
            await _context.SaveChangesAsync();
        }
    }
}
