using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace xmtruyen.API.Migrations
{
    /// <inheritdoc />
    public partial class AddDisplayLabelToPublication : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DisplayLabel",
                table: "Publications",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DisplayLabel",
                table: "Publications");
        }
    }
}
