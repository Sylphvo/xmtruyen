# Thiết kế Cơ sở dữ liệu: Quan hệ giữa User và Book

Tài liệu này mô tả cấu trúc thiết kế cơ sở dữ liệu (Database Schema) để giải quyết bài toán: **"Một User có thể sở hữu nhiều Book"**.

Để tránh tình trạng **lặp dữ liệu (data redundancy)** và lãng phí không gian lưu trữ trong các hệ quản trị CSDL quan hệ (như SQL Server, PostgreSQL, MySQL), chúng ta không nhúng trực tiếp dữ liệu bảng này vào bảng kia. Dữ liệu sẽ được chuẩn hóa (Normalization) bằng cách chia thành các bảng độc lập và liên kết qua **Khóa ngoại (Foreign Key)**.

Dưới đây là 2 kịch bản thiết kế dựa trên logic nghiệp vụ của ứng dụng:

---

## Kịch bản 1: Quan hệ Nhiều - Nhiều (Many-to-Many)
*Áp dụng cho: Ứng dụng đọc truyện, thương mại điện tử (E-books).*
*Một user có thể sở hữu nhiều đầu sách, và một đầu sách có thể được sở hữu bởi nhiều user.*

**Giải pháp:** Sử dụng **Bảng trung gian (Junction Table)**.

### 1. Sơ đồ các bảng
* `Users`: Chứa thông tin người dùng.
* `Books`: Chứa thông tin chung của đầu sách (chỉ lưu 1 lần duy nhất).
* `UserBooks`: Bảng trung gian, chỉ lưu mã User và mã Book để thể hiện quyền sở hữu.

### 2. Script SQL (Cơ bản)

```sql
-- 1. Bảng Users
CREATE TABLE Users (
    UserId INT PRIMARY KEY IDENTITY(1,1), -- Dùng SERIAL nếu là PostgreSQL
    Username NVARCHAR(100) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Books
CREATE TABLE Books (
    BookId INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(255) NOT NULL,
    Author NVARCHAR(150),
    Price DECIMAL(18,2)
);

-- 3. Bảng trung gian UserBooks
CREATE TABLE UserBooks (
    UserId INT,
    BookId INT,
    PurchaseDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (UserId, BookId), -- Composite Primary Key
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (BookId) REFERENCES Books(BookId) ON DELETE CASCADE
);
```

### 3. Ưu điểm
- Dữ liệu sách (`Title`, `Author`) hoàn toàn **không bị lặp lại**.
- Tối ưu không gian lưu trữ: Bảng `UserBooks` chỉ lưu 2 con số (INT) đại diện cho quyền sở hữu.

---

## Kịch bản 2: Quan hệ Một - Nhiều (One-to-Many)
*Áp dụng cho: Quản lý thư viện vật lý, kho hàng vật lý.*
*Mỗi cuốn sách là một thực thể vật lý độc bản (có mã vạch/barcode riêng). Tại một thời điểm, một cuốn sách vật lý chỉ do 1 user duy nhất nắm giữ/sở hữu.*

**Giải pháp:** Đặt trực tiếp khóa ngoại (Foreign Key) tại bảng `Books`.

### 1. Sơ đồ các bảng
* `Users`: Chứa thông tin người mượn/chủ sở hữu.
* `Books`: Chứa thông tin của từng cuốn sách vật lý, kèm theo `OwnerId` trỏ về người đang giữ nó.

### 2. Script SQL (Cơ bản)

```sql
-- 1. Bảng Users
CREATE TABLE Users (
    UserId INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(100) NOT NULL
);

-- 2. Bảng Books (đã bao gồm Khóa ngoại)
CREATE TABLE Books (
    BookId INT PRIMARY KEY IDENTITY(1,1), -- Hoặc mã Barcode (VARCHAR)
    Title NVARCHAR(255) NOT NULL,
    OwnerId INT NULL, -- NULL nếu sách đang ở trong kho, chưa ai sở hữu
    AcquiredDate DATETIME,
    FOREIGN KEY (OwnerId) REFERENCES Users(UserId) ON DELETE SET NULL
);
```

### 3. Ưu điểm
- Cấu trúc đơn giản, không cần bảng trung gian.
- Truy vấn cực nhanh: Chỉ cần `SELECT * FROM Books WHERE OwnerId = @UserId` để lấy toàn bộ sách của một người.

