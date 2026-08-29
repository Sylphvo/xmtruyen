using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace xmtruyen.API.Data.Migrations
{
    /// <inheritdoc />
    public partial class SyncRbacSnapshot : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Permissions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Module = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Action = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    DisplayName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permissions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RoleAuditLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Action = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    RoleId = table.Column<int>(type: "integer", nullable: true),
                    PerformedBy = table.Column<Guid>(type: "uuid", nullable: false),
                    Reason = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleAuditLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    DisplayName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Level = table.Column<int>(type: "integer", nullable: false),
                    Color = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    IsSystemRole = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RolePermissions",
                columns: table => new
                {
                    RoleId = table.Column<int>(type: "integer", nullable: false),
                    PermissionId = table.Column<string>(type: "character varying(100)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RolePermissions", x => new { x.RoleId, x.PermissionId });
                    table.ForeignKey(
                        name: "FK_RolePermissions_Permissions_PermissionId",
                        column: x => x.PermissionId,
                        principalTable: "Permissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RolePermissions_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    RoleId = table.Column<int>(type: "integer", nullable: false),
                    AssignedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    AssignedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_UserRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Permissions",
                columns: new[] { "Id", "Action", "Description", "DisplayName", "Module" },
                values: new object[,]
                {
                    { "audio.create", "create", null, "Tạo audio job", "audio" },
                    { "audio.publish", "publish", null, "Publish audio chapter", "audio" },
                    { "chapters.create", "create", null, "Tạo chương mới", "chapters" },
                    { "chapters.delete", "delete", null, "Xóa chương", "chapters" },
                    { "chapters.update", "update", null, "Sửa chương", "chapters" },
                    { "crawler.manage", "manage", null, "Quản lý crawl sources", "crawler" },
                    { "crawler.trigger", "trigger", null, "Trigger manual crawl", "crawler" },
                    { "moderation.notifications", "notifications", null, "Gửi notifications", "moderation" },
                    { "moderation.reports", "reports", null, "Xử lý reports", "moderation" },
                    { "moderation.reviews", "reviews", null, "Quản lý reviews", "moderation" },
                    { "publications.create", "create", null, "Tạo sách mới", "publications" },
                    { "publications.delete", "delete", null, "Xóa sách", "publications" },
                    { "publications.publish", "publish", null, "Publish/Unpublish sách", "publications" },
                    { "publications.read", "read", null, "Xem danh sách sách", "publications" },
                    { "publications.update", "update", null, "Sửa thông tin sách", "publications" },
                    { "system.audit_log", "audit_log", null, "Xem audit logs", "system" },
                    { "system.config", "config", null, "Thay đổi system config", "system" },
                    { "system.database", "database", null, "Quản lý database", "system" },
                    { "transactions.approve", "approve", null, "Duyệt giao dịch", "transactions" },
                    { "transactions.read", "read", null, "Xem giao dịch", "transactions" },
                    { "transactions.topup", "topup", null, "Nạp xu thủ công", "transactions" },
                    { "translation.approve", "approve", null, "Approve/Reject translation", "translation" },
                    { "translation.create_job", "create_job", null, "Tạo translation job", "translation" },
                    { "translation.glossary", "glossary", null, "Quản lý glossary", "translation" },
                    { "translation.publish", "publish", null, "Publish translated chapter", "translation" },
                    { "translation.review", "review", null, "Review bản dịch", "translation" },
                    { "users.assign_role", "assign_role", null, "Gán/Gỡ role cho user", "users" },
                    { "users.ban", "ban", null, "Ban/Unban user", "users" },
                    { "users.create", "create", null, "Tạo user mới", "users" },
                    { "users.read", "read", null, "Xem danh sách users", "users" },
                    { "users.update", "update", null, "Sửa thông tin user", "users" }
                });

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "Color", "CreatedAt", "Description", "DisplayName", "IsSystemRole", "Level", "Name" },
                values: new object[,]
                {
                    { 1, "#ff4444", new DateTime(2026, 8, 24, 7, 5, 54, 70, DateTimeKind.Utc).AddTicks(6381), null, "Quản trị viên", true, 100, "SuperAdmin" },
                    { 2, "#ff9800", new DateTime(2026, 8, 24, 7, 5, 54, 70, DateTimeKind.Utc).AddTicks(7491), null, "Biên tập viên", true, 50, "Editor" },
                    { 3, "#9c27b0", new DateTime(2026, 8, 24, 7, 5, 54, 70, DateTimeKind.Utc).AddTicks(7494), null, "Dịch giả", true, 30, "Translator" },
                    { 4, "#2196f3", new DateTime(2026, 8, 24, 7, 5, 54, 70, DateTimeKind.Utc).AddTicks(7497), null, "Quản lý viên", true, 40, "Moderator" },
                    { 5, "#4caf50", new DateTime(2026, 8, 24, 7, 5, 54, 70, DateTimeKind.Utc).AddTicks(7499), null, "Tác giả", true, 20, "Author" },
                    { 6, "#607d8b", new DateTime(2026, 8, 24, 7, 5, 54, 70, DateTimeKind.Utc).AddTicks(7501), null, "Người dùng", true, 10, "User" }
                });

            migrationBuilder.InsertData(
                table: "RolePermissions",
                columns: new[] { "PermissionId", "RoleId" },
                values: new object[,]
                {
                    { "audio.create", 2 },
                    { "audio.publish", 2 },
                    { "chapters.create", 2 },
                    { "chapters.delete", 2 },
                    { "chapters.update", 2 },
                    { "crawler.manage", 2 },
                    { "crawler.trigger", 2 },
                    { "moderation.notifications", 2 },
                    { "publications.create", 2 },
                    { "publications.delete", 2 },
                    { "publications.publish", 2 },
                    { "publications.read", 2 },
                    { "publications.update", 2 },
                    { "translation.approve", 2 },
                    { "translation.create_job", 2 },
                    { "translation.glossary", 2 },
                    { "translation.publish", 2 },
                    { "translation.review", 2 },
                    { "translation.approve", 3 },
                    { "translation.glossary", 3 },
                    { "translation.review", 3 },
                    { "moderation.notifications", 4 },
                    { "moderation.reports", 4 },
                    { "moderation.reviews", 4 },
                    { "users.ban", 4 },
                    { "users.read", 4 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_RoleAuditLogs_UserId_CreatedAt",
                table: "RoleAuditLogs",
                columns: new[] { "UserId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_RolePermissions_PermissionId",
                table: "RolePermissions",
                column: "PermissionId");

            migrationBuilder.CreateIndex(
                name: "IX_Roles_Name",
                table: "Roles",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_RoleId",
                table: "UserRoles",
                column: "RoleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RoleAuditLogs");

            migrationBuilder.DropTable(
                name: "RolePermissions");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "Permissions");

            migrationBuilder.DropTable(
                name: "Roles");
        }
    }
}
