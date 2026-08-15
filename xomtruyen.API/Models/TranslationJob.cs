using System;
using System.Collections.Generic;

namespace XomTruyen.API.Models;

public class TranslationJob
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid PublicationId { get; set; }
    public Publication Publication { get; set; } = null!;
    
    public string SourceLanguage { get; set; } = null!; // zh, ko, ja, en
    public string TargetLanguage { get; set; } = null!; // vi, en, id, th
    public string Status { get; set; } = "imported";
    
    public int TotalChapters { get; set; } = 0;
    public int TotalPages { get; set; } = 0;
    public int TotalTextBlocks { get; set; } = 0;
    public int ProcessedPages { get; set; } = 0;
    
    public string? ErrorMessage { get; set; }
    public string? CreatedBy { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }

    public ICollection<TranslationChapter> Chapters { get; set; } = new List<TranslationChapter>();
}
