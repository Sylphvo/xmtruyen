# Cấu trúc Thư mục Upload Sách (Global)

Dựa trên việc áp dụng luồng nghiệp vụ **Sách dùng chung cho tất cả User (Kịch bản 1)**, tôi đã cập nhật lại cấu trúc thư mục lưu file để tránh trùng lặp dữ liệu và dễ dàng quản lý cho trang Admin.

## Cấu trúc thư mục mới

Thay vì phân cấp theo thư mục của từng User tải lên, hệ thống sẽ gom chung vào thư mục `books/{bookId}/` và chia làm 2 thư mục con rõ ràng để Admin tiện kiểm soát dữ liệu thô và dữ liệu đã qua xử lý.

Chi tiết cấu trúc vật lý trong thư mục `wwwroot`:

```
wwwroot/
└── books/
    └── {bookId}/
        ├── FileRaw/                 <-- (Chứa file PDF gốc được upload lên)
        │   └── original.pdf 
        │
        └── FileProcess/             <-- (Chứa kết quả sau khi Background Worker xử lý)
            ├── cover.webp           <-- Ảnh bìa (Thumbnail)
            ├── page_001.webp        <-- Các trang truyện đã cắt nhỏ
            ├── page_002.webp
            ├── metadata.json        <-- File thông tin số trang
            └── toc.json             <-- Mục lục (Table of Content)
```

## Các URL trả về cho Frontend / Admin
Khi client hoặc Admin gọi API và đợi Background Worker xử lý xong, đối tượng `Output` trả về sẽ chứa đường dẫn chuẩn xác để truy xuất:

- **PdfUrl:** `books/{bookId}/FileRaw/original.pdf`
- **ImageUrl (Cover):** `books/{bookId}/FileProcess/cover.webp`
- **PagesUrl (Base Path):** `books/{bookId}/FileProcess/`

> [!TIP]
> **Dành cho Admin:** Bạn có thể dễ dàng quản lý file gốc tại `FileRaw` (thậm chí có thể xóa nếu không cần giữ bản gốc để tiết kiệm dung lượng sau này). File được dùng để stream cho người đọc qua App/Web nằm hoàn toàn trong `FileProcess`.
> 
> *Tham số `ownerId` trong `UploadController` (nếu có truyền vào) vẫn được lưu giữ và truyền vào Task để tiện cho việc lưu vào log hoặc Database, nhưng sẽ **không còn ảnh hưởng** đến đường dẫn thư mục.*
