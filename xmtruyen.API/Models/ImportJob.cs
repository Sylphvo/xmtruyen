using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Xmtruyen.API.Models;

public class ImportJob
{
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(255)]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string SourceType { get; set; } = "CSV"; // CSV, JSON, Paste, OCR

        [Required]
        public string Status { get; set; } = "Pending"; // Pending, Processing, Completed, Failed, Preview, Confirmed

        public string? ErrorReportUrl { get; set; }
        
        public int TotalRows { get; set; } = 0;
        public int ProcessedRows { get; set; } = 0;
        public int FailedRows { get; set; } = 0;

        public Guid CreatedByUserId { get; set; }
        [ForeignKey("CreatedByUserId")]
        public virtual User? CreatedByUser { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<NormalizedImportRow> Rows { get; set; } = new List<NormalizedImportRow>();
    }
