using System;
using System.Collections.Generic;

namespace Xmtruyen.API.Models;

public class Author
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string? AvatarUrl { get; set; }
    
    // Social links
    public string? Website { get; set; }
    public string? Twitter { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public ICollection<Publication> Publications { get; set; } = new List<Publication>();
}
