using System;
using System.Collections.Generic;

namespace Xmtruyen.API.Models
{
    public class ComicVideoTask
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public Guid PublicationId { get; set; }
        public Publication? Publication { get; set; }

        public string ChapterIds { get; set; } = string.Empty; // JSON array of chapter GUIDs

        public string Language { get; set; } = "vi-VN";
        public string VoiceId { get; set; } = "vi-VN-HoaiMyNeural";
        public string SpeechRate { get; set; } = "+0%";
        public string Resolution { get; set; } = "1080p";
        public string Transition { get; set; } = "kenburns";
        public string NarrationSource { get; set; } = "text_chapter";
        
        public bool AddSubtitles { get; set; } = true;
        
        public string? BackgroundMusicUrl { get; set; }
        public double BackgroundMusicVolume { get; set; } = 0.3;

        // Status tracking
        public string Status { get; set; } = "Queued"; // Queued, Processing, Completed, Failed
        public int ProgressPercent { get; set; } = 0;
        public string CurrentStep { get; set; } = string.Empty;
        public string ErrorMessage { get; set; } = string.Empty;

        // Output
        public string OutputVideoUrl { get; set; } = string.Empty;
        public string OutputThumbnailUrl { get; set; } = string.Empty;
        public double? OutputDurationSeconds { get; set; }
        public long? OutputFileSizeBytes { get; set; }
        public string OutputSubtitleUrl { get; set; } = string.Empty;

        // Metadata
        public Guid? CreatedBy { get; set; }
        public User? Creator { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }

        public int TotalPages { get; set; } = 0;
        public int TotalAudioSegments { get; set; } = 0;

        public ICollection<ComicVideoSegment> Segments { get; set; } = new List<ComicVideoSegment>();
    }
}
