using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using XomTruyen.API.Models;
using XomTruyen.API.Models.Requests;
using XomTruyen.API.Models.Responses;
using XomTruyen.API.Services.Interfaces;

namespace XomTruyen.API.Controllers;

public class AuthController : BaseApiController
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<string>>> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var result = await _authService.RegisterAsync(request);
            return Ok(ApiResponse<string>.Ok(result));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<string>.Error(ex.Message));
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Login([FromBody] LoginRequest request)
    {
        try
        {
            var result = await _authService.LoginAsync(request);
            return Ok(ApiResponse<AuthResponse>.Ok(result));
        }
        catch (Exception ex)
        {
            return Unauthorized(ApiResponse<AuthResponse>.Error(ex.Message));
        }
    }

    [HttpPost("guest-login")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> GuestLogin([FromBody] GuestLoginRequest request)
    {
        try
        {
            var result = await _authService.GuestLoginAsync(request);
            return Ok(ApiResponse<AuthResponse>.Ok(result));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<AuthResponse>.Error(ex.Message));
        }
    }

    [HttpPost("refresh-token")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        try
        {
            var result = await _authService.RefreshTokenAsync(request);
            return Ok(ApiResponse<AuthResponse>.Ok(result));
        }
        catch (Exception ex)
        {
            return Unauthorized(ApiResponse<AuthResponse>.Error(ex.Message));
        }
    }

    [HttpPost("logout")]
    public async Task<ActionResult<ApiResponse<string>>> Logout([FromBody] RefreshTokenRequest request)
    {
        try
        {
            await _authService.LogoutAsync(request);
            return Ok(ApiResponse<string>.Ok("Logged out successfully"));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<string>.Error(ex.Message));
        }
    }

    [HttpPost("forgot-password")]
    public async Task<ActionResult<ApiResponse<string>>> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        try
        {
            await _authService.ForgotPasswordAsync(request);
            return Ok(ApiResponse<string>.Ok("If that email is registered, a password reset link has been sent."));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<string>.Error(ex.Message));
        }
    }

    [HttpPost("reset-password")]
    public async Task<ActionResult<ApiResponse<string>>> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        try
        {
            await _authService.ResetPasswordAsync(request);
            return Ok(ApiResponse<string>.Ok("Password has been reset successfully."));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<string>.Error(ex.Message));
        }
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<ActionResult<ApiResponse<string>>> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized(ApiResponse<string>.Error("Invalid token"));

            await _authService.ChangePasswordAsync(userId, request);
            return Ok(ApiResponse<string>.Ok("Password changed successfully."));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<string>.Error(ex.Message));
        }
    }

    [HttpPost("verify-email")]
    public async Task<ActionResult<ApiResponse<string>>> VerifyEmail([FromBody] VerifyEmailRequest request)
    {
        try
        {
            await _authService.VerifyEmailAsync(request);
            return Ok(ApiResponse<string>.Ok("Email verified successfully."));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<string>.Error(ex.Message));
        }
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<ApiResponse<UserProfileResponse>>> GetProfile()
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized(ApiResponse<UserProfileResponse>.Error("Invalid token"));
            }

            var result = await _authService.GetProfileAsync(userId);
            return Ok(ApiResponse<UserProfileResponse>.Ok(result));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse<UserProfileResponse>.Error(ex.Message));
        }
    }
}


