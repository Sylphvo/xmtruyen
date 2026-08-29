using Xmtruyen.API.Models;
using Xmtruyen.API.Models.Requests;

namespace Xmtruyen.API.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User?> GetUserByIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<User?> GetUserByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<User?> GetGuestUserByDeviceIdAsync(string deviceId, CancellationToken cancellationToken = default);
    Task<bool> IsEmailExistsAsync(string email, CancellationToken cancellationToken = default);
    Task AddUserAsync(User user, CancellationToken cancellationToken = default);
    Task UpdateUserAsync(User user, CancellationToken cancellationToken = default);
    Task DeleteUserAsync(User user, CancellationToken cancellationToken = default);
    Task<(IEnumerable<User> Users, int TotalCount)> GetUsersAsync(UserFilterRequest filter, CancellationToken cancellationToken = default);

    Task SaveTokenAsync(UserToken token, CancellationToken cancellationToken = default);
    Task<UserToken?> GetTokenAsync(string tokenStr, string tokenType, CancellationToken cancellationToken = default);
    Task RevokeTokenAsync(Guid tokenId, CancellationToken cancellationToken = default);
    Task RevokeAllUserTokensAsync(Guid userId, string tokenType, CancellationToken cancellationToken = default);
}


