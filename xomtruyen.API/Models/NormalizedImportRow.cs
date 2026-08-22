using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XomTruyen.API.Models;

public class NormalizedImportRow
{
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid ImportJobId { get; set; }
        [ForeignKey("ImportJobId")]
        public virtual ImportJob? ImportJob { get; set; }

        public int RowIndex { get; set; }

        public string SchemaVersion { get; set; } = "1.0";
        public string EntityType { get; set; } = "Book"; // Book, Chapter, ComicPage
        
        [StringLength(255)]
        public string? ExternalId { get; set; }

        [StringLength(500)]
        public string? Title { get; set; }
        
        [StringLength(255)]
        public string? Author { get; set; }

        public string? Description { get; set; }
        public string? CategoryOrTopic { get; set; }
        
        [StringLength(50)]
        public string? Status { get; set; }
        
        public string? CoverImage { get; set; }
        public int? ChapterOrder { get; set; }
        
        [StringLength(50)]
        public string? Language { get; set; }
        
        [StringLength(100)]
        public string? DataSource { get; set; }

        public string? MetadataJson { get; set; }

        // AI / OCR Validation Tracking
        public float? ConfidenceScore { get; set; }
        public bool IsError { get; set; } = false;
        public string? ErrorMessage { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
