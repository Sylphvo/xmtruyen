import React, { useMemo, useState } from 'react';
import { ListChecks, CheckCircle2, Circle, Clock, FileText, FolderOpen } from 'lucide-react';

/**
 * Trang "Tiến độ triển khai".
 *
 * Tự động load TẤT CẢ file .md nằm ở gốc dự án (ngang hàng với thư mục src),
 * parse các dòng checklist dạng "- [ ]" / "- [x]" / "- [~]" để tính % hoàn thành.
 *
 * Chọn 1 file ở cột trái -> xem chi tiết checklist + tiến độ ở cột phải.
 */

type ItemStatus = 'todo' | 'doing' | 'done';

interface ChecklistItem {
  text: string;
  status: ItemStatus;
}

interface ChecklistSection {
  heading: string;
  items: ChecklistItem[];
}

interface MdFile {
  /** Tên file, ví dụ: MIGRATION_PROGRESS.md */
  name: string;
  raw: string;
  sections: ChecklistSection[];
  total: number;
  done: number;
  doing: number;
  percent: number;
  hasChecklist: boolean;
}

// Vite: load nội dung mọi file .md ở gốc dự án (ngang hàng src) dưới dạng string.
const mdModules = import.meta.glob('../../*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;

const CHECKBOX_RE = /^\s*[-*]\s*\[( |x|X|~)\]\s*(.*)$/;
const HEADING_RE = /^\s{0,3}#{1,6}\s+(.*)$/;

// Bỏ ký tự markdown thừa để hiển thị gọn: **bold**, `code`, *italic*
const cleanText = (s: string) =>
  s
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .trim();

const parseMd = (name: string, raw: string): MdFile => {
  const lines = raw.split(/\r?\n/);
  const sections: ChecklistSection[] = [];
  let current: ChecklistSection = { heading: 'Chung', items: [] };
  let started = false;

  const pushCurrent = () => {
    if (current.items.length > 0) sections.push(current);
  };

  for (const line of lines) {
    const heading = line.match(HEADING_RE);
    if (heading) {
      // Khi gặp heading mới: chốt section cũ (nếu có item), mở section mới
      pushCurrent();
      current = { heading: cleanText(heading[1]), items: [] };
      started = true;
      continue;
    }
    const cb = line.match(CHECKBOX_RE);
    if (cb) {
      const mark = cb[1].toLowerCase();
      const status: ItemStatus = mark === 'x' ? 'done' : mark === '~' ? 'doing' : 'todo';
      const text = cleanText(cb[2]) || '(không có mô tả)';
      current.items.push({ text, status });
    }
  }
  pushCurrent();
  // Nếu chưa từng gặp heading nhưng vẫn có item -> section "Chung" đã được push ở trên.
  void started;

  const allItems = sections.flatMap(s => s.items);
  const done = allItems.filter(i => i.status === 'done').length;
  const doing = allItems.filter(i => i.status === 'doing').length;
  const total = allItems.length;

  return {
    name,
    raw,
    sections,
    total,
    done,
    doing,
    percent: total ? Math.round((done / total) * 100) : 0,
    hasChecklist: total > 0,
  };
};

const FILES: MdFile[] = Object.entries(mdModules)
  .map(([path, raw]) => parseMd(path.split('/').pop() || path, raw))
  // File có checklist lên đầu, rồi sắp theo tên
  .sort((a, b) => {
    if (a.hasChecklist !== b.hasChecklist) return a.hasChecklist ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

const StatusIcon: React.FC<{ status: ItemStatus }> = ({ status }) => {
  if (status === 'done') return <CheckCircle2 size={18} className="text-success flex-shrink-0" />;
  if (status === 'doing') return <Clock size={18} className="text-warning flex-shrink-0" />;
  return <Circle size={18} className="text-secondary flex-shrink-0" style={{ opacity: 0.5 }} />;
};

const barColor = (percent: number) => (percent === 100 ? '#198754' : percent >= 50 ? '#0d6efd' : percent > 0 ? '#fd7e14' : '#adb5bd');

// Chiều cao chung cho 2 cột, để cột phải cao bằng cột trái.
const PANEL_HEIGHT = '72vh';

export const MigrationProgress: React.FC = () => {
  const [selected, setSelected] = useState<string>(() => {
    const withChecklist = FILES.find(f => f.hasChecklist);
    return (withChecklist || FILES[0])?.name ?? '';
  });

  const file = useMemo(() => FILES.find(f => f.name === selected), [selected]);

  return (
    <div className="container-fluid py-4 px-4">
      <div className="d-flex align-items-center gap-2 mb-1">
        <ListChecks size={28} className="text-primary" />
        <h1 className="h3 mb-0">Tiến độ triển khai</h1>
      </div>
      <p className="text-muted mb-4">
        Tự động đọc các file <code>.md</code> ở gốc dự án (ngang hàng với <code>src</code>). Chọn 1 file để xem đã triển khai bao nhiêu phần.
      </p>

      <div className="row g-4">
        {/* Cột trái: danh sách file */}
        <div className="col-12 col-lg-4 col-xl-3">
          <div className="card border-0 shadow-sm d-flex flex-column" style={{ height: PANEL_HEIGHT }}>
            <div className="card-header bg-white d-flex align-items-center gap-2 flex-shrink-0">
              <FolderOpen size={18} />
              <span className="fw-semibold">Danh sách file ({FILES.length})</span>
            </div>
            <div className="list-group list-group-flush flex-grow-1" style={{ overflowY: 'auto', minHeight: 0 }}>
              {FILES.map(f => {
                const isActive = f.name === selected;
                return (
                  <button
                    key={f.name}
                    type="button"
                    className={`list-group-item list-group-item-action ${isActive ? 'active' : ''}`}
                    onClick={() => setSelected(f.name)}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <FileText size={16} className="flex-shrink-0" />
                      <span className="text-truncate flex-grow-1" title={f.name}>{f.name}</span>
                      {f.hasChecklist ? (
                        <span
                          className="badge rounded-pill flex-shrink-0"
                          style={{ backgroundColor: isActive ? '#fff' : barColor(f.percent), color: isActive ? '#000' : '#fff' }}
                        >
                          {f.percent}%
                        </span>
                      ) : (
                        <span className={`badge rounded-pill flex-shrink-0 ${isActive ? 'text-bg-light' : 'text-bg-secondary'}`}>—</span>
                      )}
                    </div>
                    {f.hasChecklist && (
                      <div className="progress mt-2" style={{ height: 4 }}>
                        <div className="progress-bar" style={{ width: `${f.percent}%`, backgroundColor: isActive ? '#fff' : barColor(f.percent) }} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cột phải: chi tiết file được chọn */}
        <div className="col-12 col-lg-8 col-xl-9">
          {!file ? (
            <div className="card border-0 shadow-sm" style={{ height: PANEL_HEIGHT }}><div className="card-body text-muted">Không tìm thấy file .md nào ở gốc dự án.</div></div>
          ) : (
            <div className="d-flex flex-column" style={{ height: 'auto' }}>
              <div className="card border-0 shadow-sm mb-4 flex-shrink-0" style={{ height: 140 }}>
                <div className="card-body">
                  <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
                    <div>
                      <div className="d-flex align-items-center gap-2">
                        <FileText size={22} className="text-primary" />
                        <h2 className="h5 mb-0">{file.name}</h2>
                      </div>
                      {file.hasChecklist ? (
                        <div className="text-muted small mt-2">
                          ✅ {file.done} xong · ⏳ {file.doing} đang làm · ◻️ {file.total - file.done - file.doing} chờ · Tổng {file.total} mục
                        </div>
                      ) : (
                        <div className="text-muted small mt-2">File này không chứa checklist dạng <code>- [ ]</code>.</div>
                      )}
                    </div>
                    {file.hasChecklist && (
                      <div className="text-end">
                        <div className="h2 mb-0" style={{ color: barColor(file.percent) }}>{file.percent}%</div>
                        <div className="text-muted small">{file.done}/{file.total}</div>
                      </div>
                    )}
                  </div>
                  {file.hasChecklist && (
                    <div className="progress mt-3" style={{ height: 12 }}>
                      <div className="progress-bar" role="progressbar" style={{ width: `${file.percent}%`, backgroundColor: barColor(file.percent) }} aria-valuenow={file.percent} aria-valuemin={0} aria-valuemax={100} />
                    </div>
                  )}
                </div>
              </div>

              {file.hasChecklist ? (
                <div className="row g-4 flex-grow-1 overflow-auto align-content-start" style={{ minHeight: 0, height: 'calc(100% - 140px)', marginRight: 0 }}>
                  {file.sections.map((section, idx) => {
                    const sDone = section.items.filter(i => i.status === 'done').length;
                    const sPercent = section.items.length ? Math.round((sDone / section.items.length) * 100) : 0;
                    return (
                      <div className="col-12 col-xxl-6" key={`${section.heading}-${idx}`}>
                        <div className="card border-0 shadow-sm h-100">
                          <div className="card-header bg-white d-flex justify-content-between align-items-center">
                            <h3 className="h6 mb-0 text-truncate" title={section.heading}>{section.heading}</h3>
                            <span className="badge rounded-pill" style={{ backgroundColor: barColor(sPercent), color: '#fff' }}>{sDone}/{section.items.length}</span>
                          </div>
                          <ul className="list-group list-group-flush">
                            {section.items.map((item, i) => (
                              <li key={i} className="list-group-item d-flex align-items-start gap-2" style={{ opacity: item.status === 'todo' ? 0.9 : 1 }}>
                                <StatusIcon status={item.status} />
                                <span className={item.status === 'done' ? 'text-decoration-line-through text-muted' : ''}>{item.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="card border-0 shadow-sm flex-grow-1" style={{ minHeight: 0 }}>
                  <div className="card-body overflow-auto">
                    <pre className="mb-0" style={{ whiteSpace: 'pre-wrap', fontSize: 13 }}>{file.raw}</pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
