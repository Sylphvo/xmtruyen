namespace Xmtruyen.API.Models.Responses;

public record RoleSummaryResponse(int Id, string Name, string DisplayName, int Level, string? Color, int UserCount);
public record RoleDetailResponse(int Id, string Name, string DisplayName, string? Description, int Level, string? Color, IReadOnlyList<string> PermissionIds);
public record UserRoleResponse(int Id, string Name, string DisplayName, DateTime? ExpiresAt);
public record PermissionResponse(string Id, string Module, string Action, string DisplayName, string? Description);
public record RoleAuditLogResponse(Guid Id, Guid UserId, string Action, int? RoleId, Guid PerformedBy, string? Reason, DateTime CreatedAt);