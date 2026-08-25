# Đề xuất gom nhóm menu Admin Xóm Truyện

## 1. Mục tiêu

Hiện tại Admin có nhiều menu lớn và nhiều mục nằm rải rác. Tài liệu này đề xuất gom các chức năng gần nhau thành nhóm nghiệp vụ rõ ràng hơn để:

- Sidebar ngắn và dễ tìm.
- Giảm số lượng menu cấp cao.
- Các chức năng liên quan nằm cùng một nhóm.
- Không xóa chức năng hiện có.
- Có thể triển khai từng bước mà không phá route hiện tại.

## 2. Nguyên tắc phân nhóm

- Phân nhóm theo nghiệp vụ, không chỉ theo tên màn hình.
- Mỗi nhóm lớn có một trang tổng quan hoặc menu chính.
- Các mục ít dùng nên nằm trong nhóm `Hệ thống` hoặc `Công cụ`.
- Không để một chức năng xuất hiện ở hai nhóm khác nhau nếu không cần thiết.
- Giữ nguyên URL hiện tại trong giai đoạn đầu; chỉ thay đổi cách hiển thị menu.
- Các chức năng nguy hiểm như Database, Apply dữ liệu và System Config phải được tách quyền rõ ràng.

## 3. Cấu trúc menu đề xuất

```text
Dashboard

1. Nội dung
   - Tất cả sách
   - Sách chữ
   - Truyện tranh
   - Chapters
   - File sách
   - Tác giả
   - Thể loại
   - Chủ đề
   - Import dữ liệu
   - Crawler

2. Biên tập và dịch thuật
   - Dashboard dịch thuật
   - Upload RAW
   - Translation Jobs
   - Review bản dịch
   - Glossary

3. Media và xuất bản
   - Audio Dashboard
   - Quản lý giọng đọc
   - Nhân vật và mapping giọng đọc
   - Video truyện chữ
   - Video truyện tranh
   - Dàn trang và xuất bản PDF

4. Người dùng và cộng đồng
   - Người dùng
   - Đánh giá
   - Báo cáo vi phạm
   - Thông báo
   - Lịch sử hoạt động người dùng

5. Thương mại
   - Gói VIP
   - Gói xu
   - Giao dịch
   - Khuyến mãi

6. Trang chủ và CMS
   - Banners
   - Home Sections
   - Static Pages
   - FAQ
   - Help Articles
   - Email Templates

7. Phân tích và vận hành
   - Reports
   - Reading Analytics
   - Error Logs
   - Health Check
   - Test Cases
   - Build Process

8. Hệ thống
   - Database Overview
   - Database Tables
   - System Configs
   - Role và Permission
   - Audit Logs
```

## 4. Bảng ánh xạ menu hiện tại

### 4.1. Nhóm Nội dung

| Menu hiện tại | Nhóm đề xuất | Lý do |
|---|---|---|
| Tất cả sách | Nội dung | Điểm vào chính của quản lý sách |
| Sách | Nội dung | Quản lý sách chữ |
| Truyện | Nội dung | Quản lý truyện tranh |
| QL Chương | Nội dung | Dữ liệu con trực tiếp của sách |
| File sách | Nội dung | File nguồn và file đã xử lý của sách |
| Tác giả | Nội dung | Metadata của sách |
| Thể loại | Nội dung | Phân loại sách |
| Chủ đề | Nội dung | Phân nhóm và discovery |
| Import Dữ Liệu | Nội dung | Nhập hàng loạt sách, user hoặc metadata |
| Crawler Pipeline | Nội dung | Thu thập và bổ sung nội dung |

### 4.2. Nhóm Biên tập và dịch thuật

| Menu hiện tại | Nhóm đề xuất | Lý do |
|---|---|---|
| Dashboard Dịch thuật | Biên tập và dịch thuật | Tổng quan pipeline dịch |
| Upload RAW | Biên tập và dịch thuật | Đầu vào của luồng dịch |
| Translation Jobs | Biên tập và dịch thuật | Theo dõi công việc dịch |
| Translation Review | Biên tập và dịch thuật | Kiểm duyệt bản dịch |
| Glossary | Biên tập và dịch thuật | Dữ liệu thuật ngữ dùng cho dịch |

### 4.3. Nhóm Media và xuất bản

| Menu hiện tại | Nhóm đề xuất | Lý do |
|---|---|---|
| Audio Dashboard | Media và xuất bản | Quản lý nội dung audio |
| Quản lý Giọng đọc | Media và xuất bản | Cấu hình giọng đọc |
| Characters/Voice Mapping | Media và xuất bản | Gán giọng cho nhân vật |
| Video Truyện Chữ | Media và xuất bản | Pipeline video sách chữ |
| Video Truyện Tranh | Media và xuất bản | Pipeline video comic |
| Xuất bản PDF / CMYK | Media và xuất bản | Đầu ra in ấn/xuất bản |

