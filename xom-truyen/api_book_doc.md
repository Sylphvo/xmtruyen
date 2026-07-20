# XomTruyen API - Tài Liệu Tích Hợp (Books & Upload)

Tài liệu này hướng dẫn cách gọi các API liên quan đến Quản lý Sách (Books) và luồng Upload/Processing sách.

---

## 1. Dịch Vụ Xử Lý Sách (Book Processing)

API này dùng để tải lên file PDF/EPUB của sách. Ngay khi gọi xong, hệ thống sẽ đẩy vào Queue chạy ngầm (trích xuất TOC, cắt ảnh WebP,...) mà không làm đơ giao diện.

### `POST /api/Upload/book-file`
- **Mô tả:** Upload file sách để hệ thống xử lý ngầm.
- **Content-Type:** `multipart/form-data`
- **Body Parameters:**
  - `file` (File - Bắt buộc): File gốc (PDF, EPUB...).
  - `bookId` (string - Tùy chọn): ID của sách (Guid). Nếu không truyền hệ thống sẽ tự sinh ID tạm.
- **Response (200 OK):**
```json
{
  "success": true,
  "taskId": "7209e51c-63da-47be-b2e3-fb66f8149e32",
  "bookId": "a90dfb14-8a4e-4f18-a621-e8d98d2b9980",
  "status": "PROCESSING",
  "message": "Book uploaded successfully and queued for processing."
}
```

---

## 2. Quản Lý Sách (Admin Books API)

Các API CRUD cơ bản để quản lý Sách. Yêu cầu truyền Header `Authorization: Bearer {token}` nếu bật xác thực.

### 2.1. Lấy danh sách Sách (Get Books)
- **Endpoint:** `GET /api/books`
- **Query Parameters (Tùy chọn):**
  - `keyword` (string): Tìm theo tên sách.
  - `categoryId` (Guid): Lọc theo thể loại.
  - `formatType` (int): Lọc theo định dạng (1 = Text, 2 = Comic).
  - `accessLevel` (int): Lọc theo quyền (1 = Free, 2 = Vip).
  - `page` (int): Trang hiện tại (Mặc định: 1).
  - `pageSize` (int): Số lượng trên một trang (Mặc định: 10).
- **Response (200 OK):**
```json
{
  "data": [
    {
      "id": "a90dfb14-8a4e-4f18-a621-e8d98d2b9980",
      "title": "Tên Sách",
      "slug": "ten-sach",
      "formatType": 1,
      "accessLevel": 1,
      "author": "Tác giả",
      "coverImageUrl": "...",
      "viewCount": 100,
      "averageRating": 4.5
    }
  ],
  "totalCount": 50,
  "page": 1,
  "pageSize": 10
}
```

### 2.2. Lấy Chi Tiết Sách (Get Book by ID)
- **Endpoint:** `GET /api/books/{id}`
- **Response (200 OK):** Trả về chi tiết Sách (bao gồm cả danh sách `BookCategories` và `Chapters` nếu có).

### 2.3. Thêm Mới Sách (Create Book)
- **Endpoint:** `POST /api/books`
- **Body JSON (BookRequest):**
```json
{
  "title": "Sách Mới",
  "formatType": 1, 
  "accessLevel": 1,
  "author": "Nguyễn Văn A",
  "description": "Mô tả sách...",
  "coverImageUrl": "https://...",
  "categoryIds": [
    "c56a4180-65aa-42ec-a945-5fd21dec0538"
  ]
}
```
- **Lưu ý:** `categoryIds` là mảng các GUID của Thể Loại. `Slug` sẽ được tự động sinh ngẫu nhiên từ `Title` để tránh trùng lặp.
- **Response (210 Created):** Trả về object Book vừa tạo.

### 2.4. Cập Nhật Sách (Update Book)
- **Endpoint:** `PUT /api/books/{id}`
- **Body JSON:** Tương tự như Create Book. 
- **Lưu ý:** Mảng `categoryIds` truyền lên sẽ ghi đè toàn bộ danh sách Thể loại cũ của sách đó.
- **Response:** `204 No Content` (Thành công).

### 2.5. Xóa Sách (Delete Book)
- **Endpoint:** `DELETE /api/books/{id}`
- **Response:** `204 No Content` (Thành công).

### 2.6. Chuyển Đổi Trạng Thái Nổi Bật (Toggle Recommended)
- **Endpoint:** `PATCH /api/books/{id}/recommended`
- **Body JSON:** `true` hoặc `false`
- **Response:** `204 No Content`

### 2.7. Chuyển Đổi Trạng Thái Độc Quyền (Toggle Exclusive)
- **Endpoint:** `PATCH /api/books/{id}/exclusive`
- **Body JSON:** `true` hoặc `false`
- **Response:** `204 No Content`
