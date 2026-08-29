using System;

namespace Xmtruyen.API.Models;

public class Banner
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string ImageUrl { get; set; } = null!;
    public string? LinkUrl { get; set; }
    public string? Title { get; set; }
    public string? Subtitle { get; set; }
    public bool IsActive { get; set; } = true;
    public int OrderIndex { get; set; } = 0;
    
    // Position can be 'HomeTop', 'HomeMiddle', 'ReaderSidebar', etc.
    public string Position { get; set; } = "HomeTop"; 
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
