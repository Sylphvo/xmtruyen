using System;
using System.Collections.Generic;

namespace XomTruyen.API.Models;

public class TranslationChapter
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid JobId { get; set; }
    public TranslationJob Job { get; set; } = null!;
    
    public decimal ChapterNumber { get; set; }
    public string? Title { get; set; }
    public string Status { get; set; } = "imported";
    
    public int PageCount { get; set; } = 0;
    public int TextBlockCount { get; set; } = 0;
    
    public string? RawFolderPath { get; set; }
    public string? TranslatedFolderPath { get; set; }
    
    public string? ReviewNote { get; set; }
    public string? ReviewedBy { get; set; }
    public DateTime? ReviewedAt { get; set; }
    
    public Guid? PublishedChapterId { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<TranslationPage> Pages { get; set; } = new List<TranslationPage>();
}
