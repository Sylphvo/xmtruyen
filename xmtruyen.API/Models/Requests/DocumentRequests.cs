using System.ComponentModel.DataAnnotations;
using Xmtruyen.API.Models.Enums;

namespace Xmtruyen.API.Models.Requests;

public class CreateDocumentRequest
{
    [Required]
    [MaxLength(100)]
    public string WorkspaceId { get; set; }

    [Required]
    [MaxLength(255)]
    public string Title { get; set; }

    [Required]
    [MaxLength(255)]
    public string Slug { get; set; }

    public DocumentType Type { get; set; }
    
    public string ContentMarkdown { get; set; }
}

public class UpdateDocumentRequest
{
    [Required]
    [MaxLength(255)]
    public string Title { get; set; }

    [Required]
    [MaxLength(255)]
    public string Slug { get; set; }

    public DocumentType Type { get; set; }
    
    public string ContentMarkdown { get; set; }
}

public class DocumentFilterRequest
{
    public string? WorkspaceId { get; set; }
    public string? Search { get; set; }
    public DocumentType? Type { get; set; }
    public DocumentStatus? Status { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string SortBy { get; set; } = "UpdatedAt";
    public bool SortDesc { get; set; } = true;
}
