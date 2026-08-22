using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;

namespace XomTruyen.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FaqController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public FaqController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetFaq()
    {
        var faqs = await _context.FaqItems
            .Where(f => f.IsActive)
            .OrderBy(f => f.OrderIndex)
            .ToListAsync();
        return Ok(faqs);
    }
}

[ApiController]
[Route("api/admin/faq")]
[Authorize(Roles = "Admin")]
public class AdminFaqController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminFaqController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllFaq()
    {
        var faqs = await _context.FaqItems.OrderBy(f => f.OrderIndex).ToListAsync();
        return Ok(faqs);
    }

    [HttpPost]
    public async Task<IActionResult> CreateFaq(FaqItem faq)
    {
        faq.CreatedAt = DateTimeOffset.UtcNow;
        _context.FaqItems.Add(faq);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAllFaq), new { id = faq.Id }, faq);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateFaq(Guid id, FaqItem updatedFaq)
    {
        var faq = await _context.FaqItems.FindAsync(id);
        if (faq == null) return NotFound();

        faq.Category = updatedFaq.Category;
        faq.Question = updatedFaq.Question;
        faq.Answer = updatedFaq.Answer;
        faq.OrderIndex = updatedFaq.OrderIndex;
        faq.IsActive = updatedFaq.IsActive;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFaq(Guid id)
    {
        var faq = await _context.FaqItems.FindAsync(id);
        if (faq == null) return NotFound();

        _context.FaqItems.Remove(faq);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
