using System;

namespace XomTruyen.API.Models;

public class TextBlock
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid PageId { get; set; }
    public TranslationPage Page { get; set; } = null!;
    
    public int BboxX { get; set; }
    public int BboxY { get; set; }
    public int BboxWidth { get; set; }
    public int BboxHeight { get; set; }
    
    public string OriginalText { get; set; } = null!;
    public string? TranslatedText { get; set; }
    
    public string TextType { get; set; } = "dialog"; // dialog, sfx, narration, title
    public string FontStyle { get; set; } = "regular"; // regular, bold, italic
    
    public decimal? OcrConfidence { get; set; }
    public bool IsManualEdit { get; set; } = false;
    public int OrderIndex { get; set; } = 0;
}
