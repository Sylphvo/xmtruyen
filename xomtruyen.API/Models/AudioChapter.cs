namespace XomTruyen.API.Models;

public class AudioChapter
{
    public Guid Id { get; set; }
    public Guid PublicationId { get; set; }
    public Publication Publication { get; set; } = null!;
    
    public decimal ChapterNumber { get; set; }
    public string? Title { get; set; }
    
    // Path to final MP3/M4A
    public string AudioUrl { get; set; } = null!;
    
    // Duration in seconds
    public int Duration { get; set; }
    
    // File size in bytes
    public long? FileSize { get; set; }
    
    public bool IsLocked { get; set; } = false;
    public int? CoinPrice { get; set; } = 0;
    public int? ListenCount { get; set; } = 0;
    
    // JSON array for player visualization
    public string? WaveformData { get; set; }
    
    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
}
