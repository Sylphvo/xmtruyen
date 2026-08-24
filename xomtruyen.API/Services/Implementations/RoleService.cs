using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;
using XomTruyen.API.Models.Responses;
using XomTruyen.API.Services.Interfaces;

namespace XomTruyen.API.Services.Implementations;

public class RoleService : IRoleService
{
    private readonly ApplicationDbContext _db;

    public RoleService(ApplicationDbContext db) => _db = db;

    public async Task<IReadOnlyList<RoleSummaryResponse>> GetRolesAsync(CancellationToken cancellationToken = default)
    {
        return await _db.Roles.OrderByDescending(role => role.Level)
            .Select(role => new RoleSummaryResponse(role.Id, role.Name, role.DisplayName, role.Level, role.Color, role.UserRoles.Count))
            .ToListAsync(cancellationToken);
    }

    public async Task<RoleDetailResponse?> GetRoleAsync(int roleId, CancellationToken cancellationToken = default)
    {
        return await _db.Roles.Where(role => role.Id == roleId)
            .Select(role => new RoleDetailResponse(role.Id, role.Name, role.DisplayName, role.Description, role.Level, role.Color,
                role.RolePermissions.Select(permission => permission.PermissionId).ToList()))
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task UpdatePermissionsAsync(int roleId, IEnumerable<string> permissionIds, CancellationToken cancellationToken = default)
    {
        var role = await _db.Roles.Include(item => item.RolePermissions).FirstOrDefaultAsync(item => item.Id == roleId, cancellationToken)
            ?? throw new KeyNotFoundException("Role not found");
        var requestedIds = permissionIds.Distinct(StringComparer.OrdinalIgnoreCase).ToHashSet(StringComparer.OrdinalIgnoreCase);
        var validIds = await _db.Permissions.Where(permission => requestedIds.Contains(permission.Id)).Select(permission => permission.Id).ToListAsync(cancellationToken);
        if (validIds.Count != requestedIds.Count) throw new ArgumentException("One or more permissions do not exist");

        role.RolePermissions.Clear();
        foreach (var permissionId in validIds) role.RolePermissions.Add(new RolePermission { RoleId = roleId, PermissionId = permissionId });
        await _db.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<UserRoleResponse>> GetUserRolesAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        return await _db.UserRoles.Where(userRole => userRole.UserId == userId)
            .Select(userRole => new UserRoleResponse(userRole.Role.Id, userRole.Role.Name, userRole.Role.DisplayName, userRole.ExpiresAt))
            .ToListAsync(cancellationToken);
    }

    public async Task AssignRoleAsync(Guid userId, int roleId, Guid performedBy, string? reason, CancellationToken cancellationToken = default)
    {
        if (!await _db.Users.AnyAsync(user => user.Id == userId, cancellationToken)) throw new KeyNotFoundException("User not found");
        if (!await _db.Roles.AnyAsync(role => role.Id == roleId, cancellationToken)) throw new KeyNotFoundException("Role not found");
        if (await _db.UserRoles.AnyAsync(userRole => userRole.UserId == userId && userRole.RoleId == roleId, cancellationToken))
            throw new InvalidOperationException("Role is already assigned");

        _db.UserRoles.Add(new UserRole { UserId = userId, RoleId = roleId, AssignedBy = performedBy });
        _db.RoleAuditLogs.Add(new RoleAuditLog { UserId = userId, RoleId = roleId, PerformedBy = performedBy, Action = "role_assigned", Reason = reason });
        await _db.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveRoleAsync(Guid userId, int roleId, Guid performedBy, string? reason, CancellationToken cancellationToken = default)
    {
        if (roleId == 6) throw new InvalidOperationException("The User role cannot be removed");
        var userRole = await _db.UserRoles.FirstOrDefaultAsync(item => item.UserId == userId && item.RoleId == roleId, cancellationToken)
            ?? throw new KeyNotFoundException("Role assignment not found");

        _db.UserRoles.Remove(userRole);
        _db.RoleAuditLogs.Add(new RoleAuditLog { UserId = userId, RoleId = roleId, PerformedBy = performedBy, Action = "role_removed", Reason = reason });
        await _db.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<PermissionResponse>> GetPermissionsAsync(CancellationToken cancellationToken = default)
    {
        return await _db.Permissions.OrderBy(permission => permission.Module).ThenBy(permission => permission.Action)
            .Select(permission => new PermissionResponse(permission.Id, permission.Module, permission.Action, permission.DisplayName, permission.Description))
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<RoleAuditLogResponse>> GetAuditLogsAsync(Guid? userId, CancellationToken cancellationToken = default)
    {
        var query = _db.RoleAuditLogs.AsQueryable();
        if (userId.HasValue) query = query.Where(log => log.UserId == userId.Value);
        return await query.OrderByDescending(log => log.CreatedAt)
            .Select(log => new RoleAuditLogResponse(log.Id, log.UserId, log.Action, log.RoleId, log.PerformedBy, log.Reason, log.CreatedAt))
            .ToListAsync(cancellationToken);
    }
}