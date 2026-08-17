using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XomTruyen.API.Models;

public class Course
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public string? Description { get; set; }
    public string? ThumbnailUrl { get; set; }
    public string? PreviewVideoUrl { get; set; }
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public string Currency { get; set; } = "VND";
    public string Status { get; set; } = "Draft";
    public string Level { get; set; } = "Beginner";
    public string? Language { get; set; } = "vi";
    public int TotalLessons { get; set; }
    public int TotalDurationMinutes { get; set; }
    public int EnrollmentCount { get; set; }
    public double AverageRating { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? PublishedAt { get; set; }

    public Guid InstructorId { get; set; }
    public User Instructor { get; set; } = null!;
    public ICollection<CourseSection> Sections { get; set; } = new List<CourseSection>();
    public ICollection<CourseEnrollment> Enrollments { get; set; } = new List<CourseEnrollment>();
}
