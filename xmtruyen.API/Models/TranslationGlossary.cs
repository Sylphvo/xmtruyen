using System;

namespace Xmtruyen.API.Models;

public class TranslationGlossary
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public string SourceText { get; set; } = null!;
    public string TargetText { get; set; } = null!;
    public string SourceLanguage { get; set; } = null!;
    public string TargetLanguage { get; set; } = null!;
    
    public string? Category { get; set; }
    
    public Guid? PublicationId { get; set; }
    public Publication? Publication { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
