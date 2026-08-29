# Yêu Cầu Nghiệp Vụ: Dịch Vụ Xử Lý & Tối Ưu Hóa Sách (Book Processing Service)

## 1. Tổng Quan (Overview)
**Book Processing Service** là một Background Service chịu trách nhiệm xử lý các file tài liệu (PDF, EPUB) ngay sau khi Admin tải lên thành công. 
Mục tiêu là biến đổi một file gốc dung lượng lớn thành các phân mảnh nhỏ, nhẹ, hỗ trợ frontend (Web/Mobile App) có thể tải mượt mà theo cơ chế "đọc đến đâu, tải đến đó" (Lazy-loading) và bảo vệ nội dung kỹ thuật số.

## 2. Luồng Xử Lý (Workflow)
Luồng xử lý diễn ra hoàn toàn **bất đồng bộ (Asynchronous)** thông qua Message Queue (ví dụ: RabbitMQ, Redis Queue, Kafka) để không làm treo giao diện của Admin.

### Bước 1: Tiếp nhận và Xác thực (Ingestion & Validation)
* Service nhận tín hiệu có file mới cần xử lý từ Queue.
* Xác thực định dạng file (MIME type).
* Quét lỗi cơ bản hoặc mã độc (tùy chọn).

### Bước 2: Trích xuất Dữ Liệu (Metadata & TOC Extraction)
* **Trích xuất Mục lục (Table of Contents):** Quét file gốc để lấy cây mục lục (Bookmark/TOC), lưu thành cấu trúc JSON. Việc này giúp người dùng có thể chuyển chương nhanh chóng mà không cần đợi tải toàn bộ sách.
* **Đếm số trang:** Xác định tổng số trang (với PDF) hoặc tổng số chương (với EPUB).

### Bước 3: Phân mảnh & Render (Chunking & Rasterization)
Đây là bước cốt lõi để làm nhẹ file cho người đọc.
* **Đối với định dạng PDF:**
  * Lặp qua từng trang của file PDF gốc.
  * Render mỗi trang thành một file ảnh độc lập (định dạng WebP hoặc JPEG) với độ phân giải đủ nét để đọc nhưng dung lượng được nén tối ưu.
  * *Quy tắc:* Mỗi trang sinh ra 1 file ảnh. Tên file được đánh số thứ tự (VD: `page_001.webp`, `page_002.webp`).
* **Đối với định dạng EPUB:**
  * Giải nén và bóc tách các file HTML/XML bên trong.
  * Chia nhỏ nội dung theo từng chương. Mỗi chương là một mảnh dữ liệu riêng.

### Bước 4: Tạo Ảnh Thu Nhỏ (Thumbnail Generation)
* Từ trang đầu tiên (trang bìa) và các trang nội dung, tự động sinh ra các ảnh thu nhỏ (Thumbnails) với chiều cao/rộng cố định (VD: max-height 300px).
* Thumbnails được sử dụng cho tính năng "Xem trước" (Preview) hoặc "Lưới trang" (Grid View) trên app đọc sách.

### Bước 5: Đóng Gói, Mã Hóa & Lưu Trữ (Storage & DRM)
* **Mã hóa (Tùy chọn):** Nếu hệ thống yêu cầu bảo vệ bản quyền, các file ảnh/nội dung vừa cắt ra sẽ được chạy qua thuật toán mã hóa (VD: AES-256 hoặc định dạng custom của hệ thống) để chống tải lậu.
* **Lưu trữ:** Đẩy toàn bộ các file phân mảnh (ảnh trang, thumbnail) lên hệ thống lưu trữ phân tán (Object Storage như AWS S3, MinIO) thay vì lưu trên server ứng dụng.

### Bước 6: Cập Nhật Trạng Thái (Completion)
* Cập nhật trạng thái của bản ghi sách trong Database từ `PROCESSING` sang `READY`.
* Lưu lại các thông tin: Tổng số trang, URL đường dẫn gốc tới thư mục chứa các mảnh trên Storage.

## 3. Cấu Trúc Dữ Liệu Giao Tiếp (I/O Payload)

### 3.1. Input Message (Từ Admin App gửi vào Queue)
```json
{
  "taskId": "uuid-v4",
  "bookId": "uuid-v4",
  "fileName": "sach-tam-ly-hoc.pdf",
  "sourceUrl": "s3://raw-bucket/uploads/sach-tam-ly-hoc.pdf",
  "fileType": "application/pdf",
  "options": {
    "extractToc": true,
    "generateThumbnails": true,
    "enableEncryption": false
  }
}

### 3.2. Output Message (Thông báo hoàn thành hoặc lỗi)
```json
{
  "taskId": "uuid-v4",
  "bookId": "uuid-v4",
  "status": "COMPLETED", // hoặc "FAILED"
  "message": "Book processed successfully",
  "processingTimeMs": 120500,
  "output": {
    "pdfUrl": "s3://processed-bucket/books/uuid-v4/original.pdf",
    "imageUrl": "s3://processed-bucket/books/uuid-v4/cover.webp",
    "pagesUrl": "s3://processed-bucket/books/uuid-v4/pages/", // Đường dẫn tới thư mục chứa các ảnh trang
    "totalPage": 250,
    "toc": [ ... ] // Cây mục lục
  }
}

## 4. Công Nghệ Đề Xuất (Recommended Tech Stack)

Để triển khai Book Processing Service hiệu quả trên nền tảng .NET, bạn có thể sử dụng các thư viện mã nguồn mở sau:

### 4.1. Xử Lý PDF (PDF Processing)
* **PdfPig** (Thư viện đọc và xử lý PDF mạnh mẽ, hỗ trợ trích xuất văn bản và bookmark/TOC)
* **Magick.NET** (Wrapper của ImageMagick, dùng để render PDF sang ảnh)

### 4.2. Xử Lý EPUB (EPUB Processing)
* **DotNetOpenXml** (Hỗ trợ đọc và thao tác với định dạng EPUB)

### 4.3. Tạo Ảnh & Thumbnail (Image Processing)
* **ImageSharp** (Thư viện xử lý ảnh hiện đại cho .NET)

### 4.4. Message Queue (hàng đợi)
* **RabbitMQ** hoặc **Redis** (sử dụng các thư viện client .NET chính thức)

### 4.5. Lưu Trữ (Storage)
* **MinIO** (Máy chủ object storage tương thích S3, có thể tự host)
* Hoặc tích hợp với **AWS S3**, **Azure Blob Storage** nếu đang sử dụng cloud.

## 5. Ví Dụ Cấu Trúc Thư Mục (Storage Structure)

Khi lưu trữ trên object storage, bạn có thể tổ chức thư mục theo cấu trúc sau:

```
books/
├── {book_id}/
│   ├── original.pdf            # File PDF gốc (cần thiết cho việc render lại)
│   ├── cover.webp              # Ảnh trang bìa (thumbnail chính)
│   ├── page_001.webp           # Ảnh trang 1
│   ├── page_002.webp           # Ảnh trang 2
│   ├── ...
│   ├── page_NNN.webp           # Ảnh trang N
│   ├── metadata.json           # Thông tin về sách
│   └── toc.json                # Mục lục JSON
```
