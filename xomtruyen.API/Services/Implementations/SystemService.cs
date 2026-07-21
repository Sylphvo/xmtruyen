using XomTruyen.API.Contracts.Responses;
using XomTruyen.API.Repositories.Interfaces;
using XomTruyen.API.Services.Interfaces;

namespace XomTruyen.API.Services.Implementations;

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


