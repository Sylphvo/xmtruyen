using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xmtruyen.API.Data;
using Xmtruyen.API.Models;

namespace Xmtruyen.API.Controllers;

[Route("api/course")]
[ApiController]
public class CourseController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public CourseController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetCourses()
    {
        var courses = await _db.Courses
            .Where(c => c.Status == "Published")
            .Select(c => new
            {
                c.Id,
                c.Title,
                c.ThumbnailUrl,
                c.Price,
                c.DiscountPrice,
                c.Level,
                c.TotalLessons,
                c.TotalDurationMinutes,
                c.AverageRating,
                InstructorName = c.Instructor.FullName
            })
            .ToListAsync();
        
        return Ok(new { data = courses });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCourseDetail(Guid id)
    {
        var course = await _db.Courses
            .Include(c => c.Instructor)
            .Include(c => c.Sections.OrderBy(s => s.OrderIndex))
            .ThenInclude(s => s.Lessons.OrderBy(l => l.OrderIndex))
            .FirstOrDefaultAsync(c => c.Id == id);
        
        if (course == null) return NotFound();

        return Ok(new
        {
            course.Id,
            course.Title,
            course.Description,
            course.ThumbnailUrl,
            course.PreviewVideoUrl,
            course.Price,
            course.DiscountPrice,
            course.Level,
            course.TotalLessons,
            course.TotalDurationMinutes,
            course.EnrollmentCount,
            course.AverageRating,
            Instructor = new { course.Instructor.Id, course.Instructor.FullName, course.Instructor.AvatarUrl },
            Sections = course.Sections.Select(s => new
            {
                s.Id,
                s.Title,
                Lessons = s.Lessons.Select(l => new
                {
                    l.Id,
                    l.Title,
                    l.Type,
                    l.DurationSeconds,
                    l.IsFreePreview
                })
            })
        });
    }
}
