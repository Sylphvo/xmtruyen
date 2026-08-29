# Luồng Apply dữ liệu toàn hệ thống

## 1. Mục tiêu

Thêm nút `Apply dữ liệu` cạnh ô tìm kiếm và đứng trước nút ba chấm trong các màn hình quản lý Admin.

Nút này dùng để ghi các thay đổi đang chờ vào database theo một batch an toàn.

Nguyên tắc chính:

- Khi chưa có thay đổi: nút bị `disabled`.
- Khi có ít nhất một thay đổi chưa ghi: nút được enable.
- Các thao tác chỉnh sửa không ghi trực tiếp vào database.
- Admin phải xem được danh sách thay đổi trước khi Apply.
- Apply toàn hệ thống phải có transaction, idempotency, audit log và khả năng rollback.
- Không được cho phép một màn hình ghi đè âm thầm thay đổi của màn hình khác.

## 2. Phạm vi màn hình

Áp dụng cho các màn hình quản lý có thao tác thêm, sửa, xóa hoặc đổi trạng thái:

- Books, Comics, Book Chapters
- Categories, Topics, Authors
- Users
- Database và Database Table Viewer
- Subscription Plans, Coin Packages
- Transactions
- Notifications, Reviews, Reports
- Promotions, Banners, Home Sections
- Static Pages, FAQ, Help Articles, Email Templates
- Translation, Audio, Video và các pipeline có dữ liệu quản lý

Không áp dụng nút Apply cho:

- Dashboard chỉ đọc
- Login
- Health check chỉ đọc
- Các thao tác upload file cần xử lý background riêng
- Các nút hành động rõ ràng là chạy job ngay lập tức, nếu chưa chuyển chúng sang cơ chế staging

## 3. UX mong muốn

### 3.1. Vị trí nút

Trong toolbar của mỗi bảng:

```text
[ Ô tìm kiếm... ] [ Apply dữ liệu ] [ ... ]
```

Nút đặt ngay sau ô tìm kiếm và trước nút ba chấm.

Trạng thái:

| Trạng thái | Nút Apply |
|---|---|
| Không có thay đổi | Disabled, màu trung tính |
| Có thay đổi local | Enabled, hiển thị số lượng thay đổi |
| Đang kiểm tra | Disabled, spinner |
| Đang Apply | Disabled, progress |
| Apply thành công | Disabled, thông báo thành công |
| Apply lỗi | Enabled nếu còn thay đổi chưa ghi |

Nhãn đề xuất:

- `Apply dữ liệu`
- Khi có thay đổi: `Apply dữ liệu (3)`
- Tooltip: `Ghi các thay đổi đang chờ vào database`

### 3.2. Tránh mất thay đổi

Khi người dùng rời màn hình trong lúc còn pending changes:

- Hiển thị cảnh báo nếu browser hỗ trợ `beforeunload`.
- Khi chuyển route trong Admin, hiển thị modal:
  - `Apply và rời đi`
  - `Bỏ thay đổi`
  - `Ở lại`
- Không tự động Apply khi reload.
- Không tự động bỏ thay đổi khi chuyển tab giữa List và Docs.

### 3.3. Modal trước khi Apply

Click `Apply dữ liệu` không ghi ngay lập tức. Mở modal xác nhận gồm:

- Tổng số thay đổi.
- Số bản ghi thêm mới.
- Số bản ghi cập nhật.
- Số bản ghi xóa.
- Số bảng bị ảnh hưởng.
- Danh sách thay đổi theo bảng.
- Cảnh báo quan hệ liên kết hoặc foreign key.
- Người thực hiện.
- Thời điểm tạo batch.
- Nút `Kiểm tra thay đổi`.
- Nút `Apply vào database`.
- Nút `Hủy`.

Nếu validation thất bại, không cho Apply và phải hiển thị lỗi theo từng dòng/trường.

## 4. Kiến trúc dữ liệu staging

Không lưu thay đổi trực tiếp vào database chính khi người dùng đang nhập liệu. Mỗi page ghi thay đổi vào một bộ nhớ staging dùng chung.

### 4.1. Contract frontend

