using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using XomTruyen.API.Models.Requests;
using XomTruyen.API.Services.Interfaces;

namespace XomTruyen.API.Controllers;

[Route("api/topics")]
// [Authorize(Roles = "Admin")] // Uncomment when roles are implemented
public class AdminTopicController : BaseApiController
{
    private readonly ITopicManagementService _topicService;

    public AdminTopicController(ITopicManagementService topicService)
    {
        _topicService = topicService;
    }

    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] TopicFilterRequest filter)
    {
        var (topics, totalCount) = await _topicService.GetTopicsAsync(filter);
        return Ok(new
        {
            Data = topics,
            TotalCount = totalCount,
            Page = filter.Page,
            PageSize = filter.PageSize
        });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var topic = await _topicService.GetTopicByIdAsync(id);
        if (topic == null) return NotFound(new { Message = "Topic not found" });
        return Ok(topic);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TopicRequest request)
    {
        try
        {
            var topic = await _topicService.CreateTopicAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = topic.Id }, topic);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] TopicRequest request)
    {
        try
        {
            await _topicService.UpdateTopicAsync(id, request);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _topicService.DeleteTopicAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }
}


