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