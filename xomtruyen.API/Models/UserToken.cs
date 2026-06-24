namespace XomTruyen.API.Models;

public class UserToken
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User? User { get; set; }
    
    public string Token { get; set; } = string.Empty;
    public string TokenType { get; set; } = string.Empty; // e.g. "RefreshToken", "ResetPassword", "VerifyEmail"
    
    public DateTime ExpiryTime { get; set; }
    public bool IsRevoked { get; set; }
}
