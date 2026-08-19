namespace XomTruyen.API.Models;

public class AudioJob
{
    public Guid Id { get; set; }
    
    public Guid PublicationId { get; set; }
    public Publication Publication { get; set; } = null!;
    
    // 'book_chapter', 'comic_chapter', 'manual_script', 'upload'
    public string SourceType { get; set; } = null!;
    
    // JSON array of source chapter IDs
    public string? SourceChapterIds { get; set; }
    
    public string TargetLanguage { get; set; } = "vi";
    
    // pending → preprocessing → generating → post_processing → review → approved → published → failed
    public string Status { get; set; } = "pending";
    
    // 'edge_tts', 'google_cloud', 'openai', 'fpt_ai'
    public string? TtsProvider { get; set; }
    
    public string? NarratorVoiceId { get; set; }
    
    public int? TotalSegments { get; set; } = 0;
    public int? ProcessedSegments { get; set; } = 0;
    
    public string? ErrorMessage { get; set; }
    
    // JSON: { speed, addBgm, bgmVolume, ... }
    public string? Settings { get; set; }
    
    public string? CreatedBy { get; set; }
    
    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
}
