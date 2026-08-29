using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Xmtruyen.API.Models.Requests;
using Xmtruyen.API.Services.Interfaces;

namespace Xmtruyen.API.Controllers;

[Authorize(Policy = "AdminOnly")]
public class AdminRoleController : BaseApiController
{
    private readonly IRoleService _roleService;

    public AdminRoleController(IRoleService roleService) => _roleService = roleService;

    [HttpGet("/api/admin/roles")]
    public async Task<IActionResult> GetRoles(CancellationToken cancellationToken) => Ok(await _roleService.GetRolesAsync(cancellationToken));

    [HttpGet("/api/admin/roles/{roleId:int}")]
    public async Task<IActionResult> GetRole(int roleId, CancellationToken cancellationToken) =>
        OkOrNotFound(await _roleService.GetRoleAsync(roleId, cancellationToken));

    [HttpPut("/api/admin/roles/{roleId:int}/permissions")]
    public async Task<IActionResult> UpdatePermissions(int roleId, UpdateRolePermissionsRequest request, CancellationToken cancellationToken)
    {
        await _roleService.UpdatePermissionsAsync(roleId, request.PermissionIds, cancellationToken);
        return NoContent();
    }

    [HttpGet("/api/admin/users/{userId:guid}/roles")]
    public async Task<IActionResult> GetUserRoles(Guid userId, CancellationToken cancellationToken) => Ok(await _roleService.GetUserRolesAsync(userId, cancellationToken));

    [HttpPost("/api/admin/users/{userId:guid}/roles")]
    public async Task<IActionResult> AssignRole(Guid userId, AssignRoleRequest request, CancellationToken cancellationToken)
    {
        await _roleService.AssignRoleAsync(userId, request.RoleId, CurrentUserId(), request.Reason, cancellationToken);
        return Ok();
    }

    [HttpDelete("/api/admin/users/{userId:guid}/roles/{roleId:int}")]
    public async Task<IActionResult> RemoveRole(Guid userId, int roleId, [FromBody] RoleReasonRequest request, CancellationToken cancellationToken)
    {
        await _roleService.RemoveRoleAsync(userId, roleId, CurrentUserId(), request.Reason, cancellationToken);
        return NoContent();
    }

    [HttpGet("/api/admin/permissions")]
    public async Task<IActionResult> GetPermissions(CancellationToken cancellationToken) => Ok(await _roleService.GetPermissionsAsync(cancellationToken));

    [HttpGet("/api/admin/audit-logs")]
    public async Task<IActionResult> GetAuditLogs(Guid? userId, CancellationToken cancellationToken) => Ok(await _roleService.GetAuditLogsAsync(userId, cancellationToken));

    private Guid CurrentUserId() => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private IActionResult OkOrNotFound<T>(T? value) => value is null ? NotFound() : Ok(value);
}

public class RoleReasonRequest
{
    public string? Reason { get; set; }
}