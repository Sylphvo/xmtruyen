namespace Xmtruyen.API.Models;

public class PublicationCategory
{
    public Guid PublicationId { get; set; }
    public Publication Publication { get; set; } = null!;
    
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
}
