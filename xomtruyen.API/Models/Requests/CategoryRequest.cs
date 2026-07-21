using System.ComponentModel.DataAnnotations;

namespace XomTruyen.API.Models.Requests;

public class CategoryRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = null!;
}


