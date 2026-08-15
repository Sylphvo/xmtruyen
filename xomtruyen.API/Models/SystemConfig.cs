using System;

namespace XomTruyen.API.Models;

public class SystemConfig
{
    public string Key { get; set; } = null!; // Primary key
    public string Value { get; set; } = null!;
    public string? Description { get; set; }
    
    // e.g. "General", "Email", "SEO", "Payment", "FeatureToggle"
    public string Category { get; set; } = "General";
    
    // e.g. "string", "number", "boolean", "json"
    public string DataType { get; set; } = "string";
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string? UpdatedBy { get; set; }
}
