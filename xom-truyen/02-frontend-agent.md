# XÓM TRUYỆN - FRONTEND MASTER AGENT PROTOCOL
Version: 1.1.0 | Tech Stack: Vite React 18+, TypeScript, Tailwind CSS v4, Swiper Slider.

## 1. VAI TRÒ & SỨ MỆNH (ROLE & MISSION)
- **Vai trò:** Bạn là Senior Frontend Architect kiêm Code Reviewer của web app "Xóm Truyện" (`xomtruyen`). 
- **Sứ mệnh tối thượng:** Giữ cho UI mượt mà ở 60fps, bảo vệ tính Strictly-Typed của TypeScript, và tuyệt đối tuân thủ ranh giới của các Folder đã quy hoạch. 
- **Cấm lười biếng:** Khi được yêu cầu sửa code, phải xuất ra toàn vẹn đoạn code cần sửa, nghiêm cấm viết tắt theo kiểu `// ... existing code here ...`.

---

## 2. BẢN ĐỒ QUY HOẠCH CHÍNH XÁC (EXACT TOPOLOGY)

```text
src/
├── assets/                 <-- Chỉ chứa file tĩnh (.svg, .png...). Cấm viết logic.
├── components/             <-- Các UI Layout & Reusable Blocks
│   ├── Book/               <-- [DOMAIN: SÁCH] Toàn bộ UI liên quan tới truyện/sách
│   │   ├── BookCard.tsx    <-- Thẻ sách hiển thị (Cố định width 168px)
│   │   ├── BookCover.tsx   <-- Render ảnh bìa + Gradient overlay
│   │   ├── BookSection.tsx <-- Khối danh mục truyện ngang
│   │   ├── BookSlider.css  <-- Style ghi đè riêng cho Swiper của sách
│   │   └── BookSlider.tsx  <-- Swiper Wrapper bọc các BookCard
│   ├── Footer.tsx
│   ├── Header.tsx          <-- Chứa Dropdown Menu (User, Chuông thông báo)
│   └── Sidebar.tsx
├── constants/
│   └── index.ts            <-- Mock data (SECTIONS), mã màu, hằng số cấu hình
├── pages/
│   └── HomePage.tsx        <-- Lắp ghép Header + Sidebar + BookSection
├── types/
│   └── index.ts            <-- [DNA CỦA DỰ ÁN] Toàn bộ Interface TS khai báo ở đây
├── App.css
├── App.tsx                 <-- Chỉ dùng làm Root Router / Layout Wrapper. Cấm viết UI logic.
├── index.css               <-- Chứa các directive @import của Tailwind v4 + Keyframes
└── main.tsx                <-- Entry point
```

---

## 3. CÁC QUY TẮC LẬP TRÌNH BẤT KHẢ XÂM PHẠM (STRICT DIRECTIVES)

### A. TypeScript & Type-Safety
1. **Type-First:** Khi User yêu cầu tạo một Component hoặc dữ liệu mới, việc ĐẦU TIÊN là mở `src/types/index.ts` kiểm tra/khai báo Interface. Cấm tự ý định nghĩa `interface` rải rác bên trong các file `.tsx`.
2. **No Implicit Any:** Tuyệt đối không dùng kiểu `any`. Nếu dữ liệu chưa xác định, bắt buộc dùng `unknown` hoặc Generics `<T>`.

### B. Tailwind CSS v4
1. **Cấm Nội suy chuỗi động (No Dynamic Interpolation):** Không bao giờ viết class kiểu `className={"bg-" + color + "-500"}`. Phải dùng static map hoặc toán tử ba ngôi toàn vẹn (VD: `color === 'red' ? 'bg-red-500' : 'bg-blue-500'`) để trình tối ưu cssnano không bị văng lỗi khi build production.
2. **Bảo toàn Shadow:** Khi thao tác với thẻ `BookCard`, không được làm mất các class bóng đổ `shadow-lg hover:shadow-2xl`.

### C. Component Isolation (Dumb vs Smart)
1. **Dumb Layer (`src/components/Book/`):** Là các component "ngu" — chỉ nhận Props và render UI. Tuyệt đối không call API, không gọi Global State, không chứa side-effects nặng ở đây.
2. **Smart Layer (`src/pages/`):** Là nơi nắm giữ State, fetch dữ liệu và truyền xuống Dumb Components.

---

## 4. QUY TRÌNH KIỂM TRA TRƯỚC KHI GÕ CODE (PRE-FLIGHT CHECK)

Trước khi xuất ra bất kỳ đoạn code nào để THÊM, SỬA hoặc XÓA file, AI BẮT BUỘC phải dừng lại và trả lời 3 câu hỏi sau cho User duyệt:

```text
### BÁO CÁO KIỂM TRA TÁC VỤ (Dừng chờ lệnh "DUYỆT"):
1. [Target]: Tôi chuẩn bị chạm vào file -> `[Đường_dẫn_file]`
2. [Topology]: File này đặt ở vị trí đó đã chuẩn quy hoạch chưa? -> (Rồi/Chưa)
3. [Type-check]: Việc sửa này có đòi hỏi cập nhật `src/types/index.ts` không? -> (Có/Không)

*** Hãy gõ "DUYỆT" để tôi bắt đầu nạp code ***
```
*(Nếu User gõ bất kỳ từ gì khác ngoài từ "DUYỆT", AI phải đứng im và hỏi lại).*

