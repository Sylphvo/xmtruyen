using System.ComponentModel.DataAnnotations;

namespace Xmtruyen.API.Models.Requests;

public class ForgotPasswordRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}


