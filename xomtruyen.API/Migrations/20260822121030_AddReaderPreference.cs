using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace xomtruyen.API.Migrations
{
    /// <inheritdoc />
    public partial class AddReaderPreference : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ReaderPreferences",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Theme = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    FontFamily = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    FontSize = table.Column<int>(type: "integer", nullable: false),
                    LineHeight = table.Column<float>(type: "real", nullable: false),
                    Contrast = table.Column<float>(type: "real", nullable: false),
                    EnableBreakReminder = table.Column<bool>(type: "boolean", nullable: false),
                    BreakReminderIntervalMinutes = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReaderPreferences", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_ReaderPreferences_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ReaderPreferences");
        }
    }
}
