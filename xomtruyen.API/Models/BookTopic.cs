namespace XomTruyen.API.Models;

public class BookTopic
{
    public Guid BookId { get; set; }
    public Book Book { get; set; } = null!;
    
    public int TopicId { get; set; }
    public Topic Topic { get; set; } = null!;
}