```ts
export type PendingChangeType = 'CREATE' | 'UPDATE' | 'DELETE';

export interface PendingChange {
  id: string;
  resource: string;
  tableName: string;
  recordId: string | null;
  changeType: PendingChangeType;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  changedFields: string[];
  version: number | null;
  createdAt: string;
  updatedAt: string;
  sourcePage: string;
}

export interface ApplyBatch {
  batchId: string;
  changes: PendingChange[];
  createdAt: string;
  clientVersion: string;
}
```

### 4.2. Quy tắc gom thay đổi

- Cùng một record sửa nhiều lần chỉ tạo một pending change.
- `before` giữ snapshot lúc bắt đầu chỉnh sửa.
- `after` giữ dữ liệu cuối cùng người dùng muốn Apply.
- Nếu sửa rồi trả lại giống `before`, loại pending change đó.
- Create rồi Delete trước khi Apply thì loại bỏ cả hai thao tác.
- Update rồi Delete thì chỉ giữ Delete với snapshot đúng.
- Không gửi field không thay đổi.
- Không đưa password, token, secret hoặc file binary vào diff/audit log.

### 4.3. Store dùng chung

Tạo store/hook dùng cho toàn Admin:

```text
xmtruyen-admin/src/state/pendingChangesStore.ts
xmtruyen-admin/src/hooks/usePendingChanges.ts
```

Store phải có các hàm:

```ts
addChange(change)
updateChange(id, patch)
removeChange(id)
getChanges()
getChangesByResource(resource)
clearChanges(ids)
clearAllChanges()
hasPendingChanges()
getPendingCount()
```

Có thể dùng Context, Zustand hoặc reducer hiện có của dự án. Không tạo một state riêng trong từng page vì sẽ không thể Apply toàn hệ thống.

## 5. Nút dùng chung

Tạo component:

```text
xmtruyen-admin/src/components/ApplyDataButton.tsx
```

Props đề xuất:

```ts
interface ApplyDataButtonProps {
  disabled?: boolean;
  pendingCount: number;
  isApplying: boolean;
  onClick: () => void;
}
```

Component phải:

- Đọc pending count từ store hoặc nhận qua props.
- Disable khi `pendingCount === 0`.
- Disable khi đang validate/apply.
- Hiển thị spinner khi đang chạy.
- Có `aria-label`, keyboard focus và tooltip.
- Không tự gọi API; logic gọi API nằm ở hook/service.

Ví dụ sử dụng:

```tsx
<ApplyDataButton
  pendingCount={pendingCount}
  isApplying={isApplying}
  onClick={openApplyReview}
/>
```

## 6. Tích hợp vào toolbar từng page

Tạo toolbar dùng chung nếu các page đang lặp markup:

```text
xmtruyen-admin/src/components/ManagementToolbar.tsx
```

Props:

```ts
interface ManagementToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  pendingCount: number;
  onApply: () => void;
  onMore: () => void;
}
```

Nếu chưa thể refactor toàn bộ, tích hợp lần lượt vào các page có bảng. Mỗi page phải truyền `resource` rõ ràng:

```tsx
<ManagementToolbar
  searchValue={searchTerm}
  onSearchChange={setSearchTerm}
  pendingCount={getPendingCount('books')}
  onApply={openApplyReview}
  onMore={openMoreMenu}
/>
```

Nút Apply có thể hiển thị ở từng page nhưng luôn đọc cùng một global store. Vì vậy khi page A có thay đổi, page B cũng phải biết hệ thống đang có pending changes.

## 7. Luồng chỉnh sửa tại page

Mỗi thao tác CRUD phải đổi từ gọi API ngay sang staging:

### 7.1. Create

1. Mở form.
2. Validate dữ liệu cơ bản ở frontend.
3. Tạo bản ghi tạm có id client.
4. Đưa `CREATE` vào pending store.
5. Hiển thị dòng với badge `Chưa Apply`.
6. Không gọi API create ở bước này.

### 7.2. Update

1. Lấy snapshot `before` từ dữ liệu đang hiển thị.
2. Người dùng sửa form hoặc inline cell.
3. Tính diff field-level.
4. Đưa `UPDATE` vào pending store.
5. Cập nhật UI optimistic bằng `after`.
6. Không gọi API update ở bước này.

### 7.3. Delete

