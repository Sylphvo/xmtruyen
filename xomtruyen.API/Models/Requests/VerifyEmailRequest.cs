using System.ComponentModel.DataAnnotations;

namespace XomTruyen.API.Models.Requests;

public class VerifyEmailRequest
{
    [Required]
    public string Token { get; set; } = string.Empty;
}
