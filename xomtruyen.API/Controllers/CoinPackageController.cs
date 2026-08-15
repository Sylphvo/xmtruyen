using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using XomTruyen.API.Models;

namespace XomTruyen.API.Controllers;

[ApiController]
public class CoinPackageController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CoinPackageController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("api/coin-packages")]
    public async Task<IActionResult> GetActivePackages()
    {
        var packages = await _context.CoinPackages
            .Where(p => p.IsActive)
            .OrderBy(p => p.OrderIndex)
            .ToListAsync();
        return Ok(packages);
    }

    [HttpGet("api/admin/coin-packages")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllPackages()
    {
        var packages = await _context.CoinPackages
            .OrderBy(p => p.OrderIndex)
            .ToListAsync();
        return Ok(packages);
    }

    [HttpPost("api/admin/coin-packages")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreatePackage([FromBody] CoinPackage package)
    {
        package.Id = Guid.NewGuid();
        package.CreatedAt = DateTime.UtcNow;
        _context.CoinPackages.Add(package);
        await _context.SaveChangesAsync();
        return Ok(package);
    }

    [HttpPut("api/admin/coin-packages/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdatePackage(Guid id, [FromBody] CoinPackage packageUpdate)
    {
        var package = await _context.CoinPackages.FindAsync(id);
        if (package == null) return NotFound();

        package.Name = packageUpdate.Name;
        package.CoinAmount = packageUpdate.CoinAmount;
        package.BonusCoins = packageUpdate.BonusCoins;
        package.PriceVND = packageUpdate.PriceVND;
        package.IsPopular = packageUpdate.IsPopular;
        package.IsActive = packageUpdate.IsActive;
        package.OrderIndex = packageUpdate.OrderIndex;

        await _context.SaveChangesAsync();
        return Ok(package);
    }

    [HttpDelete("api/admin/coin-packages/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeletePackage(Guid id)
    {
        var package = await _context.CoinPackages.FindAsync(id);
        if (package == null) return NotFound();

        _context.CoinPackages.Remove(package);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Deleted" });
    }
}
