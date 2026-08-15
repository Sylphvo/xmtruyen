using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace xomtruyen.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCoinPackages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CoinPackages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    CoinAmount = table.Column<int>(type: "integer", nullable: false),
                    BonusCoins = table.Column<int>(type: "integer", nullable: false),
                    PriceVND = table.Column<int>(type: "integer", nullable: false),
                    IsPopular = table.Column<bool>(type: "boolean", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    OrderIndex = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CoinPackages", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CoinPackages");
        }
    }
}
