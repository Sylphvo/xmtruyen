using Dapper;
using Microsoft.EntityFrameworkCore;
using Xmtruyen.API.Data;
using Xmtruyen.API.Models;
using Xmtruyen.API.Models.Enums;
using Xmtruyen.API.Models.Requests;
using Xmtruyen.API.Models.Responses;
using Xmtruyen.API.Repositories.Interfaces;

namespace Xmtruyen.API.Repositories.Implementations;

public class PublicationRepository : IPublicationRepository
{
    private readonly ApplicationDbContext _context;

    public PublicationRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Publication> CreateAsync(Publication Publication, List<int> categoryIds, List<int> topicIds)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            await _context.Publications.AddAsync(Publication);
            await _context.SaveChangesAsync();

            var PublicationCategories = categoryIds.Select(cid => new PublicationCategory
            {
                PublicationId = Publication.Id,
                CategoryId = cid
            }).ToList();

            await _context.PublicationCategories.AddRangeAsync(PublicationCategories);
            
            var PublicationTopics = topicIds.Select(tid => new PublicationTopic
            {
                PublicationId = Publication.Id,
                TopicId = tid
            }).ToList();
            
            await _context.PublicationTopics.AddRangeAsync(PublicationTopics);
            
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();
            return Publication;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<Publication?> GetByIdAsync(Guid id)
    {
        return await _context.Publications
            .Include(b => b.PublicationCategories)
            .Include(b => b.PublicationTopics)
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task UpdateAsync(Publication Publication, List<int> categoryIds, List<int> topicIds)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // EF Core will automatically track changes to the 'Publication' entity
            // Removing _context.Publications.Update(Publication) ensures only modified properties are updated in SQL.

            var existingCategories = await _context.PublicationCategories
                .Where(bc => bc.PublicationId == Publication.Id)
                .ToListAsync();
            _context.PublicationCategories.RemoveRange(existingCategories);

            var newCategories = categoryIds.Select(cid => new PublicationCategory
            {
                PublicationId = Publication.Id,
                CategoryId = cid
            }).ToList();
            await _context.PublicationCategories.AddRangeAsync(newCategories);

            var existingTopics = await _context.PublicationTopics
                .Where(bt => bt.PublicationId == Publication.Id)
                .ToListAsync();
            _context.PublicationTopics.RemoveRange(existingTopics);

            var newTopics = topicIds.Select(tid => new PublicationTopic
            {
                PublicationId = Publication.Id,
                TopicId = tid
            }).ToList();
            await _context.PublicationTopics.AddRangeAsync(newTopics);
            
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task DeleteAsync(Publication Publication)
    {
        _context.Publications.Remove(Publication);
        await _context.SaveChangesAsync();
    }

    public async Task<(IEnumerable<PublicationListResponse> Publications, int TotalCount)> GetPublicationsAsync(PublicationFilterRequest filter)
    {
        using var connection = _context.Database.GetDbConnection();
        var parameters = new DynamicParameters();
        
        var whereClause = "WHERE 1=1";
        
        if (filter.FormatType.HasValue)
        {
            whereClause += " AND b.\"FormatType\" = @FormatType";
            parameters.Add("FormatType", (int)filter.FormatType.Value);
        }

        if (filter.AccessLevel.HasValue)
        {
            whereClause += " AND b.\"AccessLevel\" = @AccessLevel";
            parameters.Add("AccessLevel", (int)filter.AccessLevel.Value);
        }

        if (filter.IsRecommended.HasValue)
        {
            whereClause += " AND b.\"IsRecommended\" = @IsRecommended";
            parameters.Add("IsRecommended", filter.IsRecommended.Value);
        }

        if (filter.IsExclusive.HasValue)
        {
            whereClause += " AND b.\"IsExclusive\" = @IsExclusive";
            parameters.Add("IsExclusive", filter.IsExclusive.Value);
        }

        if (!string.IsNullOrWhiteSpace(filter.DisplayLabel))
        {
            whereClause += " AND b.\"DisplayLabel\" = @DisplayLabel";
            parameters.Add("DisplayLabel", filter.DisplayLabel);
        }

        if (filter.CategoryId.HasValue)
        {
            whereClause += " AND b.\"Id\" IN (SELECT \"PublicationId\" FROM \"PublicationCategories\" WHERE \"CategoryId\" = @CategoryId)";
            parameters.Add("CategoryId", filter.CategoryId.Value);
        }

        if (!string.IsNullOrWhiteSpace(filter.SearchKeyword))
        {
            whereClause += " AND (b.\"Title\" ILIKE @SearchKeyword OR b.\"AuthorName\" ILIKE @SearchKeyword)";
            parameters.Add("SearchKeyword", $"%{filter.SearchKeyword}%");
        }

        var countSql = $@"
            SELECT COUNT(*)
            FROM ""Publications"" b
            {whereClause}
        ";

        var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

        var orderBy = "ORDER BY COALESCE(b.\"UpdatedAt\", b.\"CreatedAt\") DESC";
        if (!string.IsNullOrWhiteSpace(filter.SortBy))
        {
            var sortCol = filter.SortBy.ToLower() switch
            {
                "title" => "b.\"Title\"",
                "viewcount" => "b.\"ViewCount\"",
                "averagerating" => "b.\"AverageRating\"",
                _ => "COALESCE(b.\"UpdatedAt\", b.\"CreatedAt\")"
            };
            var direction = filter.IsDescending ? "DESC" : "ASC";
            orderBy = $"ORDER BY {sortCol} {direction}";
        }

        var dataSql = $@"
            SELECT 
                b.""Id"", b.""Title"", b.""Slug"", b.""AuthorName"", b.""Description"", b.""CoverImageUrl"",
                b.""FormatType"", b.""AccessLevel"", b.""DisplayLabel"", b.""Status"", b.""ViewCount"", b.""AverageRating"",
                b.""IsRecommended"", b.""IsExclusive"", b.""CreatedAt"", b.""UpdatedAt"", b.""CreatedBy"", b.""UpdatedBy"",
                (
                    SELECT COALESCE(json_agg(json_build_object('Id', c.""Id"", 'Name', c.""Name"")), '[]'::json)
                    FROM ""PublicationCategories"" bc
                    JOIN ""Categories"" c ON bc.""CategoryId"" = c.""Id""
                    WHERE bc.""PublicationId"" = b.""Id""
                ) as ""CategoriesJson"",
                (
                    SELECT COALESCE(json_agg(json_build_object('Id', t.""Id"", 'Name', t.""Name"")), '[]'::json)
                    FROM ""PublicationTopics"" bt
                    JOIN ""Topics"" t ON bt.""TopicId"" = t.""Id""
                    WHERE bt.""PublicationId"" = b.""Id""
                ) as ""TopicsJson""
            FROM ""Publications"" b
            {whereClause}
            {orderBy}
            LIMIT @PageSize OFFSET @Offset
        ";

        parameters.Add("PageSize", filter.PageSize);
        parameters.Add("Offset", (filter.Page - 1) * filter.PageSize);

        var booksRaw = await connection.QueryAsync<dynamic>(dataSql, parameters);
        
        var Publications = booksRaw.Select(b => new PublicationListResponse
        {
            Id = b.Id,
            Title = b.Title,
            Slug = b.Slug,
            Author = b.AuthorName,
            CoverImageUrl = b.CoverImageUrl,
            FormatType = (FormatType)b.FormatType,
            AccessLevel = (AccessLevel)b.AccessLevel,
            DisplayLabel = b.DisplayLabel,
            Status = b.Status,
            ViewCount = b.ViewCount,
            AverageRating = b.AverageRating,
            IsRecommended = b.IsRecommended,
            IsExclusive = b.IsExclusive,
            CreatedAt = b.CreatedAt,
            Categories = System.Text.Json.JsonSerializer.Deserialize<List<BookCategoryResponse>>(b.CategoriesJson) ?? new List<BookCategoryResponse>(),
            Topics = System.Text.Json.JsonSerializer.Deserialize<List<BookTopicResponse>>(b.TopicsJson) ?? new List<BookTopicResponse>()
        });

        return (Publications, totalCount);
    }
}

