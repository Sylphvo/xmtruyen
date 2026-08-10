using XomTruyen.API.Contracts.Responses;

namespace XomTruyen.API.Services.Interfaces;

public interface ISystemService
{
    Task<DatabaseCheckResponse> CheckDatabaseAsync(CancellationToken cancellationToken = default);
}


