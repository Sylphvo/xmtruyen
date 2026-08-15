using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Dapper;
using XomTruyen.API.Data;

namespace XomTruyen.API.Controllers;

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
                (SELECT COUNT(*) FROM ""Publications"" WHERE ""FormatType"" = 0) AS TotalTextPublications,
                (SELECT COUNT(*) FROM ""Publications"" WHERE ""FormatType"" = 1) AS TotalComicPublications,
                
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
}
