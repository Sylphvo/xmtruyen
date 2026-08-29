namespace Xmtruyen.API.Models;

public class PublicationTopic
{
    public Guid PublicationId { get; set; }
    public Publication Publication { get; set; } = null!;
    
    public int TopicId { get; set; }
    public Topic Topic { get; set; } = null!;
}
