using XomTruyen.API.Models.Enums;

namespace XomTruyen.API.Models.Responses;

public class DocumentResponse
{
    public int Id { get; set; }
    public string WorkspaceId { get; set; }
    public string Title { get; set; }
    public string Slug { get; set; }
    public string Type { get; set; }
    public string Status { get; set; }
    public string ContentMarkdown { get; set; }
    public Guid? OwnerId { get; set; }
    public string OwnerName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? PublishedAt { get; set; }
}