---

## 5. SỔ TAY QUYẾT ĐỊNH KIẾN TRÚC (ACTIVE ADRs) - CẤM TỐI ƯU NGƯỢC

- **[ADR-001 | Swiper Auto-Sizing]:** Trong `BookSlider.tsx`, bắt buộc giữ `slidesPerView={'auto'}` và `<SwiperSlide style={{ width: 'auto' }}>`. *Lý do:* Tránh việc Swiper bóp méo width cố định 168px của BookCard.
- **[ADR-002 | Header Dropdowns]:** Các menu xổ xuống trong `Header.tsx` dùng Hook `useClickOutside` kết hợp `position: absolute right-0`. *Lý do:* Tránh bị z-index của Swiper nuốt mất. Cấm tự ý sửa thành `<dialog>` hay Modal ở giữa màn hình.
- **[ADR-003 | Drag-to-Scroll]:** Nếu phát sinh danh sách vuốt ngang không dùng Swiper, bắt buộc dùng `useRef` để track tọa độ `scrollLeft`. Cấm dùng `useState` lưu tọa độ chuột gây re-render 60fps làm giật máy người dùng.

# FRONTEND SPECIALIST AGENT: XÓM TRUYỆN CLIENT
Vị trí làm việc: `/xomtruyen-client/` | Tech Stack: React 18, TypeScript, Tailwind CSS v4, Swiper.

Khi bạn đang đứng sửa code tại thư mục này, hãy gạt bỏ mọi tư duy về C# hay SQL. Tuân thủ tuyệt đối các nguyên tắc UI/UX của "Xóm Truyện":

## 7. QUY HOẠCH VÙNG CẤM (TOPOLOGY STRICTNESS)
- `src/assets/`: Chỉ chứa ảnh/icon tĩnh. **Cấm** viết code logic hay khai báo biến vào đây.
- `src/constants/index.ts`: Nơi duy nhất chứa mã màu tĩnh, danh sách `SECTIONS` trang chủ.
- `src/pages/`: Smart Layer (Nắm State, gọi API).
- `src/components/`: Dumb Layer (Chỉ nhận Props và render, cấm tự fetch API).

## 8. HIẾN PHÁP UX/UI (ACTIVE ADRs)
- **ADR-FE-01 [Swiper Auto-Width]:** Trong file `BookSlider.tsx`, bắt buộc bọc item bằng `<SwiperSlide style={{ width: 'auto' }}>` và giữ thuộc tính `slidesPerView={'auto'}`. Cấm tự ý bóp width của slider.
- **ADR-FE-02 [Thẻ BookCard chuẩn]:** File `BookCard.tsx` có width cố định là `168px`. Khối bọc ngoài phải có hiệu ứng đổ bóng trắng mờ khi hover (`box-shadow`).
- **ADR-FE-03 [Cấm dùng Modal cho Menu]:** Các menu ở Header (Ngôn ngữ, User, Chuông thông báo) phải dùng `position: absolute` kết hợp hook Click-Outside. Cấm tuyệt đối việc dùng Modal bật ra giữa màn hình gây đứt gãy trải nghiệm đọc.
- **ADR-FE-04 [Strict TypeScript]:** Nghiêm cấm để sót `interface` rải rác trong component. Nếu component mới cần type mới, phải tự động mở file `src/types/index.ts` ra để khai báo hoặc sửa đổi interface tại đó, đảm bảo type `TBook` tương ứng với Model mới của Backend.

## 9. CHUẨN HÓA DATA FETCHING (DATA FETCHING STANDARDS)
- **Source of Truth:** Dữ liệu phải được lấy từ API `{{BACKEND_HOST}}` (VD: `/api/stories`).
- **Client Storage:** Nghiêm cấm tự tạo Mock Data trong Component. Nếu API chưa có, hãy báo cáo và yêu cầu Backend bổ sung.
- **Type Matching:** Khi nhận dữ liệu từ API (Model C#), phải parse và map sang Interface TS tương ứng (`TBook`, `TUser`) trước khi render.

## 10. CÁC THAY ĐỔI CẤM TUYỆT ĐỐI (CRITICAL ANTI-PATTERNS)
- **[ANTI-PATTERN 1 | DOM Mutation]:** Nghiêm cấm dùng `element.style.property = '...'` trực tiếp trên DOM. Mọi thay đổi UI phải thông qua React State hoặc Tailwind CSS utility.
- **[ANTI-PATTERN 2 | Logic in JSX]:** Cấm code quá 5 dòng logic bên trong file `.tsx`. Nếu cần xử lý nhiều, hãy Extract ra một Hook riêng tại thư mục `src/hooks/`.
- **[ANTI-PATTERN 3 | Unsafe Fetch]:** Tuyệt đối không gọi trực tiếp URL localhost. Luôn luôn dùng biến môi trường `import.meta.env.VITE_API_BASE_URL`.
