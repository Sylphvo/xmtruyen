using System.Text.Json.Serialization;
using System.Collections.Generic;

namespace XomTruyen.API.Models.BookProcessing
{
    public class BookProcessingOptions
    {
        public bool ExtractToc { get; set; } = true;
        public bool GenerateThumbnails { get; set; } = true;
        public bool EnableEncryption { get; set; } = false;
    }

    public class BookProcessingTask
    {
        public string TaskId { get; set; } = string.Empty;
        public string PublicationId { get; set; } = string.Empty;
        public string? OwnerId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string SourceUrl { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public BookProcessingOptions Options { get; set; } = new BookProcessingOptions();
    }

    public class TocNode
    {
        public string Title { get; set; } = string.Empty;
        public int PageNumber { get; set; }
        public List<TocNode> Children { get; set; } = new List<TocNode>();
    }

    public class BookProcessingOutput
    {
        public string PdfUrl { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string PagesUrl { get; set; } = string.Empty;
        public int TotalPage { get; set; }
        public List<TocNode> Toc { get; set; } = new List<TocNode>();
    }

    public class BookProcessingResultMessage
    {
        public string TaskId { get; set; } = string.Empty;
        public string PublicationId { get; set; } = string.Empty;
        public string Status { get; set; } = "COMPLETED"; // or FAILED
        public string Message { get; set; } = string.Empty;
        public long ProcessingTimeMs { get; set; }
        public BookProcessingOutput Output { get; set; } = new BookProcessingOutput();
    }
}
