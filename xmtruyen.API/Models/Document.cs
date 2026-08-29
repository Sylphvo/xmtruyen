using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Xmtruyen.API.Models.Enums;

namespace Xmtruyen.API.Models;

public class Document
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string WorkspaceId { get; set; } // e.g. "books", "users"

    [Required]
    [MaxLength(255)]
    public string Title { get; set; }

    [Required]
    [MaxLength(255)]
    public string Slug { get; set; }

    public DocumentType Type { get; set; }
    
    public DocumentStatus Status { get; set; }

    public string ContentMarkdown { get; set; }

    public Guid? OwnerId { get; set; }

    [ForeignKey("OwnerId")]
    public User Owner { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
    
    public DateTime? PublishedAt { get; set; }
    
    public DateTime? ArchivedAt { get; set; }

    public bool IsDeleted { get; set; } = false;
    
    public DateTime? DeletedAt { get; set; }
}
