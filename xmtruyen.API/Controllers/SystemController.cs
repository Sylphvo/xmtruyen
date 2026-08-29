using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Xmtruyen.API.Contracts.Responses;
using Xmtruyen.API.Models;
using Xmtruyen.API.Services.Interfaces;

namespace Xmtruyen.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SystemController : ControllerBase
{
    private readonly ISystemService _systemService;

    public SystemController(ISystemService systemService)
    {
        _systemService = systemService;
    }

    [HttpGet("db-check")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<DatabaseCheckResponse>>> CheckDatabaseConnection(CancellationToken cancellationToken)
    {
        var result = await _systemService.CheckDatabaseAsync(cancellationToken);
        
        if (!result.IsConnected)
        {
            return StatusCode(500, ApiResponse<DatabaseCheckResponse>.Error(result.Message));
        }

        return Ok(ApiResponse<DatabaseCheckResponse>.Ok(result, "Check successful"));
    }
}


