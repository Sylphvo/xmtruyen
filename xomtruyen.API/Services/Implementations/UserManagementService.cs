using XomTruyen.API.Models;
using XomTruyen.API.Models.Requests;
using XomTruyen.API.Models.Responses;
using XomTruyen.API.Repositories.Interfaces;
using XomTruyen.API.Services.Interfaces;
using BCrypt.Net;

namespace XomTruyen.API.Services.Implementations;

public class UserManagementService : IUserManagementService
{
    private readonly IUserRepository _userRepository;

    public UserManagementService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<AdminUserResponse> CreateUserAsync(AdminUserRequest request)
    {
        if (await _userRepository.IsEmailExistsAsync(request.Email))
        {
            throw new ArgumentException("Email already exists");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            FullName = request.FullName,
            AvatarUrl = request.AvatarUrl,
            CoinBalance = request.CoinBalance ?? 0,
            CurrentPlanId = request.CurrentPlanId,
            PlanExpiredAt = request.PlanExpiredAt,
            IsActive = request.IsActive,
            Provider = "system",
            CreatedAt = DateTime.UtcNow
        };

        if (!string.IsNullOrEmpty(request.Password))
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        }

        await _userRepository.AddUserAsync(user);

        return MapToResponse(user);
    }

    public async Task<AdminUserResponse> UpdateUserAsync(Guid id, AdminUserRequest request)
    {
        var user = await _userRepository.GetUserByIdAsync(id);
        if (user == null) throw new KeyNotFoundException("User not found");

        if (user.Email != request.Email && await _userRepository.IsEmailExistsAsync(request.Email))
        {
            throw new ArgumentException("Email already exists");
        }

        user.Email = request.Email;
        user.FullName = request.FullName;
        user.AvatarUrl = request.AvatarUrl;
        user.CoinBalance = request.CoinBalance ?? user.CoinBalance;
        user.CurrentPlanId = request.CurrentPlanId;
        user.PlanExpiredAt = request.PlanExpiredAt;
        user.IsActive = request.IsActive;

        if (!string.IsNullOrEmpty(request.Password))
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        }

        await _userRepository.UpdateUserAsync(user);

        return MapToResponse(user);
    }

    public async Task DeleteUserAsync(Guid id)
    {
        var user = await _userRepository.GetUserByIdAsync(id);
        if (user == null) throw new KeyNotFoundException("User not found");

        await _userRepository.DeleteUserAsync(user);
    }

    public async Task<AdminUserResponse?> GetUserByIdAsync(Guid id)
    {
        var user = await _userRepository.GetUserByIdAsync(id);
        return user != null ? MapToResponse(user) : null;
    }

    public async Task<(IEnumerable<AdminUserResponse> Users, int TotalCount)> GetUsersAsync(UserFilterRequest filter)
    {
        var (users, totalCount) = await _userRepository.GetUsersAsync(filter);
        var responseList = users.Select(MapToResponse).ToList();
        return (responseList, totalCount);
    }

    public async Task ToggleUserStatusAsync(Guid id, bool isActive)
    {
        var user = await _userRepository.GetUserByIdAsync(id);
        if (user == null) throw new KeyNotFoundException("User not found");

        user.IsActive = isActive;
        await _userRepository.UpdateUserAsync(user);
    }

    private static AdminUserResponse MapToResponse(User user)
    {
        return new AdminUserResponse
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            AvatarUrl = user.AvatarUrl,
            Provider = user.Provider,
            CoinBalance = user.CoinBalance,
            CurrentPlanId = user.CurrentPlanId,
            CurrentPlanName = user.CurrentPlan?.Name,
            PlanExpiredAt = user.PlanExpiredAt,
            TotalGuestReads = user.TotalGuestReads,
            DailyReadCount = user.DailyReadCount,
            CreatedAt = user.CreatedAt,
            IsActive = user.IsActive
        };
    }
}


