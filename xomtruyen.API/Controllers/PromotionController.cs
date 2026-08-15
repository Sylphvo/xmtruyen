using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;

namespace XomTruyen.API.Controllers;

[ApiController]
public class PromotionController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PromotionController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("api/admin/promotions")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllPromotions()
    {
        var promotions = await _context.Promotions
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
        return Ok(promotions);
    }

    [HttpPost("api/admin/promotions")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreatePromotion([FromBody] Promotion promotion)
    {
        promotion.Id = Guid.NewGuid();
        promotion.CreatedAt = DateTime.UtcNow;
        promotion.UsedCount = 0;
        
        _context.Promotions.Add(promotion);
        await _context.SaveChangesAsync();
        
        return Ok(promotion);
    }
    
    [HttpPut("api/admin/promotions/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdatePromotion(Guid id, [FromBody] Promotion promotionUpdate)
    {
        var promotion = await _context.Promotions.FindAsync(id);
        if (promotion == null) return NotFound();

        promotion.Code = promotionUpdate.Code;
        promotion.Description = promotionUpdate.Description;
        promotion.DiscountPercent = promotionUpdate.DiscountPercent;
        promotion.MaxDiscountAmount = promotionUpdate.MaxDiscountAmount;
        promotion.MinPurchaseAmount = promotionUpdate.MinPurchaseAmount;
        promotion.ValidFrom = promotionUpdate.ValidFrom;
        promotion.ValidTo = promotionUpdate.ValidTo;
        promotion.UsageLimit = promotionUpdate.UsageLimit;
        promotion.IsActive = promotionUpdate.IsActive;

        await _context.SaveChangesAsync();
        return Ok(promotion);
    }

    [HttpDelete("api/admin/promotions/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeletePromotion(Guid id)
    {
        var promotion = await _context.Promotions.FindAsync(id);
        if (promotion == null) return NotFound();

        _context.Promotions.Remove(promotion);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Deleted" });
    }
}
