using System.ComponentModel.DataAnnotations;

namespace XomTruyen.API.Models.Requests;

public class GuestLoginRequest
{
    [Required]
    public string DeviceId { get; set; } = string.Empty;
}
