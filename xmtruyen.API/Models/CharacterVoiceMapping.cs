namespace Xmtruyen.API.Models;

public class CharacterVoiceMapping
{
    public Guid Id { get; set; }
    
    public Guid PublicationId { get; set; }
    public Publication Publication { get; set; } = null!;
    
    public string CharacterName { get; set; } = null!;
    
    public string? VoiceProfileId { get; set; }
    public VoiceProfile? VoiceProfile { get; set; }
    
    public string? Notes { get; set; }
}
