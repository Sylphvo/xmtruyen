using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XomTruyen.API.Models
{
    public class BookVideoTask
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid PublicationId { get; set; }
        
        [ForeignKey("PublicationId")]
        public Publication Publication { get; set; }

        /// <summary>
        /// JSON array of chapter IDs to include in the video
        /// </summary>
        [Required]
        public string ChapterIds { get; set; }

        [MaxLength(30)]
        public string ImageSource { get; set; } = "stable-diffusion";

        [MaxLength(50)]
        public string ArtStyle { get; set; }

        public int SegmentWordCount { get; set; } = 150;

        [Required]
        [MaxLength(10)]
        public string Language { get; set; }

        [Required]
        [MaxLength(100)]
        public string VoiceId { get; set; }

        [MaxLength(10)]
        public string SpeechRate { get; set; } = "+0%";

        public bool EnableMultiVoice { get; set; } = false;

        [MaxLength(10)]
        public string Resolution { get; set; } = "1080p";

        [MaxLength(20)]
        public string Transition { get; set; } = "kenburns";

        public bool AddSubtitles { get; set; } = true;

        public bool AddIntroOutro { get; set; } = true;

        public bool BgmEnabled { get; set; } = false;

        [MaxLength(50)]
        public string BgmGenre { get; set; }

        public double BgmVolume { get; set; } = 0.2;

        [MaxLength(20)]
        public string Status { get; set; } = "Queued"; // Queued, Processing, Completed, Failed

        public int ProgressPercent { get; set; } = 0;

        public string CurrentStep { get; set; }

        public string ErrorMessage { get; set; }

        public int TotalSegments { get; set; } = 0;

        public int CompletedSegments { get; set; } = 0;

        public string OutputVideoUrl { get; set; }

        public string OutputThumbnailUrl { get; set; }

        public double? OutputDurationSeconds { get; set; }

        public long? OutputFileSizeBytes { get; set; }

        public string OutputSubtitleUrl { get; set; }

        public Guid? CreatedBy { get; set; }
        
        [ForeignKey("CreatedBy")]
        public User Creator { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? CompletedAt { get; set; }

        // Navigation property
        public ICollection<BookVideoSegment> Segments { get; set; }
    }
}
