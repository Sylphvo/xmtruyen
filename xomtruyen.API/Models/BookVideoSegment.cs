using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XomTruyen.API.Models
{
    public class BookVideoSegment
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid TaskId { get; set; }

        [ForeignKey("TaskId")]
        public BookVideoTask Task { get; set; }

        public int OrderIndex { get; set; }

        [Required]
        public string TextContent { get; set; }

        public string SceneDescription { get; set; }

        public string ImageUrl { get; set; }

        public string AudioUrl { get; set; }

        public double? AudioDurationSeconds { get; set; }

        public string SubtitleText { get; set; }

        [MaxLength(20)]
        public string Status { get; set; } = "Pending"; // Pending, ImageReady, AudioReady, Done
    }
}
