---
name: xomtruyen-validation
description: >
  Kiểm tra thay đổi xuyên workspace Xomtruyen trước khi hoàn tất. Dùng khi sửa
  nhiều project, route/API contract, auth, database migration, upload pipeline,
  reader flow hoặc cần xác định lệnh test/build/lint phù hợp.
version: 1.0.0
metadata:
  audience: developers
  keywords: xomtruyen, validation, build, lint, test, regression, monorepo
  workflow: ai
---

# Xomtruyen Validation

## Chọn phạm vi

- Chỉ TypeScript admin: `xomtruyen-admin`.
- Chỉ web reader: `xom-truyen`.
- Chỉ mobile: `xomtruyen-app`.
- Backend/model/migration: `xomtruyen.API`.
- Thay đổi API dùng bởi nhiều client: chạy backend và tất cả client bị ảnh hưởng.

## Quy trình

1. Đọc `package.json` hoặc `.csproj` của project bị chạm để dùng đúng script/package.
2. Chạy check rẻ nhất của file vừa sửa trước: TypeScript build, ESLint hoặc `dotnet build`.
3. Với thay đổi route/API/auth, kiểm tra cả happy path, unauthorized, forbidden, not found và server error.
4. Với migration, kiểm tra model snapshot, migration order và khả năng khởi động API với database dev.
5. Với UI, kiểm tra loading, empty, error, retry, double-submit và responsive layout.
6. Không xem một build xanh là đủ nếu thay đổi ảnh hưởng runtime data hoặc permission.
7. Không sửa test/build hỏng không liên quan; ghi nhận rõ trong kết quả.

## Lệnh chuẩn

```powershell
dotnet build .\xomtruyen.API\xomtruyen.API.csproj
Push-Location .\xomtruyen-admin; npm run lint; npm run build; Pop-Location
Push-Location .\xom-truyen; npm run lint; npm run build; Pop-Location
Push-Location .\xomtruyen-app; npm run lint; npm run build; Pop-Location
```

Mobile có thêm test hiện có:

```powershell
Push-Location .\xomtruyen-app; npm run test.unit -- --run; Pop-Location
```

## Báo cáo

Ghi rõ project/lệnh nào đã chạy, pass/fail, và lỗi có phải do thay đổi hiện tại hay không. Nếu không thể chạy vì thiếu database, service hoặc dependency, nêu blocker cụ thể thay vì đoán kết quả.
