using System;
using System.ComponentModel.DataAnnotations;

namespace XomTruyen.API.Models;

public class ErrorLog
{
    [Key]
    public Guid Id { get; set; }
    
    [Required]
    public string Severity { get; set; } = null!; // critical, high, medium, low
    
    [Required]
    public string Category { get; set; } = null!; // REACT_CRASH, API_ERROR, SERVER_EXCEPTION, v.v.
    
    [Required]
    public string Message { get; set; } = null!;
    
    public string StackTrace { get; set; } = string.Empty;
    public string Endpoint { get; set; } = string.Empty;
    public int? StatusCode { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string IpAddress { get; set; } = string.Empty;
    public string UserAgent { get; set; } = string.Empty;
    
    // Front-end error tracking fields
    public string ComponentStack { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string RequestBody { get; set; } = string.Empty;
    public string ResponseBody { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
