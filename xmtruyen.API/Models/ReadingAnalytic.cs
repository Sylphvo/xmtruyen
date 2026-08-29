using System;

namespace Xmtruyen.API.Models;

public class ReadingAnalytic
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    // Who read
    public Guid? UserId { get; set; }
    public User? User { get; set; }
    
    public string? GuestSessionId { get; set; }
    
    // What was read
    public Guid PublicationId { get; set; }
    public Publication Publication { get; set; } = null!;
    
    public Guid? ChapterId { get; set; } // Could be BookChapter or ComicChapter depending on FormatType
    
    // Details
    public DateTime ReadAt { get; set; } = DateTime.UtcNow;
    public int ReadingDurationSeconds { get; set; } // Time spent reading
    
    public string? DeviceInfo { get; set; } // Mobile/Desktop, OS, Browser
    public string? Country { get; set; }
}