### 4.4. Nhóm Người dùng và cộng đồng

| Menu hiện tại | Nhóm đề xuất | Lý do |
|---|---|---|
| User | Người dùng và cộng đồng | Quản lý tài khoản |
| Đánh giá | Người dùng và cộng đồng | Nội dung do cộng đồng tạo |
| Báo cáo vi phạm | Người dùng và cộng đồng | Moderation |
| Thông báo | Người dùng và cộng đồng | Giao tiếp với user |
| Reading Analytics | Phân tích và vận hành | Số liệu đọc, không phải CRUD user |

### 4.5. Nhóm Thương mại

| Menu hiện tại | Nhóm đề xuất | Lý do |
|---|---|---|
| Gói VIP | Thương mại | Sản phẩm subscription |
| Gói Xu | Thương mại | Sản phẩm coin |
| Giao dịch | Thương mại | Payment và transaction |
| Khuyến mãi | Thương mại | Campaign và discount |

### 4.6. Nhóm Trang chủ và CMS

| Menu hiện tại | Nhóm đề xuất | Lý do |
|---|---|---|
| Banners | Trang chủ và CMS | Nội dung hiển thị trang chủ |
| Home Sections | Trang chủ và CMS | Bố cục trang chủ |
| Trang Tĩnh | Trang chủ và CMS | Nội dung tĩnh |
| FAQ | Trang chủ và CMS | Nội dung hỗ trợ |
| Trợ giúp | Trang chủ và CMS | Help Center |
| Mẫu Email | Trang chủ và CMS | Nội dung email hệ thống |

### 4.7. Nhóm Phân tích và vận hành

| Menu hiện tại | Nhóm đề xuất | Lý do |
|---|---|---|
| Reports | Phân tích và vận hành | Báo cáo tổng hợp |
| Reading Analytics | Phân tích và vận hành | Chỉ số sử dụng |
| Error Logs | Phân tích và vận hành | Theo dõi lỗi runtime |
| Health Check | Phân tích và vận hành | Kiểm tra dịch vụ |
| Test Cases | Phân tích và vận hành | QA và bug log |
| Build Process | Phân tích và vận hành | CI/CD và release |

### 4.8. Nhóm Hệ thống

| Menu hiện tại | Nhóm đề xuất | Lý do |
|---|---|---|
| Database Overview | Hệ thống | Quản trị database |
| Database Tables | Hệ thống | CRUD dữ liệu động |
| System Config | Hệ thống | Cấu hình ứng dụng |
| Role/Permission | Hệ thống | Phân quyền |
| Audit Logs | Hệ thống | Theo dõi hành động quản trị |
| Apply dữ liệu | Hệ thống | Ghi batch thay đổi vào database |

## 5. Menu cấp cao nên giữ lại

Nên giữ khoảng 8 nhóm cấp cao:

1. Dashboard.
2. Nội dung.
3. Biên tập và dịch thuật.
4. Media và xuất bản.
5. Người dùng và cộng đồng.
6. Thương mại.
7. Trang chủ và CMS.
8. Phân tích và vận hành.
9. Hệ thống.

Nếu muốn sidebar ngắn hơn nữa, có thể gom thành 6 nhóm:

```text
Dashboard
Nội dung
Người dùng và thương mại
CMS và marketing
Media và dịch thuật
Hệ thống và vận hành
```

Tuy nhiên, phương án 8 nhóm dễ hiểu hơn vì không trộn quá nhiều nghiệp vụ khác nhau.

## 6. Đề xuất giao diện Sidebar

### 6.1. Cách hiển thị

Mỗi menu cấp cao hiển thị:

- Icon.
- Tên nhóm.
- Mũi tên mở rộng/thu gọn.
- Badge số lượng nếu có dữ liệu cần xử lý.

Ví dụ:

```text
[Icon] Nội dung                         >
[Icon] Biên tập và dịch thuật           >
[Icon] Media và xuất bản                >
[Icon] Người dùng và cộng đồng          >
[Icon] Thương mại                       >
[Icon] Trang chủ và CMS                 >
[Icon] Phân tích và vận hành            >
[Icon] Hệ thống                         >
```

### 6.2. Trạng thái active

- Active group khi route con đang mở.
- Active item có màu nổi bật.
- Khi sidebar collapsed, chỉ hiển thị icon và tooltip.
- Không reset nhóm đang mở khi chuyển giữa List và Docs.
- Giữ thứ tự menu bằng `localStorage` như cơ chế hiện tại nếu vẫn cần kéo thả.

### 6.3. Badge đề xuất

| Nhóm | Badge |
|---|---|
| Biên tập và dịch thuật | Job chờ review |
| Người dùng và cộng đồng | Report chưa xử lý |
| Thương mại | Giao dịch chờ duyệt |
| Phân tích và vận hành | Error mới |
| Hệ thống | Migration hoặc health warning |

