using System.ComponentModel.DataAnnotations;

namespace Xmtruyen.API.Models.Requests;

public class RefreshTokenRequest
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}


