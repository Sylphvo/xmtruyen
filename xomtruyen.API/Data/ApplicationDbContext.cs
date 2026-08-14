using Microsoft.EntityFrameworkCore;
using XomTruyen.API.Models;

namespace XomTruyen.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<SubscriptionPlan> SubscriptionPlans { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Topic> Topics { get; set; }
    public DbSet<Publication> Publications { get; set; }
    public DbSet<PublicationCategory> PublicationCategories { get; set; }
    public DbSet<PublicationTopic> PublicationTopics { get; set; }
    public DbSet<BookChapter> BookChapters { get; set; }
    public DbSet<ComicChapter> ComicChapters { get; set; }
    public DbSet<ComicPage> ComicPages { get; set; }
    public DbSet<Bookmark> Bookmarks { get; set; }
    public DbSet<UserPurchasedChapter> UserPurchasedChapters { get; set; }
    public DbSet<ReadingHistory> ReadingHistories { get; set; }
    public DbSet<UserFavorite> UserFavorites { get; set; }
    public DbSet<UserPublication> UserPublications { get; set; }
    public DbSet<Note> Notes { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<UserToken> UserTokens { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // SubscriptionPlan
        modelBuilder.Entity<SubscriptionPlan>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            
            // Seed Data
            entity.HasData(
                new SubscriptionPlan { Id = 1, Name = "Free", Price = 0, DurationDays = 3650, IsUnlimited = false, MaxChaptersPerDay = 10, RemoveAds = false },
                new SubscriptionPlan { Id = 2, Name = "Basic", Price = 29000, DurationDays = 30, IsUnlimited = false, MaxChaptersPerDay = 30, RemoveAds = false },
                new SubscriptionPlan { Id = 3, Name = "VIP", Price = 59000, DurationDays = 30, IsUnlimited = true, MaxChaptersPerDay = null, RemoveAds = true }
            );
        });

        // User
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.PasswordHash).HasMaxLength(255);
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.Provider).HasMaxLength(50);
            entity.Property(e => e.ProviderId).HasMaxLength(255);
            
            entity.HasOne(e => e.CurrentPlan)
                  .WithMany()
                  .HasForeignKey(e => e.CurrentPlanId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // Category
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Slug).HasMaxLength(150).IsRequired();
        });

        // Topic
        modelBuilder.Entity<Topic>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Slug).HasMaxLength(150).IsRequired();
        });

        // Publication
        modelBuilder.Entity<Publication>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).HasMaxLength(255).IsRequired();
            entity.Property(e => e.Slug).HasMaxLength(255).IsRequired();
            entity.Property(e => e.Author).HasMaxLength(150);
            entity.Property(e => e.AverageRating).HasColumnType("decimal(3,2)");
            entity.Property(e => e.Status).HasMaxLength(50).HasDefaultValue("Active");
            
            entity.HasOne(e => e.Owner)
                  .WithMany()
                  .HasForeignKey(e => e.OwnerId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // PublicationCategory
        modelBuilder.Entity<PublicationCategory>(entity =>
        {
            entity.HasKey(e => new { e.PublicationId, e.CategoryId });
            
            entity.HasOne(e => e.Publication)
                  .WithMany(p => p.PublicationCategories)
                  .HasForeignKey(e => e.PublicationId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(e => e.Category)
                  .WithMany()
                  .HasForeignKey(e => e.CategoryId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // PublicationTopic
        modelBuilder.Entity<PublicationTopic>(entity =>
        {
            entity.HasKey(e => new { e.PublicationId, e.TopicId });
            
            entity.HasOne(e => e.Publication)
                  .WithMany(p => p.PublicationTopics)
                  .HasForeignKey(e => e.PublicationId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(e => e.Topic)
                  .WithMany()
                  .HasForeignKey(e => e.TopicId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // BookChapter
        modelBuilder.Entity<BookChapter>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).HasMaxLength(255);
            
            entity.HasOne(e => e.Publication)
                  .WithMany(p => p.BookChapters)
                  .HasForeignKey(e => e.PublicationId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ComicChapter
        modelBuilder.Entity<ComicChapter>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).HasMaxLength(255);
            
            entity.HasOne(e => e.Publication)
                  .WithMany(p => p.ComicChapters)
                  .HasForeignKey(e => e.PublicationId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ComicPage
        modelBuilder.Entity<ComicPage>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.HasOne(e => e.ComicChapter)
                  .WithMany(c => c.Pages)
                  .HasForeignKey(e => e.ComicChapterId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Bookmark
        modelBuilder.Entity<Bookmark>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // UserPurchasedChapter
        modelBuilder.Entity<UserPurchasedChapter>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ReadingHistory
        modelBuilder.Entity<ReadingHistory>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.PublicationId });
            
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(e => e.Publication)
                  .WithMany()
                  .HasForeignKey(e => e.PublicationId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // UserFavorite
        modelBuilder.Entity<UserFavorite>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.PublicationId });
            
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(e => e.Publication)
                  .WithMany()
                  .HasForeignKey(e => e.PublicationId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // UserPublication
        modelBuilder.Entity<UserPublication>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.PublicationId });
            
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(e => e.Publication)
                  .WithMany()
                  .HasForeignKey(e => e.PublicationId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Note
        modelBuilder.Entity<Note>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Review
        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(e => e.Publication)
                  .WithMany()
                  .HasForeignKey(e => e.PublicationId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Transaction
        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TransactionType).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Status).HasMaxLength(50).IsRequired();
            entity.Property(e => e.PaymentMethod).HasMaxLength(50);
            entity.Property(e => e.ExternalTransactionId).HasMaxLength(255);
            entity.Property(e => e.Note).HasMaxLength(500);
            
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(e => e.SubscriptionPlan)
                  .WithMany()
                  .HasForeignKey(e => e.SubscriptionPlanId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // UserToken
        modelBuilder.Entity<UserToken>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Token).HasMaxLength(500).IsRequired();
            entity.Property(e => e.TokenType).HasMaxLength(50).IsRequired();

            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
