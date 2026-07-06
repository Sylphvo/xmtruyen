# TÀI LIỆU API QUẢN LÝ USER (USER MANAGEMENT API)

**Base URL (Ví dụ):** `http://localhost:<port>`
**Tất cả các API này đều yêu cầu:** (Sắp tới sẽ cần Header `Authorization: Bearer <token>` với Role là `Admin`)

## 1. Lấy danh sách Users (có phân trang & filter)
- **Method:** `GET`
- **Endpoint:** `/api/users`
- **Query Parameters:**
  - `searchKeyword` *(string, optional)*: Tìm kiếm theo Email hoặc FullName.
  - `provider` *(string, optional)*: Lọc theo nhà cung cấp đăng nhập (ví dụ: Google, Local,...).
  - `isActive` *(boolean, optional)*: Lọc theo trạng thái hoạt động.
  - `minCoinBalance` *(integer, optional)*: Lọc theo số xu tối thiểu.
  - `maxCoinBalance` *(integer, optional)*: Lọc theo số xu tối đa.
  - `currentPlanId` *(integer, optional)*: Lọc theo ID của gói Plan hiện tại.
  - `page` *(integer, optional)*: Trang hiện tại (Mặc định: `1`).
  - `pageSize` *(integer, optional)*: Số lượng user trên mỗi trang (Mặc định: `20`).
  - `sortBy` *(string, optional)*: Tên cột để sắp xếp (Mặc định: `CreatedAt`).
  - `isDescending` *(boolean, optional)*: Chiều sắp xếp giảm dần (Mặc định: `true`).
- **Response (200 OK):**
```json
{
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "email": "user@example.com",
      "fullName": "Nguyen Van A",
      "avatarUrl": "https://...",
      "provider": "Local",
      "coinBalance": 100,
      "currentPlanId": 1,
      "currentPlanName": "VIP",
      "planExpiredAt": "2024-12-31T23:59:59Z",
      "totalGuestReads": 5,
      "dailyReadCount": 2,
      "createdAt": "2024-01-01T10:00:00Z",
      "isActive": true
    }
  ],
  "totalCount": 100,
  "page": 1,
  "pageSize": 20
}
```

## 2. Lấy chi tiết 1 User theo ID
- **Method:** `GET`
- **Endpoint:** `/api/users/{id}`
- **Path Parameter:** `id` *(Guid)*: ID của user.
- **Response (200 OK):** Trả về 1 object `User` như trong mảng `data` của API Lấy danh sách.
- **Response (404 Not Found):** `{"message": "User not found"}`

## 3. Tạo mới User
- **Method:** `POST`
- **Endpoint:** `/api/users`
- **Request Body (JSON):**
```json
{
  "email": "string", // Bắt buộc, chuẩn định dạng email, tối đa 255 ký tự
  "password": "string", // Tùy chọn (nếu có password)
  "fullName": "string", // Tùy chọn, tối đa 100 ký tự
  "avatarUrl": "string", // Tùy chọn, link ảnh
  "coinBalance": 0, // Tùy chọn, số dư xu
  "currentPlanId": 1, // Tùy chọn, ID của Plan
  "planExpiredAt": "2024-12-31T23:59:59Z", // Tùy chọn, ngày hết hạn Plan
  "isActive": true // Tùy chọn, mặc định true
}
```
- **Response (201 Created):** Trả về object `User` vừa được tạo thành công.
- **Response (400 Bad Request):** Báo lỗi validation hoặc logic `{"message": "Lỗi chi tiết"}`.

## 4. Cập nhật User
- **Method:** `PUT`
- **Endpoint:** `/api/users/{id}`
- **Path Parameter:** `id` *(Guid)*: ID của user cần sửa.
- **Request Body (JSON):** *Giống hệt Request Body của API Tạo mới User.* (Gửi đầy đủ các trường muốn giữ lại).
- **Response (200 OK):** Trả về object `User` sau khi đã cập nhật.
- **Response (404 Not Found):** `{"message": "..."}`

## 5. Cập nhật Trạng thái User (Bật/Tắt khóa tài khoản)
- **Method:** `PATCH`
- **Endpoint:** `/api/users/{id}/status`
- **Path Parameter:** `id` *(Guid)*: ID của user.
- **Request Body (JSON):** *Truyền thẳng giá trị boolean, ví dụ:*
```json
true
```
*(hoặc `false` để khóa user)*
- **Response (204 No Content):** Thành công, không trả về dữ liệu.
- **Response (404 Not Found):** `{"message": "..."}`

## 6. Xóa User
- **Method:** `DELETE`
- **Endpoint:** `/api/users/{id}`
- **Path Parameter:** `id` *(Guid)*: ID của user cần xóa.
- **Response (204 No Content):** Thành công, không trả về dữ liệu.
- **Response (404 Not Found):** `{"message": "..."}`

---
**Ghi chú dành cho Client (Frontend):**
- Mã lỗi chung có dạng `{"message": "Lý do lỗi"}` (áp dụng cho lỗi 400 Bad Request hoặc 404 Not Found).
- Các trường ngày tháng như `createdAt`, `planExpiredAt` được trả về theo chuẩn ISO 8601 UTC.
- Các trường tuỳ chọn (optional) trong Response có thể trả về `null` nếu không có dữ liệu.
