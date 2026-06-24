using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XomTruyen.API.Contracts.Responses;
using XomTruyen.API.Models;
using XomTruyen.API.Services.Interfaces;

namespace XomTruyen.API.Controllers;

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
