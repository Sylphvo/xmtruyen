# Tiêu Chuẩn Dọn Dẹp Mã Nguồn (Pre-commit Clean Code Checklist)

Tài liệu này cung cấp danh sách các nghiệp vụ cần thực hiện trước khi **commit** và **push** code lên Git Repository. Quy trình này có thể được áp dụng chung cho mọi dự án (React, Node.js, .NET, v.v.) để đảm bảo mã nguồn luôn sạch sẽ, dễ hiểu và dễ bảo trì.

---

## 1. Dọn Dẹp File & Thư Mục Rác (Clean Source)
Trước khi commit, hãy đảm bảo hệ thống không lưu trữ các file dư thừa hoặc các file cấu hình cá nhân:

- [ ] **Bảo vệ file nhạy cảm**: Chắc chắn rằng các file như `.env`, `.env.local` hoặc các file chứa API Key/Secret đã được đưa vào `.gitignore`.
- [ ] **Kiểm tra `.gitignore`**: Đảm bảo các thư mục sinh ra trong quá trình chạy (như `node_modules/`, `dist/`, `build/`, `out/`, `.next/`, `.vite/`, `coverage/`) đã bị loại trừ.
- [ ] **Xóa file không sử dụng**: 
  - Các file components, utils, hooks, hay services đã viết nhưng bị loại bỏ khỏi luồng sử dụng.
  - Các thư mục trống không còn ý nghĩa.
- [ ] **Xóa các file tạm/log**: Xóa các file `.log`, các file nén rác hoặc thư mục backup tạm thời (ví dụ: `node_modules_trash`, thư mục `_bak`).

## 2. Làm Sạch Mã Nguồn (Clean Code)
Rà soát lại toàn bộ các file đã thay đổi (xem trong mục Git Changes) để tối ưu hóa code:

- [ ] **Xóa Log & Debug**: Gỡ bỏ toàn bộ `console.log()`, `console.error()`, `debugger` hoặc các hàm in ra màn hình dùng để test local.
- [ ] **Xóa Code Thừa (Dead Code)**: 
  - Xóa các biến (variables), hàm (functions) đã khai báo nhưng không sử dụng.
  - Xóa các đoạn code bị comment lại (ví dụ: `// const oldFunction = () => {}`). Nếu cần lưu lịch sử, Git đã đảm nhiệm việc đó.
- [ ] **Xóa thư viện/import không dùng**: Xóa các dòng `import` dư thừa ở đầu file. Gỡ cài đặt các thư viện trong `package.json` nếu không còn dùng tới.
- [ ] **Chuẩn hóa đặt tên (Naming Convention)**: Kiểm tra lại tên biến, tên hàm xem đã rõ nghĩa chưa (tránh đặt tên như `a`, `b`, `temp`, `data1`).

## 3. Bổ Sung Comment & Tài Liệu
Code sạch là code tự giải thích được, nhưng với các nghiệp vụ phức tạp thì comment là bắt buộc:

- [ ] **Comment các đoạn logic phức tạp**: Giải thích **"Tại sao"** lại viết như vậy (Why) thay vì **"Đang làm gì"** (What).
- [ ] **Docblock cho Hàm/Component**: Thêm chú thích cho các hàm có tham số đầu vào và đầu ra phức tạp để người đọc (hoặc đồng nghiệp) dễ dàng nắm bắt.
- [ ] **Cập nhật README.md**: Nếu nhánh hiện tại có thêm môi trường mới, biến môi trường mới hoặc thư viện quan trọng, hãy ghi chú lại vào README.

## 4. Kiểm Tra & Định Dạng (Linting & Formatting)
- [ ] **Chạy Linter**: Chạy lệnh kiểm tra lỗi (vd: `npm run lint`) và sửa toàn bộ các cảnh báo (warnings/errors) nếu có.
- [ ] **Định dạng code (Format)**: Chạy công cụ format (Prettier, ESLint, dprint) để canh lề chuẩn xác, đồng bộ dấu nháy đơn/kép, dấu chấm phẩy.
- [ ] **Kiểm tra build**: Đảm bảo dự án vẫn có thể build thành công ở local (vd: `npm run build`) trước khi push code đi.

---
💡 **Mẹo nhỏ:** Hãy xem lại từng dòng code trong mục **Source Control (Git diff)** của VS Code một lần cuối cùng trước khi bấm nút `Commit`.
