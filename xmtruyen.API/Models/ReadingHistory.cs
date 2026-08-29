using Xmtruyen.API.Models.Enums;

namespace Xmtruyen.API.Models;

public class ReadingHistory
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    
    public Guid PublicationId { get; set; }
    public Publication Publication { get; set; } = null!;
    
    public Guid? LastReadChapterId { get; set; }
    public ChapterType? LastReadChapterType { get; set; }
    
    public DateTime? UpdatedAt { get; set; }
}
