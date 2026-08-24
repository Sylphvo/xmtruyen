# Xomtruyen skills

Các skill này dùng cho source local, không truy vấn dịch vụ bên ngoài.

## Chọn skill

- `xomtruyen-api-contract`: thêm/sửa endpoint, DTO, response và đồng bộ client.
- `xomtruyen-auth-security`: login, JWT, session, route guard và phân quyền.
- `xomtruyen-content-pipeline`: CSV, paste, OCR, archive, chapter upload và job xử lý.
- `xomtruyen-reader-experience`: reader text/comic, mobile, progress, theme, TTS và accessibility.
- `xomtruyen-validation`: chọn lệnh build/lint/test theo phạm vi thay đổi.
- `orbit-local-xomtruyen`: lập chỉ mục và hỏi quan hệ code local khi binary Orbit Local khả dụng.

### Cách chọn nhanh

1. Thay đổi bắt đầu từ controller/service/DTO: dùng `xomtruyen-api-contract`.
2. Có token, role hoặc endpoint admin: thêm `xomtruyen-auth-security`.
3. Có file, chapter, import hoặc background processing: thêm `xomtruyen-content-pipeline`.
4. Có màn hình đọc hoặc trạng thái đọc: dùng `xomtruyen-reader-experience`.
5. Chạm hơn một project hoặc trước khi kết thúc task: dùng `xomtruyen-validation`.
