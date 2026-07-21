using XomTruyen.API.Models.Requests;
using XomTruyen.API.Models.Responses;

namespace XomTruyen.API.Services.Interfaces;

public interface IUserManagementService
{
    Task<AdminUserResponse> CreateUserAsync(AdminUserRequest request);
    Task<AdminUserResponse> UpdateUserAsync(Guid id, AdminUserRequest request);
    Task DeleteUserAsync(Guid id);
    Task<AdminUserResponse?> GetUserByIdAsync(Guid id);
    Task<(IEnumerable<AdminUserResponse> Users, int TotalCount)> GetUsersAsync(UserFilterRequest filter);
    Task ToggleUserStatusAsync(Guid id, bool isActive);
}


