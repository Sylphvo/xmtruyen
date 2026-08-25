# Docs Tab - Kế hoạch triển khai

## Mục tiêu

Thêm tab `Docs` vào trang Admin theo bố cục quản lý tài liệu trong hình tham chiếu. Admin có thể tìm kiếm, lọc, sắp xếp, tạo, sửa và xóa tài liệu. Bản đầu tiên chạy được khi chưa có API/database; dữ liệu được lưu tạm trong `localStorage` để hoàn thiện UI và luồng thao tác.

## Trạng thái hiện tại

- [x] Thêm view `?view=docs` theo từng trang quản lý, ví dụ `/books?view=docs`.
- [x] Biến tab `Docs` trên thanh điều hướng thành link thật và giữ nguyên pathname hiện tại.
- [x] Hiển thị workspace theo ngữ cảnh trang, bảng tài liệu, owner, ngày tạo và ngày cập nhật.
- [x] Thêm tìm kiếm theo tiêu đề/nội dung.
- [x] Thêm lọc theo loại tài liệu và sắp xếp theo ngày cập nhật.
- [x] Thêm modal tạo và chỉnh sửa tài liệu.
- [x] Thêm xóa tài liệu có xác nhận.
- [x] Lưu dữ liệu demo vào `localStorage`.
- [ ] Kết nối API và thay thế hoàn toàn `localStorage`.

## Task 1 - Chốt nghiệp vụ

Docs là một tab riêng của từng màn quản lý, tương tự tab `List`; tài liệu của Sách, Users, Database... không trộn vào một danh sách global.

- [ ] Xác định tài liệu thuộc workspace/project nào.
- [ ] Chốt loại tài liệu: nghiệp vụ, API reference, hướng dẫn, quyết định kiến trúc.
- [ ] Chốt trạng thái: `DRAFT`, `IN_REVIEW`, `PUBLISHED`, `ARCHIVED`.
- [ ] Chốt người có quyền xem, tạo, sửa, xuất bản và xóa.
- [ ] Chốt có cần version, lịch sử thay đổi và khôi phục phiên bản không.
- [ ] Chốt tài liệu có hỗ trợ Markdown đầy đủ, đính kèm file và hình ảnh không.

## Task 2 - Thiết kế dữ liệu

- [ ] Tạo bảng `Documents` gồm `Id`, `WorkspaceId`, `Title`, `Slug`, `Type`, `Status`, `ContentMarkdown`.
- [ ] Bổ sung `OwnerId`, `CreatedAt`, `UpdatedAt`, `PublishedAt`, `ArchivedAt`.
- [ ] Tạo bảng `DocumentVersions` nếu cần lịch sử chỉnh sửa.
- [ ] Tạo bảng `DocumentPermissions` nếu quyền truy cập không chỉ dựa trên role.
- [ ] Thêm index cho `WorkspaceId`, `Status`, `Type`, `UpdatedAt` và tìm kiếm tiêu đề.
- [ ] Tạo migration và seed dữ liệu tài liệu mẫu ở môi trường development only.

## Task 3 - API backend

- [ ] `GET /api/admin/{resource}/docs`: lấy tài liệu của đúng resource/page với phân trang, search, type, status, sort.
- [ ] `GET /api/admin/docs/{id}`: lấy chi tiết tài liệu và metadata.
- [ ] `POST /api/admin/docs`: tạo tài liệu ở trạng thái `DRAFT`.
- [ ] `PUT /api/admin/docs/{id}`: cập nhật title, type, status và Markdown.
- [ ] `POST /api/admin/docs/{id}/publish`: xuất bản sau khi kiểm tra quyền.
- [ ] `POST /api/admin/docs/{id}/archive`: lưu trữ tài liệu.
- [ ] `DELETE /api/admin/docs/{id}`: xóa mềm, không xóa vật lý ngay.
- [ ] `GET /api/admin/docs/{id}/versions`: xem lịch sử phiên bản.
- [ ] Chuẩn hóa response envelope, validation error và paging theo contract hiện tại.
- [ ] Thêm authorization bắt buộc cho toàn bộ endpoint Admin Docs.

