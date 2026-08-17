using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XomTruyen.API.Models;

public class Lesson
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Type { get; set; } = "Video";
    public int OrderIndex { get; set; }
    public int DurationSeconds { get; set; }
    public bool IsFreePreview { get; set; } = false;
    public string? TextContent { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Guid SectionId { get; set; }
    public CourseSection Section { get; set; } = null!;
    public LessonVideo? Video { get; set; }
    public ICollection<LessonProgress> Progresses { get; set; } = new List<LessonProgress>();
}
