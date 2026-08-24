---
name: xomtruyen-reader-experience
description: >
  Phát triển trải nghiệm đọc truyện chữ và truyện tranh trên web/mobile Xomtruyen.
  Dùng khi sửa ReadingPage, ComicReadingContent, reader settings, theme, progress,
  bookmark/history, bilingual reader, dictionary, TTS, break reminder hoặc accessibility.
version: 1.0.0
metadata:
  audience: developers
  keywords: xomtruyen, reader, reading, ionic, mobile, accessibility, tts
  workflow: ai
---

# Xomtruyen Reader Experience

## Điểm kiểm soát

- Web reader: `xom-truyen/src/pages/ReadingPage.tsx` và `src/components/Reading`.
- Mobile reader: `xomtruyen-app/src/pages` và các hook/component đọc tương ứng.
- Backend: `ReadingController`, `HistoryController`, `BookmarkController`, `FavoriteController`, `ReaderPreferenceController`.
- API/types: các module trong `xom-truyen/src/services`, `xomtruyen-app/src`, và model/DTO trong `xomtruyen.API`.

## Quy trình

1. Xác định content type trước: text chapter và comic chapter không dùng cùng renderer hoặc pagination.
2. Giữ reading position theo publication/chapter; khi lưu history phải dùng upsert và xử lý offline/retry nếu client hỗ trợ.
3. Khi thêm setting, cập nhật type, default, persistence, API DTO và UI preview; không để state chỉ sống trong một component.
4. Theme, font, size, line-height và contrast phải có giới hạn rõ ràng, không làm layout tràn màn hình.
5. TTS, dictionary, bilingual và device advisor là enhancement; nội dung gốc phải còn nguyên và không được chặn việc đọc cơ bản.
6. Break reminder phải là thông báo mềm, có thể tắt/reset và không làm mất vị trí đọc.
7. Hỗ trợ keyboard, focus, reduced motion, alt text và trạng thái loading/error/empty.

## Quy tắc hiệu năng

- Lazy-load ảnh comic, giữ thứ tự trang và placeholder ổn định.
- Không gọi API lặp do effect dependency hoặc scroll handler.
- Debounce thao tác lưu progress; không ghi mỗi pixel scroll.
- Dọn timer, event listener, SignalR subscription và object URL khi unmount.
- Không đưa credentials hoặc nội dung chapter private vào URL/log.

## Kiểm tra

- Đọc text/comic khi chưa đăng nhập và khi đã đăng nhập.
- Chapter khóa, hết quyền, chapter không tồn tại, mạng chậm và API lỗi.
- Đổi theme/font/size rồi reload; kiểm tra progress/history.
- Màn hình nhỏ, xoay mobile, keyboard navigation và reduced motion.

```powershell
Push-Location .\xom-truyen; npm run lint; npm run build; Pop-Location
Push-Location .\xomtruyen-app; npm run lint; npm run build; Pop-Location
```