## Task 4 - Frontend Admin

- [x] Tạo trang `src/pages/Docs.tsx` và route `/docs`.
- [x] Dựng toolbar Search, Type, Sort và Manage connection.
- [x] Dựng bảng responsive theo bố cục tham chiếu.
- [ ] Tách API client riêng: `src/api/docsApi.ts`.
- [ ] Thay state `localStorage` bằng query API, loading, empty và error state.
- [ ] Thêm trang/editor Markdown có preview song song.
- [ ] Thêm autosave bản nháp, thông báo xung đột và cảnh báo rời trang khi chưa lưu.
- [ ] Thêm publish/archive với confirmation và trạng thái rõ ràng.
- [ ] Thêm phân trang hoặc infinite scroll khi số tài liệu lớn.
- [ ] Kiểm tra responsive trên desktop, tablet và mobile.

## Task 5 - Markdown editor và an toàn nội dung

- [ ] Chọn thư viện Markdown editor có hỗ trợ preview và syntax highlight.
- [ ] Sanitize HTML sau khi render Markdown để chống XSS.
- [ ] Không render raw HTML nếu chưa qua sanitizer.
- [ ] Giới hạn kích thước nội dung và file đính kèm.
- [ ] Chuẩn hóa link, ảnh, heading và bảng trong tài liệu.
- [ ] Quy định cách lưu ảnh: object storage, URL có hạn dùng hoặc proxy qua API.

## Task 6 - Đồng bộ tài liệu hiện có

- [ ] Chuyển nội dung từ `xomtruyen-admin/*.md` và các file API liên quan thành document seed/import.
- [ ] Gắn nguồn và owner cho từng tài liệu đã import.
- [ ] Loại bỏ nội dung trùng lặp giữa tài liệu nghiệp vụ và API reference.
- [ ] Thêm liên kết chéo giữa tài liệu API, database, upload và reader.
- [ ] Có script import Markdown idempotent, chạy lại không tạo bản ghi trùng.

## Task 7 - Kiểm thử

- [ ] Unit test filter, search, sort và serialize dữ liệu.
- [ ] Test tạo, sửa, xóa và reload trang vẫn giữ dữ liệu local ở MVP.
- [ ] Test API unauthorized `401`, forbidden `403`, not found `404` và validation `400`.
- [ ] Test không mất nội dung khi refresh hoặc request lỗi.
- [ ] Test hai admin sửa cùng tài liệu và xử lý version conflict.
- [ ] Test Markdown độc hại không thực thi script.
- [ ] Test bảng không vỡ layout trên màn hình nhỏ.
- [ ] Chạy lint và build Admin trước khi merge.

## Task 8 - Triển khai

- [ ] Bổ sung biến môi trường API cho Admin và không hardcode localhost.
- [ ] Cấu hình database migration trong CI/CD.
- [ ] Cấu hình storage cho hình ảnh/file đính kèm.
- [ ] Thiết lập backup database và retention cho document versions.
- [ ] Bật logging cho create/update/publish/delete, không log nội dung nhạy cảm.
- [ ] Chạy smoke test `/docs` sau deploy.
- [ ] Kiểm tra rollback migration và rollback frontend.

## Tiêu chí hoàn thành

- Admin mở được tab `Docs` từ thanh điều hướng.
- Danh sách có search, filter, sort, empty state và responsive layout.
- Admin có thể tạo/sửa/xóa tài liệu theo đúng quyền.
- Markdown được render an toàn và có preview.
- Dữ liệu lưu qua API/database, có migration, validation, authorization và audit log.
- Có test cho happy path, lỗi mạng, lỗi quyền, conflict và nội dung độc hại.

## Lệnh kiểm tra local

```powershell
Push-Location .\xomtruyen-admin
npm run lint
npm run build
Pop-Location
```
