using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace xmtruyen.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddAdminPreferences : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AdminPreferences",
                table: "Users",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdminPreferences",
                table: "Users");
        }
    }
}
