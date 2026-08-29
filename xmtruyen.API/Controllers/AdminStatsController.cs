using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Dapper;
using Xmtruyen.API.Data;

namespace Xmtruyen.API.Controllers;

[Route("api/admin/stats")]
[Authorize(Roles = "Admin")]
public class AdminStatsController : BaseApiController
{
    private readonly ApplicationDbContext _context;

    public AdminStatsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview()
    {
        var connection = _context.Database.GetDbConnection();

        var sql = @"
            SELECT
                (SELECT COUNT(*) FROM ""Publications"") AS TotalPublications,
                (SELECT COUNT(*) FROM ""Publications"" WHERE ""FormatType"" = 1) AS TotalTextPublications,
                (SELECT COUNT(*) FROM ""Publications"" WHERE ""FormatType"" = 2) AS TotalComicPublications,
                
                (SELECT COUNT(*) FROM ""Users"") AS TotalUsers,
                (SELECT COUNT(*) FROM ""Users"" WHERE ""IsActive"" = true) AS ActiveUsers,
                (SELECT COUNT(*) FROM ""Users"" WHERE ""CurrentPlanId"" IS NOT NULL AND ""PlanExpiredAt"" > NOW()) AS VipUsers,
                (SELECT COUNT(*) FROM ""Users"" WHERE DATE(""CreatedAt"") = CURRENT_DATE) AS NewUsersToday,
                
                (SELECT COUNT(*) FROM ""ComicChapters"") AS TotalComicChapters,
                (SELECT COUNT(*) FROM ""BookChapters"") AS TotalBookChapters,
                
                (SELECT COALESCE(SUM(""Amount""), 0) FROM ""Transactions"" WHERE ""Status"" = 'Success' AND DATE(""CreatedAt"") = CURRENT_DATE) AS RevenueToday
        ";

        var stats = await connection.QuerySingleOrDefaultAsync(sql);

        if (stats == null) return NotFound();

        return Ok(new
        {
            publications = new { total = stats.totalpublications, text = stats.totaltextpublications, comic = stats.totalcomicpublications },
            users = new { total = stats.totalusers, active = stats.activeusers, vip = stats.vipusers, newToday = stats.newuserstoday },
            chapters = new { totalComic = stats.totalcomicchapters, totalBook = stats.totalbookchapters },
            revenue = new { today = stats.revenuetoday }
        });
    }

    [HttpGet("top-publications")]
    public async Task<IActionResult> GetTopPublications([FromQuery] int limit = 10, [FromQuery] string sortBy = "viewCount")
    {
        var connection = _context.Database.GetDbConnection();
        var sql = $@"
            SELECT ""Id"" as ""id"", ""Title"" as ""title"", ""CoverImageUrl"" as ""coverImageUrl"", ""ViewCount"" as ""viewCount"", ""AverageRating"" as ""averageRating"" 
            FROM ""Publications""
            ORDER BY ""ViewCount"" DESC 
            LIMIT @Limit
        ";
        var topPubs = await connection.QueryAsync(sql, new { Limit = limit });
        return Ok(topPubs);
    }

    [HttpGet("engagement")]
    public async Task<IActionResult> GetEngagement()
    {
        return Ok(new
        {
            totalBookmarks = await _context.Bookmarks.CountAsync(),
            totalFavorites = await _context.UserFavorites.CountAsync(),
            totalHistoryRecords = await _context.ReadingHistories.CountAsync(),
            mostBookmarkedChapters = await _context.Bookmarks
                .GroupBy(bookmark => new { bookmark.ChapterId, bookmark.ChapterType })
                .OrderByDescending(group => group.Count())
                .Take(10)
                .Select(group => new { chapterId = group.Key.ChapterId, chapterType = group.Key.ChapterType, count = group.Count() })
                .ToListAsync(),
            mostFavoritedPublications = await _context.UserFavorites
                .GroupBy(f => f.PublicationId)
                .OrderByDescending(group => group.Count())
                .Take(10)
                .Select(group => new { publicationId = group.Key, count = group.Count() })
                .ToListAsync()
        });
    }

