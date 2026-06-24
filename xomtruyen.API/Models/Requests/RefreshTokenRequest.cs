using System.ComponentModel.DataAnnotations;

namespace XomTruyen.API.Models.Requests;

public class RefreshTokenRequest
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}
