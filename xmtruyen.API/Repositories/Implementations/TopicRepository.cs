using Dapper;
using Microsoft.EntityFrameworkCore;
using Xmtruyen.API.Data;
using Xmtruyen.API.Models;
using Xmtruyen.API.Models.Requests;
using Xmtruyen.API.Repositories.Interfaces;

namespace Xmtruyen.API.Repositories.Implementations;

public class TopicRepository : ITopicRepository
{
    private readonly ApplicationDbContext _context;

    public TopicRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Topic> CreateAsync(Topic topic)
    {
        await _context.Topics.AddAsync(topic);
        await _context.SaveChangesAsync();
        return topic;
    }

    public async Task<Topic?> GetByIdAsync(int id)
    {
        return await _context.Topics.FindAsync(id);
    }

    public async Task<Topic?> GetBySlugAsync(string slug)
    {
        return await _context.Topics.FirstOrDefaultAsync(t => t.Slug == slug);
    }

    public async Task UpdateAsync(Topic topic)
    {
        _context.Topics.Update(topic);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Topic topic)
    {
        _context.Topics.Remove(topic);
        await _context.SaveChangesAsync();
    }

    public async Task<(IEnumerable<Topic> Topics, int TotalCount)> GetTopicsAsync(TopicFilterRequest filter)
    {
        using var connection = _context.Database.GetDbConnection();
        var parameters = new DynamicParameters();
        
        var whereClause = "WHERE 1=1";
        if (!string.IsNullOrWhiteSpace(filter.SearchKeyword))
        {
            whereClause += " AND \"Name\" ILIKE @SearchKeyword";
            parameters.Add("SearchKeyword", $"%{filter.SearchKeyword}%");
        }

        var countSql = $"SELECT COUNT(*) FROM \"Topics\" {whereClause}";
        var totalCount = await connection.ExecuteScalarAsync<int>(countSql, parameters);

        var orderBy = "ORDER BY \"Name\" ASC";
        if (!string.IsNullOrWhiteSpace(filter.SortBy))
        {
            var sortCol = filter.SortBy.ToLower() == "id" ? "\"Id\"" : "\"Name\"";
            var direction = filter.IsDescending ? "DESC" : "ASC";
            orderBy = $"ORDER BY {sortCol} {direction}";
        }

        var dataSql = $@"
            SELECT * FROM ""Topics""
            {whereClause}
            {orderBy}
            LIMIT @PageSize OFFSET @Offset
        ";
        
        parameters.Add("PageSize", filter.PageSize);
        parameters.Add("Offset", (filter.Page - 1) * filter.PageSize);

        var topics = await connection.QueryAsync<Topic>(dataSql, parameters);
        return (topics, totalCount);
    }
}


