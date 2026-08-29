# LUỒNG NGHIỆP VỤ: ĐỌC TRUYỆN & QUẢNG CÁO (READING & ADS FLOW)

## 1. Dữ liệu tham chiếu (Database Context)
- `Users`: Chứa `Provider` (system/guest/google/zalo), `CoinBalance`, `CurrentPlanId`, `TotalGuestReads`, `DailyReadCount`.
- `SubscriptionPlans`: Chứa `IsUnlimited`, `MaxChaptersPerDay`, `RemoveAds`, `CoinPrice`.
- `Chapters`: Chứa `CoinPrice` (giá = 0 là miễn phí).
- `UserPurchasedChapters`: Lưu lịch sử mua chap lẻ.

## 2. Luồng xử lý Quảng Cáo (Ads Logic)
- **Input:** `UserId`
- **Logic:** 
  1. Lấy thông tin User.
  2. Nếu User không có `CurrentPlanId` (User thường hoặc Guest) -> `ShowAds = true`.
  3. Nếu User có `CurrentPlanId`: check bảng `SubscriptionPlans`. Nếu `RemoveAds == true` -> `ShowAds = false`.

## 3. Luồng cấp quyền đọc truyện (Read Permission Logic)
- **Input:** `UserId` (có thể null nếu là khách), `ChapterId`
- **Output:** Trả về nội dung Chapter (hoặc danh sách ảnh) / HOẶC trả về lỗi (yêu cầu nạp tiền/đăng nhập).

**Quy tắc xét duyệt (Theo thứ tự ưu tiên):**
1. **Nếu `Chapter.CoinPrice == 0`**: Cho phép tất cả đọc miễn phí.
2. **Nếu User chưa đăng nhập (Guest):**
   - Check `User.TotalGuestReads`.
   - Nếu < 10: Cho đọc -> Update `TotalGuestReads += 1`.
   - Nếu >= 10: Throw Error "Bạn đã hết lượt đọc thử, vui lòng đăng nhập".
3. **Nếu User là VIP (`SubscriptionPlans.IsUnlimited == true`):**
   - Cho phép đọc ngay lập tức, không trừ xu.
4. **Nếu User là Basic (`SubscriptionPlans.IsUnlimited == false`):**
   - Check `User.LastReadDate`. Nếu là ngày mới -> Reset `DailyReadCount = 0`.
   - Nếu `User.DailyReadCount < SubscriptionPlans.MaxChaptersPerDay`: Cho đọc -> Update `DailyReadCount += 1`.
   - Nếu đã vượt quá lượt trong ngày: Chuyển sang bước 5.
5. **Nếu User Thường (Hoặc Basic hết lượt):**
   - Check `UserPurchasedChapters` xem user đã mua `ChapterId` này chưa.
   - Đã mua: Cho đọc.
   - Chưa mua: 
     - Kiểm tra `User.CoinBalance >= Chapter.CoinPrice`.
     - Đủ xu: Trừ xu (`CoinBalance -= CoinPrice`) -> Insert vào `UserPurchasedChapters` -> Cho đọc.
     - Không đủ xu: Throw Error "Tài khoản không đủ xu, vui lòng nạp thêm".
## 6. LUỒNG NGHIỆP VỤ LÕI (CORE BUSINESS FLOWS)
Agent phải tuân thủ nghiêm ngặt các luồng logic nghiệp vụ sau đây khi triển khai các API quản trị (Admin) và Client:

### A. Định nghĩa Phân loại (Enums)
Bắt buộc sử dụng `Enum` trong C# để quản lý các loại sách, giúp Code an toàn và dễ kiểm soát:
- **FormatType (Định dạng):** `1 = Text` (Truyện chữ), `2 = Comic` (Truyện tranh/Hình ảnh).
- **AccessLevel (Quyền truy cập):** `1 = Free` (Miễn phí toàn bộ), `2 = Vip` (Truyện VIP, yêu cầu trả phí hoặc tài khoản VIP mới được đọc các chương bị khóa).

### B. Nghiệp vụ Quản lý Thể loại (Topics / Categories)
- **Thêm mới (Create):** 
  - Input: `Name` (Tên thể loại).
  - Logic: Tự động sinh `Slug` từ Name (VD: "Tiên Hiệp" -> "tien-hiep"). Phải check trùng lặp Slug trước khi `AddAsync` bằng EF Core.
- **Cập nhật (Update):**
  - Chỉ cho phép đổi `Name`. `Slug` có thể được giữ nguyên để không làm chết các link SEO cũ (hoặc sinh Slug mới nhưng phải cảnh báo).
- **Xóa (Delete):**
  - **Luật thép:** Không được xóa cứng (Hard Delete) nếu Thể loại đó đang có sách (count > 0). Phải ném ra lỗi `BadRequest` ("Không thể xóa thể loại đang chứa truyện").
- **Đọc (Read):** Dùng Dapper.

### C. Nghiệp vụ Quản lý Sách (Books)
- **Thêm Sách (Create Book):**
  - Giao dịch (Transaction) bắt buộc: Khi thêm Sách, phải lưu đồng thời thông tin Sách và danh sách Thể loại (bảng `BookCategories`) vào database cùng một lúc.
  - Tự động sinh `Slug` từ `Title` kết hợp với một mã random ngắn để tránh trùng (VD: "than-dong-dat-viet-8a2f").
- **Sửa Sách (Update Book):**
  - Cho phép cập nhật `Title`, `Description`, `FormatType`, `AccessLevel`...
  - **Xử lý Thể loại (Topics):** Khi Admin thay đổi danh sách Thể loại, EF Core phải xóa các record cũ trong bảng `BookCategories` và Insert các record mới.
- **Xóa Sách (Delete Book):**
  - Xóa sách sẽ kích hoạt `Cascade Delete` (xóa toàn bộ Chương, Đánh giá, Lịch sử đọc liên quan). Phải có bước xác nhận kép (Soft Delete là một điểm cộng nếu mở rộng sau này).
- **Lấy danh sách (Get List - Admin):** Dùng Dapper, hỗ trợ Filter động (Lọc theo Truyện Tranh/Chữ, Lọc theo VIP/Free, Lọc theo Thể loại, Search theo Tên).

### D. Nghiệp vụ Quản lý Chương (Chapters) - Mở rộng linh hoạt
Luồng thêm chương sẽ khác nhau hoàn toàn dựa vào `FormatType` của Sách:
- **Nếu Sách là `Text` (Truyện Chữ):**
  - Bắt buộc phải có dữ liệu truyền vào cột `Content` (Nội dung chữ, HTML).
  - Cột `ImageUrls` bỏ trống.
- **Nếu Sách là `Comic` (Truyện Tranh):**
  - Bắt buộc phải có danh sách link ảnh truyền vào cột `ImageUrls` (Lưu dưới dạng JSON mảng các đường link).
  - Cột `Content` bỏ trống.
- **Cơ chế Khóa VIP (`IsLocked`):**
  - Nếu Sách có `AccessLevel = Vip`, Admin khi thêm Chương sẽ có quyền chọn `IsLocked = true` (Chương thu phí) hoặc `false` (Đọc thử miễn phí). 
  - *Luồng Client Đọc Truyện:* Khi Client gọi API lấy chi tiết Chương, Service phải check xem Chương có `IsLocked = true` không. Nếu có, tiếp tục check User hiện tại có đang là tài khoản VIP không. Nếu không, chỉ trả về một phần nội dung (Teaser) hoặc mã lỗi 403 Forbidden ("Bạn cần nâng cấp VIP để đọc chương này").