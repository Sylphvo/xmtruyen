using Microsoft.AspNetCore.Authorization;

namespace Xmtruyen.API.Authorization;

public sealed class PermissionRequirement : IAuthorizationRequirement
{
    public PermissionRequirement(string permission) => Permission = permission;
    public string Permission { get; }
}