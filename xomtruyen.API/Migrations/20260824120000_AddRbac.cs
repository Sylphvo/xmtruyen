using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace xomtruyen.API.Migrations;

[Migration("20260824120000_AddRbac")]
public partial class AddRbac : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.CreateTable(
            name: "Roles",
            columns: table => new
            {
                Id = table.Column<int>(type: "integer", nullable: false),
                Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                DisplayName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                Description = table.Column<string>(type: "text", nullable: true),
                Level = table.Column<int>(type: "integer", nullable: false),
                Color = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                IsSystemRole = table.Column<bool>(type: "boolean", nullable: false),
                CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
            }, constraints: table => table.PrimaryKey("PK_Roles", x => x.Id));

        migrationBuilder.CreateTable(
            name: "Permissions",
            columns: table => new
            {
                Id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                Module = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                Action = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                DisplayName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                Description = table.Column<string>(type: "text", nullable: true)
            }, constraints: table => table.PrimaryKey("PK_Permissions", x => x.Id));

        migrationBuilder.CreateTable(
            name: "UserRoles",
            columns: table => new
            {
                UserId = table.Column<Guid>(type: "uuid", nullable: false),
                RoleId = table.Column<int>(type: "integer", nullable: false),
                AssignedBy = table.Column<Guid>(type: "uuid", nullable: true),
                AssignedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
            }, constraints: table =>
            {
                table.PrimaryKey("PK_UserRoles", x => new { x.UserId, x.RoleId });
                table.ForeignKey("FK_UserRoles_Roles_RoleId", x => x.RoleId, "Roles", "Id", onDelete: ReferentialAction.Cascade);
                table.ForeignKey("FK_UserRoles_Users_UserId", x => x.UserId, "Users", "Id", onDelete: ReferentialAction.Cascade);
            });

        migrationBuilder.CreateTable(
            name: "RolePermissions",
            columns: table => new
            {
                RoleId = table.Column<int>(type: "integer", nullable: false),
                PermissionId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false)
            }, constraints: table =>
            {
                table.PrimaryKey("PK_RolePermissions", x => new { x.RoleId, x.PermissionId });
                table.ForeignKey("FK_RolePermissions_Permissions_PermissionId", x => x.PermissionId, "Permissions", "Id", onDelete: ReferentialAction.Cascade);
                table.ForeignKey("FK_RolePermissions_Roles_RoleId", x => x.RoleId, "Roles", "Id", onDelete: ReferentialAction.Cascade);
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
            }, constraints: table => table.PrimaryKey("PK_RoleAuditLogs", x => x.Id));

        migrationBuilder.CreateIndex(name: "IX_Roles_Name", table: "Roles", column: "Name", unique: true);
        migrationBuilder.CreateIndex(name: "IX_RoleAuditLogs_UserId_CreatedAt", table: "RoleAuditLogs", columns: new[] { "UserId", "CreatedAt" });

        var createdAt = new DateTime(2026, 8, 24, 0, 0, 0, DateTimeKind.Utc);
        migrationBuilder.InsertData("Roles", new[] { "Id", "Name", "DisplayName", "Level", "Color", "IsSystemRole", "CreatedAt" }, new object[] { 1, "SuperAdmin", "Quản trị viên", 100, "#ff4444", true, createdAt });
        migrationBuilder.InsertData("Roles", new[] { "Id", "Name", "DisplayName", "Level", "Color", "IsSystemRole", "CreatedAt" }, new object[] { 2, "Editor", "Biên tập viên", 50, "#ff9800", true, createdAt });
        migrationBuilder.InsertData("Roles", new[] { "Id", "Name", "DisplayName", "Level", "Color", "IsSystemRole", "CreatedAt" }, new object[] { 3, "Translator", "Dịch giả", 30, "#9c27b0", true, createdAt });
        migrationBuilder.InsertData("Roles", new[] { "Id", "Name", "DisplayName", "Level", "Color", "IsSystemRole", "CreatedAt" }, new object[] { 4, "Moderator", "Quản lý viên", 40, "#2196f3", true, createdAt });
        migrationBuilder.InsertData("Roles", new[] { "Id", "Name", "DisplayName", "Level", "Color", "IsSystemRole", "CreatedAt" }, new object[] { 5, "Author", "Tác giả", 20, "#4caf50", true, createdAt });
        migrationBuilder.InsertData("Roles", new[] { "Id", "Name", "DisplayName", "Level", "Color", "IsSystemRole", "CreatedAt" }, new object[] { 6, "User", "Người dùng", 10, "#607d8b", true, createdAt });

        migrationBuilder.Sql("INSERT INTO \"Permissions\" (\"Id\", \"Module\", \"Action\", \"DisplayName\") VALUES ('publications.create', 'publications', 'create', 'Tạo sách mới'), ('publications.read', 'publications', 'read', 'Xem danh sách sách'), ('publications.update', 'publications', 'update', 'Sửa thông tin sách'), ('publications.delete', 'publications', 'delete', 'Xóa sách'), ('publications.publish', 'publications', 'publish', 'Publish/Unpublish sách'), ('chapters.create', 'chapters', 'create', 'Tạo chương mới'), ('chapters.update', 'chapters', 'update', 'Sửa chương'), ('chapters.delete', 'chapters', 'delete', 'Xóa chương'), ('users.read', 'users', 'read', 'Xem danh sách users'), ('users.create', 'users', 'create', 'Tạo user mới'), ('users.update', 'users', 'update', 'Sửa thông tin user'), ('users.ban', 'users', 'ban', 'Ban/Unban user'), ('users.assign_role', 'users', 'assign_role', 'Gán/Gỡ role cho user'), ('transactions.read', 'transactions', 'read', 'Xem giao dịch'), ('transactions.topup', 'transactions', 'topup', 'Nạp xu thủ công'), ('transactions.approve', 'transactions', 'approve', 'Duyệt giao dịch'), ('translation.create_job', 'translation', 'create_job', 'Tạo translation job'), ('translation.review', 'translation', 'review', 'Review bản dịch'), ('translation.approve', 'translation', 'approve', 'Approve/Reject translation'), ('translation.publish', 'translation', 'publish', 'Publish translated chapter'), ('translation.glossary', 'translation', 'glossary', 'Quản lý glossary'), ('crawler.manage', 'crawler', 'manage', 'Quản lý crawl sources'), ('crawler.trigger', 'crawler', 'trigger', 'Trigger manual crawl'), ('audio.create', 'audio', 'create', 'Tạo audio job'), ('audio.publish', 'audio', 'publish', 'Publish audio chapter'), ('moderation.reviews', 'moderation', 'reviews', 'Quản lý reviews'), ('moderation.reports', 'moderation', 'reports', 'Xử lý reports'), ('moderation.notifications', 'moderation', 'notifications', 'Gửi notifications'), ('system.database', 'system', 'database', 'Quản lý database'), ('system.config', 'system', 'config', 'Thay đổi system config'), ('system.audit_log', 'system', 'audit_log', 'Xem audit logs') ON CONFLICT (\"Id\") DO NOTHING;");
        migrationBuilder.Sql("INSERT INTO \"UserRoles\" (\"UserId\", \"RoleId\", \"AssignedAt\") SELECT \"Id\", CASE WHEN \"Role\" = 'Admin' THEN 1 WHEN \"Role\" = 'Editor' THEN 2 ELSE 6 END, NOW() FROM \"Users\" ON CONFLICT (\"UserId\", \"RoleId\") DO NOTHING;");
        migrationBuilder.Sql("INSERT INTO \"UserRoles\" (\"UserId\", \"RoleId\", \"AssignedAt\") SELECT \"Id\", 1, NOW() FROM \"Users\" WHERE \"Email\" = 'admin@xomtruyen.com' ON CONFLICT (\"UserId\", \"RoleId\") DO NOTHING;");
        migrationBuilder.Sql("INSERT INTO \"RolePermissions\" (\"RoleId\", \"PermissionId\") VALUES (2, 'publications.create'), (2, 'publications.read'), (2, 'publications.update'), (2, 'publications.delete'), (2, 'publications.publish'), (2, 'chapters.create'), (2, 'chapters.update'), (2, 'chapters.delete'), (2, 'translation.create_job'), (2, 'translation.review'), (2, 'translation.approve'), (2, 'translation.publish'), (2, 'translation.glossary'), (2, 'crawler.manage'), (2, 'crawler.trigger'), (2, 'audio.create'), (2, 'audio.publish'), (2, 'moderation.notifications'), (3, 'translation.review'), (3, 'translation.approve'), (3, 'translation.glossary'), (4, 'users.read'), (4, 'users.ban'), (4, 'moderation.reviews'), (4, 'moderation.reports'), (4, 'moderation.notifications') ON CONFLICT (\"RoleId\", \"PermissionId\") DO NOTHING;");
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "RoleAuditLogs");
        migrationBuilder.DropTable(name: "RolePermissions");
        migrationBuilder.DropTable(name: "UserRoles");
        migrationBuilder.DropTable(name: "Permissions");
        migrationBuilder.DropTable(name: "Roles");
    }
}