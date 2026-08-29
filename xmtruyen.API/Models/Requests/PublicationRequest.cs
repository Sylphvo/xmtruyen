using System.ComponentModel.DataAnnotations;
using Xmtruyen.API.Models.Enums;

namespace Xmtruyen.API.Models.Requests;

public class PublicationRequest
{
    public Guid? Id { get; set; }

    [Required]
    [MaxLength(255)]
    public string Title { get; set; } = null!;
    
    [MaxLength(150)]
    public string? Author { get; set; }
    
    public string? Description { get; set; }
    
    public string? CoverImageUrl { get; set; }
    
    public FormatType FormatType { get; set; } = FormatType.Text;
    
    public AccessLevel AccessLevel { get; set; } = AccessLevel.Free;
    
    public string? DisplayLabel { get; set; }

    [Required]
    public List<int> CategoryIds { get; set; } = new List<int>();

    public List<int> TopicIds { get; set; } = new List<int>();
}


