namespace XomTruyen.API.Repositories.Interfaces;

public interface ISystemRepository
{
    Task<bool> CheckDatabaseConnectionAsync(CancellationToken cancellationToken = default);
}


