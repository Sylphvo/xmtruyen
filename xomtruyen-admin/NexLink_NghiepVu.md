# TÀI LIỆU NGHIỆP VỤ (BUSINESS LOGIC) - NEXLINK CRM DASHBOARD

## 1. Tổng quan dự án
**Tên dự án:** NexLink - Hệ thống Quản trị CRM & Quản lý doanh nghiệp (Admin Dashboard).
**Mô tả:** Dựa trên kiến trúc của NexLink LayoutDrop, đây là hệ thống quản trị trung tâm dành cho doanh nghiệp để theo dõi KPI, quản lý quan hệ khách hàng (CRM), quản lý bán hàng và dự án trên một giao diện hiện đại, đa nền tảng.
**Nền tảng:** Web Application (ReactJS, TypeScript, Bootstrap 5).

## 2. Phân quyền người dùng (User Roles)
* **Super Admin:** Toàn quyền kiểm soát hệ thống, quản lý người dùng, cấu hình bảo mật.
* **Sales Manager (Quản lý kinh doanh):** Xem báo cáo doanh thu tổng, quản lý danh sách khách hàng, phê duyệt hợp đồng.
* **Sales/Staff (Nhân viên):** Cập nhật tiến độ dự án, tương tác với khách hàng, theo dõi lịch trình cá nhân.

## 3. Các phân hệ và chức năng cốt lõi

### 3.1. Dashboard (Bảng điều khiển trung tâm)
* **Tổng quan (Overview):** Thống kê số liệu nhanh (Doanh thu, Khách hàng mới, Đơn hàng) sử dụng các thẻ thông tin.
* **Biểu đồ phân tích:** * Biểu đồ doanh thu theo tháng/quý (sử dụng **ApexCharts**).
    * Biểu đồ tỷ lệ chuyển đổi khách hàng (sử dụng **Chart.js**).
* **Lịch trình:** Hiển thị sự kiện hoặc lịch họp sắp tới.

### 3.2. CRM & Quản lý khách hàng (Leads/Customers)
* **Danh sách khách hàng:** Hiển thị dạng bảng (sử dụng **Datatables**). Cho phép tìm kiếm, lọc theo trạng thái (Tiềm năng, Đã ký hợp đồng, Hủy), phân trang và sắp xếp dữ liệu lớn.
* **Chi tiết khách hàng:** Lưu trữ lịch sử trao đổi, thông tin liên hệ, file đính kèm.

### 3.3. Quản lý công việc và dự án (Task/Project Management)
* **Bảng Kanban:** Kéo thả công việc theo trạng thái (To do, In Progress, Done).
* **Danh sách công việc:** Hiển thị công việc được giao, tiến độ hoàn thành.
* **Timeline/Thư viện ảnh dự án:** Sử dụng **Swiper Slider** để trình chiếu các tài liệu/hình ảnh báo cáo của dự án.

### 3.4. Các công cụ hỗ trợ (Utilities & Apps)
* **Lịch (Calendar & Booking):** Đặt lịch hẹn với khách hàng, chọn ngày giờ giao việc (sử dụng **Flatpickr**).
* **Quản lý tài nguyên:** Kho giao diện icon phong phú (**Lucide Icon, Font Awesome, Flaticon**) dùng cho các danh mục sản phẩm/dịch vụ.
* **Chỉnh sửa giao diện:** Hỗ trợ Light/Dark mode, Typography chuẩn qua **Google Fonts**, tùy biến giao diện bằng **SCSS**.

## 4. Quy trình làm việc (User Flow tiêu biểu)
1. **Sales** đăng nhập vào hệ thống -> Xem **Dashboard** xem mục tiêu tháng.
2. Chuyển sang tab **CRM** -> Chọn ngày lọc bằng **Flatpickr** -> Mở danh sách khách hàng mới bằng **Datatables**.
3. Click vào một khách hàng -> Chuyển trạng thái, cập nhật ghi chú.
4. Quản lý xem biểu đồ **ApexCharts** báo cáo hiệu suất của nhân viên Sales đó trên hệ thống theo thời gian thực.