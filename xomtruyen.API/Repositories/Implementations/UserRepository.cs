using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;
using XomTruyen.API.Models.Requests;
using XomTruyen.API.Repositories.Interfaces;

namespace XomTruyen.API.Repositories.Implementations;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetUserByIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .Include(u => u.CurrentPlan)
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                    .ThenInclude(r => r.RolePermissions)
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
    }

    public async Task<User?> GetUserByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .Include(u => u.CurrentPlan)
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                    .ThenInclude(r => r.RolePermissions)
            .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
    }

    public async Task<User?> GetGuestUserByDeviceIdAsync(string deviceId, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Provider == "guest" && u.ProviderId == deviceId, cancellationToken);
    }

    public async Task<bool> IsEmailExistsAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _context.Users.AnyAsync(u => u.Email == email, cancellationToken);
    }

    public async Task AddUserAsync(User user, CancellationToken cancellationToken = default)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateUserAsync(User user, CancellationToken cancellationToken = default)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteUserAsync(User user, CancellationToken cancellationToken = default)
    {
        _context.Users.Remove(user);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<(IEnumerable<User> Users, int TotalCount)> GetUsersAsync(UserFilterRequest filter, CancellationToken cancellationToken = default)
    {
        var query = _context.Users.Include(u => u.CurrentPlan).AsQueryable();

        if (!string.IsNullOrWhiteSpace(filter.SearchKeyword))
        {
            var keyword = filter.SearchKeyword.ToLower();
            query = query.Where(u => 
                (u.Email != null && u.Email.ToLower().Contains(keyword)) ||
                (u.FullName != null && u.FullName.ToLower().Contains(keyword)));
        }

        if (!string.IsNullOrWhiteSpace(filter.Provider))
        {
            query = query.Where(u => u.Provider == filter.Provider);
        }

        if (filter.IsActive.HasValue)
        {
            query = query.Where(u => u.IsActive == filter.IsActive.Value);
        }

        if (filter.MinCoinBalance.HasValue)
        {
            query = query.Where(u => u.CoinBalance >= filter.MinCoinBalance.Value);
        }

        if (filter.MaxCoinBalance.HasValue)
        {
            query = query.Where(u => u.CoinBalance <= filter.MaxCoinBalance.Value);
        }

        if (filter.CurrentPlanId.HasValue)
        {
            query = query.Where(u => u.CurrentPlanId == filter.CurrentPlanId.Value);
        }

        var totalCount = await query.CountAsync(cancellationToken);

        // Sorting
        query = filter.SortBy?.ToLower() switch
        {
            "email" => filter.IsDescending ? query.OrderByDescending(u => u.Email) : query.OrderBy(u => u.Email),
            "fullname" => filter.IsDescending ? query.OrderByDescending(u => u.FullName) : query.OrderBy(u => u.FullName),
            "coinbalance" => filter.IsDescending ? query.OrderByDescending(u => u.CoinBalance) : query.OrderBy(u => u.CoinBalance),
            _ => filter.IsDescending ? query.OrderByDescending(u => u.CreatedAt) : query.OrderBy(u => u.CreatedAt),
        };

        var users = await query
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .ToListAsync(cancellationToken);

        return (users, totalCount);
    }

    public async Task SaveTokenAsync(UserToken token, CancellationToken cancellationToken = default)
    {
        _context.UserTokens.Add(token);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<UserToken?> GetTokenAsync(string tokenStr, string tokenType, CancellationToken cancellationToken = default)
    {
        return await _context.UserTokens
            .Include(t => t.User)
                .ThenInclude(u => u!.UserRoles)
                    .ThenInclude(ur => ur.Role)
                        .ThenInclude(r => r.RolePermissions)
            .FirstOrDefaultAsync(t => t.Token == tokenStr && t.TokenType == tokenType, cancellationToken);
    }

    public async Task RevokeTokenAsync(Guid tokenId, CancellationToken cancellationToken = default)
    {
        var token = await _context.UserTokens.FindAsync(new object[] { tokenId }, cancellationToken);
        if (token != null)
        {
            token.IsRevoked = true;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task RevokeAllUserTokensAsync(Guid userId, string tokenType, CancellationToken cancellationToken = default)
    {
        var tokens = await _context.UserTokens
            .Where(t => t.UserId == userId && t.TokenType == tokenType && !t.IsRevoked)
            .ToListAsync(cancellationToken);

        foreach (var token in tokens)
        {
            token.IsRevoked = true;
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}


