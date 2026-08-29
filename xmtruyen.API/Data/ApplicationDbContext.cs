using Microsoft.EntityFrameworkCore;
using Xmtruyen.API.Models;

namespace Xmtruyen.API.Data;

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
    public DbSet<ReaderPreference> ReaderPreferences { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<UserToken> UserTokens { get; set; }
    public DbSet<CoinPackage> CoinPackages { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Course> Courses { get; set; }
    public DbSet<CourseSection> CourseSections { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<LessonVideo> LessonVideos { get; set; }
    public DbSet<LessonProgress> LessonProgresses { get; set; }
    public DbSet<CourseEnrollment> CourseEnrollments { get; set; }
    public DbSet<CoursePayment> CoursePayments { get; set; }
    public DbSet<Promotion> Promotions { get; set; }
    public DbSet<UserPromotionUsage> UserPromotionUsages { get; set; }
    public DbSet<CrawlJob> CrawlJobs { get; set; }
    public DbSet<TranslationJob> TranslationJobs { get; set; }
    public DbSet<TranslationChapter> TranslationChapters { get; set; }
    public DbSet<TranslationPage> TranslationPages { get; set; }
    public DbSet<TextBlock> TextBlocks { get; set; }
    public DbSet<TranslationGlossary> TranslationGlossaries { get; set; }
    public DbSet<Banner> Banners { get; set; }
    public DbSet<HomeSection> HomeSections { get; set; }
    public DbSet<Author> Authors { get; set; }
    public DbSet<Report> Reports { get; set; }
    public DbSet<SystemConfig> SystemConfigs { get; set; }
    public DbSet<ReadingAnalytic> ReadingAnalytics { get; set; }
    public DbSet<EmailTemplate> EmailTemplates { get; set; }
    public DbSet<HelpArticle> HelpArticles { get; set; }
    public DbSet<ErrorLog> ErrorLogs { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<Permission> Permissions { get; set; }
    public DbSet<RolePermission> RolePermissions { get; set; }
    public DbSet<RoleAuditLog> RoleAuditLogs { get; set; }
    
    // Import Pipeline
    public DbSet<ImportJob> ImportJobs { get; set; }
    public DbSet<NormalizedImportRow> NormalizedImportRows { get; set; }

    // CMS / Static Content
    public DbSet<StaticPage> StaticPages { get; set; }
    public DbSet<FaqItem> FaqItems { get; set; }

    // Audiobook Pipeline
    public DbSet<AudioChapter> AudioChapters { get; set; }
    public DbSet<AudioJob> AudioJobs { get; set; }
    public DbSet<AudioSegment> AudioSegments { get; set; }
    public DbSet<VoiceProfile> VoiceProfiles { get; set; }
    public DbSet<CharacterVoiceMapping> CharacterVoiceMappings { get; set; }
    public DbSet<AudioSfx> AudioSfxLibrary { get; set; }

    // Book to Video Pipeline
    public DbSet<BookVideoTask> BookVideoTasks { get; set; }
    public DbSet<BookVideoSegment> BookVideoSegments { get; set; }

    // Comic to Video Pipeline
    public DbSet<ComicVideoTask> ComicVideoTasks { get; set; }
    public DbSet<ComicVideoSegment> ComicVideoSegments { get; set; }

    // Docs
    public DbSet<Document> Documents { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .Property(u => u.ShortId)
            .HasMaxLength(16)
            .IsRequired();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.ShortId)
            .IsUnique();

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

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(50).IsRequired();
            entity.HasIndex(e => e.Name).IsUnique();
            entity.Property(e => e.DisplayName).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Color).HasMaxLength(20);
            var staticDate = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            entity.HasData(
                new Role { Id = 1, Name = "SuperAdmin", DisplayName = "Quản trị viên", Level = 100, Color = "#ff4444", CreatedAt = staticDate },
                new Role { Id = 2, Name = "Editor", DisplayName = "Biên tập viên", Level = 50, Color = "#ff9800", CreatedAt = staticDate },
                new Role { Id = 3, Name = "Translator", DisplayName = "Dịch giả", Level = 30, Color = "#9c27b0", CreatedAt = staticDate },
                new Role { Id = 4, Name = "Moderator", DisplayName = "Quản lý viên", Level = 40, Color = "#2196f3", CreatedAt = staticDate },
                new Role { Id = 5, Name = "Author", DisplayName = "Tác giả", Level = 20, Color = "#4caf50", CreatedAt = staticDate },
                new Role { Id = 6, Name = "User", DisplayName = "Người dùng", Level = 10, Color = "#607d8b", CreatedAt = staticDate });
        });

        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.RoleId });
            entity.HasOne(e => e.User).WithMany(u => u.UserRoles).HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Role).WithMany(r => r.UserRoles).HasForeignKey(e => e.RoleId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Permission>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasMaxLength(100);
            entity.Property(e => e.Module).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Action).HasMaxLength(50).IsRequired();
            entity.Property(e => e.DisplayName).HasMaxLength(200).IsRequired();
            entity.HasData(
                new Permission { Id = "publications.create", Module = "publications", Action = "create", DisplayName = "Tạo sách mới" },
                new Permission { Id = "publications.read", Module = "publications", Action = "read", DisplayName = "Xem danh sách sách" },
                new Permission { Id = "publications.update", Module = "publications", Action = "update", DisplayName = "Sửa thông tin sách" },
                new Permission { Id = "publications.delete", Module = "publications", Action = "delete", DisplayName = "Xóa sách" },
                new Permission { Id = "publications.publish", Module = "publications", Action = "publish", DisplayName = "Publish/Unpublish sách" },
                new Permission { Id = "chapters.create", Module = "chapters", Action = "create", DisplayName = "Tạo chương mới" },
                new Permission { Id = "chapters.update", Module = "chapters", Action = "update", DisplayName = "Sửa chương" },
                new Permission { Id = "chapters.delete", Module = "chapters", Action = "delete", DisplayName = "Xóa chương" },
                new Permission { Id = "users.read", Module = "users", Action = "read", DisplayName = "Xem danh sách users" },
                new Permission { Id = "users.create", Module = "users", Action = "create", DisplayName = "Tạo user mới" },
                new Permission { Id = "users.update", Module = "users", Action = "update", DisplayName = "Sửa thông tin user" },
                new Permission { Id = "users.ban", Module = "users", Action = "ban", DisplayName = "Ban/Unban user" },
                new Permission { Id = "users.assign_role", Module = "users", Action = "assign_role", DisplayName = "Gán/Gỡ role cho user" },
                new Permission { Id = "transactions.read", Module = "transactions", Action = "read", DisplayName = "Xem giao dịch" },
                new Permission { Id = "transactions.topup", Module = "transactions", Action = "topup", DisplayName = "Nạp xu thủ công" },
                new Permission { Id = "transactions.approve", Module = "transactions", Action = "approve", DisplayName = "Duyệt giao dịch" },
                new Permission { Id = "translation.create_job", Module = "translation", Action = "create_job", DisplayName = "Tạo translation job" },
                new Permission { Id = "translation.review", Module = "translation", Action = "review", DisplayName = "Review bản dịch" },
                new Permission { Id = "translation.approve", Module = "translation", Action = "approve", DisplayName = "Approve/Reject translation" },
                new Permission { Id = "translation.publish", Module = "translation", Action = "publish", DisplayName = "Publish translated chapter" },
                new Permission { Id = "translation.glossary", Module = "translation", Action = "glossary", DisplayName = "Quản lý glossary" },
                new Permission { Id = "crawler.manage", Module = "crawler", Action = "manage", DisplayName = "Quản lý crawl sources" },
                new Permission { Id = "crawler.trigger", Module = "crawler", Action = "trigger", DisplayName = "Trigger manual crawl" },
                new Permission { Id = "audio.create", Module = "audio", Action = "create", DisplayName = "Tạo audio job" },
                new Permission { Id = "audio.publish", Module = "audio", Action = "publish", DisplayName = "Publish audio chapter" },
                new Permission { Id = "moderation.reviews", Module = "moderation", Action = "reviews", DisplayName = "Quản lý reviews" },
                new Permission { Id = "moderation.reports", Module = "moderation", Action = "reports", DisplayName = "Xử lý reports" },
                new Permission { Id = "moderation.notifications", Module = "moderation", Action = "notifications", DisplayName = "Gửi notifications" },
                new Permission { Id = "system.database", Module = "system", Action = "database", DisplayName = "Quản lý database" },
                new Permission { Id = "system.config", Module = "system", Action = "config", DisplayName = "Thay đổi system config" },
                new Permission { Id = "system.audit_log", Module = "system", Action = "audit_log", DisplayName = "Xem audit logs" });
        });

        modelBuilder.Entity<RolePermission>(entity =>
        {
            entity.HasKey(e => new { e.RoleId, e.PermissionId });
            entity.HasOne(e => e.Role).WithMany(r => r.RolePermissions).HasForeignKey(e => e.RoleId).OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Permission).WithMany(p => p.RolePermissions).HasForeignKey(e => e.PermissionId).OnDelete(DeleteBehavior.Cascade);
            entity.HasData(
                new RolePermission { RoleId = 2, PermissionId = "publications.create" },
                new RolePermission { RoleId = 2, PermissionId = "publications.read" },
                new RolePermission { RoleId = 2, PermissionId = "publications.update" },
                new RolePermission { RoleId = 2, PermissionId = "publications.delete" },
                new RolePermission { RoleId = 2, PermissionId = "publications.publish" },
                new RolePermission { RoleId = 2, PermissionId = "chapters.create" },
                new RolePermission { RoleId = 2, PermissionId = "chapters.update" },
                new RolePermission { RoleId = 2, PermissionId = "chapters.delete" },
                new RolePermission { RoleId = 2, PermissionId = "translation.create_job" },
                new RolePermission { RoleId = 2, PermissionId = "translation.review" },
                new RolePermission { RoleId = 2, PermissionId = "translation.approve" },
                new RolePermission { RoleId = 2, PermissionId = "translation.publish" },
                new RolePermission { RoleId = 2, PermissionId = "translation.glossary" },
                new RolePermission { RoleId = 2, PermissionId = "crawler.manage" },
                new RolePermission { RoleId = 2, PermissionId = "crawler.trigger" },
                new RolePermission { RoleId = 2, PermissionId = "audio.create" },
                new RolePermission { RoleId = 2, PermissionId = "audio.publish" },
                new RolePermission { RoleId = 2, PermissionId = "moderation.notifications" },
                new RolePermission { RoleId = 3, PermissionId = "translation.review" },
                new RolePermission { RoleId = 3, PermissionId = "translation.approve" },
                new RolePermission { RoleId = 3, PermissionId = "translation.glossary" },
                new RolePermission { RoleId = 4, PermissionId = "users.read" },
                new RolePermission { RoleId = 4, PermissionId = "users.ban" },
                new RolePermission { RoleId = 4, PermissionId = "moderation.reviews" },
                new RolePermission { RoleId = 4, PermissionId = "moderation.reports" },
                new RolePermission { RoleId = 4, PermissionId = "moderation.notifications" });
        });

        modelBuilder.Entity<RoleAuditLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Action).HasMaxLength(50).IsRequired();
            entity.Property(e => e.Reason).HasMaxLength(1000);
            entity.HasIndex(e => new { e.UserId, e.CreatedAt });
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
            entity.Property(e => e.AuthorName).HasMaxLength(150);
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

        // ReaderPreference
        modelBuilder.Entity<ReaderPreference>(entity =>
        {
            entity.HasKey(e => e.UserId);
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

        modelBuilder.Entity<SystemConfig>(entity =>
        {
            entity.HasKey(e => e.Key);
        });

        modelBuilder.Entity<EmailTemplate>(entity =>
        {
            entity.HasKey(e => e.Code);
        });
        
        modelBuilder.Entity<HelpArticle>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Slug).IsUnique();
        });

        // Audiobook Pipeline
        modelBuilder.Entity<AudioChapter>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.PublicationId, e.ChapterNumber });
        });

        modelBuilder.Entity<AudioJob>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.PublicationId);
            entity.HasIndex(e => e.Status);
        });

        modelBuilder.Entity<AudioSegment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.JobId, e.OrderIndex });
        });

        modelBuilder.Entity<VoiceProfile>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.HasData(
                new VoiceProfile { Id = "narrator_male", DisplayName = "Người kể (Nam)", VoiceType = "narrator", Gender = "male", TtsProvider = "edge_tts", TtsVoiceId = "vi-VN-NamMinhNeural", IsActive = true },
                new VoiceProfile { Id = "narrator_female", DisplayName = "Người kể (Nữ)", VoiceType = "narrator", Gender = "female", TtsProvider = "edge_tts", TtsVoiceId = "vi-VN-HoaiMyNeural", IsActive = true },
                new VoiceProfile { Id = "male_hero", DisplayName = "Nam chính (Trẻ)", VoiceType = "character", Gender = "male", TtsProvider = "edge_tts", TtsVoiceId = "vi-VN-NamMinhNeural", IsActive = true },
                new VoiceProfile { Id = "female_lead", DisplayName = "Nữ chính", VoiceType = "character", Gender = "female", TtsProvider = "edge_tts", TtsVoiceId = "vi-VN-HoaiMyNeural", IsActive = true }
            );
        });

        modelBuilder.Entity<CharacterVoiceMapping>(entity =>
        {
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<AudioSfx>(entity =>
        {
            entity.HasKey(e => e.Id);
        });

        // Import Pipeline
        modelBuilder.Entity<ImportJob>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.SourceType);
        });

        // CMS
        modelBuilder.Entity<StaticPage>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Slug).IsUnique();
        });

        modelBuilder.Entity<FaqItem>(entity =>
        {
            entity.HasKey(e => e.Id);
        });

        modelBuilder.Entity<NormalizedImportRow>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.ImportJobId, e.RowIndex });
            entity.HasIndex(e => e.Status);
        });

        // Document
        modelBuilder.Entity<Document>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.WorkspaceId);
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => e.Type);
            entity.HasIndex(e => e.UpdatedAt);
            entity.HasIndex(e => e.Title);
            
            entity.Property(e => e.Status).HasConversion<string>();
            entity.Property(e => e.Type).HasConversion<string>();
        });
    }
}
