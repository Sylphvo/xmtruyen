using System;

namespace XomTruyen.API.Models;

public class FaqItem
{
    public Guid Id { get; set; }
    public string Category { get; set; } = null!;
    public string Question { get; set; } = null!;
    public string Answer { get; set; } = null!;
    public int OrderIndex { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
