using Xmtruyen.API.Models.Requests;
using Xmtruyen.API.Models.Responses;

namespace Xmtruyen.API.Services.Interfaces;

public interface IUserManagementService
{
    Task<AdminUserResponse> CreateUserAsync(AdminUserRequest request);
    Task<AdminUserResponse> UpdateUserAsync(Guid id, AdminUserRequest request);
    Task DeleteUserAsync(Guid id);
    Task<AdminUserResponse?> GetUserByIdAsync(Guid id);
    Task<(IEnumerable<AdminUserResponse> Users, int TotalCount)> GetUsersAsync(UserFilterRequest filter);
    Task ToggleUserStatusAsync(Guid id, bool isActive);
    Task UpdateAdminPreferencesAsync(Guid id, string? preferencesJson);
}


