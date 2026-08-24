using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using BCrypt.Net;
using Microsoft.IdentityModel.Tokens;
using XomTruyen.API.Models;
using XomTruyen.API.Models.Requests;
using XomTruyen.API.Models.Responses;
using XomTruyen.API.Repositories.Interfaces;
using XomTruyen.API.Services.Interfaces;

namespace XomTruyen.API.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IEmailService _emailService;
    private readonly IConfiguration _configuration;

    public AuthService(IUserRepository userRepository, IEmailService emailService, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _emailService = emailService;
        _configuration = configuration;
    }

    public async Task<string> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
    {
        if (await _userRepository.IsEmailExistsAsync(request.Email, cancellationToken))
            throw new Exception("Email already exists");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            FullName = request.FullName,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Provider = "system",
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.AddUserAsync(user, cancellationToken);

        var verifyToken = GenerateRandomString();
        var userToken = new UserToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = verifyToken,
            TokenType = "VerifyEmail",
            ExpiryTime = DateTime.UtcNow.AddHours(24)
        };
        await _userRepository.SaveTokenAsync(userToken, cancellationToken);
        await _emailService.SendVerificationEmailAsync(user.Email, verifyToken);

        return "User registered successfully. Please check your email to verify your account.";
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetUserByEmailAsync(request.Email, cancellationToken);
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password");

        var token = GenerateJwtToken(user);
        var refreshToken = GenerateRandomString();

        var userToken = new UserToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = refreshToken,
            TokenType = "RefreshToken",
            ExpiryTime = DateTime.UtcNow.AddDays(7)
        };
        await _userRepository.SaveTokenAsync(userToken, cancellationToken);

        return new AuthResponse
        {
            Token = token,
            RefreshToken = refreshToken,
            Email = user.Email ?? string.Empty,
            Roles = GetRoleNames(user),
            Permissions = GetPermissionNames(user)
        };
    }

    public async Task<AuthResponse> GuestLoginAsync(GuestLoginRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetGuestUserByDeviceIdAsync(request.DeviceId, cancellationToken);
        if (user == null)
        {
            user = new User
            {
                Id = Guid.NewGuid(),
                Provider = "guest",
                ProviderId = request.DeviceId,
                TotalGuestReads = 0,
                CreatedAt = DateTime.UtcNow
            };
            await _userRepository.AddUserAsync(user, cancellationToken);
        }

        var token = GenerateJwtToken(user);
        var refreshToken = GenerateRandomString();
        var userToken = new UserToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = refreshToken,
            TokenType = "RefreshToken",
            ExpiryTime = DateTime.UtcNow.AddDays(7)
        };
        await _userRepository.SaveTokenAsync(userToken, cancellationToken);

        return new AuthResponse
        {
            Token = token,
            RefreshToken = refreshToken,
            Email = "guest",
            Roles = GetRoleNames(user),
            Permissions = GetPermissionNames(user)
        };
    }

    public async Task<UserProfileResponse> GetProfileAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetUserByIdAsync(userId, cancellationToken);
        if (user == null) throw new Exception("User not found");

        return new UserProfileResponse
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            AvatarUrl = user.AvatarUrl,
            CoinBalance = user.CoinBalance,
            Provider = user.Provider,
            CurrentPlanId = user.CurrentPlanId,
            PlanName = user.CurrentPlan?.Name,
            IsUnlimited = user.CurrentPlan?.IsUnlimited ?? false,
            PlanExpiredAt = user.PlanExpiredAt,
            TotalGuestReads = user.TotalGuestReads,
            DailyReadCount = user.DailyReadCount,
            CreatedAt = user.CreatedAt,
            Roles = GetRoleNames(user),
            Permissions = GetPermissionNames(user)
        };
    }

    public async Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest request, CancellationToken cancellationToken = default)
    {
        var storedToken = await _userRepository.GetTokenAsync(request.RefreshToken, "RefreshToken", cancellationToken);
        if (storedToken == null || storedToken.IsRevoked || storedToken.ExpiryTime <= DateTime.UtcNow)
            throw new Exception("Invalid or expired refresh token");

        if (storedToken.User == null)
            throw new Exception("User not found");

        await _userRepository.RevokeTokenAsync(storedToken.Id, cancellationToken);

        var token = GenerateJwtToken(storedToken.User);
        var newRefreshToken = GenerateRandomString();

        var userToken = new UserToken
        {
            Id = Guid.NewGuid(),
            UserId = storedToken.UserId,
            Token = newRefreshToken,
            TokenType = "RefreshToken",
            ExpiryTime = DateTime.UtcNow.AddDays(7)
        };
        await _userRepository.SaveTokenAsync(userToken, cancellationToken);

        return new AuthResponse
        {
            Token = token,
            RefreshToken = newRefreshToken,
            Email = storedToken.User.Email ?? storedToken.User.Provider ?? string.Empty,
            Roles = GetRoleNames(storedToken.User),
            Permissions = GetPermissionNames(storedToken.User)
        };
    }

    public async Task LogoutAsync(RefreshTokenRequest request, CancellationToken cancellationToken = default)
    {
        var storedToken = await _userRepository.GetTokenAsync(request.RefreshToken, "RefreshToken", cancellationToken);
        if (storedToken != null)
        {
            await _userRepository.RevokeTokenAsync(storedToken.Id, cancellationToken);
        }
    }

    public async Task ForgotPasswordAsync(ForgotPasswordRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetUserByEmailAsync(request.Email, cancellationToken);
        if (user == null) return; // Prevent enumeration

        await _userRepository.RevokeAllUserTokensAsync(user.Id, "ResetPassword", cancellationToken);

        var resetToken = new Random().Next(100000, 999999).ToString();
        var userToken = new UserToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Token = resetToken,
            TokenType = "ResetPassword",
            ExpiryTime = DateTime.UtcNow.AddMinutes(15)
        };
        await _userRepository.SaveTokenAsync(userToken, cancellationToken);
        await _emailService.SendPasswordResetEmailAsync(user.Email!, resetToken);
    }

    public async Task ResetPasswordAsync(ResetPasswordRequest request, CancellationToken cancellationToken = default)
    {
        var storedToken = await _userRepository.GetTokenAsync(request.Token, "ResetPassword", cancellationToken);
        if (storedToken == null || storedToken.IsRevoked || storedToken.ExpiryTime <= DateTime.UtcNow)
            throw new Exception("Invalid or expired token");

        var user = await _userRepository.GetUserByIdAsync(storedToken.UserId, cancellationToken);
        if (user == null) throw new Exception("User not found");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await _userRepository.UpdateUserAsync(user, cancellationToken);
        await _userRepository.RevokeTokenAsync(storedToken.Id, cancellationToken);
    }

    public async Task ChangePasswordAsync(Guid userId, ChangePasswordRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _userRepository.GetUserByIdAsync(userId, cancellationToken);
        if (user == null) throw new Exception("User not found");

        if (string.IsNullOrEmpty(user.PasswordHash) || !BCrypt.Net.BCrypt.Verify(request.OldPassword, user.PasswordHash))
            throw new Exception("Incorrect old password");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await _userRepository.UpdateUserAsync(user, cancellationToken);
    }

    public async Task VerifyEmailAsync(VerifyEmailRequest request, CancellationToken cancellationToken = default)
    {
        var storedToken = await _userRepository.GetTokenAsync(request.Token, "VerifyEmail", cancellationToken);
        if (storedToken == null || storedToken.IsRevoked || storedToken.ExpiryTime <= DateTime.UtcNow)
            throw new Exception("Invalid or expired token");

        await _userRepository.RevokeTokenAsync(storedToken.Id, cancellationToken);
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]!);

        var roleNames = GetRoleNames(user);
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.FullName ?? user.Email ?? "Unknown"),
            new(ClaimTypes.Email, user.Email ?? user.Provider ?? string.Empty)
        };
        claims.AddRange(roleNames.Select(role => new Claim(ClaimTypes.Role, role)));

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpireMinutes"]!)),
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private static List<string> GetRoleNames(User user)
    {
        var roles = user.UserRoles
            .Where(userRole => userRole.ExpiresAt == null || userRole.ExpiresAt > DateTime.UtcNow)
            .Select(userRole => userRole.Role.Name)
            .Where(name => !string.IsNullOrWhiteSpace(name))
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        if (roles.Count == 0 && !string.IsNullOrWhiteSpace(user.Role))
            roles.Add(user.Role);

        if (roles.Contains("Admin"))
            roles.Add("SuperAdmin");
        if (roles.Contains("SuperAdmin"))
            roles.Add("Admin");

        return roles.ToList();
    }

    private static List<string> GetPermissionNames(User user)
    {
        return user.UserRoles
            .Where(userRole => userRole.ExpiresAt == null || userRole.ExpiresAt > DateTime.UtcNow)
            .SelectMany(userRole => userRole.Role.RolePermissions)
            .Select(rolePermission => rolePermission.PermissionId)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
    }

    private string GenerateRandomString(int length = 64)
    {
        var randomBytes = new byte[length / 2];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomBytes);
        }
        return Convert.ToHexString(randomBytes).ToLower();
    }
}


