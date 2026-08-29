using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Xmtruyen.API.Models;

public class ReaderPreference
{
    [Key]
    public Guid UserId { get; set; }
    
    [ForeignKey("UserId")]
    public virtual User? User { get; set; }

    [StringLength(50)]
    public string Theme { get; set; } = "light"; // light, dark, sepia

    [StringLength(100)]
    public string FontFamily { get; set; } = "Arial"; // Arial, Times New Roman, Bookerly

    public int FontSize { get; set; } = 16;

    public float LineHeight { get; set; } = 1.5f;

    public float Contrast { get; set; } = 1.0f;

    public bool EnableBreakReminder { get; set; } = false;
    public int BreakReminderIntervalMinutes { get; set; } = 60; // 30, 45, 60
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
