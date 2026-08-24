---
name: orbit-local-xomtruyen
description: >
  Phân tích checkout local của workspace Xomtruyen bằng Orbit Local. Dùng khi cần
  tạo repo map, tìm định nghĩa TypeScript/JavaScript, truy vết import hoặc call
  graph, kiểm tra blast radius của thay đổi chưa push, hoặc truy vấn code bằng
  SQL read-only. Trên Windows, chạy Orbit Local trong WSL hoặc qua binary tương thích.
version: 1.0.0
license: MIT
metadata:
  audience: developers
  keywords: xomtruyen, orbit-local, knowledge-graph, code-graph, typescript, react
  workflow: ai
---

# Orbit Local cho Xomtruyen

Dùng Orbit Local để lập chỉ mục một checkout Xomtruyen và trả lời câu hỏi về cấu trúc code bằng DuckDB read-only.

## Khi dùng

Dùng skill này cho:

- `AuthContext`, hook, component, service hoặc symbol nào đang được gọi ở đâu.
- File nào import một module hoặc component.
- Sơ đồ thư mục, API và các định nghĩa trong một app.
- Đánh giá phạm vi ảnh hưởng trước khi sửa code trong branch local.

Skill này chỉ dành cho source local. Không dùng nó cho lookup GitLab đơn lẻ hoặc thao tác ghi MR.

## Cách chạy

Orbit Local cần nhận repo root có `.git`, vì vậy hãy index `D:\temp\xomtruyen`, không chỉ một thư mục con:

```powershell
wsl
cd /mnt/d/temp/xomtruyen
orbit index . --stats
orbit repo-map overview
```

Nếu dùng wrapper của `glab`:

```powershell
wsl
cd /mnt/d/temp/xomtruyen
glab orbit local --yes index .
glab orbit local --yes repo-map overview
```

Binary upstream không có bản Windows. Không tải binary Linux vào PowerShell native; dùng WSL hoặc đặt binary tương thích bằng `GLAB_ORBIT_LOCAL_BINARY_PATH`.

## Quy trình

1. Xác nhận checkout đã được index ở commit hiện tại; index lại sau khi đổi branch/commit.
2. Chạy `orbit repo-map overview` để biết ngôn ngữ và cấu trúc chính.
3. Thu hẹp bằng `tree` hoặc `api`, ví dụ `orbit repo-map api xomtruyen-admin/src`.
4. Với câu hỏi chính xác về caller/import, dùng SQL một truy vấn thay vì quét rộng.
5. Khi báo cáo kết quả, nêu rõ commit và đường dẫn local đã được phân tích.

## SQL mẫu

Các bảng chính là `gl_definition`, `gl_file`, `gl_imported_symbol` và `gl_edge`:

```bash
orbit sql "SELECT definition_type, name, file_path, start_line FROM gl_definition WHERE file_path LIKE 'xomtruyen-admin/src/%' ORDER BY file_path, start_line"
```

Tìm nơi gọi một symbol:

```bash
orbit sql "SELECT DISTINCT s.name AS caller, s.file_path, s.start_line FROM gl_edge e JOIN gl_definition s ON e.source_id = s.id JOIN gl_definition t ON e.target_id = t.id WHERE e.relationship_kind='CALLS' AND t.name='AuthProvider'"
```

Tìm import:

```bash
orbit sql "SELECT DISTINCT file_path, import_path, identifier_name FROM gl_imported_symbol WHERE import_path LIKE '%AuthContext%' ORDER BY file_path"
```

Các truy vấn chỉ đọc. Tên `definition_type` phân biệt hoa thường; dùng `orbit schema gl_definition gl_edge` nếu cần xác nhận schema.

## Giới hạn

- Kết quả phụ thuộc parser và coverage của Orbit đối với TypeScript/TSX.
- `gl_edge` không có `commit_sha`; scope theo commit bằng cách join với bảng definition.
- Repo map là công cụ định hướng, không thay thế test, TypeScript build hoặc ESLint.
- Sau khi phân tích, luôn xác nhận thay đổi bằng lệnh phù hợp của package bị tác động, chẳng hạn `npm run lint` hoặc `npm run build`.
