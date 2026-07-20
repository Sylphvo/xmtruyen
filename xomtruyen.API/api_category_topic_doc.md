# XomTruyen API - Tài Liệu Tích Hợp (Category & Topic)

Tài liệu này hướng dẫn cách gọi các API liên quan đến Quản lý Thể loại (Category) và Chủ đề (Topic).

---

## 1. Quản Lý Thể Loại (Categories)

API cung cấp các thao tác CRUD cơ bản đối với Thể loại sách.

### 1.1. Lấy danh sách Thể loại
- **Endpoint:** `GET /api/categories`
- **Query Parameters (Tùy chọn):**
  - `searchKeyword` (string): Tìm kiếm theo tên thể loại.
  - `page` (int): Trang hiện tại (Mặc định: 1).
  - `pageSize` (int): Số lượng trên một trang (Mặc định: 20).
  - `sortBy` (string): Sắp xếp theo trường (Mặc định: `Name`).
  - `isDescending` (boolean): Sắp xếp giảm dần (Mặc định: `false`).
- **Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Tiên Hiệp",
      "slug": "tien-hiep"
    }
  ],
  "totalCount": 10,
  "page": 1,
  "pageSize": 20
}
```

### 1.2. Lấy Chi Tiết Thể loại
- **Endpoint:** `GET /api/categories/{id}`
- **Response (200 OK):**
```json
{
  "id": 1,
  "name": "Tiên Hiệp",
  "slug": "tien-hiep"
}
```

### 1.3. Thêm Mới Thể loại
- **Endpoint:** `POST /api/categories`
- **Body JSON:**
```json
{
  "name": "Huyền Huyễn"
}
```
- **Lưu ý:** `Slug` sẽ được hệ thống tự động sinh ra từ tên để làm đường dẫn chuẩn SEO. Không thể tạo Thể loại có tên trùng lặp (dựa trên slug).
- **Response (210 Created / 200 OK):** Trả về chi tiết Thể loại vừa tạo.

### 1.4. Cập Nhật Thể loại
- **Endpoint:** `PUT /api/categories/{id}`
- **Body JSON:**
```json
{
  "name": "Huyền Huyễn Cập Nhật"
}
```
- **Lưu ý:** Chỉ cập nhật tên (`name`), `slug` sẽ được giữ nguyên để không làm hỏng (dead links) các đường dẫn SEO hiện tại.
- **Response:** `204 No Content` (Cập nhật thành công).

### 1.5. Xóa Thể loại
- **Endpoint:** `DELETE /api/categories/{id}`
- **Lưu ý:** Không thể xóa Thể loại nếu đang có Sách (Book) liên kết đến nó.
- **Response:** `204 No Content` (Xóa thành công).

---

## 2. Quản Lý Chủ Đề (Topics)

API cung cấp các thao tác CRUD cơ bản đối với Chủ đề sách. Cấu trúc kết nối giống hệt với Categories.

### 2.1. Lấy danh sách Chủ đề
- **Endpoint:** `GET /api/topics`
- **Query Parameters (Tùy chọn):**
  - `searchKeyword` (string): Tìm kiếm theo tên chủ đề.
  - `page` (int): Trang hiện tại (Mặc định: 1).
  - `pageSize` (int): Số lượng trên một trang (Mặc định: 20).
  - `sortBy` (string): Sắp xếp theo trường (Mặc định: `Name`).
  - `isDescending` (boolean): Sắp xếp giảm dần (Mặc định: `false`).
- **Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Hệ Thống",
      "slug": "he-thong"
    }
  ],
  "totalCount": 5,
  "page": 1,
  "pageSize": 20
}
```

### 2.2. Lấy Chi Tiết Chủ đề
- **Endpoint:** `GET /api/topics/{id}`
- **Response (200 OK):**
```json
{
  "id": 1,
  "name": "Hệ Thống",
  "slug": "he-thong"
}
```

### 2.3. Thêm Mới Chủ đề
- **Endpoint:** `POST /api/topics`
- **Body JSON:**
```json
{
  "name": "Chuyển Sinh"
}
```
- **Response (210 Created / 200 OK):** Trả về chi tiết Chủ đề vừa tạo.

### 2.4. Cập Nhật Chủ đề
- **Endpoint:** `PUT /api/topics/{id}`
- **Body JSON:**
```json
{
  "name": "Xuyên Không"
}
```
- **Lưu ý:** Tương tự Category, chỉ thay đổi `name`, `slug` giữ nguyên.
- **Response:** `204 No Content` (Cập nhật thành công).

### 2.5. Xóa Chủ đề
- **Endpoint:** `DELETE /api/topics/{id}`
- **Response:** `204 No Content` (Xóa thành công).
