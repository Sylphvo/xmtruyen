import React, { useMemo } from 'react';
import { ListChecks, CheckCircle2, Circle, Clock } from 'lucide-react';

/**
 * Trang "Tiến độ triển khai" — hiển thị checklist đồng bộ các trang theo chuẩn Books.
 *
 * ⚠️ NGUỒN DỮ LIỆU: Giữ đồng bộ với file MIGRATION_PROGRESS.md ở gốc dự án.
 * Mỗi khi apply xong một mục, đổi status của mục đó: 'todo' -> 'done' (hoặc 'doing').
 */

type ItemStatus = 'todo' | 'doing' | 'done';

interface ChecklistItem {
  label: string;
  note?: string;
  status: ItemStatus;
}

interface ChecklistGroup {
  id: string;
  title: string;
  color: string; // màu badge nhóm
  items: ChecklistItem[];
}

const GROUPS: ChecklistGroup[] = [
  {
    id: 'A',
    title: '🔴 Nhóm A — Sửa lỗi / placeholder',
    color: '#dc3545',
    items: [
      { label: 'ImportData.tsx', note: 'Viết lại bằng react-bootstrap, gọi API thật (bỏ mock + MUI)', status: 'todo' },
      { label: 'StaticPages.tsx', note: 'Fix bug variant="sm light" -> variant="light" size="sm"', status: 'todo' },
      { label: 'Sidebar.tsx', note: 'Cập nhật lại cờ status cho đúng thực trạng', status: 'todo' },
    ],
  },
  {
    id: 'B',
    title: '🟠 Nhóm B — CRUD thủ công + modal → nâng lên chuẩn Books',
    color: '#fd7e14',
    items: [
      { label: 'Authors.tsx', note: 'Bản mẫu chuyển đổi', status: 'todo' },
      { label: 'Banners.tsx', status: 'todo' },
      { label: 'HelpArticles.tsx', status: 'todo' },
      { label: 'HomeSections.tsx', status: 'todo' },
      { label: 'EmailTemplates.tsx', status: 'todo' },
      { label: 'FaqManagement.tsx', status: 'todo' },
      { label: 'Reports.tsx', status: 'todo' },
      { label: 'AudioVoices.tsx', status: 'todo' },
      { label: 'AudioCharacters.tsx', status: 'todo' },
      { label: 'Translation.tsx', status: 'todo' },
      { label: 'TranslationGlossary.tsx', status: 'todo' },
      { label: 'SystemConfigs.tsx', status: 'todo' },
      { label: 'ErrorLogPage.tsx', status: 'todo' },
      { label: 'AudioDashboard.tsx', status: 'todo' },
      { label: 'BookVideoDashboard.tsx', status: 'todo' },
      { label: 'ComicVideoDashboard.tsx', status: 'todo' },
    ],
  },
  {
    id: 'C',
    title: '🟡 Nhóm C — Có InfiniteScroll, thiếu Skeleton/inline/reorder',
    color: '#ffc107',
    items: [
      { label: 'Transactions.tsx', note: 'Skeleton, Excel, inline edit', status: 'todo' },
      { label: 'Reviews.tsx', note: 'Skeleton, inline edit, column reorder', status: 'todo' },
      { label: 'Notifications.tsx', note: 'Skeleton, inline edit, column reorder', status: 'todo' },
      { label: 'Promotions.tsx', note: 'Skeleton, column reorder', status: 'todo' },
      { label: 'CoinPackages.tsx', note: 'Skeleton, phân trang thật', status: 'todo' },
      { label: 'SubscriptionPlans.tsx', note: 'Skeleton, phân trang thật', status: 'todo' },
      { label: 'Crawlers.tsx', note: 'Skeleton, column reorder', status: 'todo' },
      { label: 'BookChapters.tsx', note: 'Skeleton, column reorder', status: 'todo' },
      { label: 'BookFiles.tsx', note: 'Skeleton, phân trang thật', status: 'todo' },
      { label: 'DatabaseTableViewer.tsx', note: 'Skeleton, inline edit', status: 'todo' },
      { label: 'Database.tsx', note: 'Dùng InfiniteScroll', status: 'todo' },
    ],
  },
  {
    id: 'D',
    title: '🟢 Nhóm D — Đạt chuẩn / bổ sung nhỏ',
    color: '#198754',
    items: [
      { label: 'Books.tsx', note: 'Mẫu chuẩn', status: 'done' },
      { label: 'Users.tsx', note: 'Thêm Excel + lưu column order server', status: 'todo' },
      { label: 'Categories.tsx', note: 'Lưu column order lên server', status: 'todo' },
      { label: 'Topics.tsx', note: 'Lưu column order lên server', status: 'todo' },
      { label: 'ReadingAnalytics.tsx', note: 'Trang thống kê, OK', status: 'done' },
      { label: 'TestCases.tsx', note: 'Công cụ nội bộ, OK', status: 'done' },
      { label: 'BuildProcess.tsx', note: 'Công cụ nội bộ, OK', status: 'done' },
    ],
  },
];

