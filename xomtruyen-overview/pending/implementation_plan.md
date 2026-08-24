# Kế hoạch: Apply Jira-style Table cho tất cả trang quản lý

## Mục tiêu
Đồng bộ UX bảng dữ liệu: checkbox, hover, selected highlight, FloatingBulkActionBar với Delete — giống trang "Tất cả sách".

## Phân tích hiện trạng

### ✅ Đã có cơ bản (cần bổ sung xóa hàng loạt + đồng bộ CSS)
| Trang | selectedIds | FloatingBulkActionBar | onBulkDelete |
|---|---|---|---|
| Categories.tsx | ✅ | ✅ | ❌ |
| Topics.tsx | ✅ | ✅ | ❌ |
| BookChapters.tsx | ✅ | ✅ | ❌ |
| BookFiles.tsx | ✅ | ✅ | ❌ |
| Users.tsx | ✅ | ✅ | ❌ |
| CoinPackages.tsx | ✅ | ✅ | ❌ |
| Transactions.tsx | ✅ | ✅ | ❌ |
| Promotions.tsx | ✅ | ✅ | ❌ |
| Notifications.tsx | ✅ | ✅ | ❌ |
| Reviews.tsx | ✅ | ✅ | ❌ |
| SubscriptionPlans.tsx | ✅ | ✅ | ❌ |
| Crawlers.tsx | ✅ | ✅ | ❌ |
| Database.tsx | ✅ | ✅ | ❌ |
| DatabaseTableViewer.tsx | ✅ | ✅ | ❌ |

## Những gì sẽ được áp dụng cho mỗi trang

### 1. CSS selected row (đổi từ hardcode sang class)
```tsx
// Trước
style={{ backgroundColor: selectedIds.includes(item.id) ? '#ebf2fc' : 'transparent' }}

// Sau
className={`jira-table-row${selectedIds.includes(item.id) ? ' jira-row-selected' : ''}`}
```

### 2. FloatingBulkActionBar với onBulkDelete
```tsx
<FloatingBulkActionBar 
  selectedCount={selectedIds.length} 
  onClearSelection={() => setSelectedIds([])} 
  onBulkDelete={handleBulkDelete}  // ← Thêm mới
/>
```

### 3. handleBulkDelete per page (gọi API delete tương ứng)
```tsx
const handleBulkDelete = async () => {
  if (!window.confirm(`Xóa ${selectedIds.length} mục?`)) return;
  const p = Promise.all(selectedIds.map(id => deleteXxx(id)));
  toast.promise(p, { loading: 'Đang xóa...', success: 'Xóa thành công!', error: 'Lỗi khi xóa' });
  await p;
  selectedIds.forEach(id => removeItem(id));
  setSelectedIds([]);
};
```

### 4. CSS class `jira-row-selected` trong app.scss
```scss
.jira-table-row.jira-row-selected {
  background-color: #e8f0fd !important;
}
```

## Open Questions

> [!IMPORTANT]
> **Với các trang như Users, Transactions, Reviews**: Có nên bật chức năng xóa hàng loạt không? Một số trang (Users) có thể nguy hiểm nếu xóa nhầm nhiều user.

> [!IMPORTANT]
> **Thứ tự ưu tiên**: Bạn muốn tôi làm tất cả các trang cùng lúc, hay ưu tiên một số trang trước? (Categories, Topics, Authors trước?)

## Các trang KHÔNG áp dụng
- Dashboard.tsx (không có bảng dữ liệu dạng list)
- Login.tsx
- BookDetails.tsx (bảng chapter đặc thù)
- AudioDashboard, BookVideoDashboard, ComicVideoDashboard (bảng job log)
s