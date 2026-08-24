---
name: xomtruyen-auth-security
description: >
  Thiết kế, sửa và kiểm tra authentication, JWT, session, route guard và role
  authorization trong Xomtruyen. Dùng khi thay đổi login, refresh token, user
  claims, admin controller, protected route hoặc xử lý lỗi 401/403.
version: 1.0.0
metadata:
  audience: developers
  keywords: xomtruyen, auth, jwt, role, authorize, session, security
  workflow: ai
---

# Xomtruyen Auth Security

## Điểm kiểm soát

- Backend: `xomtruyen.API/Controllers/AuthController.cs`, `Services/Implementations/AuthService.cs`, `Program.cs`, model `User` và migration.
- Admin: `xomtruyen-admin/src/contexts/AuthContext.tsx`, `src/api/userApi.ts`, `App.tsx`, `Login.tsx`, route guard.
- Web/mobile: các API client, context và màn hình cần đăng nhập trong `xom-truyen/src` và `xomtruyen-app/src`.

## Quy trình

1. Xác định token flow: login, refresh, logout, `me`, expiration và claim names.
2. Đối chiếu claim .NET (`ClaimTypes.NameIdentifier`, email, role) với decoder TypeScript.
3. Kiểm tra token được lưu đúng nơi mà interceptor đọc; hiện admin dùng `sessionStorage` cho `accessToken` và `refreshToken`.
4. Bảo vệ backend bằng `[Authorize]` hoặc `[Authorize(Roles = "Admin,Moderator")]` theo ownership endpoint.
5. Bảo vệ frontend bằng route guard nhưng không coi route guard là thay thế backend authorization.
6. Với 401, xóa session và chuyển về login; với 403, giữ session và hiển thị không đủ quyền.
7. Không tạo fallback user hoặc fake GUID trong production path.

## An toàn bắt buộc

- Không ghi access token, refresh token, password hoặc secret vào log.
- Không tin role từ request body; role phải lấy từ token đã ký và dữ liệu server.
- Không nới `RequireHttpsMetadata` hoặc CORS chỉ để làm test pass mà không ghi rõ môi trường.
- Khi đổi claim hoặc storage key, cập nhật mọi interceptor, context và test cùng lúc.
- Kiểm tra anonymous, token hết hạn, token sai chữ ký, user thường, Admin và Moderator.

## Kiểm tra

```powershell
Push-Location .\xomtruyen-admin; npm run lint; npm run build; Pop-Location
dotnet build .\xomtruyen.API\xomtruyen.API.csproj
```

Không kết luận auth đã an toàn chỉ từ việc UI redirect đúng; phải kiểm tra endpoint backend bị gọi trực tiếp với quyền không phù hợp.
