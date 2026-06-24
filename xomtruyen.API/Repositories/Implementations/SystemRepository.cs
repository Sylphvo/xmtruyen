using Dapper;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Repositories.Interfaces;

namespace XomTruyen.API.Repositories.Implementations;

public class SystemRepository : ISystemRepository
{
    private readonly ApplicationDbContext _context;

    public SystemRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> CheckDatabaseConnectionAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var connection = _context.Database.GetDbConnection();
            var result = await connection.ExecuteScalarAsync<int>("SELECT 1;");
            return result == 1;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[DB CONNECTION ERROR]: {ex.Message}");
            Console.WriteLine(ex.StackTrace);
            return false;
        }
    }
}
