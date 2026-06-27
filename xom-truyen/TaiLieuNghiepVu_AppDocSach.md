# TÀI LIỆU YÊU CẦU NGHIỆP VỤ (USER FLOW & BUSINESS LOGIC) - CLIENT APP

## 1. Tổng quan hệ thống
Tài liệu này mô tả luồng nghiệp vụ (user flow) cho ứng dụng đọc sách ở phía Client (người dùng cuối) dựa trên sơ đồ cấu trúc (Sitemap/Flowchart) đã cung cấp.

## 2. Phân hệ Xác thực (Authentication)
- **Đăng Nhập/Đăng ký (Login/Register):** Điểm bắt đầu của ứng dụng. Người dùng tiến hành đăng nhập vào hệ thống hoặc tạo tài khoản mới.
- **Quên mật khẩu (Forgot password):** Từ luồng Đăng nhập, người dùng có thể chọn quên mật khẩu để tiến hành các bước khôi phục. 
- Sau khi xác thực thành công, hệ thống điều hướng người dùng vào **Trang chủ (Home page)**.

## 3. Các chức năng/Điều hướng chính (Main Navigation)
Từ giao diện chính, người dùng có thể truy cập vào 4 luồng tính năng lớn:
1. Trang chủ (Home page)
2. Lịch sử (History)
3. Lưu trữ (Save)
4. Cài đặt (Setting)

### 3.1. Trang chủ (Home page)
Màn hình chính hiển thị các danh mục và bộ sưu tập sách để người dùng khám phá. Bao gồm:
- **Mới nhất (Latests):** Danh sách các sách mới được cập nhật trên hệ thống.
- **Sách đề xuất (Recommended books):** Các đầu sách được hệ thống gợi ý.
- **Sách độc quyền (Exclusive books):** Sách chỉ phát hành độc quyền trên nền tảng.
- **Sách được đánh giá cao (Highly rated books):** Sách có điểm rating cao từ cộng đồng người đọc.
- **Sách được yêu thích (Favorite books):** Sách có lượt yêu thích cao.
> **Luồng chung:** Người dùng click vào bất kỳ tựa sách nào trong các danh sách trên đều sẽ được điều hướng tới trang **Thông tin sách (Book information)**.

### 3.2. Lịch sử (History)
Nơi lưu lại các dấu vết hoạt động và tương tác của người dùng với các đầu sách. Bao gồm các bộ lọc/danh sách:
- **Sách đã đọc (Books read)**
- **Sách đã đánh giá (Books review)**
- **Sách đã lưu (Saved books)**
- **Sách yêu thích (Favorite books)**
> **Luồng chung:** Nhấp vào sách sẽ điều hướng tới trang **Thông tin sách (Book information)**.

### 3.3. Lưu trữ (Save / Thư viện cá nhân)
Quản lý các sách mà người dùng đã chủ động lưu lại để đọc hoặc theo dõi. Bao gồm:
- **Sách đã lưu (Saved books)**
- **Sách yêu thích (Favorite books)**
> **Luồng chung:** Nhấp vào sách sẽ điều hướng tới trang **Thông tin sách (Book information)**.

### 3.4. Cài đặt (Setting)
Quản lý thông tin tài khoản và cấu hình hệ thống:
- **Hồ sơ (Profile):** Xem và chỉnh sửa thông tin cá nhân của người dùng.
- **Đăng xuất (Log out):** Kết thúc phiên làm việc hiện tại, đưa người dùng về lại màn hình Đăng nhập.

## 4. Luồng Chức năng Sách & Đọc Sách (Core Features)

### 4.1. Thông tin sách (Book information)
Đây là trang trung tâm (Hub) gom luồng từ tất cả các danh sách sách (Trang chủ, Lịch sử, Lưu trữ). Màn hình này hiển thị chi tiết về một cuốn sách cụ thể. Tại đây người dùng có thể thực hiện 2 chức năng (Function) chính:
- **Đánh giá sách (Books review):** Cho phép người dùng viết nhận xét và chấm điểm cho cuốn sách.
- **Đọc sách (Read):** Mở trình đọc (Reader) để bắt đầu đọc nội dung sách.

### 4.2. Trình Đọc sách (Read Function)
Khi vào màn hình Đọc sách, hệ thống cung cấp 3 chức năng (Function) bổ trợ nhằm tối ưu trải nghiệm đọc:
- **Danh mục (List):** Mở mục lục để xem các chương/phần và chuyển hướng nhanh trong sách.
- **Ghi chú (Note):** Cho phép người dùng bôi đen (highlight) hoặc tạo các ghi chú cá nhân tại các đoạn văn bản cụ thể.
- **Đánh dấu trang (Bookmark):** Lưu lại vị trí trang hiện tại để người dùng có thể nhanh chóng quay lại đọc tiếp vào lần sau.

---
*Tài liệu này được biên soạn bám sát 100% vào cấu trúc luồng màn hình được cung cấp.*
