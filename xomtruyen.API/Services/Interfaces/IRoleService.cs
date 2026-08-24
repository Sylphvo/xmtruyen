using XomTruyen.API.Models.Responses;

namespace XomTruyen.API.Services.Interfaces;

public interface IRoleService
{
    Task<IReadOnlyList<RoleSummaryResponse>> GetRolesAsync(CancellationToken cancellationToken = default);
    Task<RoleDetailResponse?> GetRoleAsync(int roleId, CancellationToken cancellationToken = default);
    Task UpdatePermissionsAsync(int roleId, IEnumerable<string> permissionIds, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<UserRoleResponse>> GetUserRolesAsync(Guid userId, CancellationToken cancellationToken = default);
    Task AssignRoleAsync(Guid userId, int roleId, Guid performedBy, string? reason, CancellationToken cancellationToken = default);
    Task RemoveRoleAsync(Guid userId, int roleId, Guid performedBy, string? reason, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<PermissionResponse>> GetPermissionsAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<RoleAuditLogResponse>> GetAuditLogsAsync(Guid? userId, CancellationToken cancellationToken = default);
}