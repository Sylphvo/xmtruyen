using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Scalar.AspNetCore;
using Xmtruyen.API.Data;
using Xmtruyen.API.Repositories.Interfaces;
using Xmtruyen.API.Repositories.Implementations;
using Xmtruyen.API.Services.Interfaces;
using Xmtruyen.API.Services.Implementations;
using Xmtruyen.API.Services.Background;
using Xmtruyen.API.Services;
using Xmtruyen.API.Services.VideoConvert;
using Xmtruyen.API.Services.Import;

var builder = WebApplication.CreateBuilder(args);

// Configure max request size (1GB) for file uploads and bulk chapter processing
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 1073741824; // 1GB
});
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 1073741824; // 1GB
});

// Add services to the container.
builder.Services.AddSignalR();
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Configure Entity Framework Core with PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<ISystemRepository, SystemRepository>();
builder.Services.AddScoped<IChapterRepository, ChapterRepository>();
builder.Services.AddScoped<IComicChapterRepository, ComicChapterRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPurchaseRepository, PurchaseRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ITopicRepository, TopicRepository>();
builder.Services.AddScoped<IPublicationRepository, PublicationRepository>();

builder.Services.AddScoped<ISystemService, SystemService>();
builder.Services.AddScoped<IReadingService, ReadingService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IAuthorizationHandler, Xmtruyen.API.Authorization.PermissionHandler>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<ICategoryManagementService, CategoryManagementService>();
builder.Services.AddScoped<ITopicManagementService, TopicManagementService>();
builder.Services.AddScoped<IPublicationManagementService, PublicationManagementService>();
builder.Services.AddScoped<IComicChapterManagementService, ComicChapterManagementService>();
builder.Services.AddScoped<IBookChapterManagementService, BookChapterManagementService>();
builder.Services.AddScoped<IUserManagementService, UserManagementService>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<Xmtruyen.API.Services.IPaymentService, Xmtruyen.API.Services.PaymentService>();
builder.Services.AddScoped<IEngagementService, EngagementService>();
builder.Services.AddScoped<IDiscoveryService, DiscoveryService>();
builder.Services.AddScoped<IImportService, ImportService>();
builder.Services.AddScoped<IPasteParserService, PasteParserService>();
builder.Services.AddScoped<IOcrService, OcrService>();

// Register Audiobook Services
builder.Services.AddSingleton<AudioJobQueue>();
builder.Services.AddHostedService<AudioBackgroundWorker>();
builder.Services.AddHttpClient("PythonWorker", client =>
{
    client.BaseAddress = new Uri("http://127.0.0.1:8000");
});

// Register Publication Processing Services
builder.Services.AddSingleton<IBackgroundTaskQueue>(ctx => new BackgroundTaskQueue(100));
builder.Services.AddScoped<IBookProcessor, PdfBookProcessor>();
builder.Services.AddScoped<IBookProcessor, ArchiveBookProcessor>();
builder.Services.AddHostedService<BookProcessingWorker>();
// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = Encoding.ASCII.GetBytes(jwtSettings["Key"]!);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Set to true in production
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(secretKey),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("SuperAdmin", "Admin"));
    options.AddPolicy("EditorOrAbove", policy => policy.RequireRole("SuperAdmin", "Admin", "Editor"));
    options.AddPolicy("TranslatorOrAbove", policy => policy.RequireRole("SuperAdmin", "Admin", "Editor", "Translator"));
    options.AddPolicy("ModeratorOrAbove", policy => policy.RequireRole("SuperAdmin", "Admin", "Moderator"));
    options.AddPolicy("AuthorOrAbove", policy => policy.RequireRole("SuperAdmin", "Admin", "Editor", "Author"));
    options.AddPolicy("CanManagePublications", policy => policy.Requirements.Add(new Xmtruyen.API.Authorization.PermissionRequirement("publications.create")));
    options.AddPolicy("CanManageUsers", policy => policy.Requirements.Add(new Xmtruyen.API.Authorization.PermissionRequirement("users.update")));
    options.AddPolicy("CanViewTransactions", policy => policy.Requirements.Add(new Xmtruyen.API.Authorization.PermissionRequirement("transactions.read")));
});

builder.Services.AddEndpointsApiExplorer();

// Configure OpenAPI (Standard .NET 9) with JWT Bearer Security Scheme
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, context, cancellationToken) =>
    {
        document.Info.Title = "Xmtruyen API";
        document.Info.Version = "v1";
        
        document.Components ??= new OpenApiComponents();
        document.Components.SecuritySchemes.Add("Bearer", new OpenApiSecurityScheme
        {
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            Description = "Enter your token here.\n\nExample: \"eyJhbGciOiJIUzI1Ni...\""
        });
        
        foreach (var path in document.Paths.Values)
        {
            foreach (var operation in path.Operations.Values)
            {
                operation.Security.Add(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
                        },
                        new string[] {}
                    }
                });
            }
        }
        
        return Task.CompletedTask;
    });
});

// Book to Video Services
builder.Services.AddSingleton<Xmtruyen.API.Services.BookVideo.IBookVideoJobQueue, Xmtruyen.API.Services.BookVideo.BookVideoJobQueue>();
builder.Services.AddHostedService<Xmtruyen.API.Services.BookVideo.BookVideoBackgroundWorker>();
builder.Services.AddScoped<Xmtruyen.API.Services.BookVideo.SceneDescriptionService>();
builder.Services.AddScoped<Xmtruyen.API.Services.BookVideo.IImageGenerationService, Xmtruyen.API.Services.BookVideo.ImageGenerationService>();
builder.Services.AddScoped<Xmtruyen.API.Services.BookVideo.BookVideoComposeService>();

builder.Services.AddSingleton<IVideoConvertJobQueue, VideoConvertJobQueue>();
builder.Services.AddHostedService<VideoConvertBackgroundWorker>();

var app = builder.Build();

// Register the global exception middleware as early as possible
app.UseMiddleware<Xmtruyen.API.Middleware.GlobalExceptionMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.Title = "Xmtruyen API";
        options.Theme = ScalarTheme.Mars;
        options.Authentication = new ScalarAuthenticationOptions
        {
            PreferredSecuritySchemes = new[] { "Bearer" }
        };
    });
}

app.UseHttpsRedirection();

app.UseStaticFiles(); // Allow serving static files from wwwroot

// Serve files from the custom absolute upload path
var uploadBasePath = builder.Configuration.GetValue<string>("UploadSettings:BasePath") ?? "C:\\Uploads";
if (!System.IO.Directory.Exists(uploadBasePath))
{
    System.IO.Directory.CreateDirectory(uploadBasePath);
}
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(uploadBasePath),
    RequestPath = "" // Map it to the root, e.g. /Publications/..., /uploads/...
});

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<Xmtruyen.API.Hubs.NotificationHub>("/hubs/notification");

app.MapGet("/", () => Results.Redirect("/scalar/v1"));

app.Run();
