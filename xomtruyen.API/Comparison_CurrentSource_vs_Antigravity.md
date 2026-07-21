# Bảng So Sánh Kiến Trúc: Current Source vs. Antigravity

Tài liệu này đánh giá và so sánh thiết kế cơ sở dữ liệu và mã nguồn giữa hệ thống hiện tại (**Current Source**) và kiến trúc mới/dự án mới (**Antigravity**), đặc biệt tập trung vào cách xử lý dữ liệu hỗn hợp (Sách chữ và Truyện tranh).

## 1. Tổng quan (Overview)

| Tiêu chí | Current Source (Legacy) | Antigravity (New Architecture) |
| :--- | :--- | :--- |
| **Mục tiêu** | Triển khai nhanh, thiết kế gộp chung (monolithic) ban đầu. | Tối ưu hóa hiệu suất, chuẩn hóa dữ liệu, dễ mở rộng (Scalable). |
| **Mô hình DB** | Table-per-Hierarchy (Lưu chung 1 bảng) hoặc chưa tối ưu hóa phân lớp. | Tách biệt Metadata (thông tin chung) và Content (nội dung chi tiết). |
| **Tầng Application** | Logic xử lý nội dung bị trộn lẫn (if-else nhiều). | Phân tách Service/Repository rõ ràng cho từng loại ấn phẩm. |

---

## 2. So sánh Cấu trúc Database (Database Schema)

### 2.1. Current Source (Hệ thống hiện tại)
Trong source hiện tại, sách và truyện có thể đang bị gộp chung vào một bảng (hoặc lưu chung một bảng nội dung), gây ra một số vấn đề về mặt dài hạn:

- **Dư thừa dữ liệu (Sparse Data):** Các cột dành riêng cho truyện (như URL ảnh) sẽ bị `NULL` ở các dòng của sách, và ngược lại.
- **Khó ràng buộc (Data Integrity):** Không thể thiết lập các ràng buộc `NOT NULL` cứng ở database cho các thuộc tính đặc thù.
- **Phình to bảng (Table Bloat):** Bảng chính phình to nhanh chóng vì chứa cả chữ (NVARCHAR(MAX)) lẫn URL/cấu trúc ảnh.

### 2.2. Antigravity (Kiến trúc mới đề xuất)
Antigravity áp dụng mô hình phân tách dữ liệu đa hình (Polymorphic data) một cách triệt để.

- **Bảng `Publications` (Metadata):** Chỉ chứa các thông tin chung (`Id`, `Title`, `Author`, `CoverImage`, `Type`). Dùng để load siêu nhanh ở trang chủ.
- **Xử lý Sách chữ (Text):**
  - Bảng `BookChapters`: `Id`, `PublicationId`, `ChapterNumber`, `Content` (Text dài).
- **Xử lý Truyện tranh (Images):**
  - Bảng `ComicChapters`: `Id`, `PublicationId`, `ChapterNumber`.
  - Bảng `ComicPages` (1-N với Chapters): `Id`, `ComicChapterId`, `ImageUrl`, `PageNumber`.

---

## 3. Phân tích Hiệu suất & Mã nguồn (Code & Performance)

### 3.1. Khi truy vấn danh sách (Trang chủ, Tìm kiếm)
- **Current Source:** Có thể gặp hiện tượng bottleneck I/O nếu query database vô tình kéo theo các cột text/json nặng dù không cần thiết.
- **Antigravity:** Rất nhanh và nhẹ. Chỉ cần query bảng `Publications`. Hệ thống database hoạt động hiệu quả hơn do bảng index nhỏ gọn.

### 3.2. Khi đọc nội dung (Read Mode)
- **Current Source:** API trả về một object cồng kềnh. Logic Frontend và Backend phải check `Type` liên tục để parse nội dung cho đúng (VD: `if (type == "Comic") { parse_images() }`).
- **Antigravity:** 
  - Backend sử dụng cấu trúc hướng đối tượng tốt hơn (Clean Architecture). 
  - Có các endpoint hoặc service riêng (`/api/books/{id}/read` trả về text, `/api/comics/{id}/read` trả về mảng URL ảnh). 
  - Trải nghiệm load trang (TTFB) cho người dùng nhanh hơn.

---

## 4. Đánh giá rủi ro & Kế hoạch Migration

### Khó khăn khi chuyển sang Antigravity:
1. **Migration Dữ liệu:** Đòi hỏi phải viết script (SQL hoặc C#) để bóc tách, chuyển đổi dữ liệu từ cấu trúc 1 bảng cũ sang 4 bảng mới.
2. **Refactor Code:** Cần cập nhật lại toàn bộ Data Models (C# Entities), Dapper Queries/EF Core DbContext và các Services liên quan.

### Kế hoạch chuyển đổi (Migration Plan) đề xuất:
1. Thiết kế và tạo các bảng mới (`Publications`, `BookChapters`, `ComicChapters`, `ComicPages`) trên môi trường Dev.
2. Viết tool nhỏ (Console App hoặc Background Service) để chuyển dữ liệu từ bảng cũ sang schema mới của Antigravity.
3. Chạy song song (Parallel Run): API đọc từ Antigravity, nếu lỗi fallback về Current Source.
4. Sau khi ổn định, loại bỏ bảng cũ và dọn dẹp mã nguồn.
