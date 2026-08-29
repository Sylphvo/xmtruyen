using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xmtruyen.API.Data;

namespace Xmtruyen.API.Controllers;

[Route("api/plans")]
[ApiController]
public class SubscriptionPlanController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SubscriptionPlanController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllPlans()
    {
        var plans = await _context.SubscriptionPlans.OrderBy(p => p.Price).ToListAsync();
        return Ok(plans);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPlan(int id)
    {
        var plan = await _context.SubscriptionPlans.FindAsync(id);
        if (plan == null) return NotFound();
        return Ok(plan);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreatePlan(Xmtruyen.API.Models.SubscriptionPlan plan)
    {
        _context.SubscriptionPlans.Add(plan);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetPlan), new { id = plan.Id }, plan);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdatePlan(int id, Xmtruyen.API.Models.SubscriptionPlan plan)
    {
        if (id != plan.Id) return BadRequest();
        _context.Entry(plan).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeletePlan(int id)
    {
        var plan = await _context.SubscriptionPlans.FindAsync(id);
        if (plan == null) return NotFound();
        _context.SubscriptionPlans.Remove(plan);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
