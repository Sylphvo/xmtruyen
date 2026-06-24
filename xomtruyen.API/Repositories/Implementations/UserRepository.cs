using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;
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
            .FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
    }

    public async Task<User?> GetUserByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .Include(u => u.CurrentPlan)
            .FirstOrDefaultAsync(u => u.Email == email, cancellationToken);
    }

    public async Task<User?> GetGuestUserByDeviceIdAsync(string deviceId, CancellationToken cancellationToken = default)
    {
        return await _context.Users
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

    public async Task SaveTokenAsync(UserToken token, CancellationToken cancellationToken = default)
    {
        _context.UserTokens.Add(token);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<UserToken?> GetTokenAsync(string tokenStr, string tokenType, CancellationToken cancellationToken = default)
    {
        return await _context.UserTokens
            .Include(t => t.User)
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
