using Xmtruyen.API.Contracts.Responses;
using Xmtruyen.API.Repositories.Interfaces;
using Xmtruyen.API.Services.Interfaces;

namespace Xmtruyen.API.Services.Implementations;

public class SystemService : ISystemService
{
    private readonly ISystemRepository _systemRepository;

    public SystemService(ISystemRepository systemRepository)
    {
        _systemRepository = systemRepository;
    }

    public async Task<DatabaseCheckResponse> CheckDatabaseAsync(CancellationToken cancellationToken = default)
    {
        var isConnected = await _systemRepository.CheckDatabaseConnectionAsync(cancellationToken);
        
        return new DatabaseCheckResponse
        {
            IsConnected = isConnected,
            Message = isConnected ? "Database is connected successfully." : "Failed to connect to the database."
        };
    }
}


