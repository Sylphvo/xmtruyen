using Xmtruyen.API.Models.Enums;

namespace Xmtruyen.API.Models;

public class Note
{
    public Guid Id { get; set; }
    
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public Guid? ChapterId { get; set; }
    public ChapterType? ChapterType { get; set; }
    
    public string Content { get; set; } = null!;
    public DateTime? CreatedAt { get; set; }
}
