using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XomTruyen.API.Models;

public class CourseEnrollment
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public Guid CourseId { get; set; }
    public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
    public DateTime? ExpireAt { get; set; }

    public User User { get; set; } = null!;
    public Course Course { get; set; } = null!;
}
