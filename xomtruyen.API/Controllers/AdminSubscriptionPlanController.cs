using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;
using XomTruyen.API.Models.Requests;

namespace XomTruyen.API.Controllers;

[Route("api/admin/plans")]
[ApiController]
[Authorize(Roles = "Admin")]
public class AdminSubscriptionPlanController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdminSubscriptionPlanController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllPlans()
    {
        var plans = await _context.SubscriptionPlans.OrderBy(p => p.Price).ToListAsync();
        return Ok(plans);
    }

    [HttpPost]
    public async Task<IActionResult> CreatePlan([FromBody] SubscriptionPlanRequest request)
    {
        var plan = new SubscriptionPlan
        {
            Name = request.Name,
            Price = request.Price,
            DurationDays = request.DurationDays,
            IsUnlimited = request.IsUnlimited,
            MaxChaptersPerDay = request.MaxChaptersPerDay,
            RemoveAds = request.RemoveAds
        };

        _context.SubscriptionPlans.Add(plan);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAllPlans), new { id = plan.Id }, plan);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePlan(int id, [FromBody] SubscriptionPlanRequest request)
    {
        var plan = await _context.SubscriptionPlans.FindAsync(id);
        if (plan == null) return NotFound();

        plan.Name = request.Name;
        plan.Price = request.Price;
        plan.DurationDays = request.DurationDays;
        plan.IsUnlimited = request.IsUnlimited;
        plan.MaxChaptersPerDay = request.MaxChaptersPerDay;
        plan.RemoveAds = request.RemoveAds;

        await _context.SaveChangesAsync();

        return Ok(plan);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePlan(int id)
    {
        var plan = await _context.SubscriptionPlans.FindAsync(id);
        if (plan == null) return NotFound();

        _context.SubscriptionPlans.Remove(plan);
        await _context.SaveChangesAsync();

        return Ok(new { success = true, message = "Plan deleted successfully." });
    }
}
