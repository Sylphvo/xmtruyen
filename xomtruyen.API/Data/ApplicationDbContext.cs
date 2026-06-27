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
    public DbSet<Book> Books { get; set; }
    public DbSet<BookCategory> BookCategories { get; set; }
    public DbSet<Chapter> Chapters { get; set; }
    public DbSet<ChapterImage> ChapterImages { get; set; }
    public DbSet<Bookmark> Bookmarks { get; set; }
    public DbSet<UserPurchasedChapter> UserPurchasedChapters { get; set; }
    public DbSet<ReadingHistory> ReadingHistories { get; set; }
    public DbSet<UserFavorite> UserFavorites { get; set; }
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

        // Book
        modelBuilder.Entity<Book>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).HasMaxLength(255).IsRequired();
            entity.Property(e => e.Slug).HasMaxLength(255).IsRequired();
            entity.Property(e => e.Author).HasMaxLength(150);
            entity.Property(e => e.AverageRating).HasColumnType("decimal(3,2)");
        });

        // BookCategory
        modelBuilder.Entity<BookCategory>(entity =>
        {
            entity.HasKey(e => new { e.BookId, e.CategoryId });
            
            entity.HasOne(e => e.Book)
                  .WithMany(b => b.BookCategories)
                  .HasForeignKey(e => e.BookId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(e => e.Category)
                  .WithMany()
                  .HasForeignKey(e => e.CategoryId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Chapter
        modelBuilder.Entity<Chapter>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).HasMaxLength(255);
            entity.Property(e => e.ImageUrls).HasColumnType("jsonb");
            
            entity.HasOne(e => e.Book)
                  .WithMany(b => b.Chapters)
                  .HasForeignKey(e => e.BookId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ChapterImage
        modelBuilder.Entity<ChapterImage>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.HasOne(e => e.Chapter)
                  .WithMany(c => c.Images)
                  .HasForeignKey(e => e.ChapterId)
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
                  
            entity.HasOne(e => e.Chapter)
                  .WithMany()
                  .HasForeignKey(e => e.ChapterId)
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
                  
            entity.HasOne(e => e.Chapter)
                  .WithMany()
                  .HasForeignKey(e => e.ChapterId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ReadingHistory
        modelBuilder.Entity<ReadingHistory>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.BookId });
            
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(e => e.Book)
                  .WithMany()
                  .HasForeignKey(e => e.BookId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(e => e.LastReadChapter)
                  .WithMany()
                  .HasForeignKey(e => e.LastReadChapterId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // UserFavorite
        modelBuilder.Entity<UserFavorite>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.BookId });
            
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
                  
            entity.HasOne(e => e.Book)
                  .WithMany()
                  .HasForeignKey(e => e.BookId)
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
                  
            entity.HasOne(e => e.Chapter)
                  .WithMany()
                  .HasForeignKey(e => e.ChapterId)
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
                  
            entity.HasOne(e => e.Book)
                  .WithMany()
                  .HasForeignKey(e => e.BookId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Transaction
        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.TransactionType).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Status).HasMaxLength(50).IsRequired();
            
            entity.HasOne(e => e.User)
                  .WithMany()
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
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
