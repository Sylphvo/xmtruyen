namespace XomTruyen.API.Models;

public class BookCategory
{
    public Guid BookId { get; set; }
    public Book Book { get; set; } = null!;
    
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
}
