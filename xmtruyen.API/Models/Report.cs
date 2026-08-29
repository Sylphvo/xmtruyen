using System;

namespace Xmtruyen.API.Models;

public class Report
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    // Who reported it
    public Guid ReporterId { get; set; }
    public User Reporter { get; set; } = null!;
    
    // Target entity: 'Publication', 'Chapter', 'Review', 'User', 'Comment'
    public string TargetType { get; set; } = null!;
    public Guid TargetId { get; set; }
    
    // Reason: 'Spam', 'Inappropriate', 'Copyright', 'Error', 'Other'
    public string Reason { get; set; } = null!;
    public string? Description { get; set; }
    
    // Status: 'Pending', 'Resolved', 'Dismissed'
    public string Status { get; set; } = "Pending";
    
    public string? ResolutionNote { get; set; }
    public string? ResolvedBy { get; set; }
    public DateTime? ResolvedAt { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
