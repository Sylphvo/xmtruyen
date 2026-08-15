using System;

namespace XomTruyen.API.Models;

public class EmailTemplate
{
    public string Code { get; set; } = null!; // e.g. "WELCOME_EMAIL", "RESET_PASSWORD"
    public string Subject { get; set; } = null!;
    public string BodyHtml { get; set; } = null!; // HTML content
    
    public string? Description { get; set; } // What is this template used for?
    public string? Variables { get; set; } // e.g. "{{UserName}}, {{ResetLink}}"
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string? UpdatedBy { get; set; }
}
