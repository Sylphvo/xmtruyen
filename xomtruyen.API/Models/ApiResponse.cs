namespace XomTruyen.API.Models;

public record ApiResponse<T>(bool Success, string Message, T? Data)
{
    public static ApiResponse<T> Ok(T data, string message = "Success")
    {
        return new ApiResponse<T>(true, message, data);
    }

    public static ApiResponse<T> Error(string message)
    {
        return new ApiResponse<T>(false, message, default);
    }
}
