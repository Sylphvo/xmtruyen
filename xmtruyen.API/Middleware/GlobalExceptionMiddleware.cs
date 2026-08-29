using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Text.Json;
using System.Threading.Tasks;
using Xmtruyen.API.Data;
using Xmtruyen.API.Models;
using Microsoft.Extensions.DependencyInjection;

namespace Xmtruyen.API.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception: {Path}", context.Request.Path);

            // We need to resolve DbContext from the current scope since Middleware is singleton/scoped differently
            using var scope = context.RequestServices.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            var errorLog = new ErrorLog
            {
                Id = Guid.NewGuid(),
                Severity = "high",
                Category = "SERVER_EXCEPTION",
                Message = ex.Message,
                StackTrace = ex.StackTrace ?? "",
                Endpoint = $"{context.Request.Method} {context.Request.Path}",
                StatusCode = 500,
                UserId = context.User?.FindFirst("sub")?.Value ?? context.User?.FindFirst("nameid")?.Value ?? "",
                IpAddress = context.Connection.RemoteIpAddress?.ToString() ?? "",
                UserAgent = context.Request.Headers["User-Agent"].ToString(),
                CreatedAt = DateTime.UtcNow
            };
            
            try 
            {
                db.ErrorLogs.Add(errorLog);
                await db.SaveChangesAsync();
            }
            catch (Exception dbEx) 
            {
                // Fallback log if DB fails, do not throw
                _logger.LogError(dbEx, "Failed to save ErrorLog to Database.");
            }

            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/json";
            
            var response = new
            {
                success = false,
                message = Xmtruyen.API.Helpers.ExceptionHelper.GetFriendlyMessage(ex),
                errorId = errorLog.Id,
                timestamp = errorLog.CreatedAt
            };
            
            var json = JsonSerializer.Serialize(response);
            await context.Response.WriteAsync(json);
        }
    }
}
