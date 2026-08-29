using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace xmtruyen.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBookAndChapterSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BookType",
                table: "Books");

            migrationBuilder.AlterColumn<float>(
                name: "ChapterNumber",
                table: "Chapters",
                type: "real",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<List<string>>(
                name: "ImageUrls",
                table: "Chapters",
                type: "jsonb",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsLocked",
                table: "Chapters",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "AccessLevel",
                table: "Books",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "FormatType",
                table: "Books",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrls",
                table: "Chapters");

            migrationBuilder.DropColumn(
                name: "IsLocked",
                table: "Chapters");

            migrationBuilder.DropColumn(
                name: "AccessLevel",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "FormatType",
                table: "Books");

            migrationBuilder.AlterColumn<int>(
                name: "ChapterNumber",
                table: "Chapters",
                type: "integer",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "real");

            migrationBuilder.AddColumn<string>(
                name: "BookType",
                table: "Books",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);
        }
    }
}
