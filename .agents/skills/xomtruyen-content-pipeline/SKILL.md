---
name: xomtruyen-content-pipeline
description: >
  Xây dựng và sửa workflow nhập, upload, xử lý và xuất nội dung sách/chapter cho
  Xomtruyen. Dùng khi làm CSV, paste, OCR, ZIP/CBZ/CBR/PDF, background job,
  preview, validate, retry hoặc màn hình ImportData/PrintPipeline.
version: 1.0.0
metadata:
  audience: developers
  keywords: xomtruyen, import, upload, chapter, archive, csv, ocr, worker
  workflow: ai
---

# Xomtruyen Content Pipeline

## Điểm kiểm soát

- API: `xomtruyen.API/Controllers/Admin/AdminImportController.cs`, `Services/Import`, `Models/ImportJob.cs`, `Models/NormalizedImportRow.cs`.
- Chapter upload: `AdminComicChapterController`, `ComicChapterManagementService`, `ArchiveHelper` và `Models/Requests/BulkUploadChapterRequest.cs`.
- Admin UI: `xomtruyen-admin/src/pages/ImportData.tsx`, `PrintPipeline.tsx`, `components/BulkUploadModal.tsx`, `api/chapterApi.ts`.
- Worker: `python-worker/main.py` và các background worker trong API.

## Quy trình import

1. Xác định loại nội dung: metadata sách, text chapter, comic archive, audio hoặc print pipeline.
2. Chuẩn hóa tất cả nguồn thành row contract có `rowIndex`, dữ liệu đã parse, status, warning/error và provenance.
3. Parse CSV bằng parser đúng chuẩn, không dùng `Split(',')` khi dữ liệu có quote hoặc comma trong nội dung.
4. OCR và paste chỉ được đề xuất dữ liệu; luôn có preview và xác nhận người vận hành trước commit.
5. Với archive, whitelist extension ảnh, bỏ file hệ thống, tách chapter bằng số nguyên và sắp xếp theo số thay vì chuỗi.
6. Giữ transaction cho DB và danh sách file vật lý đã tạo; khi lỗi phải rollback DB và dọn file đã ghi.
7. Dùng `AddRangeAsync`, batch `SaveChangesAsync`, giới hạn kích thước/timeout hợp lý và cancellation token.
8. Job phải có trạng thái rõ ràng, progress, lỗi theo row và retry idempotent; không seed production trực tiếp từ browser.

## Quy trình client

- Dùng `FormData` cho file upload và API module riêng.
- Disable thao tác lặp khi đang upload/processing.
- Hiển thị progress upload khác với processing server.
- Cho phép tải error file và sửa lại đúng row.
- Không báo thành công khi chỉ upload xong nhưng server chưa xử lý xong.

## Kiểm tra bắt buộc

- File rỗng, sai extension, archive hỏng, chapter không có ảnh.
- Tên chapter `1`, `2`, `10` phải được order đúng.
- Trùng chapter với cả overwrite bật/tắt.
- Duplicate request, retry giữa chừng, hết dung lượng và cancellation.
- CSV có comma/quote/newline, row thiếu field, reference không tồn tại.
- User không đủ quyền, file quá lớn và nội dung độc hại.

```powershell
dotnet build .\xomtruyen.API\xomtruyen.API.csproj
Push-Location .\xomtruyen-admin; npm run lint; npm run build; Pop-Location
```
