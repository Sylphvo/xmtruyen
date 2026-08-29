namespace Xmtruyen.API.Models;

public class VoiceProfile
{
    // 'narrator_male', 'male_hero', etc.
    public string Id { get; set; } = null!;
    
    public string DisplayName { get; set; } = null!;
    
    // 'narrator', 'character', 'sfx'
    public string VoiceType { get; set; } = null!;
    
    // 'male', 'female', 'neutral'
    public string? Gender { get; set; }
    
    public string TtsProvider { get; set; } = null!;
    
    // Provider-specific voice ID
    public string TtsVoiceId { get; set; } = null!;
    
    // JSON: { pitch, speed, style, ... }
    public string? Settings { get; set; }
    
    // Preview audio sample
    public string? SampleAudioUrl { get; set; }
    
    public bool IsActive { get; set; } = true;
}
