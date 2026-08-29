# Yêu cầu triển khai (Antigravity / AI Context): Xử lý Tải lên hàng loạt Chapter (Bulk Upload)

## 1. Mục tiêu (Objective)
Phát triển tính năng cho phép admin tải lên một file nén (`.zip` hoặc `.cbz`) chứa hàng loạt ảnh của nhiều chapter (ví dụ: 180 chapter). Hệ thống sẽ tự động bóc tách thư mục, giải nén, tạo các bản ghi Chapter vào cơ sở dữ liệu PostgreSQL, lưu trữ ảnh vật lý vào thư mục `wwwroot` và tạo bản ghi ChapterImage cho từng ảnh theo đúng thứ tự logic.

## 2. Ánh xạ Cấu trúc Dự án (Project Structure Mapping)
Dựa trên kiến trúc hiện tại của workspace:
- **Frontend Admin**: `xmtruyen-admin` (ReactJS).
- **Backend API**: `xmtruyen.API` (.NET Core Web API).
- **Database**: PostgreSQL (truy xuất qua Entity Framework Core/Repositories).

---

## 3. Hướng dẫn Triển khai Backend (`xmtruyen.API`)

Tính năng này cần tuân thủ nghiêm ngặt kiến trúc N-Tier hiện tại của dự án:

### 3.1. Cấu hình hệ thống (`Program.cs`)
File nén chứa 180 chapters thường có dung lượng rất lớn (có thể lên đến >1GB). Cần thiết lập lại giới hạn dung lượng của Server trong `Program.cs`:
```csharp
// Tăng giới hạn Kestrel cho Request
builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 1073741824; // 1GB
});

// Tăng giới hạn Multipart Form Data
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 1073741824; // 1GB
});
```

### 3.2. Lớp Utilities (`Utils/ArchiveHelper.cs` - Tạo mới nếu cần)
Tạo một Helper chuyên dụng để xử lý việc đọc luồng file nén:
- **Xử lý luồng nhớ**: Sử dụng `System.IO.Compression.ZipArchive` đọc trực tiếp từ `Stream` thay vì bung ra đĩa.
- **Trích xuất thông minh (Regex)**: Sử dụng Biểu thức chính quy (Regex: `\d+`) để lấy số chương (chapter number) từ tên thư mục (ví dụ thư mục "Chap 12" -> xuất ra `12`). Việc chuyển đổi sang số nguyên (`int`) là bắt buộc để hệ thống order chapters chuẩn xác (1, 2, 3... 10 thay vì sort theo chuỗi: 1, 10, 2, 3).

### 3.3. Lớp Contracts/DTOs (`Contracts/Requests/BulkUploadChapterRequest.cs`)
```csharp
public class BulkUploadChapterRequest
{
    // Có thể truyền thêm các thông tin config từ admin nếu cần
    public IFormFile File { get; set; } // Bắt buộc nhận .zip hoặc .cbz
}
```

### 3.4. Lớp Services (`Services/ChapterService.cs` hoặc `BookService.cs`)
Tuyệt đối **KHÔNG** viết logic giải nén bên trong thư mục `Controllers/`. Toàn bộ logic nghiệp vụ (Business Logic) phải đặt tại `Services/`:
1. **Lọc dữ liệu**: Chỉ xử lý các `ZipArchiveEntry` có định dạng `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`. Bỏ qua file rác sinh ra từ HĐH (như `.DS_Store`).
2. **Gom nhóm (Grouping)**: Dùng LINQ `GroupBy` gom các entry dựa trên cấp thư mục cha (ví dụ: `entry.FullName.Split('/')[0]`).
3. **Quản lý Transaction**: Bọc toàn bộ quá trình DB vào **Transaction** (`IDbContextTransaction` từ EF Core). Nếu xảy ra lỗi giữa chừng (file zip hỏng, hết dung lượng), **Rollback** toàn bộ dữ liệu (Xoá chapter đã insert trong batch, xoá file vật lý đã giải nén ra `wwwroot`).
4. **Lưu vật lý**: Inject `IWebHostEnvironment` để copy ảnh vào thư mục `wwwroot/uploads/books/{bookId}/{chapterId}/`.

### 3.5. Lớp Repositories (`Repositories/ChapterRepository.cs` & `ChapterImageRepository.cs`)
Tối ưu hóa các thao tác Database với PostgreSQL:
- Bắt buộc dùng `AddRangeAsync` đối với danh sách `ChapterImage` và gọi `SaveChangesAsync()` một lần ở cuối chu trình xử lý mỗi chapter để giảm tải I/O Database.

### 3.6. Lớp Controllers (`Controllers/ChaptersController.cs`)
```csharp
[HttpPost("{bookId}/bulk-upload")]
[RequestSizeLimit(1073741824)] // 1GB limit config overriding
[RequestFormLimits(MultipartBodyLengthLimit = 1073741824)]
public async Task<IActionResult> BulkUploadChapters([FromRoute] Guid bookId, [FromForm] IFormFile file)
{
    // 1. Validation kiểm tra định dạng đuôi file (.zip, .cbz)
    // 2. Gọi interface service (vd: await _chapterService.ProcessBulkUploadAsync(bookId, file))
    // 3. Trả về format chuẩn API response của hệ thống
}
```

---

## 4. Hướng dẫn Triển khai Frontend (`xmtruyen-admin`)

Tại giao diện quản lý Chapters:
- **Tạo Component Mới**: `BulkUploadModal.jsx` hoặc thêm tab bên cạnh chức năng tạo chapter thủ công hiện tại.
- **UI / Cảnh báo UX**: Cần có Text note rõ ràng: *"File nén (.zip, .cbz) phải được chia thành các thư mục chapter (Ví dụ: Thư mục 'Chap 1' chứa các file ảnh). Quá trình tải lên file lớn có thể mất vài phút. Tuyệt đối không tải lại trang."*
- **Xử lý Axios/Fetch**:
```javascript
// Gửi qua form-data với cấu hình Timeout kéo dài
const formData = new FormData();
formData.append('file', selectedZipFile);

const config = {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 600000, // Timeout 10 phút vì quá trình Server giải nén cực tốn thời gian
    onUploadProgress: (progressEvent) => {
        // Cập nhật thanh tiến trình hiển thị cho admin
        let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    }
};

await axios.post(`/api/chapters/${bookId}/bulk-upload`, formData, config);
```
- Quản lý State `isLoading` cẩn thận: Vô hiệu hóa (Disable) nút Upload và hiển thị Loading Spinner che toàn màn hình để ngăn admin click thao tác khác.


Hướng dẫn chi tiết cấu hình tối ưu cho File Zip (Bulk Upload Chapters)

Để hệ thống Web API (.NET Core) hoạt động ổn định với File Zip chứa 180 chapter, vấn đề cốt lõi là xử lý đồng thời dung lượng file lớn và lượng tài nguyên (bộ nhớ/CPU) khi giải nén. Dưới đây là các bước cấu hình chi tiết và tối ưu nhất:


Cấu hình Kestrel & Multipart Limits (Program.cs)

