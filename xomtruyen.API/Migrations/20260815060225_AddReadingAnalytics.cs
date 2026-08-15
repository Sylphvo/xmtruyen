using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace xomtruyen.API.Migrations
{
    /// <inheritdoc />
    public partial class AddReadingAnalytics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ReadingAnalytics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    GuestSessionId = table.Column<string>(type: "text", nullable: true),
                    PublicationId = table.Column<Guid>(type: "uuid", nullable: false),
                    ChapterId = table.Column<Guid>(type: "uuid", nullable: true),
                    ReadAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ReadingDurationSeconds = table.Column<int>(type: "integer", nullable: false),
                    DeviceInfo = table.Column<string>(type: "text", nullable: true),
                    Country = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReadingAnalytics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReadingAnalytics_Publications_PublicationId",
                        column: x => x.PublicationId,
                        principalTable: "Publications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ReadingAnalytics_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ReadingAnalytics_PublicationId",
                table: "ReadingAnalytics",
                column: "PublicationId");

            migrationBuilder.CreateIndex(
                name: "IX_ReadingAnalytics_UserId",
                table: "ReadingAnalytics",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReadingAnalytics");
        }
    }
}
