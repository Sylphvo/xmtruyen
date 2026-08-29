using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace xmtruyen.API.Migrations
{
    /// <inheritdoc />
    public partial class ApplyAntigravityArchitecture : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookmarks_Chapters_ChapterId",
                table: "Bookmarks");

            migrationBuilder.DropForeignKey(
                name: "FK_Notes_Chapters_ChapterId",
                table: "Notes");

            migrationBuilder.DropForeignKey(
                name: "FK_ReadingHistories_Books_BookId",
                table: "ReadingHistories");

            migrationBuilder.DropForeignKey(
                name: "FK_ReadingHistories_Chapters_LastReadChapterId",
                table: "ReadingHistories");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Books_BookId",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_UserFavorites_Books_BookId",
                table: "UserFavorites");

            migrationBuilder.DropForeignKey(
                name: "FK_UserPurchasedChapters_Chapters_ChapterId",
                table: "UserPurchasedChapters");

            migrationBuilder.DropTable(
                name: "BookCategories");

            migrationBuilder.DropTable(
                name: "BookTopics");

            migrationBuilder.DropTable(
                name: "ChapterImages");

            migrationBuilder.DropTable(
                name: "UserBooks");

            migrationBuilder.DropTable(
                name: "Chapters");

            migrationBuilder.DropTable(
                name: "Books");

            migrationBuilder.DropIndex(
                name: "IX_UserPurchasedChapters_ChapterId",
                table: "UserPurchasedChapters");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_BookId",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_ReadingHistories_LastReadChapterId",
                table: "ReadingHistories");

            migrationBuilder.DropIndex(
                name: "IX_Notes_ChapterId",
                table: "Notes");

            migrationBuilder.DropIndex(
                name: "IX_Bookmarks_ChapterId",
                table: "Bookmarks");

            migrationBuilder.DropColumn(
                name: "BookId",
                table: "Reviews");

            migrationBuilder.RenameColumn(
                name: "BookId",
                table: "UserFavorites",
                newName: "PublicationId");

            migrationBuilder.RenameIndex(
                name: "IX_UserFavorites_BookId",
                table: "UserFavorites",
                newName: "IX_UserFavorites_PublicationId");

            migrationBuilder.RenameColumn(
                name: "Comment",
                table: "Reviews",
                newName: "Content");

            migrationBuilder.RenameColumn(
                name: "BookId",
                table: "ReadingHistories",
                newName: "PublicationId");

            migrationBuilder.RenameIndex(
                name: "IX_ReadingHistories_BookId",
                table: "ReadingHistories",
                newName: "IX_ReadingHistories_PublicationId");

            migrationBuilder.AddColumn<int>(
                name: "ChapterType",
                table: "UserPurchasedChapters",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "Reviews",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "PublicationId",
                table: "Reviews",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Reviews",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LastReadChapterType",
                table: "ReadingHistories",
                type: "integer",
                nullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "Notes",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ChapterType",
                table: "Notes",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ChapterType",
                table: "Bookmarks",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Publications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Slug = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    FormatType = table.Column<int>(type: "integer", nullable: false),
                    AccessLevel = table.Column<int>(type: "integer", nullable: false),
                    Author = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    CoverImageUrl = table.Column<string>(type: "text", nullable: true),
                    ViewCount = table.Column<int>(type: "integer", nullable: true),
                    AverageRating = table.Column<decimal>(type: "numeric(3,2)", nullable: true),
                    IsRecommended = table.Column<bool>(type: "boolean", nullable: true),
                    IsExclusive = table.Column<bool>(type: "boolean", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    OwnerId = table.Column<Guid>(type: "uuid", nullable: true),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "Active")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Publications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Publications_Users_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "BookChapters",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PublicationId = table.Column<Guid>(type: "uuid", nullable: false),
                    ChapterNumber = table.Column<float>(type: "real", nullable: false),
                    Title = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Content = table.Column<string>(type: "text", nullable: true),
                    IsLocked = table.Column<bool>(type: "boolean", nullable: false),
                    CoinPrice = table.Column<int>(type: "integer", nullable: true),
                    ViewCount = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookChapters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BookChapters_Publications_PublicationId",
                        column: x => x.PublicationId,
                        principalTable: "Publications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ComicChapters",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    PublicationId = table.Column<Guid>(type: "uuid", nullable: false),
                    ChapterNumber = table.Column<float>(type: "real", nullable: false),
                    Title = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    IsLocked = table.Column<bool>(type: "boolean", nullable: false),
                    CoinPrice = table.Column<int>(type: "integer", nullable: true),
                    ViewCount = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComicChapters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ComicChapters_Publications_PublicationId",
                        column: x => x.PublicationId,
                        principalTable: "Publications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PublicationCategories",
                columns: table => new
                {
                    PublicationId = table.Column<Guid>(type: "uuid", nullable: false),
                    CategoryId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PublicationCategories", x => new { x.PublicationId, x.CategoryId });
                    table.ForeignKey(
                        name: "FK_PublicationCategories_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PublicationCategories_Publications_PublicationId",
                        column: x => x.PublicationId,
                        principalTable: "Publications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PublicationTopics",
                columns: table => new
                {
                    PublicationId = table.Column<Guid>(type: "uuid", nullable: false),
                    TopicId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PublicationTopics", x => new { x.PublicationId, x.TopicId });
                    table.ForeignKey(
                        name: "FK_PublicationTopics_Publications_PublicationId",
                        column: x => x.PublicationId,
                        principalTable: "Publications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PublicationTopics_Topics_TopicId",
                        column: x => x.TopicId,
                        principalTable: "Topics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserPublications",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    PublicationId = table.Column<Guid>(type: "uuid", nullable: false),
                    PurchasedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPublications", x => new { x.UserId, x.PublicationId });
                    table.ForeignKey(
                        name: "FK_UserPublications_Publications_PublicationId",
                        column: x => x.PublicationId,
                        principalTable: "Publications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserPublications_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ComicPages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ComicChapterId = table.Column<Guid>(type: "uuid", nullable: true),
                    ImageUrl = table.Column<string>(type: "text", nullable: false),
                    OrderIndex = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ComicPages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ComicPages_ComicChapters_ComicChapterId",
                        column: x => x.ComicChapterId,
                        principalTable: "ComicChapters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_PublicationId",
                table: "Reviews",
                column: "PublicationId");

            migrationBuilder.CreateIndex(
                name: "IX_BookChapters_PublicationId",
                table: "BookChapters",
                column: "PublicationId");

            migrationBuilder.CreateIndex(
                name: "IX_ComicChapters_PublicationId",
                table: "ComicChapters",
                column: "PublicationId");

            migrationBuilder.CreateIndex(
                name: "IX_ComicPages_ComicChapterId",
                table: "ComicPages",
                column: "ComicChapterId");

            migrationBuilder.CreateIndex(
                name: "IX_PublicationCategories_CategoryId",
                table: "PublicationCategories",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Publications_OwnerId",
                table: "Publications",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_PublicationTopics_TopicId",
                table: "PublicationTopics",
                column: "TopicId");

            migrationBuilder.CreateIndex(
                name: "IX_UserPublications_PublicationId",
                table: "UserPublications",
                column: "PublicationId");

            migrationBuilder.AddForeignKey(
                name: "FK_ReadingHistories_Publications_PublicationId",
                table: "ReadingHistories",
                column: "PublicationId",
                principalTable: "Publications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Publications_PublicationId",
                table: "Reviews",
                column: "PublicationId",
                principalTable: "Publications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserFavorites_Publications_PublicationId",
                table: "UserFavorites",
                column: "PublicationId",
                principalTable: "Publications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ReadingHistories_Publications_PublicationId",
                table: "ReadingHistories");

            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Publications_PublicationId",
                table: "Reviews");

            migrationBuilder.DropForeignKey(
                name: "FK_UserFavorites_Publications_PublicationId",
                table: "UserFavorites");

            migrationBuilder.DropTable(
                name: "BookChapters");

            migrationBuilder.DropTable(
                name: "ComicPages");

            migrationBuilder.DropTable(
                name: "PublicationCategories");

            migrationBuilder.DropTable(
                name: "PublicationTopics");

            migrationBuilder.DropTable(
                name: "UserPublications");

            migrationBuilder.DropTable(
                name: "ComicChapters");

            migrationBuilder.DropTable(
                name: "Publications");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_PublicationId",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "ChapterType",
                table: "UserPurchasedChapters");

            migrationBuilder.DropColumn(
                name: "PublicationId",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Reviews");

            migrationBuilder.DropColumn(
                name: "LastReadChapterType",
                table: "ReadingHistories");

            migrationBuilder.DropColumn(
                name: "ChapterType",
                table: "Notes");

            migrationBuilder.DropColumn(
                name: "ChapterType",
                table: "Bookmarks");

            migrationBuilder.RenameColumn(
                name: "PublicationId",
                table: "UserFavorites",
                newName: "BookId");

            migrationBuilder.RenameIndex(
                name: "IX_UserFavorites_PublicationId",
                table: "UserFavorites",
                newName: "IX_UserFavorites_BookId");

            migrationBuilder.RenameColumn(
                name: "Content",
                table: "Reviews",
                newName: "Comment");

            migrationBuilder.RenameColumn(
                name: "PublicationId",
                table: "ReadingHistories",
                newName: "BookId");

            migrationBuilder.RenameIndex(
                name: "IX_ReadingHistories_PublicationId",
                table: "ReadingHistories",
                newName: "IX_ReadingHistories_BookId");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "Reviews",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.AddColumn<Guid>(
                name: "BookId",
                table: "Reviews",
                type: "uuid",
                nullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "Notes",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.CreateTable(
                name: "Books",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OwnerId = table.Column<Guid>(type: "uuid", nullable: true),
                    AccessLevel = table.Column<int>(type: "integer", nullable: false),
                    Author = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    AverageRating = table.Column<decimal>(type: "numeric(3,2)", nullable: true),
                    CoverImageUrl = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedBy = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    FormatType = table.Column<int>(type: "integer", nullable: false),
                    IsExclusive = table.Column<bool>(type: "boolean", nullable: true),
                    IsRecommended = table.Column<bool>(type: "boolean", nullable: true),
                    Slug = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "Active"),
                    Title = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UpdatedBy = table.Column<string>(type: "text", nullable: true),
                    ViewCount = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Books", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Books_Users_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "BookCategories",
                columns: table => new
                {
                    BookId = table.Column<Guid>(type: "uuid", nullable: false),
                    CategoryId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookCategories", x => new { x.BookId, x.CategoryId });
                    table.ForeignKey(
                        name: "FK_BookCategories_Books_BookId",
                        column: x => x.BookId,
                        principalTable: "Books",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookCategories_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BookTopics",
                columns: table => new
                {
                    BookId = table.Column<Guid>(type: "uuid", nullable: false),
                    TopicId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookTopics", x => new { x.BookId, x.TopicId });
                    table.ForeignKey(
                        name: "FK_BookTopics_Books_BookId",
                        column: x => x.BookId,
                        principalTable: "Books",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookTopics_Topics_TopicId",
                        column: x => x.TopicId,
                        principalTable: "Topics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Chapters",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    BookId = table.Column<Guid>(type: "uuid", nullable: false),
                    ChapterNumber = table.Column<float>(type: "real", nullable: false),
                    CoinPrice = table.Column<int>(type: "integer", nullable: true),
                    Content = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ImageUrls = table.Column<List<string>>(type: "jsonb", nullable: true),
                    IsLocked = table.Column<bool>(type: "boolean", nullable: false),
                    Title = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    ViewCount = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Chapters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Chapters_Books_BookId",
                        column: x => x.BookId,
                        principalTable: "Books",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserBooks",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    BookId = table.Column<Guid>(type: "uuid", nullable: false),
                    PurchaseDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserBooks", x => new { x.UserId, x.BookId });
                    table.ForeignKey(
                        name: "FK_UserBooks_Books_BookId",
                        column: x => x.BookId,
                        principalTable: "Books",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserBooks_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChapterImages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ChapterId = table.Column<Guid>(type: "uuid", nullable: true),
                    ImageUrl = table.Column<string>(type: "text", nullable: false),
                    OrderIndex = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChapterImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChapterImages_Chapters_ChapterId",
                        column: x => x.ChapterId,
                        principalTable: "Chapters",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserPurchasedChapters_ChapterId",
                table: "UserPurchasedChapters",
                column: "ChapterId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_BookId",
                table: "Reviews",
                column: "BookId");

            migrationBuilder.CreateIndex(
                name: "IX_ReadingHistories_LastReadChapterId",
                table: "ReadingHistories",
                column: "LastReadChapterId");

            migrationBuilder.CreateIndex(
                name: "IX_Notes_ChapterId",
                table: "Notes",
                column: "ChapterId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookmarks_ChapterId",
                table: "Bookmarks",
                column: "ChapterId");

            migrationBuilder.CreateIndex(
                name: "IX_BookCategories_CategoryId",
                table: "BookCategories",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Books_OwnerId",
                table: "Books",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_BookTopics_TopicId",
                table: "BookTopics",
                column: "TopicId");

            migrationBuilder.CreateIndex(
                name: "IX_ChapterImages_ChapterId",
                table: "ChapterImages",
                column: "ChapterId");

            migrationBuilder.CreateIndex(
                name: "IX_Chapters_BookId",
                table: "Chapters",
                column: "BookId");

            migrationBuilder.CreateIndex(
                name: "IX_UserBooks_BookId",
                table: "UserBooks",
                column: "BookId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookmarks_Chapters_ChapterId",
                table: "Bookmarks",
                column: "ChapterId",
                principalTable: "Chapters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notes_Chapters_ChapterId",
                table: "Notes",
                column: "ChapterId",
                principalTable: "Chapters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ReadingHistories_Books_BookId",
                table: "ReadingHistories",
                column: "BookId",
                principalTable: "Books",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ReadingHistories_Chapters_LastReadChapterId",
                table: "ReadingHistories",
                column: "LastReadChapterId",
                principalTable: "Chapters",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Books_BookId",
                table: "Reviews",
                column: "BookId",
                principalTable: "Books",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserFavorites_Books_BookId",
                table: "UserFavorites",
                column: "BookId",
                principalTable: "Books",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserPurchasedChapters_Chapters_ChapterId",
                table: "UserPurchasedChapters",
                column: "ChapterId",
                principalTable: "Chapters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
