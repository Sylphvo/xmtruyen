using System.ComponentModel.DataAnnotations;

namespace Xmtruyen.API.Models.Requests;

public class TopicRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = null!;
}