1. Hiển thị confirmation.
2. Đưa `DELETE` vào pending store.
3. Ẩn dòng khỏi list hoặc đánh dấu pending delete.
4. Cho phép Undo trước khi Apply.
5. Không gọi API delete ở bước này.

### 7.4. Undo

- Mỗi pending change cần có thao tác Undo.
- Undo phải khôi phục UI và xóa/thay thế change tương ứng trong store.
- Không dùng Undo để phục hồi dữ liệu đã Apply; việc đó phải qua version/rollback batch.

## 8. API backend

Tạo module API riêng:

```text
xmtruyen.API/Controllers/Admin/AdminApplyController.cs
xmtruyen.API/Contracts/ApplyData/
xmtruyen.API/Services/ApplyData/
```

### 8.1. Validate batch

```http
POST /api/admin/apply-data/validate
```

Request:

```json
{
  "batchId": "client-batch-id",
  "clientVersion": "admin-1.0.0",
  "changes": [
    {
      "id": "change-1",
      "resource": "books",
      "tableName": "Publications",
      "recordId": "book-id",
      "changeType": "UPDATE",
      "before": { "title": "Tên cũ" },
      "after": { "title": "Tên mới" },
      "changedFields": ["title"],
      "version": 4
    }
  ]
}
```

Response phải trả:

- `valid`
- `errors[]`
- `warnings[]`
- `normalizedChanges[]`
- `conflicts[]`
- `estimatedAffectedRows`
- `requiresSecondConfirmation`

### 8.2. Apply batch

```http
POST /api/admin/apply-data
Idempotency-Key: {batchId}
```

Response:

```json
{
  "batchId": "client-batch-id",
  "status": "APPLIED",
  "appliedCount": 3,
  "failedCount": 0,
  "auditLogId": "audit-id",
  "appliedAt": "2026-08-25T10:00:00Z"
}
```

Các trạng thái:

- `VALIDATING`
- `READY`
- `APPLYING`
- `APPLIED`
- `PARTIAL_FAILED`
- `FAILED`
- `ROLLED_BACK`
- `CONFLICT`

### 8.3. Xem trạng thái batch

```http
GET /api/admin/apply-data/{batchId}
```

Dùng cho trường hợp request timeout nhưng server có thể đã Apply thành công.

### 8.4. Rollback batch

```http
POST /api/admin/apply-data/{batchId}/rollback
```

Rollback chỉ được cho phép nếu:

- Có audit snapshot trước Apply.
- Bản ghi chưa bị thay đổi bởi batch khác.
- Người dùng có quyền rollback.
- Không vi phạm foreign key hoặc dữ liệu mới phát sinh.

## 9. Xử lý database an toàn

### 9.1. Transaction

Toàn bộ batch phải chạy trong transaction database:

1. Load và lock bản ghi liên quan.
2. Kiểm tra version/concurrency token.
3. Validate foreign key và business rule.
4. Apply create/update/delete theo thứ tự dependency.
5. Ghi audit log.
6. Commit một lần.
7. Nếu có lỗi: rollback toàn bộ batch.

Không được commit từng dòng độc lập nếu UI hiển thị đây là một lần Apply toàn hệ thống.

### 9.2. Thứ tự Apply đề xuất

1. Create/update Categories, Topics, Authors.
2. Create/update Publications/Books.
3. Create/update Chapters và quan hệ sách.
4. Create/update Users và role mapping.
5. Apply nội dung CMS.
6. Apply transactions và dữ liệu phụ thuộc.
7. Apply delete sau cùng.

Nếu một batch có quan hệ phức tạp, backend phải tự tính dependency graph thay vì tin thứ tự do browser gửi lên.

### 9.3. Optimistic concurrency

Mỗi entity cần có:

- `UpdatedAt` hoặc `RowVersion`.
- Version gửi từ client.
- Kiểm tra version trước update/delete.

Nếu version database khác version client:

- Không ghi đè.
- Trả `409 Conflict`.
- Hiển thị before hiện tại, before lúc chỉnh sửa và after người dùng muốn Apply.
- Cho phép `Giữ dữ liệu server`, `Ghi đè có quyền` hoặc `Trộn thủ công`.

### 9.4. Idempotency

