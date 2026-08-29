namespace Xmtruyen.API.Models;

public class AudioSfx
{
    public Guid Id { get; set; }
    
    // 'explosion', 'sword_slash', 'thunder'
    public string Name { get; set; } = null!;
    
    // 'combat', 'nature', 'emotion', 'magic'
    public string? Category { get; set; }
    
    // JSON array: ["boom", "đùng", "nổ"]
    public string? Keywords { get; set; }
    
    public string AudioUrl { get; set; } = null!;
    
    // ms
    public int? Duration { get; set; }
}
