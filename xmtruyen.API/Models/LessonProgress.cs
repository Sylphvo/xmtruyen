using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Xmtruyen.API.Models;

[PrimaryKey(nameof(UserId), nameof(LessonId))]
public class LessonProgress
{
    public Guid UserId { get; set; }
    public Guid LessonId { get; set; }
    public double WatchedPercent { get; set; }
    public int LastPositionSeconds { get; set; }
    public bool IsCompleted { get; set; } = false;
    public DateTime? CompletedAt { get; set; }
    public DateTime LastAccessedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public Lesson Lesson { get; set; } = null!;
}