    [HttpGet("chart/users")]
    public async Task<IActionResult> GetUserChart([FromQuery] int days = 30)
    {
        var from = DateTime.UtcNow.Date.AddDays(-Math.Max(1, days) + 1);
        var rows = await _context.Users
            .Where(user => user.CreatedAt >= from)
            .GroupBy(user => user.CreatedAt!.Value.Date)
            .Select(group => new { date = group.Key, count = group.Count() })
            .ToListAsync();
        return Ok(ToDailySeries(rows.Select(row => (row.date, row.count)), from, days));
    }

    [HttpGet("chart/revenue")]
    public async Task<IActionResult> GetRevenueChart([FromQuery] int days = 30)
    {
        var from = DateTime.UtcNow.Date.AddDays(-Math.Max(1, days) + 1);
        var rows = await _context.Transactions
            .Where(transaction => transaction.CreatedAt >= from && (transaction.Status == "Success" || transaction.Status == "Completed"))
            .GroupBy(transaction => transaction.CreatedAt!.Value.Date)
            .Select(group => new { date = group.Key, amount = group.Sum(transaction => transaction.Amount) })
            .ToListAsync();
        return Ok(ToDailySeries(rows.Select(row => (row.date, row.amount)), from, days));
    }

    [HttpGet("chart/reads")]
    public async Task<IActionResult> GetReadsChart([FromQuery] int days = 30)
    {
        var from = DateTime.UtcNow.Date.AddDays(-Math.Max(1, days) + 1);
        var rows = await _context.ReadingAnalytics
            .Where(read => read.ReadAt >= from)
            .GroupBy(read => read.ReadAt.Date)
            .Select(group => new { date = group.Key, count = group.Count() })
            .ToListAsync();
        return Ok(ToDailySeries(rows.Select(row => (row.date, row.count)), from, days));
    }

    [HttpGet("recent-activity")]
    public async Task<IActionResult> GetRecentActivity([FromQuery] int limit = 20)
    {
        var activity = new List<RecentActivity>();
        var users = await _context.Users
            .OrderByDescending(user => user.CreatedAt)
            .Take(limit)
            .Select(user => new { user.Id, user.Email, user.FullName, user.CreatedAt })
            .ToListAsync();
        activity.AddRange(users.Select(user => new RecentActivity("new_user", user.CreatedAt, new { user.Id, user.Email, user.FullName })));

        var reviews = await _context.Reviews
            .OrderByDescending(review => review.CreatedAt)
            .Take(limit)
            .Select(review => new { review.Id, review.PublicationId, review.Rating, review.CreatedAt })
            .ToListAsync();
        activity.AddRange(reviews.Select(review => new RecentActivity("new_review", review.CreatedAt, new { review.Id, review.PublicationId, review.Rating })));

        var transactions = await _context.Transactions
            .OrderByDescending(transaction => transaction.CreatedAt)
            .Take(limit)
            .Select(transaction => new { transaction.Id, transaction.Amount, transaction.Status, transaction.CreatedAt })
            .ToListAsync();
        activity.AddRange(transactions.Select(transaction => new RecentActivity("new_transaction", transaction.CreatedAt, new { transaction.Id, transaction.Amount, transaction.Status })));

        return Ok(activity.OrderByDescending(item => item.CreatedAt).Take(Math.Max(1, limit)));
    }

    private sealed record RecentActivity(string Type, DateTime? CreatedAt, object Data);

    private static object ToDailySeries(IEnumerable<(DateTime date, int value)> rows, DateTime from, int days)
    {
        var values = rows.ToDictionary(row => row.date.Date, row => row.value);
        var labels = Enumerable.Range(0, Math.Max(1, days)).Select(offset => from.AddDays(offset).ToString("yyyy-MM-dd")).ToList();
        var data = Enumerable.Range(0, Math.Max(1, days)).Select(offset => values.GetValueOrDefault(from.AddDays(offset).Date)).ToList();
        return new { labels, data };
    }

    private static object ToDailySeries(IEnumerable<(DateTime date, decimal value)> rows, DateTime from, int days)
    {
        var values = rows.ToDictionary(row => row.date.Date, row => row.value);
        var labels = Enumerable.Range(0, Math.Max(1, days)).Select(offset => from.AddDays(offset).ToString("yyyy-MM-dd")).ToList();
        var data = Enumerable.Range(0, Math.Max(1, days)).Select(offset => values.GetValueOrDefault(from.AddDays(offset).Date)).ToList();
        return new { labels, data };
    }
}