`batchId` phải unique và được lưu ở server.

Nếu client gửi lại cùng `Idempotency-Key`:

- Không Apply lần hai.
- Trả lại kết quả batch cũ.
- Không tạo audit log trùng.

## 10. Quyền và bảo mật

Tối thiểu cần các quyền:

- `system.apply_data.preview`
- `system.apply_data.execute`
- `system.apply_data.rollback`
- Quyền riêng theo resource nếu cần.

Backend phải kiểm tra:

- JWT và role Admin.
- Quyền trên từng resource/table.
- Field nào user được phép sửa.
- Không tin `tableName`, `resource`, `recordId` từ browser nếu chưa whitelist.
- Không cho phép Apply tùy ý SQL.
- Không log password, token, dữ liệu riêng tư hoặc nội dung nhạy cảm.
- Giới hạn số change/batch và kích thước payload.
- Rate limit endpoint Apply.
- Yêu cầu confirmation thứ hai cho delete hàng loạt hoặc bảng nhạy cảm.

## 11. Audit log

Tạo bảng hoặc dùng hệ thống audit hiện có với các field:

```text
AuditLogId
BatchId
ActorUserId
Resource
TableName
RecordId
Action
BeforeJson
AfterJson
ChangedFieldsJson
Status
IpAddress
UserAgent
CreatedAt
ErrorCode
ErrorMessage
```

Audit log phải:

- Append-only.
- Không cho client sửa/xóa.
- Có thể tìm theo batch, user, resource và thời gian.
- Liên kết được tới rollback.
- Có retention policy.

## 12. Frontend state và đồng bộ

### 12.1. Persist tạm

Có thể lưu pending changes vào `sessionStorage` hoặc `localStorage` để tránh mất khi reload, nhưng phải:

- Mã hóa hoặc loại bỏ dữ liệu nhạy cảm.
- Có TTL.
- Có schema version.
- Xóa sau khi server trả `APPLIED`.
- Không xem localStorage là database chính.

Key đề xuất:

```text
xmtruyen.pendingChanges.v1
```

### 12.2. Sau khi Apply thành công

1. Xóa các change đã Apply khỏi store.
2. Refetch các resource bị ảnh hưởng.
3. Xóa optimistic rows không còn hợp lệ.
4. Hiển thị batch id và thời gian Apply.
5. Cho phép mở audit detail.

### 12.3. Khi Apply lỗi

- Giữ lại các change chưa Apply.
- Đánh dấu lỗi theo change.
- Không báo thành công nếu chỉ Apply được một phần.
- Cho phép sửa lỗi rồi validate lại.
- Cho phép retry cùng batch nếu backend hỗ trợ idempotency.

## 13. Các bước triển khai theo thứ tự

### Phase 1 - Chốt contract

- [ ] Liệt kê tất cả page và CRUD action.
- [ ] Liệt kê entity/table được phép Apply.
- [ ] Chốt trạng thái batch.
- [ ] Chốt field được phép chỉnh sửa theo role.
- [ ] Chốt cách xử lý conflict và rollback.
- [ ] Chốt giới hạn số change trong một batch.

**Kết quả:** tài liệu contract và ma trận quyền được duyệt.

### Phase 2 - Frontend staging

- [ ] Tạo `PendingChange` types.
- [ ] Tạo global pending changes store.
- [ ] Tạo hook `usePendingChanges`.
- [ ] Chuyển một page mẫu, nên bắt đầu từ Categories hoặc Topics, sang staging.
- [ ] Hiển thị badge `Chưa Apply`.
- [ ] Thêm Undo.
- [ ] Test create/update/delete mà không gọi API.

**Kết quả:** một page có thể chỉnh nhiều dòng và chỉ giữ local changes.

### Phase 3 - Component UI dùng chung

- [ ] Tạo `ApplyDataButton`.
- [ ] Đặt sau ô tìm kiếm, trước nút ba chấm.
- [ ] Disable khi count bằng 0.
- [ ] Tạo Apply Review Modal.
- [ ] Thêm loading, error, success và conflict state.
- [ ] Tích hợp dần vào các page còn lại.

**Kết quả:** UI nhất quán trên toàn Admin.

### Phase 4 - Backend validate

