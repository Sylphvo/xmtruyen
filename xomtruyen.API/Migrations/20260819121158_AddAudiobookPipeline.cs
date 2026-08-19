using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace xomtruyen.API.Migrations
{
    /// <inheritdoc />
    public partial class AddAudiobookPipeline : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AudioChapters",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PublicationId = table.Column<Guid>(type: "uuid", nullable: false),
                    ChapterNumber = table.Column<decimal>(type: "numeric", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: true),
                    AudioUrl = table.Column<string>(type: "text", nullable: false),
                    Duration = table.Column<int>(type: "integer", nullable: false),
                    FileSize = table.Column<long>(type: "bigint", nullable: true),
                    IsLocked = table.Column<bool>(type: "boolean", nullable: false),
                    CoinPrice = table.Column<int>(type: "integer", nullable: true),
                    ListenCount = table.Column<int>(type: "integer", nullable: true),
                    WaveformData = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AudioChapters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AudioChapters_Publications_PublicationId",
                        column: x => x.PublicationId,
                        principalTable: "Publications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AudioJobs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PublicationId = table.Column<Guid>(type: "uuid", nullable: false),
                    SourceType = table.Column<string>(type: "text", nullable: false),
                    SourceChapterIds = table.Column<string>(type: "text", nullable: true),
                    TargetLanguage = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    TtsProvider = table.Column<string>(type: "text", nullable: true),
                    NarratorVoiceId = table.Column<string>(type: "text", nullable: true),
                    TotalSegments = table.Column<int>(type: "integer", nullable: true),
                    ProcessedSegments = table.Column<int>(type: "integer", nullable: true),
                    ErrorMessage = table.Column<string>(type: "text", nullable: true),
                    Settings = table.Column<string>(type: "text", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AudioJobs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AudioJobs_Publications_PublicationId",
                        column: x => x.PublicationId,
                        principalTable: "Publications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AudioSfxLibrary",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Category = table.Column<string>(type: "text", nullable: true),
                    Keywords = table.Column<string>(type: "text", nullable: true),
                    AudioUrl = table.Column<string>(type: "text", nullable: false),
                    Duration = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AudioSfxLibrary", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "VoiceProfiles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    DisplayName = table.Column<string>(type: "text", nullable: false),
                    VoiceType = table.Column<string>(type: "text", nullable: false),
                    Gender = table.Column<string>(type: "text", nullable: true),
                    TtsProvider = table.Column<string>(type: "text", nullable: false),
                    TtsVoiceId = table.Column<string>(type: "text", nullable: false),
                    Settings = table.Column<string>(type: "text", nullable: true),
                    SampleAudioUrl = table.Column<string>(type: "text", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VoiceProfiles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AudioSegments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    JobId = table.Column<Guid>(type: "uuid", nullable: false),
                    OrderIndex = table.Column<int>(type: "integer", nullable: false),
                    SegmentType = table.Column<string>(type: "text", nullable: false),
                    Text = table.Column<string>(type: "text", nullable: true),
                    VoiceProfileId = table.Column<string>(type: "text", nullable: true),
                    Speaker = table.Column<string>(type: "text", nullable: true),
                    Emotion = table.Column<string>(type: "text", nullable: true),
                    Speed = table.Column<decimal>(type: "numeric", nullable: true),
                    PauseAfterMs = table.Column<int>(type: "integer", nullable: true),
                    AudioChunkUrl = table.Column<string>(type: "text", nullable: true),
                    Duration = table.Column<int>(type: "integer", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AudioSegments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AudioSegments_AudioJobs_JobId",
                        column: x => x.JobId,
                        principalTable: "AudioJobs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CharacterVoiceMappings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PublicationId = table.Column<Guid>(type: "uuid", nullable: false),
                    CharacterName = table.Column<string>(type: "text", nullable: false),
                    VoiceProfileId = table.Column<string>(type: "text", nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CharacterVoiceMappings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CharacterVoiceMappings_Publications_PublicationId",
                        column: x => x.PublicationId,
                        principalTable: "Publications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CharacterVoiceMappings_VoiceProfiles_VoiceProfileId",
                        column: x => x.VoiceProfileId,
                        principalTable: "VoiceProfiles",
                        principalColumn: "Id");
                });

            migrationBuilder.InsertData(
                table: "VoiceProfiles",
                columns: new[] { "Id", "DisplayName", "Gender", "IsActive", "SampleAudioUrl", "Settings", "TtsProvider", "TtsVoiceId", "VoiceType" },
                values: new object[,]
                {
                    { "female_lead", "Nữ chính", "female", true, null, null, "edge_tts", "vi-VN-HoaiMyNeural", "character" },
                    { "male_hero", "Nam chính (Trẻ)", "male", true, null, null, "edge_tts", "vi-VN-NamMinhNeural", "character" },
                    { "narrator_female", "Người kể (Nữ)", "female", true, null, null, "edge_tts", "vi-VN-HoaiMyNeural", "narrator" },
                    { "narrator_male", "Người kể (Nam)", "male", true, null, null, "edge_tts", "vi-VN-NamMinhNeural", "narrator" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AudioChapters_PublicationId_ChapterNumber",
                table: "AudioChapters",
                columns: new[] { "PublicationId", "ChapterNumber" });

            migrationBuilder.CreateIndex(
                name: "IX_AudioJobs_PublicationId",
                table: "AudioJobs",
                column: "PublicationId");

            migrationBuilder.CreateIndex(
                name: "IX_AudioJobs_Status",
                table: "AudioJobs",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_AudioSegments_JobId_OrderIndex",
                table: "AudioSegments",
                columns: new[] { "JobId", "OrderIndex" });

            migrationBuilder.CreateIndex(
                name: "IX_CharacterVoiceMappings_PublicationId",
                table: "CharacterVoiceMappings",
                column: "PublicationId");

            migrationBuilder.CreateIndex(
                name: "IX_CharacterVoiceMappings_VoiceProfileId",
                table: "CharacterVoiceMappings",
                column: "VoiceProfileId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AudioChapters");

            migrationBuilder.DropTable(
                name: "AudioSegments");

            migrationBuilder.DropTable(
                name: "AudioSfxLibrary");

            migrationBuilder.DropTable(
                name: "CharacterVoiceMappings");

            migrationBuilder.DropTable(
                name: "AudioJobs");

            migrationBuilder.DropTable(
                name: "VoiceProfiles");
        }
    }
}
