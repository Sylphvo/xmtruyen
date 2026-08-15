using System;
using System.Collections.Generic;

namespace XomTruyen.API.Models;

public class HomeSection
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = null!; // e.g. "Truyện Mới Cập Nhật", "Truyện Hot"
    public string? Description { get; set; }
    
    // Type determines how the section is rendered: 'Grid', 'Carousel', 'List', 'TopRanking'
    public string Type { get; set; } = "Grid"; 
    
    public bool IsActive { get; set; } = true;
    public int OrderIndex { get; set; } = 0;
    
    // Comma separated list of Publication IDs, or empty if it's an auto-generated section (e.g. latest updates)
    public string? PublicationIds { get; set; } 
    
    // If not manual list, define the query type: 'Latest', 'MostViewed', 'HighestRated'
    public string? QueryType { get; set; }
    public int ItemLimit { get; set; } = 10;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
