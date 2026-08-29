using Xmtruyen.API.Contracts.Responses;

namespace Xmtruyen.API.Services.Interfaces;

public interface ISystemService
{
    Task<DatabaseCheckResponse> CheckDatabaseAsync(CancellationToken cancellationToken = default);
}


