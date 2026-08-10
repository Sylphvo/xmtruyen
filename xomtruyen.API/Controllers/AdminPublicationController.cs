using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XomTruyen.API.Models.Enums;
using XomTruyen.API.Models.Requests;
using XomTruyen.API.Services.Interfaces;

namespace XomTruyen.API.Controllers;

[Route("api/Publications")]
[Route("api/books")]
// [Authorize(Roles = "Admin")] // Uncomment when roles are implemented
public class AdminPublicationController : BaseApiController
{
    private readonly IPublicationManagementService _publicationService;

    public AdminPublicationController(IPublicationManagementService publicationService)
    {
        _publicationService = publicationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] PublicationFilterRequest filter)
    {
        var (Publications, totalCount) = await _publicationService.GetPublicationsAsync(filter);
        return Ok(new
        {
            Data = Publications,
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize
        });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var Publication = await _publicationService.GetBookByIdAsync(id);
        if (Publication == null) return NotFound(new { Message = "Publication not found" });
        return Ok(Publication);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PublicationRequest request)
    {
        try
        {
            var Publication = await _publicationService.CreateBookAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = Publication.Id }, Publication);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] PublicationRequest request)
    {
        try
        {
            await _publicationService.UpdateBookAsync(id, request);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpPatch("{id}")]
    public async Task<IActionResult> PartialUpdate(Guid id, [FromBody] PublicationUpdateRequest request)
    {
        try
        {
            await _publicationService.PartialUpdateBookAsync(id, request);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _publicationService.DeleteBookAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
    }

    [HttpPatch("{id}/recommended")]
    public async Task<IActionResult> ToggleRecommended(Guid id, [FromBody] bool isRecommended)
    {
        try
        {
            await _publicationService.ToggleRecommendedAsync(id, isRecommended);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
    }

    [HttpPatch("{id}/exclusive")]
    public async Task<IActionResult> ToggleExclusive(Guid id, [FromBody] bool isExclusive)
    {
        try
        {
            await _publicationService.ToggleExclusiveAsync(id, isExclusive);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> ToggleStatus(Guid id, [FromBody] string status)
    {
        try
        {
            await _publicationService.ToggleStatusAsync(id, status);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
    }
}


