using System;
using System.Collections.Generic;

namespace XomTruyen.API.Models;

public class TranslationPage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid ChapterId { get; set; }
    public TranslationChapter Chapter { get; set; } = null!;
    
    public int PageNumber { get; set; }
    public string RawImageUrl { get; set; } = null!;
    public string? TranslatedImageUrl { get; set; }
    
    public string OcrStatus { get; set; } = "pending";
    public string TypesetStatus { get; set; } = "pending";
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<TextBlock> TextBlocks { get; set; } = new List<TextBlock>();
}
