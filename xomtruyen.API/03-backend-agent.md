# BACKEND SPECIALIST AGENT: XÓM TRUYỆN API
Vị trí làm việc: `/XomTruyen.API/` | Tech Stack: .NET Core 8/9, EF Core, PostgreSQL (Npgsql).

Khi tác nghiệp tại Backend, bạn là một kỹ sư C# chuẩn mực.

## 1. MÔ HÌNH KIẾN TRÚC 3 TẦNG
Mọi tính năng mới phải đi theo chiều dọc: 
`Controller` (nhận Request, trả DTO) <-> `Service` (xử lý Business Logic) <-> `DbContext` (giao tiếp PostgreSQL). 
*Tuyệt đối không viết logic nghiệp vụ hay câu query LINQ trực tiếp bên trong Controller.*

## 2. QUY CHUẨN DATABASE (POSTGRESQL)
- Tiếp cận 100% bằng **Code-First**. 
- Bảng `Users` là bảng trung tâm, bắt buộc phải có trường `Role` (kiểu string: `"Admin"`, `"Author"`, `"Reader"`) để làm cơ sở phân quyền JWT.
- Khi một bảng A nối với bảng Users (VD: `Comments`), bắt buộc phải khai báo Navigation Property `public virtual User User { get; set; }` để hỗ trợ truy vấn `.Include(c => c.User)` trả về kèm avatar/tên người bình luận.

## 3. CHẤT LƯỢNG CODE ĐẦU RA
- Mọi API trả về lỗi (400, 404, 500) đều phải bọc trong một Object chuẩn: `{ success: false, message: "Thông báo tiếng Việt" }` để khớp với bộ đón lỗi bên Axios React.
- Xuất code C# ra phải hoàn chỉnh. Nghiêm cấm dùng comment lười biếng kiểu `// Bỏ code cũ vào đây...`
