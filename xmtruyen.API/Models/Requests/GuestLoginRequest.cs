using System.ComponentModel.DataAnnotations;

namespace Xmtruyen.API.Models.Requests;

public class GuestLoginRequest
{
    [Required]
    public string DeviceId { get; set; } = string.Empty;
}


