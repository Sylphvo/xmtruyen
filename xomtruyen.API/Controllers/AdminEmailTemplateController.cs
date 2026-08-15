using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;

namespace XomTruyen.API.Controllers;

[ApiController]
public class AdminEmailTemplateController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminEmailTemplateController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("api/admin/email-templates")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetTemplates()
    {
        var templates = await _context.EmailTemplates.ToListAsync();
        return Ok(templates);
    }

    [HttpPost("api/admin/email-templates")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateTemplate([FromBody] EmailTemplate template)
    {
        if (await _context.EmailTemplates.AnyAsync(t => t.Code == template.Code))
            return BadRequest(new { message = "Template code already exists" });

        var currentUserId = User.FindFirst("Id")?.Value;
        template.UpdatedBy = currentUserId;
        template.UpdatedAt = DateTime.UtcNow;

        _context.EmailTemplates.Add(template);
        await _context.SaveChangesAsync();
        return Ok(template);
    }

    [HttpPut("api/admin/email-templates/{code}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateTemplate(string code, [FromBody] EmailTemplate req)
    {
        var template = await _context.EmailTemplates.FirstOrDefaultAsync(t => t.Code == code);
        if (template == null) return NotFound();

        template.Subject = req.Subject;
        template.BodyHtml = req.BodyHtml;
        template.Description = req.Description;
        template.Variables = req.Variables;
        
        var currentUserId = User.FindFirst("Id")?.Value;
        template.UpdatedAt = DateTime.UtcNow;
        template.UpdatedBy = currentUserId;

        await _context.SaveChangesAsync();
        return Ok(template);
    }

    [HttpDelete("api/admin/email-templates/{code}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteTemplate(string code)
    {
        var template = await _context.EmailTemplates.FirstOrDefaultAsync(t => t.Code == code);
        if (template == null) return NotFound();

        _context.EmailTemplates.Remove(template);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Deleted" });
    }
}
