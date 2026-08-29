namespace Xmtruyen.API.Models;

public class AudioSegment
{
    public Guid Id { get; set; }
    
    public Guid JobId { get; set; }
    public AudioJob Job { get; set; } = null!;
    
    public int OrderIndex { get; set; }
    
    // 'narration', 'dialog', 'sfx', 'pause'
    public string SegmentType { get; set; } = null!;
    
    // Text content to speak
    public string? Text { get; set; }
    
    public string? VoiceProfileId { get; set; }
    
    // Character name
    public string? Speaker { get; set; }
    
    // happy, sad, angry, neutral
    public string? Emotion { get; set; }
    
    public decimal? Speed { get; set; } = 1.0m;
    
    public int? PauseAfterMs { get; set; } = 500;
    
    // Path to generated audio chunk
    public string? AudioChunkUrl { get; set; }
    
    // Chunk duration in ms
    public int? Duration { get; set; }
    
    // pending, generating, done, failed
    public string Status { get; set; } = "pending";
}
