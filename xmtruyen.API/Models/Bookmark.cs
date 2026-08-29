using Xmtruyen.API.Models.Enums;

namespace Xmtruyen.API.Models;

public class Bookmark
{
    public Guid Id { get; set; }
    
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public Guid? ChapterId { get; set; }
    // Polymorphic association (not a hard FK in db)
    public ChapterType? ChapterType { get; set; }
    
    public DateTime? CreatedAt { get; set; }
}
