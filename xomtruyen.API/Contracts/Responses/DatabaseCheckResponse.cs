namespace XomTruyen.API.Contracts.Responses;

public class DatabaseCheckResponse
{
    public bool IsConnected { get; set; }
    public string Message { get; set; } = string.Empty;
}
