using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;

namespace XomTruyen.API.Controllers;

[Route("api/enrollment")]
[ApiController]
[Authorize]
public class EnrollmentController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public EnrollmentController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpPost("course/{courseId}")]
    public async Task<IActionResult> EnrollCourse(Guid courseId)
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
            return Unauthorized();

        // Check if already enrolled
        var isEnrolled = await _db.CourseEnrollments.AnyAsync(e => e.UserId == userId && e.CourseId == courseId);
        if (isEnrolled) return BadRequest("Bạn đã sở hữu khóa học này");

        var course = await _db.Courses.FindAsync(courseId);
        if (course == null) return NotFound("Khóa học không tồn tại");

        var priceToPay = course.DiscountPrice ?? course.Price;

        if (priceToPay > 0)
        {
            var userEntity = await _db.Users.FindAsync(userId);
            if (userEntity == null || (userEntity.CoinBalance ?? 0) < priceToPay)
            {
                return BadRequest($"LOCKED_COURSE|{priceToPay}"); // Client handles this string
            }

            // Deduct coins
            userEntity.CoinBalance = (userEntity.CoinBalance ?? 0) - (int)priceToPay;
            // userEntity.UpdatedAt is not available

            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Amount = 0,
                CoinAmount = -(int)priceToPay,
                TransactionType = "PurchaseCourse",
                Note = $"Mua khóa học {course.Title}",
                Status = "Completed",
                CreatedAt = DateTime.UtcNow
            };
            _db.Transactions.Add(transaction);
        }

        var enrollment = new CourseEnrollment
        {
            UserId = userId,
            CourseId = courseId
        };
        _db.CourseEnrollments.Add(enrollment);
        
        // Increase enrollment count
        course.EnrollmentCount += 1;

        await _db.SaveChangesAsync();

        return Ok(new { success = true, message = "Đăng ký khóa học thành công" });
    }

    [HttpGet("my-courses")]
    public async Task<IActionResult> GetMyCourses()
    {
        var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
            return Unauthorized();

        var enrollments = await _db.CourseEnrollments
            .Include(e => e.Course)
            .Where(e => e.UserId == userId)
            .Select(e => new
            {
                e.Course.Id,
                e.Course.Title,
                e.Course.ThumbnailUrl,
                e.EnrolledAt
            })
            .ToListAsync();
        
        return Ok(new { data = enrollments });
    }
}
