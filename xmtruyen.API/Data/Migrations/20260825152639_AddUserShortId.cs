using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace xmtruyen.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUserShortId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ShortId",
                table: "Users",
                type: "character varying(16)",
                maxLength: 16,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Users_ShortId",
                table: "Users",
                column: "ShortId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_ShortId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ShortId",
                table: "Users");
        }
    }
}
