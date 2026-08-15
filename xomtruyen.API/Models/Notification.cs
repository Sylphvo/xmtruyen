using System;

namespace XomTruyen.API.Models;

public class Notification
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }
    public User? User { get; set; }
    
    public string Title { get; set; } = null!;
    public string Message { get; set; } = null!;
    public string Type { get; set; } = null!;
    
    public Guid? ReferenceId { get; set; }
    public string? ReferenceType { get; set; }
    
    public bool IsRead { get; set; } = false;
    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
}
