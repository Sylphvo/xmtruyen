using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;

namespace XomTruyen.API.Controllers;

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
}
