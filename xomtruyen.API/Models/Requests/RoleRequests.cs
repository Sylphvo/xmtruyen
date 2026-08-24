namespace XomTruyen.API.Models.Requests;

public class UpdateRolePermissionsRequest
{
    public List<string> PermissionIds { get; set; } = new();
}

public class AssignRoleRequest
{
    public int RoleId { get; set; }
    public string? Reason { get; set; }
}