const StatusIcon: React.FC<{ status: ItemStatus }> = ({ status }) => {
  if (status === 'done') return <CheckCircle2 size={18} className="text-success flex-shrink-0" />;
  if (status === 'doing') return <Clock size={18} className="text-warning flex-shrink-0" />;
  return <Circle size={18} className="text-secondary flex-shrink-0" style={{ opacity: 0.5 }} />;
};

const countDone = (items: ChecklistItem[]) => items.filter(i => i.status === 'done').length;

export const MigrationProgress: React.FC = () => {
  const totals = useMemo(() => {
    const allItems = GROUPS.flatMap(g => g.items);
    const done = allItems.filter(i => i.status === 'done').length;
    const doing = allItems.filter(i => i.status === 'doing').length;
    return { total: allItems.length, done, doing, percent: allItems.length ? Math.round((done / allItems.length) * 100) : 0 };
  }, []);

  return (
    <div className="container-fluid py-4 px-4">
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2">
            <ListChecks size={28} className="text-primary" />
            <h1 className="h3 mb-0">Tiến độ triển khai</h1>
          </div>
          <p className="text-muted mb-0 mt-2">
            Theo dõi việc đồng bộ các trang theo chuẩn <strong>Books</strong>. Nguồn dữ liệu: <code>MIGRATION_PROGRESS.md</code>.
          </p>
        </div>
        <div className="text-end">
          <div className="h2 mb-0 text-primary">{totals.percent}%</div>
          <div className="text-muted small">{totals.done}/{totals.total} mục hoàn thành</div>
        </div>
      </div>

      {/* Progress bar tổng */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-2">
            <span className="fw-semibold">Tổng tiến độ</span>
            <span className="text-muted small">
              ✅ {totals.done} xong · ⏳ {totals.doing} đang làm · ◻️ {totals.total - totals.done - totals.doing} chờ
            </span>
          </div>
          <div className="progress" style={{ height: 12 }}>
            <div
              className="progress-bar bg-success"
              role="progressbar"
              style={{ width: `${totals.percent}%` }}
              aria-valuenow={totals.percent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </div>

      {/* Các nhóm */}
      <div className="row g-4">
        {GROUPS.map(group => {
          const done = countDone(group.items);
          const percent = group.items.length ? Math.round((done / group.items.length) * 100) : 0;
          return (
            <div className="col-12 col-xl-6" key={group.id}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h2 className="h6 mb-0">{group.title}</h2>
                  <span
                    className="badge rounded-pill"
                    style={{ backgroundColor: group.color, color: group.id === 'C' ? '#000' : '#fff' }}
                  >
                    {done}/{group.items.length}
                  </span>
                </div>
                <div className="px-3 pt-3">
                  <div className="progress" style={{ height: 6 }}>
                    <div className="progress-bar" role="progressbar" style={{ width: `${percent}%`, backgroundColor: group.color }} />
                  </div>
                </div>
                <ul className="list-group list-group-flush">
                  {group.items.map(item => (
                    <li
                      key={item.label}
                      className="list-group-item d-flex align-items-start gap-2"
                      style={{ opacity: item.status === 'todo' ? 0.85 : 1 }}
                    >
                      <StatusIcon status={item.status} />
                      <div className="flex-grow-1">
                        <div className={item.status === 'done' ? 'text-decoration-line-through text-muted' : ''}>
                          <code>{item.label}</code>
                        </div>
                        {item.note && <div className="text-muted small">{item.note}</div>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
