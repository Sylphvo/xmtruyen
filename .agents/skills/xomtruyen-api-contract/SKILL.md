---
name: xomtruyen-api-contract
description: >
  Đồng bộ API contract giữa xomtruyen.API và các client Xomtruyen. Dùng khi thêm
  hoặc sửa endpoint, DTO, response envelope, query filter, upload hoặc thay đổi
  model dữ liệu được dùng bởi admin, web và mobile.
version: 1.0.0
metadata:
  audience: developers
  keywords: xomtruyen, dotnet, api, dto, axios, contract, typescript
  workflow: ai
---

# Xomtruyen API Contract

## Phạm vi

Skill này điều phối thay đổi xuyên lớp giữa:

- `xomtruyen.API/Controllers`, `Models`, `Contracts`, `Services`, `Repositories`.
- `xomtruyen-admin/src/api` và pages/components liên quan.
- `xom-truyen/src` và `xomtruyen-app/src` nếu endpoint phục vụ người đọc.

## Quy trình

1. Tìm controller và service đang sở hữu hành vi trước khi tạo file mới.
2. Đọc DTO request/response, `BaseApiController`, `ApiResponse` và route thực tế.
3. Kiểm tra API client đang unwrap `response.data` hay giữ envelope để không đọc sai shape.
4. Sửa backend contract trước, sau đó cập nhật các client cùng lúc.
5. Giữ tên field JSON, kiểu GUID/date/number và quy ước paging hiện có.
6. Với lỗi, giữ status code có nghĩa: `400` input, `401/403` auth, `404` resource, `409` conflict, `5xx` lỗi server.
7. Thêm hoặc cập nhật tài liệu API gần module nếu request/response thay đổi.

## Quy tắc

- Không viết logic nghiệp vụ trong controller.
- Không dùng `any` khi đã có thể mô tả DTO TypeScript.
- Không trả toàn bộ nội dung chapter trong list nếu trang chỉ cần metadata.
- Không đổi route hoặc response envelope chỉ để làm code ngắn hơn.
- Kiểm tra cả text chapter và comic chapter vì hai model có shape khác nhau.

## Kiểm tra

```powershell
dotnet build .\xomtruyen.API\xomtruyen.API.csproj
Push-Location .\xomtruyen-admin; npm run build; Pop-Location
Push-Location .\xom-truyen; npm run build; Pop-Location
```

Chỉ chạy các package thực sự bị ảnh hưởng; nếu API thay đổi dùng ít nhất build API và client tương ứng.