- [ ] Tạo DTO request/response.
- [ ] Tạo whitelist resource/table/field.
- [ ] Tạo endpoint validate.
- [ ] Validate required field, type, length, foreign key và business rules.
- [ ] Thêm optimistic concurrency check.
- [ ] Trả lỗi theo từng change.

**Kết quả:** server có thể kiểm tra batch mà chưa thay đổi database.

### Phase 5 - Backend Apply transaction

- [ ] Tạo Apply service, không viết nghiệp vụ trong controller.
- [ ] Tạo transaction boundary.
- [ ] Tính dependency order.
- [ ] Implement create/update/delete an toàn.
- [ ] Thêm idempotency record.
- [ ] Thêm audit log.
- [ ] Thêm rollback snapshot.
- [ ] Kiểm tra timeout và cancellation.

**Kết quả:** batch Apply nguyên tử, retry không nhân đôi dữ liệu.

### Phase 6 - Tích hợp toàn hệ thống

- [ ] Thay API CRUD trực tiếp trong từng page bằng staging.
- [ ] Chuyển Book, User, Database sau page mẫu.
- [ ] Xử lý các upload/background job riêng.
- [ ] Refetch dữ liệu sau Apply.
- [ ] Hiển thị global pending count.
- [ ] Thêm cảnh báo khi rời trang.

**Kết quả:** mọi thay đổi CRUD thuộc phạm vi đều đi qua Apply.

### Phase 7 - Kiểm thử

- [ ] Nút disabled khi không có thay đổi.
- [ ] Nút enable khi tạo một thay đổi.
- [ ] Sửa rồi trả lại giá trị cũ thì nút disabled.
- [ ] Create rồi Delete trước Apply không tạo dữ liệu rác.
- [ ] Update nhiều lần cùng record chỉ tạo một change.
- [ ] Apply nhiều bảng trong một batch.
- [ ] Validation fail không thay đổi database.
- [ ] Foreign key fail rollback toàn batch.
- [ ] Request timeout retry không tạo bản ghi trùng.
- [ ] Conflict trả `409` và không ghi đè.
- [ ] Unauthorized trả `401`.
- [ ] Forbidden trả `403`.
- [ ] Không tìm thấy record trả `404`.
- [ ] Rollback chỉ hoạt động với batch hợp lệ.
- [ ] Refresh browser không làm mất pending changes nếu tính năng persist được bật.
- [ ] Mobile/tablet không làm vỡ toolbar.

### Phase 8 - Triển khai production

- [ ] Chạy migration database.
- [ ] Bật feature flag theo nhóm admin.
- [ ] Chạy với một resource trước.
- [ ] Theo dõi số batch thành công/thất bại/conflict.
- [ ] Kiểm tra audit log.
- [ ] Chuẩn bị rollback frontend và migration.
- [ ] Mở rộng dần sang các resource còn lại.

## 14. Tiêu chí hoàn thành

Chức năng được xem là hoàn thành khi:

- Nút `Apply dữ liệu` xuất hiện đúng vị trí trong các bảng được hỗ trợ.
- Nút disabled khi không có pending changes.
- Mọi chỉnh sửa trước Apply không ghi vào database chính.
- Admin xem được preview diff trước khi xác nhận.
- Apply có authorization, validation, transaction và idempotency.
- Một lỗi trong batch không để lại dữ liệu nửa chừng.
- Có optimistic concurrency và cách xử lý conflict.
- Có audit log đầy đủ.
- Có rollback trong giới hạn dữ liệu cho phép.
- Có test cho CRUD, lỗi mạng, quyền, conflict, duplicate request và rollback.
- Có thể mở rộng cùng một flow cho toàn bộ page mà không copy logic riêng từng nơi.

## 15. Khuyến nghị triển khai MVP

Không nên triển khai Apply toàn hệ thống ngay từ ngày đầu. Thứ tự ít rủi ro:

1. Categories.
2. Topics.
3. Authors.
4. Books.
5. Chapters.
6. Users.
7. Database Table Viewer.
8. Các bảng giao dịch và dữ liệu nhạy cảm.

Chỉ khi 3 resource đầu tiên đã pass validation, transaction, audit và conflict test mới mở rộng sang toàn hệ thống.
