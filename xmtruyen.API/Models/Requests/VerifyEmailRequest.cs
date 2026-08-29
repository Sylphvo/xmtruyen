using System.ComponentModel.DataAnnotations;

namespace Xmtruyen.API.Models.Requests;

public class VerifyEmailRequest
{
    [Required]
    public string Token { get; set; } = string.Empty;
}


