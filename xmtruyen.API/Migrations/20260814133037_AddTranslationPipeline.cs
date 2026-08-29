using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace xmtruyen.API.Migrations
{
    /// <inheritdoc />
    public partial class AddTranslationPipeline : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TranslationTasks");

            migrationBuilder.CreateTable(
                name: "TranslationGlossaries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SourceText = table.Column<string>(type: "text", nullable: false),
                    TargetText = table.Column<string>(type: "text", nullable: false),
                    SourceLanguage = table.Column<string>(type: "text", nullable: false),
                    TargetLanguage = table.Column<string>(type: "text", nullable: false),
                    Category = table.Column<string>(type: "text", nullable: true),
                    PublicationId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TranslationGlossaries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TranslationGlossaries_Publications_PublicationId",
                        column: x => x.PublicationId,
                        principalTable: "Publications",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "TranslationJobs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PublicationId = table.Column<Guid>(type: "uuid", nullable: false),
                    SourceLanguage = table.Column<string>(type: "text", nullable: false),
                    TargetLanguage = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    TotalChapters = table.Column<int>(type: "integer", nullable: false),
                    TotalPages = table.Column<int>(type: "integer", nullable: false),
                    TotalTextBlocks = table.Column<int>(type: "integer", nullable: false),
                    ProcessedPages = table.Column<int>(type: "integer", nullable: false),
                    ErrorMessage = table.Column<string>(type: "text", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TranslationJobs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TranslationJobs_Publications_PublicationId",
                        column: x => x.PublicationId,
                        principalTable: "Publications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TranslationChapters",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    JobId = table.Column<Guid>(type: "uuid", nullable: false),
                    ChapterNumber = table.Column<decimal>(type: "numeric", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: false),
                    PageCount = table.Column<int>(type: "integer", nullable: false),
                    TextBlockCount = table.Column<int>(type: "integer", nullable: false),
                    RawFolderPath = table.Column<string>(type: "text", nullable: true),
                    TranslatedFolderPath = table.Column<string>(type: "text", nullable: true),
                    ReviewNote = table.Column<string>(type: "text", nullable: true),
                    ReviewedBy = table.Column<string>(type: "text", nullable: true),
                    ReviewedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    PublishedChapterId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TranslationChapters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TranslationChapters_TranslationJobs_JobId",
                        column: x => x.JobId,
                        principalTable: "TranslationJobs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TranslationPages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ChapterId = table.Column<Guid>(type: "uuid", nullable: false),
                    PageNumber = table.Column<int>(type: "integer", nullable: false),
                    RawImageUrl = table.Column<string>(type: "text", nullable: false),
                    TranslatedImageUrl = table.Column<string>(type: "text", nullable: true),
                    OcrStatus = table.Column<string>(type: "text", nullable: false),
                    TypesetStatus = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TranslationPages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TranslationPages_TranslationChapters_ChapterId",
                        column: x => x.ChapterId,
                        principalTable: "TranslationChapters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TextBlocks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PageId = table.Column<Guid>(type: "uuid", nullable: false),
                    BboxX = table.Column<int>(type: "integer", nullable: false),
                    BboxY = table.Column<int>(type: "integer", nullable: false),
                    BboxWidth = table.Column<int>(type: "integer", nullable: false),
                    BboxHeight = table.Column<int>(type: "integer", nullable: false),
                    OriginalText = table.Column<string>(type: "text", nullable: false),
                    TranslatedText = table.Column<string>(type: "text", nullable: true),
                    TextType = table.Column<string>(type: "text", nullable: false),
                    FontStyle = table.Column<string>(type: "text", nullable: false),
                    OcrConfidence = table.Column<decimal>(type: "numeric", nullable: true),
                    IsManualEdit = table.Column<bool>(type: "boolean", nullable: false),
                    OrderIndex = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TextBlocks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TextBlocks_TranslationPages_PageId",
                        column: x => x.PageId,
                        principalTable: "TranslationPages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TextBlocks_PageId",
                table: "TextBlocks",
                column: "PageId");

            migrationBuilder.CreateIndex(
                name: "IX_TranslationChapters_JobId",
                table: "TranslationChapters",
                column: "JobId");

            migrationBuilder.CreateIndex(
                name: "IX_TranslationGlossaries_PublicationId",
                table: "TranslationGlossaries",
                column: "PublicationId");

            migrationBuilder.CreateIndex(
                name: "IX_TranslationJobs_PublicationId",
                table: "TranslationJobs",
                column: "PublicationId");

            migrationBuilder.CreateIndex(
                name: "IX_TranslationPages_ChapterId",
                table: "TranslationPages",
                column: "ChapterId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TextBlocks");

            migrationBuilder.DropTable(
                name: "TranslationGlossaries");

            migrationBuilder.DropTable(
                name: "TranslationPages");

            migrationBuilder.DropTable(
                name: "TranslationChapters");

            migrationBuilder.DropTable(
                name: "TranslationJobs");

            migrationBuilder.CreateTable(
                name: "TranslationTasks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AssignedToEditorId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    RawText = table.Column<string>(type: "text", nullable: false),
                    ReferenceId = table.Column<Guid>(type: "uuid", nullable: true),
                    ReferenceType = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: false),
                    TranslatedText = table.Column<string>(type: "text", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TranslationTasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TranslationTasks_Users_AssignedToEditorId",
                        column: x => x.AssignedToEditorId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_TranslationTasks_AssignedToEditorId",
                table: "TranslationTasks",
                column: "AssignedToEditorId");
        }
    }
}
