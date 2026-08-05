# 📚 XÓM TRUYỆN - SƠ ĐỒ PHÂN HỆ CẤU TRÚC ĐA TẦNG (MULTI-TIER ARCHITECTURE)

Thư mục **`xomtruyen-overview`** cung cấp giao diện trực quan hóa tương tác đa tầng (Multi-Tier Tree) toàn bộ các ứng dụng và phân hệ con gắn trực tiếp phía dưới theo phong cách thiết kế Dark Cyber & Neon Glow.

---

## 🚀 Cách Mở Giao Diện Trực Quan Hóa (Interactive Visualizer)

1. **Cách nhanh nhất (1-Click)**: Nhấp đúp vào file [`start-overview.bat`](file:///c:/Users/Cilse/source/xomtruyen/XomTruyen_Workspace/xomtruyen-overview/start-overview.bat).
2. **Mở trực tiếp trên trình duyệt**: Mở file [`index.html`](file:///c:/Users/Cilse/source/xomtruyen/XomTruyen_Workspace/xomtruyen-overview/index.html) bằng Chrome, Edge, Brave hoặc Firefox.

---

## 🌳 Cấu Trúc Sơ Đồ Phân Hệ Gắn Phía Dưới (Multi-Tier Tree)

```
                            [⚡ HỆ THỐNG XÓM TRUYỆN (HUB)]
                                        │
    ┌────────────────┬──────────────────┼──────────────────┬────────────────┐
    ▼                ▼                  ▼                  ▼                ▼
[xom-truyen]  [xomtruyen-app]   [xomtruyen.API]   [xomtruyen-admin]   [PostgreSQL DB]
(Web Client)    (Mobile App)     (Backend Core)    (Admin Portal)       (Database)
    │                │                  │                  │                │
    ├─ Trang Chủ     ├─ Đọc Mobile      ├─ Xuất Bản/Upload ├─ Quản Lý Sách  ├─ Bảng Sách/Chương
    ├─ Chi Tiết Sách ├─ Yêu Thích/Notif ├─ Đọc Sách API    ├─ Danh Mục/Topic├─ Bảng Người Dùng
    ├─ Trình Đọc     ├─ Đơn Mua/Lịch Sử ├─ Auth JWT        ├─ Người Dùng    ├─ Bảng Lịch Sử/Bookmark
    ├─ Tủ Sách/LịchSử├─ Xác Thực Mobile ├─ Danh Mục/Topic  ├─ Dashboard     └─ Bảng Giao Dịch
    └─ Xác Thực/HồSơ                    ├─ Quản Trị CSDL   └─ Database View
                                        └─ Worker Ngầm
```

---

## 🎨 6 Chế Độ Xem Trên Giao Diện

1. 🌳 **Sơ Đồ Phân Hệ Toàn Cảnh (Multi-Tier)**: Bản đồ tổng thể kết nối từ Gốc -> 4 Ứng Dụng & CSDL -> Tất cả phân hệ con gắn trực tiếp phía dưới mỗi cột ứng dụng.
2. ⚡ **Backend `xomtruyen.API`**: Chi tiết phân hệ Controllers, Services và Background Worker.
3. 🌐 **Web Client (`xom-truyen`)**: Chi tiết toàn bộ trang đọc truyện, tủ sách và hồ sơ.
4. 📱 **Mobile App (`xomtruyen-app`)**: Chi tiết các màn hình di động Ionic React.
5. 🛡️ **Quản Trị (`xomtruyen-admin`)**: Chi tiết các module quản lý AG-Grid và biểu đồ ApexCharts.
6. 🗄️ **Cơ Sở Dữ Liệu (`PostgreSQL`)**: Chi tiết các nhóm bảng dữ liệu (18 DbSets).

---

## 🏗️ Bản Đồ Cấu Trúc Toàn Bộ Dự Án (`XomTruyen_Workspace`)

```
XomTruyen_Workspace/
│
├── 🌐 xom-truyen/                  # [Web Frontend] Web Client đọc truyện chữ & tranh
│   ├── Tech: React 19, TypeScript, Vite 8, React Router 7, Axios, Swiper
│   ├── Port mặc định: http://localhost:5173
│   └── Lệnh chạy: npm run dev
│
├── 🛡️ xomtruyen-admin/             # [Admin Frontend] Portal quản trị toàn diện
│   ├── Tech: React 19, Vite 5, AG-Grid Enterprise 36, ApexCharts, Bootstrap 5.3, SCSS
│   ├── Port mặc định: http://localhost:5174
│   └── Lệnh chạy: npm run dev
│
├── 📱 xomtruyen-app/               # [Mobile App] Ứng dụng di động iOS & Android
│   ├── Tech: Ionic 8.5, Capacitor 8.4, React 19, Swiper, Cypress, Vitest
│   ├── Port mặc định: http://localhost:8100
│   └── Lệnh chạy: npm run dev  (Build mobile: npx cap run android / ios)
│
├── ⚡ xomtruyen.API/               # [Backend API] RESTful Web API & Dịch vụ xử lý
│   ├── Tech: .NET 9 (C#), ASP.NET Core Web API, EF Core, Npgsql (PostgreSQL), JWT Bearer
│   ├── Port mặc định: http://localhost:5000 | https://localhost:5001 | /scalar/v1
│   ├── Background Worker: IBackgroundTaskQueue, PdfBookProcessor, ArchiveBookProcessor
│   └── Lệnh chạy: dotnet run
│
└── 📊 xomtruyen-overview/          # [Tool] Giao diện trực quan hóa kiến trúc hệ thống
    ├── index.html                  # Trang hiển thị tương tác chính
    ├── style.css                   # Cyber Dark & Neon Glow styling
    ├── app.js                      # Logic đồ thị đa tầng, SVG bezier lines & animation
    └── start-overview.bat          # Script click đúp mở nhanh
```
