using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Xmtruyen.API.Data;

namespace Xmtruyen.API.Authorization;

public sealed class PermissionHandler : AuthorizationHandler<PermissionRequirement>
{
    private readonly ApplicationDbContext _db;

    public PermissionHandler(ApplicationDbContext db) => _db = db;

    protected override async Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
    {
        if (context.User.IsInRole("SuperAdmin") || context.User.IsInRole("Admin"))
        {
            context.Succeed(requirement);
            return;
        }

        var userIdValue = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdValue, out var userId)) return;

        var hasPermission = await _db.UserRoles
            .Where(userRole => userRole.UserId == userId)
            .Where(userRole => userRole.ExpiresAt == null || userRole.ExpiresAt > DateTime.UtcNow)
            .SelectMany(userRole => userRole.Role.RolePermissions)
            .AnyAsync(rolePermission => rolePermission.PermissionId == requirement.Permission);

        if (hasPermission) context.Succeed(requirement);
    }
}