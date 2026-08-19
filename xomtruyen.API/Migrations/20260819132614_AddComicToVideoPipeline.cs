using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace xomtruyen.API.Migrations
{
    /// <inheritdoc />
    public partial class AddComicToVideoPipeline : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ComicVideoTasks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PublicationId = table.Column<Guid>(type: "uuid", nullable: false),
                    ChapterIds = table.Column<string>(type: "text", nullable: false),
                    Language = table.Column<string>(type: "text", nullable: false),
                    VoiceId = table.Column<string>(type: "text", nullable: false),
                    SpeechRate = table.Column<string>(type: "text", nullable: false),
                    Resolution = table.Column<string>(type: "text", nullable: false),
                    Transition = table.Column<string>(type: "text", nullable: false),
                    NarrationSource = table.Column<string>(type: "text", nullable: false),
                    AddSubtitles = table.Column<bool>(type: "boolean", nullable: false),
                    BackgroundMusicUrl = table.Column<string>(type: "text", nullable: true),
                    BackgroundMusicVolume = table.Column<double>(type: "double precision", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    ProgressPercent = table.Column<int>(type: "integer", nullable: false),
                    CurrentStep = table.Column<string>(type: "text", nullable: false),
                    ErrorMessage = table.Column<string>(type: "text", nullable: false),
                    OutputVideoUrl = table.Column<string>(type: "text", nullable: false),
                    OutputThumbnailUrl = table.Column<string>(type: "text", nullable: false),
                    OutputDurationSeconds = table.Column<double>(type: "double precision", nullable: true),
                    OutputFileSizeBytes = table.Column<long>(type: "bigint", nullable: true),
                    OutputSubtitleUrl = table.Column<string>(type: "text", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    TotalPages = table.Column<int>(type: "integer", nullable: false),
                    TotalAudioSegments = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComicVideoTasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ComicVideoTasks_Publications_PublicationId",
                        column: x => x.PublicationId,
                        principalTable: "Publications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ComicVideoTasks_Users_CreatorId",
                        column: x => x.CreatorId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "ComicVideoSegments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TaskId = table.Column<Guid>(type: "uuid", nullable: false),
                    OrderIndex = table.Column<int>(type: "integer", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: false),
                    TextContent = table.Column<string>(type: "text", nullable: false),
                    AudioUrl = table.Column<string>(type: "text", nullable: false),
                    AudioDurationSeconds = table.Column<double>(type: "double precision", nullable: true),
                    SubtitleText = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComicVideoSegments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ComicVideoSegments_ComicVideoTasks_TaskId",
                        column: x => x.TaskId,
                        principalTable: "ComicVideoTasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ComicVideoSegments_TaskId",
                table: "ComicVideoSegments",
                column: "TaskId");

            migrationBuilder.CreateIndex(
                name: "IX_ComicVideoTasks_CreatorId",
                table: "ComicVideoTasks",
                column: "CreatorId");

            migrationBuilder.CreateIndex(
                name: "IX_ComicVideoTasks_PublicationId",
                table: "ComicVideoTasks",
                column: "PublicationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ComicVideoSegments");

            migrationBuilder.DropTable(
                name: "ComicVideoTasks");
        }
    }
}
