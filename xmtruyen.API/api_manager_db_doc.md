# Xmtruyen API - Tài Liệu Tích Hợp (ManagerDB)

Tài liệu này hướng dẫn cách gọi các API liên quan đến Quản lý Cơ sở dữ liệu động (ManagerDB). API này cho phép thực hiện các thao tác CRUD cơ bản trên các bảng dữ liệu đã được khai báo trong hệ thống.

---

## 1. Lấy Danh Sách Các Bảng Dữ Liệu
API trả về danh sách tên của tất cả các bảng (bộ dữ liệu) được phép thao tác.

- **Endpoint:** `GET /api/ManagerDB/tables`
- **Response (200 OK):** Mảng các chuỗi (Tên bảng).
```json
[
  "Books",
  "Categories",
  "Users",
  "Chapters"
]
```

---

## 2. Lấy Cấu Trúc Bảng (Schema)
API trả về cấu trúc các cột của bảng (tên cột, kiểu dữ liệu, có phải khóa chính không), giúp Frontend tự động sinh form và lưới dữ liệu động.

- **Endpoint:** `GET /api/ManagerDB/{tableName}/schema`
- **Ví dụ gọi API:** `/api/ManagerDB/Books/schema`
- **Response (200 OK):**
```json
[
  {
    "Name": "Id",
    "Type": "Int32",
    "IsPrimaryKey": true
  },
  {
    "Name": "Title",
    "Type": "String",
    "IsPrimaryKey": false
  }
]
```

---

## 3. Lấy Danh Sách Dữ Liệu Theo Bảng (Có Phân Trang)
Lấy toàn bộ dữ liệu của một bảng cụ thể. Hỗ trợ phân trang qua tham số.

- **Endpoint:** `GET /api/ManagerDB/{tableName}`
- **Query Parameters (Tùy chọn):**
  - `page` (int): Trang hiện tại (Mặc định: 1).
  - `pageSize` (int): Số lượng bản ghi trên một trang (Mặc định: 100).
- **Ví dụ gọi API:** `/api/ManagerDB/Books?page=1&pageSize=10`
- **Response (200 OK):**
```json
{
  "data": [
    {
      "Id": 1,
      "Title": "Tiên Tôn Lạc Trôi",
      "Author": "Ngã Thị Lão Ngũ",
      "ViewCount": 1500
    },
    ...
  ],
  "total": 350,
  "page": 1,
  "pageSize": 10
}
```

---

## 4. Lấy Chi Tiết Một Bản Ghi
Lấy thông tin của một dòng dữ liệu trong bảng dựa vào Khóa chính (Primary Key).

- **Endpoint:** `GET /api/ManagerDB/{tableName}/{id}`
- **Ví dụ gọi API:** `/api/ManagerDB/Books/1`
- **Response (200 OK):** Đối tượng JSON chứa dữ liệu bản ghi.
```json
{
  "Id": 1,
  "Title": "Tiên Tôn Lạc Trôi",
  "Author": "Ngã Thị Lão Ngũ",
  "Description": "Mô tả truyện...",
  "FormatType": 1
}
```

---

## 5. Thêm Mới Dữ Liệu (Insert)
Thêm một dòng dữ liệu mới vào bảng được chỉ định.

- **Endpoint:** `POST /api/ManagerDB/{tableName}`
- **Body JSON:** Chứa các cột và giá trị cần thêm. (Không cần gửi khóa chính nếu nó tự tăng).
```json
{
  "Title": "Phàm Nhân Tu Tiên",
  "Author": "Vong Ngữ",
  "FormatType": 1,
  "AccessLevel": 1
}
```
- **Lưu ý:** Tên thuộc tính trong body JSON nên được viết chuẩn với tên cột trong bảng (ví dụ: `Title`, `Author`).
- **Response (200 OK):** Trả về toàn bộ dữ liệu của bản ghi vừa được tạo thành công (tùy thuộc vào database có hỗ trợ trả về).

---

## 6. Cập Nhật Dữ Liệu (Update)
Cập nhật một dòng dữ liệu trong bảng dựa vào Khóa chính.

- **Endpoint:** `PUT /api/ManagerDB/{tableName}/{id}`
- **Body JSON:** Chứa các cột cần thay đổi và giá trị mới của chúng. Bạn chỉ cần gửi các trường muốn cập nhật.
```json
{
  "Title": "Phàm Nhân Tu Tiên - Phần 2",
  "AccessLevel": 2
}
```
- **Response (200 OK):** Trả về toàn bộ dữ liệu của bản ghi sau khi đã cập nhật.

---

## 7. Xóa Dữ Liệu (Delete)
Xóa một dòng dữ liệu khỏi bảng theo Khóa chính.

- **Endpoint:** `DELETE /api/ManagerDB/{tableName}/{id}`
- **Ví dụ gọi API:** `/api/ManagerDB/Books/1`
- **Response (200 OK):** Xóa thành công (trả về dữ liệu vừa bị xóa hoặc thông báo tùy cơ sở dữ liệu).
- **Lưu ý:** Việc xóa dữ liệu có thể thất bại do ràng buộc khóa ngoại (Foreign Key Constraints) nếu có bảng khác đang liên kết với dữ liệu này.

---

## 8. Tạo Bảng Mới (DDL)
Tạo mới một bảng trong cơ sở dữ liệu với các định nghĩa cột động.

- **Endpoint:** `POST /api/ManagerDB/schema/create-table`
- **Body JSON:**
```json
{
  "tableName": "MyNewTable",
  "columns": [
    {
      "name": "Id",
      "type": "SERIAL",
      "isPrimaryKey": true,
      "isNullable": false
    },
    {
      "name": "Name",
      "type": "VARCHAR(255)",
      "isPrimaryKey": false,
      "isNullable": true
    }
  ]
}
```
- **Response (200 OK):** `{"message": "Table MyNewTable created successfully."}`
- **Lưu ý quan trọng:** Các bảng tạo ra từ API này sẽ là bảng thật dưới CSDL, nhưng **Entity Framework Core có thể chưa nhận diện được** ngay lập tức. Để EF Core lấy và dùng được bằng API ManagerDB thông thường (`GetTables`, `Insert`, `Update`, v.v.), có thể bạn cần đồng bộ model hoặc khởi động lại ứng dụng nếu đang cấu hình Model cố định.

---

## 9. Xóa Bảng (DDL)
Xóa hoàn toàn một bảng (DROP TABLE) khỏi hệ thống.

- **Endpoint:** `DELETE /api/ManagerDB/schema/drop-table/{tableName}`
- **Ví dụ gọi API:** `/api/ManagerDB/schema/drop-table/MyNewTable`
- **Response (200 OK):** `{"message": "Table MyNewTable dropped successfully."}`
- **CẢNH BÁO:** Thao tác này sẽ xóa TẤT CẢ dữ liệu của bảng đó vĩnh viễn và không thể phục hồi!

---

### Chú ý về Bảo mật
API này sử dụng Entity Framework Metadata để xác thực tên bảng và tham số hóa (Parameterized Queries bằng Dapper) nhằm chống tấn công **SQL Injection**. Do đó, API hoàn toàn an toàn khi sử dụng để thao tác động trên các bảng hệ thống. Tuy nhiên, ở môi trường Production, nên cân nhắc phân quyền truy cập API này cho duy nhất cấp bậc quản trị (Admin).