## 7. Quyền truy cập theo nhóm

| Nhóm | Role đề xuất |
|---|---|
| Nội dung | Admin, Editor, Author tùy action |
| Biên tập và dịch thuật | Admin, Translator, Editor |
| Media và xuất bản | Admin, Editor, Audio/Video operator |
| Người dùng và cộng đồng | Admin, Moderator |
| Thương mại | Admin, Finance operator |
| Trang chủ và CMS | Admin, Editor, Marketing |
| Phân tích và vận hành | Admin, QA, DevOps |
| Hệ thống | SuperAdmin hoặc Admin được cấp quyền |

Các quyền cần tách rõ:

- Xem.
- Tạo.
- Sửa.
- Xóa.
- Publish.
- Approve.
- Apply dữ liệu.
- Rollback dữ liệu.
- Export.

## 8. Quan hệ với tab List và Docs

Mỗi màn hình quản lý vẫn giữ hai tab:

```text
[List] [Docs]
```

Ví dụ:

```text
Nội dung > Sách
  /books              -> List
  /books?view=docs    -> Docs của Sách

Người dùng và cộng đồng > User
  /users              -> List
  /users?view=docs    -> Docs của User

Hệ thống > Database
  /database           -> List
  /database?view=docs -> Docs của Database
```

Docs là tài liệu theo ngữ cảnh của từng màn hình, không phải một menu global độc lập.

## 9. Lộ trình triển khai

### Phase 1 - Chuẩn hóa cấu hình menu

- [ ] Tạo một cấu hình menu trung tâm.
- [ ] Đặt `groupId`, `itemId`, `path`, `icon`, `permission` cho mỗi item.
- [ ] Ánh xạ tất cả route hiện tại.
- [ ] Không đổi URL trong phase này.
- [ ] Xác định item nào chỉ dành cho SuperAdmin.

### Phase 2 - Gom nhóm Sidebar

- [ ] Tạo 8 nhóm cấp cao.
- [ ] Di chuyển item vào nhóm tương ứng.
- [ ] Thêm expand/collapse.
- [ ] Giữ active group theo pathname.
- [ ] Giữ trạng thái nhóm bằng localStorage nếu cần.
- [ ] Kiểm tra sidebar collapsed và mobile.

### Phase 3 - Chuẩn hóa toolbar

- [ ] Dùng chung toolbar cho các trang dạng bảng.
- [ ] Đặt Search, Apply dữ liệu và More theo cùng thứ tự.
- [ ] Giữ tab List/Docs theo từng page.
- [ ] Hiển thị badge pending changes.
- [ ] Không làm mất filter khi chuyển tab.

### Phase 4 - Phân quyền

- [ ] Gắn permission cho từng item.
- [ ] Ẩn menu không có quyền.
- [ ] Backend vẫn phải kiểm tra quyền, không chỉ ẩn frontend.
- [ ] Tách quyền Database và Apply dữ liệu.
- [ ] Ghi audit log cho thao tác nhạy cảm.

### Phase 5 - Kiểm thử

- [ ] Tất cả route cũ vẫn mở được.
- [ ] Active menu đúng theo route.
- [ ] Chuyển List/Docs không mất context.
- [ ] Sidebar collapsed không che nội dung.
- [ ] Menu không có quyền không hiển thị.
- [ ] Reload vẫn giữ nhóm menu cần thiết.
- [ ] Không có item bị trùng hoặc mất.
- [ ] Mobile hiển thị được toàn bộ menu.

## 10. Tiêu chí hoàn thành

- Sidebar chỉ còn khoảng 8 nhóm cấp cao.
- Mỗi chức năng hiện tại vẫn truy cập được.
- Nội dung, dịch thuật, media, commerce, CMS và system được tách rõ.
- Các menu liên quan nằm cùng một nhóm.
- Route hiện tại không bị phá.
- Quyền được gắn tới từng menu/action.
- Tab `List/Docs` vẫn hoạt động theo từng màn hình.
- Apply dữ liệu nằm trong nhóm Hệ thống và có quyền riêng.
- Có thể mở rộng thêm module mà không phải sửa nhiều component.

## 11. Thứ tự ưu tiên khuyến nghị

Ưu tiên triển khai theo thứ tự:

1. Nội dung.
2. Người dùng và cộng đồng.
3. Thương mại.
4. Trang chủ và CMS.
5. Biên tập và dịch thuật.
6. Media và xuất bản.
7. Phân tích và vận hành.
8. Hệ thống.

Lý do: bốn nhóm đầu thường được sử dụng nhiều nhất; nhóm Hệ thống cần làm sau vì liên quan đến quyền, database và thao tác nguy hiểm.
