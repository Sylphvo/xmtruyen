using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Data;
using System.Text.Json;
using Dapper;

namespace XomTruyen.API.Controllers;

public class ColumnDefinition
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; 
    public bool IsPrimaryKey { get; set; }
    public bool IsNullable { get; set; } = true;
}

public class CreateTableRequest
{
    public string TableName { get; set; } = string.Empty;
    public List<ColumnDefinition> Columns { get; set; } = new();
}

public class ManagerDBController : BaseApiController
{
    private readonly ApplicationDbContext _context;

    public ManagerDBController(ApplicationDbContext context)
    {
        _context = context;
    }

    private async Task<string?> GetActualTableName(string tableName)
    {
        using var connection = _context.Database.GetDbConnection();
        var sql = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name ILIKE @TableName LIMIT 1";
        return await connection.QuerySingleOrDefaultAsync<string>(sql, new { TableName = tableName });
    }

    private async Task<string?> GetSinglePrimaryKeyColumn(string tableName)
    {
        using var connection = _context.Database.GetDbConnection();
        var sql = @"
            SELECT kcu.column_name
            FROM information_schema.table_constraints tco
            JOIN information_schema.key_column_usage kcu 
                 ON kcu.constraint_name = tco.constraint_name 
                 AND kcu.constraint_schema = tco.constraint_schema
            WHERE tco.constraint_type = 'PRIMARY KEY' 
              AND kcu.table_name = @TableName
            LIMIT 1";
        return await connection.QuerySingleOrDefaultAsync<string>(sql, new { TableName = tableName });
    }

    private async Task<object?> ParseId(string tableName, string id)
    {
        var pkCol = await GetSinglePrimaryKeyColumn(tableName);
        if (pkCol == null) return id;

        using var connection = _context.Database.GetDbConnection();
        var sql = "SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = @TableName AND column_name = @ColName LIMIT 1";
        var dataType = await connection.QuerySingleOrDefaultAsync<string>(sql, new { TableName = tableName, ColName = pkCol });

        if (dataType == null) return id;

        try
        {
            if (dataType == "integer") return int.Parse(id);
            if (dataType == "bigint") return long.Parse(id);
            if (dataType == "uuid") return Guid.Parse(id);
        }
        catch
        {
            return null;
        }
        return id;
    }

    [HttpGet("tables")]
    public async Task<IActionResult> GetTables()
    {
        using var connection = _context.Database.GetDbConnection();
        var sql = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' AND table_name != '__EFMigrationsHistory' ORDER BY table_name";
        var tables = await connection.QueryAsync<string>(sql);
        return Ok(tables);
    }

    [HttpGet("{tableName}/schema", Order = -1)]
    public async Task<IActionResult> GetTableSchema(string tableName)
    {
        var actualTableName = await GetActualTableName(tableName);
        if (actualTableName == null) return NotFound(new { message = $"Table {tableName} not found." });
        
        using var connection = _context.Database.GetDbConnection();
        
        var sqlCols = @"
            SELECT column_name AS Name, 
                   data_type AS Type, 
                   is_nullable = 'YES' AS IsNullable
            FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name = @TableName";
            
        var cols = (await connection.QueryAsync(sqlCols, new { TableName = actualTableName })).ToList();

        var pkSql = @"
            SELECT kcu.column_name
            FROM information_schema.table_constraints tco
            JOIN information_schema.key_column_usage kcu 
                 ON kcu.constraint_name = tco.constraint_name 
                 AND kcu.constraint_schema = tco.constraint_schema
            WHERE tco.constraint_type = 'PRIMARY KEY' 
              AND kcu.table_name = @TableName";
        var pks = (await connection.QueryAsync<string>(pkSql, new { TableName = actualTableName })).ToList();

        var fkSql = @"
            SELECT kcu.column_name
            FROM information_schema.table_constraints tco
            JOIN information_schema.key_column_usage kcu 
                 ON kcu.constraint_name = tco.constraint_name 
                 AND kcu.constraint_schema = tco.constraint_schema
            WHERE tco.constraint_type = 'FOREIGN KEY' 
              AND kcu.table_name = @TableName";
        var fks = (await connection.QueryAsync<string>(fkSql, new { TableName = actualTableName })).ToList();

        var result = cols.Select(c => new {
            Name = c.name,
            Type = c.type,
            IsPrimaryKey = pks.Contains((string)c.name),
            IsForeignKey = fks.Contains((string)c.name),
            IsNullable = c.isnullable
        });
        
        return Ok(result);
    }

