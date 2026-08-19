using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace xomtruyen.API.Migrations
{
    /// <inheritdoc />
    public partial class AddBookToVideoPipeline : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BookVideoTasks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PublicationId = table.Column<Guid>(type: "uuid", nullable: false),
                    ChapterIds = table.Column<string>(type: "text", nullable: false),
                    ImageSource = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    ArtStyle = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    SegmentWordCount = table.Column<int>(type: "integer", nullable: false),
                    Language = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    VoiceId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    SpeechRate = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    EnableMultiVoice = table.Column<bool>(type: "boolean", nullable: false),
                    Resolution = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Transition = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    AddSubtitles = table.Column<bool>(type: "boolean", nullable: false),
                    AddIntroOutro = table.Column<bool>(type: "boolean", nullable: false),
                    BgmEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    BgmGenre = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    BgmVolume = table.Column<double>(type: "double precision", nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    ProgressPercent = table.Column<int>(type: "integer", nullable: false),
                    CurrentStep = table.Column<string>(type: "text", nullable: false),
                    ErrorMessage = table.Column<string>(type: "text", nullable: false),
                    TotalSegments = table.Column<int>(type: "integer", nullable: false),
                    CompletedSegments = table.Column<int>(type: "integer", nullable: false),
                    OutputVideoUrl = table.Column<string>(type: "text", nullable: false),
                    OutputThumbnailUrl = table.Column<string>(type: "text", nullable: false),
                    OutputDurationSeconds = table.Column<double>(type: "double precision", nullable: true),
                    OutputFileSizeBytes = table.Column<long>(type: "bigint", nullable: true),
                    OutputSubtitleUrl = table.Column<string>(type: "text", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookVideoTasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BookVideoTasks_Publications_PublicationId",
                        column: x => x.PublicationId,
                        principalTable: "Publications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookVideoTasks_Users_CreatedBy",
                        column: x => x.CreatedBy,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "BookVideoSegments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TaskId = table.Column<Guid>(type: "uuid", nullable: false),
                    OrderIndex = table.Column<int>(type: "integer", nullable: false),
                    TextContent = table.Column<string>(type: "text", nullable: false),
                    SceneDescription = table.Column<string>(type: "text", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: false),
                    AudioUrl = table.Column<string>(type: "text", nullable: false),
                    AudioDurationSeconds = table.Column<double>(type: "double precision", nullable: true),
                    SubtitleText = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookVideoSegments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BookVideoSegments_BookVideoTasks_TaskId",
                        column: x => x.TaskId,
                        principalTable: "BookVideoTasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BookVideoSegments_TaskId",
                table: "BookVideoSegments",
                column: "TaskId");

            migrationBuilder.CreateIndex(
                name: "IX_BookVideoTasks_CreatedBy",
                table: "BookVideoTasks",
                column: "CreatedBy");

            migrationBuilder.CreateIndex(
                name: "IX_BookVideoTasks_PublicationId",
                table: "BookVideoTasks",
                column: "PublicationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BookVideoSegments");

            migrationBuilder.DropTable(
                name: "BookVideoTasks");
        }
    }
}
