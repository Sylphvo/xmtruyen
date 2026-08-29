using System;

namespace Xmtruyen.API.Models;

public class HelpArticle
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = null!;
    public string Slug { get; set; } = null!; // URL friendly
    
    // e.g. "Account", "Payment", "Reading", "General"
    public string Category { get; set; } = "General";
    
    public string ContentHtml { get; set; } = null!; // Rich text content
    
    public int ViewCount { get; set; } = 0;
    
    // Sort order in category
    public int OrderIndex { get; set; } = 0;
    
    public bool IsPublished { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public Guid? AuthorId { get; set; }
    public User? Author { get; set; }
}
