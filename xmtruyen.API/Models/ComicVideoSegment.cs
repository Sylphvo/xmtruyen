using System;

namespace Xmtruyen.API.Models
{
    public class ComicVideoSegment
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        
        public Guid TaskId { get; set; }
        public ComicVideoTask? Task { get; set; }

        public int OrderIndex { get; set; }
        
        // Input: Comic page image
        public string ImageUrl { get; set; } = string.Empty;
        
        // Text for TTS
        public string TextContent { get; set; } = string.Empty;
        
        // Output TTS Audio
        public string AudioUrl { get; set; } = string.Empty;
        public double? AudioDurationSeconds { get; set; }
        
        public string SubtitleText { get; set; } = string.Empty;
        
        public string Status { get; set; } = "Pending"; // Pending, TtsGenerated, Completed, Failed
    }
}
