using System.ComponentModel.DataAnnotations;
using XomTruyen.API.Models.Enums;

namespace XomTruyen.API.Models.Requests;

public class BookRequest
{
    [Required]
    [MaxLength(255)]
    public string Title { get; set; } = null!;
    
    [MaxLength(150)]
    public string? Author { get; set; }
    
    public string? Description { get; set; }
    
    public string? CoverImageUrl { get; set; }
    
    public FormatType FormatType { get; set; } = FormatType.Text;
    
    public AccessLevel AccessLevel { get; set; } = AccessLevel.Free;

    [Required]
    public List<int> CategoryIds { get; set; } = new List<int>();
}