    [HttpPost("schema/create-table")]
    public async Task<IActionResult> CreateTable([FromBody] CreateTableRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.TableName) || request.Columns == null || request.Columns.Count == 0)
            return BadRequest(new { message = "Invalid request payload." });

        if (!System.Text.RegularExpressions.Regex.IsMatch(request.TableName, @"^[a-zA-Z0-9_]+$"))
            return BadRequest(new { message = "Invalid table name format." });

        var columnDefs = new List<string>();
        foreach (var col in request.Columns)
        {
            if (!System.Text.RegularExpressions.Regex.IsMatch(col.Name, @"^[a-zA-Z0-9_]+$"))
                return BadRequest(new { message = $"Invalid column name format: {col.Name}" });

            var def = $"\"{col.Name}\" {col.Type}";
            if (col.IsPrimaryKey) def += " PRIMARY KEY";
            else if (!col.IsNullable) def += " NOT NULL";
            columnDefs.Add(def);
        }

        var sql = $"CREATE TABLE \"{request.TableName}\" ({string.Join(", ", columnDefs)});";

        using var connection = _context.Database.GetDbConnection();
        try
        {
            await connection.ExecuteAsync(sql);
            return Ok(new { message = $"Table {request.TableName} created successfully." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("schema/drop-table/{tableName}")]
    public async Task<IActionResult> DropTable(string tableName)
    {
        if (!System.Text.RegularExpressions.Regex.IsMatch(tableName, @"^[a-zA-Z0-9_]+$"))
            return BadRequest(new { message = "Invalid table name format." });

        var sql = $"DROP TABLE IF EXISTS \"{tableName}\" CASCADE;";
        using var connection = _context.Database.GetDbConnection();
        try
        {
            await connection.ExecuteAsync(sql);
            return Ok(new { message = $"Table {tableName} dropped successfully." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{tableName}")]
    public async Task<IActionResult> GetAll(string tableName, [FromQuery] int page = 1, [FromQuery] int pageSize = 100)
    {
        var actualTableName = await GetActualTableName(tableName);
        if (actualTableName == null) return NotFound(new { message = $"Table {tableName} not found." });

        var offset = (page - 1) * pageSize;
        var pkCol = await GetSinglePrimaryKeyColumn(actualTableName);
        
        var orderBy = pkCol != null ? $"ORDER BY \"{pkCol}\" DESC" : "";

        using var connection = _context.Database.GetDbConnection();
        var sql = $"SELECT * FROM \"{actualTableName}\" {orderBy} LIMIT @Limit OFFSET @Offset";
        var data = await connection.QueryAsync(sql, new { Limit = pageSize, Offset = offset });
        
        var countSql = $"SELECT COUNT(*) FROM \"{actualTableName}\"";
        var totalCount = await connection.ExecuteScalarAsync<long>(countSql);
        
        return Ok(new { data, total = totalCount, page, pageSize });
    }

    [HttpGet("{tableName}/{id}")]
    public async Task<IActionResult> GetById(string tableName, string id)
    {
        var actualTableName = await GetActualTableName(tableName);
        if (actualTableName == null) return NotFound(new { message = $"Table {tableName} not found." });

        var pkCol = await GetSinglePrimaryKeyColumn(actualTableName);
        if (pkCol == null) return BadRequest(new { message = "Table has no single primary key. Unsupported operation." });

        var typedId = await ParseId(actualTableName, id);
        if (typedId == null) return BadRequest(new { message = "Invalid ID format" });

        using var connection = _context.Database.GetDbConnection();
        var sql = $"SELECT * FROM \"{actualTableName}\" WHERE \"{pkCol}\" = @Id";
        var data = await connection.QuerySingleOrDefaultAsync(sql, new { Id = typedId });
        
        if (data == null) return NotFound();
        return Ok(data);
    }

    [HttpPost("{tableName}")]
    public async Task<IActionResult> Insert(string tableName, [FromBody] Dictionary<string, object> data)
    {
        var actualTableName = await GetActualTableName(tableName);
        if (actualTableName == null) return NotFound(new { message = $"Table {tableName} not found." });
        if (data == null || data.Count == 0) return BadRequest(new { message = "Data is empty" });

        var columns = string.Join(", ", data.Keys.Select(k => $"\"{k}\""));
        var parameters = string.Join(", ", data.Keys.Select(k => $"@{k}"));
        var sql = $"INSERT INTO \"{actualTableName}\" ({columns}) VALUES ({parameters}) RETURNING *";

        var paramDict = new DynamicParameters();
        foreach (var kvp in data)
        {
            paramDict.Add(kvp.Key, ParseJsonElement(kvp.Value));
        }

        using var connection = _context.Database.GetDbConnection();
        try
        {
            var result = await connection.QuerySingleOrDefaultAsync(sql, paramDict);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{tableName}/{id}")]
    public async Task<IActionResult> Update(string tableName, string id, [FromBody] Dictionary<string, object> data)
    {
        var actualTableName = await GetActualTableName(tableName);
        if (actualTableName == null) return NotFound(new { message = $"Table {tableName} not found." });
        if (data == null || data.Count == 0) return BadRequest(new { message = "Data is empty" });

        var pkCol = await GetSinglePrimaryKeyColumn(actualTableName);
        if (pkCol == null) return BadRequest(new { message = "Table has no single primary key. Unsupported operation." });

        var typedId = await ParseId(actualTableName, id);
        if (typedId == null) return BadRequest(new { message = "Invalid ID format" });

        var updateKeys = data.Keys.Where(k => !string.Equals(k, pkCol, StringComparison.OrdinalIgnoreCase)).ToList();
        if (updateKeys.Count == 0) return BadRequest(new { message = "No fields to update" });

        var setClause = string.Join(", ", updateKeys.Select(k => $"\"{k}\" = @{k}"));
        var sql = $"UPDATE \"{actualTableName}\" SET {setClause} WHERE \"{pkCol}\" = @Id RETURNING *";

        var paramDict = new DynamicParameters();
        paramDict.Add("Id", typedId);
        foreach (var key in updateKeys)
        {
            paramDict.Add(key, ParseJsonElement(data[key]));
        }

        using var connection = _context.Database.GetDbConnection();
        try
        {
            var result = await connection.QuerySingleOrDefaultAsync(sql, paramDict);
            if (result == null) return NotFound(new { message = "Record not found" });
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{tableName}/{id}")]
    public async Task<IActionResult> Delete(string tableName, string id)
    {
        var actualTableName = await GetActualTableName(tableName);
        if (actualTableName == null) return NotFound(new { message = $"Table {tableName} not found." });

        var pkCol = await GetSinglePrimaryKeyColumn(actualTableName);
        if (pkCol == null) return BadRequest(new { message = "Table has no single primary key. Unsupported operation." });

        var typedId = await ParseId(actualTableName, id);
        if (typedId == null) return BadRequest(new { message = "Invalid ID format" });

        var sql = $"DELETE FROM \"{actualTableName}\" WHERE \"{pkCol}\" = @Id RETURNING *";

        using var connection = _context.Database.GetDbConnection();
        try
        {
            var result = await connection.QuerySingleOrDefaultAsync(sql, new { Id = typedId });
            if (result == null) return NotFound(new { message = "Record not found" });
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    private object? ParseJsonElement(object? value)
    {
        if (value is JsonElement element)
        {
            switch (element.ValueKind)
            {
                case JsonValueKind.String: return element.GetString();
                case JsonValueKind.Number:
                    if (element.TryGetInt32(out int i)) return i;
                    if (element.TryGetInt64(out long l)) return l;
                    if (element.TryGetDouble(out double d)) return d;
                    return element.GetDecimal();
                case JsonValueKind.True: return true;
                case JsonValueKind.False: return false;
                case JsonValueKind.Null: return null;
                default: return element.ToString();
            }
        }
        return value;
    }
}
