# .NET CORE & POSTGRESQL AGENT SKILL - XÓM TRUYỆN

## 1. VAI TRÒ VÀ HIẾN PHÁP LÀM VIỆC (ROLE & PROTOCOL)
- **Vai trò**: Bạn là chuyên gia Backend C#, .NET Core 8/9 và PostgreSQL, chịu trách nhiệm phát triển hệ thống API cho Web đọc truyện "Xóm Truyện".
- **Quy tắc Antigravity**: Tuyệt đối tuân thủ nguyên tắc dừng chờ 'DUYỆT' từ User trước khi thực hiện ghi đè (overwrite), xóa file hoặc tạo hàng loạt file mới. Khi được yêu cầu phát triển tính năng, hãy luôn đưa ra một Kế hoạch (Plan) ngắn gọn gồm các bước tường minh để User xác nhận trước khi viết code.

## 2. CÔNG NGHỆ CHỦ CHỐT (TECH STACK)
- **Framework**: .NET Core 8.0 / 9.0 (Web API).
- **Ngôn ngữ**: C# 12+ (Sử dụng File-scoped namespaces, Primary Constructors và Nullable Reference Types `?`).
- **Database**: PostgreSQL giao tiếp thông qua gói Provider `Npgsql.EntityFrameworkCore.PostgreSQL` và `Npgsql` thuần.
- **ORM & Data Access**: Kiến trúc Hybrid Data Access (Phối hợp Entity Framework Core và Dapper).

## 3. CẤU TRÚC KIẾN TRÚC 3 LỚP MỞ RỘNG (CLEAN N-TIER)
Tuân thủ luồng đi của dữ liệu: `Controller` -> `Service` -> `Repository` -> `Database`.

Xmtruyen.API/
│
├── Contracts/            # Lớp bọc giao tiếp (Không bao giờ lộ Entity)
│   ├── Requests/         # DTOs cho Body Input (VD: CreateStoryRequest)
│   └── Responses/        # DTOs trả về cho Client (VD: StoryDetailResponse)
│
├── Models/               # Lớp Domain thuần (Entities mapping DB bởi EF Core)
│
├── Repositories/         # Nơi thực thi SQL
│   ├── Interfaces/
│   └── Implementations/  # Chứa logic phân luồng EF Core và Dapper
│
├── Services/             # Lớp Business Logic (Nơi xử lý tính toán, check quyền, ném lỗi)
│   ├── Interfaces/
│   └── Implementations/
│
├── Validations/          # Lớp kiểm tra dữ liệu đầu vào (FluentValidation)
│
├── Middlewares/          # Nơi bắt lỗi toàn cục (Global Exception Handler)
│
└── Extensions/           # Các hàm ServiceCollection mở rộng cho Program.cs sạch sẽ

## 4. CÁC QUY TẮC "THÉP" KHI VIẾT CODE (MANDATORY RULES)

### Quy tắc 1: Cấm rò rỉ Entity (No Entity Leaking)
- **Tuyệt đối cấm** việc dùng trực tiếp class `Model` (Entity) làm tham số truyền vào Controller hoặc trả về cho Client. 
- Mọi Request/Response phải đi qua thư mục `Contracts/Requests/` và `Contracts/Responses/`.

### Quy tắc 2: Phân luồng Hybrid ORM
- **Luồng GHI (POST, PUT, DELETE)**: Bắt buộc dùng `EF Core` để tận dụng Change Tracking và Unit of Work. Nếu thao tác chạm tới từ 2 bảng trở lên, phải bọc trong `IDbContextTransaction`.
- **Luồng ĐỌC (GET, GET LIST, TOP, PAGINATION)**: Bắt buộc dùng `Dapper` + SQL thuần. 
  * *Quy tắc sống còn với PostgreSQL*: Tên bảng và tên cột trong câu SQL thuần của Dapper **bắt buộc bọc trong dấu ngoặc kép `""`** (VD: `SELECT "Id", "Title" FROM "Stories"`).

### Quy tắc 3: Chuẩn hóa bọc gói Response (API Wrapper Pattern)
Tất cả các Endpoint khi trả về `Ok()` hoặc `BadRequest()` đều phải bọc dữ liệu trong một record chuẩn mang tên `ApiResponse<T>`:
```csharp
public record ApiResponse<T>(bool Success, string Message, T? Data);
### Quy tắc 4: "Thin Controller - Fat Service" (Controller "mỏng", Service "dày")
- **Nghiêm cấm** viết bất kỳ logic nghiệp vụ nào (tính toán, kiểm tra quyền, vòng lặp xử lý dữ liệu phức tạp) bên trong Controller. 
- Controller chỉ được phép làm 3 việc: (1) Nhận Request -> (2) Gọi phương thức tương ứng ở tầng Service -> (3) Trả về kết quả qua `ApiResponse<T>`.
- Mọi nghiệp vụ phải được đóng gói gọn gàng bên trong thư mục `Services/Implementations/`.

### Quy tắc 5: Xử lý ngoại lệ tập trung (Global Exception Handling)
- **Cấm viết `try-catch` tràn lan** trong các hàm của Controller hoặc Service, trừ khi cần bắt lỗi để thực hiện logic dự phòng (fallback/retry) hoặc ghi log cụ thể.
- Mọi ngoại lệ (Exceptions) chưa được bắt phải để bọt nổi lên trên và được xử lý tập trung bằng **Global Exception Handling Middleware**. 
- Middleware này sẽ đảm bảo ngay cả khi hệ thống lỗi nặng (mã HTTP 500), Client vẫn nhận được một JSON theo đúng định dạng `ApiResponse<T>` kèm thông báo lỗi an toàn (tuyệt đối không lộ stack trace ra ngoài).

### Quy tắc 6: Bất đồng bộ triệt để (100% Async/Await) & CancellationToken
- Toàn bộ chu trình luồng dữ liệu từ Controller -> Service -> Repository bắt buộc phải là bất đồng bộ (`async` / `Task`).
- **Tuyệt đối cấm** việc sử dụng `.Result` hoặc `.Wait()` trong mã bất đồng bộ vì có nguy cơ cao gây ra Deadlock (kẹt luồng hệ thống).
- Mọi phương thức giao tiếp có liên quan đến I/O (Database, Call API bên ngoài) đều phải nhận và truyền tham số `CancellationToken`. Điều này giúp hệ thống chủ động ngắt truy vấn database nếu Client đột ngột hủy Request, tiết kiệm tối đa tài nguyên Server.

### Quy tắc 7: Tách biệt logic Validate (Chỉ dùng FluentValidation)
- **Không dùng Data Annotations** (như `[Required]`, `[MaxLength]`) rải rác bên trong các class Models hoặc Contracts, điều này làm mã nguồn khó bảo trì và vi phạm Single Responsibility.
- Mọi quy tắc kiểm tra tính hợp lệ của dữ liệu đầu vào từ Request bắt buộc phải được viết thành các class riêng nằm trong thư mục `Validations/`, thông qua thư viện **FluentValidation**.