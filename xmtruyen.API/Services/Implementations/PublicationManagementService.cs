using Xmtruyen.API.Models;
using Xmtruyen.API.Models.Enums;
using Xmtruyen.API.Models.Requests;
using Xmtruyen.API.Models.Responses;
using Xmtruyen.API.Repositories.Interfaces;
using Xmtruyen.API.Services.Interfaces;
using Xmtruyen.API.Utils;

namespace Xmtruyen.API.Services.Implementations;

public class PublicationManagementService : IPublicationManagementService
{
    private readonly IPublicationRepository _publicationRepository;
    private readonly ICategoryRepository _categoryRepository;

    public PublicationManagementService(IPublicationRepository publicationRepository, ICategoryRepository categoryRepository)
    {
        _publicationRepository = publicationRepository;
        _categoryRepository = categoryRepository;
    }

    public async Task<Publication> CreateBookAsync(PublicationRequest request)
    {
        // Validate categories
        foreach (var catId in request.CategoryIds)
        {
            var cat = await _categoryRepository.GetByIdAsync(catId);
            if (cat == null) throw new ArgumentException($"Category with ID {catId} does not exist.");
        }

        var Publication = new Publication
        {
            Id = request.Id ?? Guid.NewGuid(),
            Title = request.Title,
            Slug = SlugHelper.GenerateSlugWithRandomSuffix(request.Title),
            AuthorName = request.Author,
            Description = request.Description,
            CoverImageUrl = request.CoverImageUrl,
            FormatType = request.FormatType,
            AccessLevel = request.AccessLevel,
            DisplayLabel = request.DisplayLabel,
            CreatedAt = DateTime.UtcNow,
            ViewCount = 0,
            AverageRating = 0
        };

        return await _publicationRepository.CreateAsync(Publication, request.CategoryIds, request.TopicIds);
    }

    public async Task UpdateBookAsync(Guid id, PublicationRequest request)
    {
        var Publication = await _publicationRepository.GetByIdAsync(id);
        if (Publication == null) throw new KeyNotFoundException("Publication not found");

        // Validate categories
        foreach (var catId in request.CategoryIds)
        {
            var cat = await _categoryRepository.GetByIdAsync(catId);
            if (cat == null) throw new ArgumentException($"Category with ID {catId} does not exist.");
        }

        Publication.Title = request.Title;
        Publication.AuthorName = request.Author;
        Publication.Description = request.Description;
        Publication.CoverImageUrl = request.CoverImageUrl;
        Publication.FormatType = request.FormatType;
        Publication.AccessLevel = request.AccessLevel;
        Publication.DisplayLabel = request.DisplayLabel;

        await _publicationRepository.UpdateAsync(Publication, request.CategoryIds, request.TopicIds);
    }

    public async Task PartialUpdateBookAsync(Guid id, PublicationUpdateRequest request)
    {
        var Publication = await _publicationRepository.GetByIdAsync(id);
        if (Publication == null) throw new KeyNotFoundException("Publication not found");

        if (request.Title != null) Publication.Title = request.Title;
        if (request.Author != null) Publication.AuthorName = request.Author;
        if (request.Description != null) Publication.Description = request.Description;
        if (request.CoverImageUrl != null) Publication.CoverImageUrl = request.CoverImageUrl;
        if (request.FormatType.HasValue) Publication.FormatType = request.FormatType.Value;
        if (request.AccessLevel.HasValue) Publication.AccessLevel = request.AccessLevel.Value;
        if (request.Status != null) Publication.Status = request.Status;

        var catIds = request.CategoryIds ?? Publication.PublicationCategories.Select(bc => bc.CategoryId).ToList();
        var topicIds = request.TopicIds ?? Publication.PublicationTopics.Select(bt => bt.TopicId).ToList();

        // Validate categories if they were updated
        if (request.CategoryIds != null)
        {
            foreach (var catId in request.CategoryIds)
            {
                var cat = await _categoryRepository.GetByIdAsync(catId);
                if (cat == null) throw new ArgumentException($"Category with ID {catId} does not exist.");
            }
        }

        await _publicationRepository.UpdateAsync(Publication, catIds, topicIds);
    }

    public async Task DeleteBookAsync(Guid id)
    {
        var Publication = await _publicationRepository.GetByIdAsync(id);
        if (Publication == null) throw new KeyNotFoundException("Publication not found");

        await _publicationRepository.DeleteAsync(Publication);
    }

    public async Task<Publication?> GetBookByIdAsync(Guid id)
    {
        return await _publicationRepository.GetByIdAsync(id);
    }

    public async Task<(IEnumerable<PublicationListResponse> Publications, int TotalCount)> GetPublicationsAsync(PublicationFilterRequest filter)
    {
        return await _publicationRepository.GetPublicationsAsync(filter);
    }

    public async Task ToggleRecommendedAsync(Guid id, bool isRecommended)
    {
        var Publication = await _publicationRepository.GetByIdAsync(id);
        if (Publication == null) throw new KeyNotFoundException("Publication not found");

        Publication.IsRecommended = isRecommended;
        
        var existingCategories = Publication.PublicationCategories.Select(bc => bc.CategoryId).ToList();
        var existingTopics = Publication.PublicationTopics.Select(bt => bt.TopicId).ToList();
        await _publicationRepository.UpdateAsync(Publication, existingCategories, existingTopics);
    }

    public async Task ToggleExclusiveAsync(Guid id, bool isExclusive)
    {
        var Publication = await _publicationRepository.GetByIdAsync(id);
        if (Publication == null) throw new KeyNotFoundException("Publication not found");

        Publication.IsExclusive = isExclusive;
        
        var existingCategories = Publication.PublicationCategories.Select(bc => bc.CategoryId).ToList();
        var existingTopics = Publication.PublicationTopics.Select(bt => bt.TopicId).ToList();
        await _publicationRepository.UpdateAsync(Publication, existingCategories, existingTopics);
    }

    public async Task ToggleStatusAsync(Guid id, string status)
    {
        var Publication = await _publicationRepository.GetByIdAsync(id);
        if (Publication == null) throw new KeyNotFoundException("Publication not found");

        Publication.Status = status;
        
        var existingCategories = Publication.PublicationCategories.Select(bc => bc.CategoryId).ToList();
        var existingTopics = Publication.PublicationTopics.Select(bt => bt.TopicId).ToList();
        await _publicationRepository.UpdateAsync(Publication, existingCategories, existingTopics);
    }
}


