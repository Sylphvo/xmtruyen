using System;

namespace Xmtruyen.API.Helpers;

public static class ExceptionHelper
{
    /// <summary>
    /// Parses an exception and returns a user-friendly error message, especially for database connection failures.
    /// </summary>
    public static string GetFriendlyMessage(this Exception ex)
    {
        if (ex == null) return "Lỗi không xác định.";

        var fullMessage = ex.ToString(); // Includes inner exceptions

        // Check for common PostgreSQL and Database connection errors
        if (fullMessage.Contains("Npgsql.PostgresException") || 
            fullMessage.Contains("3D000") || 
            fullMessage.Contains("08001") || 
            fullMessage.Contains("08006") ||
            fullMessage.Contains("28P01") ||
            fullMessage.Contains("SocketException") ||
            fullMessage.Contains("NpgsqlException") ||
            fullMessage.Contains("does not exist") ||
            fullMessage.Contains("Failed to connect"))
        {
            return "Kết nối đến database thất bại. Vui lòng thử lại sau.";
        }

        // Keep the original message for business logic exceptions
        // E.g. "Mật khẩu không đúng", "Email đã tồn tại", etc.
        return ex.Message;
    }
}
