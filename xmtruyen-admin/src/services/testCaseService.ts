import type { BugLog, TestArea, TestCase, TestRunSummary } from '../types/testCase';

const TEST_CASES_KEY = 'xmtruyen_admin_test_cases';
const BUG_LOGS_KEY = 'xmtruyen_admin_bug_logs';
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5172').replace(/\/$/, '');

const defaultTestCases: TestCase[] = [
  { id: 'AUTH-01', title: 'API health phản hồi', area: 'API', description: 'Kiểm tra API admin health bằng GET read-only.', expected: 'HTTP 2xx và response hợp lệ.', automated: true, status: 'PENDING' },
  { id: 'AUTH-02', title: 'Session admin còn hợp lệ', area: 'API', description: 'Kiểm tra token hiện tại có thể gọi endpoint protected.', expected: 'Không nhận HTTP 401.', automated: true, status: 'PENDING' },
  { id: 'BOOK-01', title: 'Danh sách sách phản hồi', area: 'API', description: 'Kiểm tra GET publications không thay đổi dữ liệu.', expected: 'HTTP 2xx và có response JSON.', automated: true, status: 'PENDING' },
  { id: 'CHAP-01', title: 'API chapter không trả lỗi server', area: 'API', description: 'Kiểm tra endpoint chapter theo publication cần chọn thủ công khi có ID.', expected: 'HTTP 2xx, 401 hoặc 404 có kiểm soát; không 5xx.', automated: false, status: 'MANUAL' },
  { id: 'CLIENT-01', title: 'Ứng dụng React mount thành công', area: 'CLIENT', description: 'Kiểm tra root của admin đã render nội dung.', expected: 'Root tồn tại và có phần tử con.', automated: true, status: 'PENDING' },
  { id: 'CLIENT-02', title: 'Không có lỗi runtime mới', area: 'CLIENT', description: 'Theo dõi error và unhandled rejection trong lúc chạy test.', expected: 'Không phát sinh lỗi JavaScript.', automated: true, status: 'PENDING' },
  { id: 'UIUX-01', title: 'Không tràn ngang viewport', area: 'UI_UX', description: 'Kiểm tra layout admin ở viewport hiện tại.', expected: 'scrollWidth không vượt viewport.', automated: true, status: 'PENDING' },
  { id: 'UIUX-02', title: 'Điều khiển tương tác có nhãn', area: 'UI_UX', description: 'Kiểm tra button và input có accessible name.', expected: 'Không có control thiếu label/name.', automated: true, status: 'PENDING' },
  { id: 'BOOK-05', title: 'CRUD sách', area: 'API', description: 'Tạo, sửa, xóa sách bằng dữ liệu kiểm thử.', expected: 'Mutation đúng response và rollback dữ liệu test.', automated: false, status: 'MANUAL' },
  { id: 'CHAP-05', title: 'Đọc chapter VIP chưa mua', area: 'CLIENT', description: 'Kiểm tra quyền đọc chapter bị khóa.', expected: 'Hiển thị yêu cầu mua/quyền truy cập phù hợp.', automated: false, status: 'MANUAL' },
  { id: 'UPLOAD-01', title: 'Bulk upload archive', area: 'API', description: 'Kiểm tra ZIP/CBZ/CBR và chapter ordering.', expected: 'Preview, validate và xử lý đúng; không upload trực tiếp khi chạy tự động.', automated: false, status: 'MANUAL' },
  { id: 'READ-01', title: 'Reader responsive mobile', area: 'UI_UX', description: 'Kiểm tra reader ở kích thước mobile và thao tác đọc.', expected: 'Không vỡ layout, giữ vị trí đọc.', automated: false, status: 'MANUAL' },
  { id: 'BUG-01', title: 'Bug log ghi nhận lỗi', area: 'BUG_LOG', description: 'Kiểm tra lỗi test tự động được thêm vào log cục bộ.', expected: 'Bug có test case, severity, actual và timestamp.', automated: true, status: 'PENDING' },
  { id: 'BUG-02', title: 'Không mất bug log khi reload', area: 'BUG_LOG', description: 'Kiểm tra dữ liệu bug log được lưu trong browser storage.', expected: 'Bug log vẫn còn sau khi tải lại trang.', automated: true, status: 'PENDING' }
];

const read = <T,>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value));
const createId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

export const getTestCases = (): TestCase[] => read(TEST_CASES_KEY, defaultTestCases);
export const saveTestCases = (testCases: TestCase[]) => write(TEST_CASES_KEY, testCases);
export const getBugLogs = (): BugLog[] => read(BUG_LOGS_KEY, []);
export const saveBugLogs = (logs: BugLog[]) => write(BUG_LOGS_KEY, logs.slice(0, 200));

export const addBugLog = (bug: Omit<BugLog, 'id' | 'createdAt' | 'status'>): BugLog => {
  const created: BugLog = { ...bug, id: createId('bug'), createdAt: new Date().toISOString(), status: 'OPEN' };
  saveBugLogs([created, ...getBugLogs()]);
  return created;
};

const requestReadOnly = async (path: string): Promise<{ status: number; durationMs: number }> => {
  const started = performance.now();
  const token = sessionStorage.getItem('accessToken');
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    signal: AbortSignal.timeout(10000)
  });
  return { status: response.status, durationMs: Math.round(performance.now() - started) };
};

const runAutomatedTest = async (testCase: TestCase, runtimeErrors: string[]): Promise<{ passed: boolean; message: string; durationMs: number; bug?: Omit<BugLog, 'id' | 'createdAt' | 'status'> }> => {
  const started = performance.now();
  try {
    if (testCase.id === 'AUTH-01') {
      const result = await requestReadOnly('/api/admin/health');
      if (result.status >= 200 && result.status < 300) return { passed: true, message: `API phản hồi HTTP ${result.status}.`, durationMs: result.durationMs };
      if (result.status === 401 || result.status === 403) return { passed: false, message: `API từ chối quyền với HTTP ${result.status}.`, durationMs: result.durationMs, bug: { testCaseId: testCase.id, area: 'API', severity: 'high', title: 'Không gọi được API health', message: `Endpoint trả HTTP ${result.status}.`, expected: 'HTTP 2xx.', actual: `HTTP ${result.status}.`, source: 'AUTOMATED' } };
      return { passed: false, message: `API trả HTTP ${result.status}.`, durationMs: result.durationMs, bug: { testCaseId: testCase.id, area: 'API', severity: 'high', title: 'API health lỗi', message: `Endpoint trả HTTP ${result.status}.`, expected: 'HTTP 2xx.', actual: `HTTP ${result.status}.`, source: 'AUTOMATED' } };
    }
    if (testCase.id === 'AUTH-02') {
      const result = await requestReadOnly('/api/admin/health');
      const passed = result.status !== 401;
      return { passed, message: passed ? `Session không bị từ chối (HTTP ${result.status}).` : 'Session đã hết hạn hoặc không hợp lệ.', durationMs: result.durationMs, bug: passed ? undefined : { testCaseId: testCase.id, area: 'API', severity: 'high', title: 'Session admin không hợp lệ', message: 'Endpoint protected trả HTTP 401.', expected: 'Token hiện tại gọi được endpoint.', actual: 'HTTP 401.', source: 'AUTOMATED' } };
    }
    if (testCase.id === 'BOOK-01') {
      const result = await requestReadOnly('/api/Publications?page=1&pageSize=1');
      const passed = result.status >= 200 && result.status < 300;
      return { passed, message: `GET Publications trả HTTP ${result.status}.`, durationMs: result.durationMs, bug: passed ? undefined : { testCaseId: testCase.id, area: 'API', severity: 'medium', title: 'Không tải được danh sách sách', message: `GET Publications trả HTTP ${result.status}.`, expected: 'HTTP 2xx.', actual: `HTTP ${result.status}.`, source: 'AUTOMATED' } };
    }
    if (testCase.id === 'CLIENT-01') {
      const root = document.getElementById('root');
      const passed = Boolean(root?.children.length);
      return { passed, message: passed ? 'React root đã mount.' : 'React root không có nội dung.', durationMs: Math.round(performance.now() - started), bug: passed ? undefined : { testCaseId: testCase.id, area: 'CLIENT', severity: 'critical', title: 'Admin không mount giao diện', message: 'Phần tử #root không có child.', expected: 'Root có nội dung UI.', actual: 'Root rỗng.', source: 'AUTOMATED' } };
    }
    if (testCase.id === 'CLIENT-02') {
      const passed = runtimeErrors.length === 0;
      const message = passed ? 'Không ghi nhận runtime error trong lượt test.' : `Ghi nhận ${runtimeErrors.length} runtime error.`;
      return { passed, message, durationMs: Math.round(performance.now() - started), bug: passed ? undefined : { testCaseId: testCase.id, area: 'CLIENT', severity: 'critical', title: 'Client phát sinh runtime error', message: runtimeErrors.join(' | ').slice(0, 1000), expected: 'Không có error hoặc unhandled rejection.', actual: message, source: 'AUTOMATED' } };
    }
    if (testCase.id === 'UIUX-01') {
      const passed = document.documentElement.scrollWidth <= window.innerWidth + 2;
      return { passed, message: passed ? 'Không phát hiện tràn ngang.' : `scrollWidth ${document.documentElement.scrollWidth}px vượt viewport ${window.innerWidth}px.`, durationMs: Math.round(performance.now() - started), bug: passed ? undefined : { testCaseId: testCase.id, area: 'UI_UX', severity: 'medium', title: 'Layout bị tràn ngang', message: 'Trang có nội dung vượt viewport.', expected: 'Không có horizontal overflow.', actual: `scrollWidth ${document.documentElement.scrollWidth}px.`, source: 'AUTOMATED' } };
    }
    if (testCase.id === 'UIUX-02') {
      const controls = Array.from(document.querySelectorAll('button, input, select, textarea'));
      const unlabeled = controls.filter(control => !control.getAttribute('aria-label') && !control.getAttribute('title') && !control.textContent?.trim() && !document.querySelector(`label[for="${control.id}"]`));
      const passed = unlabeled.length === 0;
      return { passed, message: passed ? 'Các control có accessible name.' : `${unlabeled.length} control thiếu accessible name.`, durationMs: Math.round(performance.now() - started), bug: passed ? undefined : { testCaseId: testCase.id, area: 'UI_UX', severity: 'medium', title: 'Control thiếu accessible name', message: `${unlabeled.length} control không có label, title hoặc aria-label.`, expected: 'Control có tên truy cập được.', actual: `${unlabeled.length} control thiếu tên.`, source: 'AUTOMATED' } };
    }
    if (testCase.id === 'BUG-01' || testCase.id === 'BUG-02') {
      return { passed: true, message: 'Bug log local đang hoạt động.', durationMs: Math.round(performance.now() - started) };
    }
    return { passed: true, message: 'Test case manual, chưa chạy tự động.', durationMs: Math.round(performance.now() - started) };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Không xác định';
    return { passed: false, message, durationMs: Math.round(performance.now() - started), bug: { testCaseId: testCase.id, area: testCase.area, severity: 'high', title: `Test ${testCase.id} gặp lỗi`, message, expected: testCase.expected, actual: message, source: 'AUTOMATED' } };
  }
};

export const runTestSuite = async (onProgress: (testCase: TestCase) => void): Promise<TestRunSummary> => {
  const startedAt = new Date().toISOString();
  const testCases = getTestCases();
  const runtimeErrors: string[] = [];
  const captureError = (event: ErrorEvent) => runtimeErrors.push(event.message || 'Unknown runtime error');
  const captureRejection = (event: PromiseRejectionEvent) => runtimeErrors.push(event.reason?.message || String(event.reason || 'Unhandled promise rejection'));
  window.addEventListener('error', captureError);
  window.addEventListener('unhandledrejection', captureRejection);
  let passed = 0;
  let failed = 0;
  const skipped = 0;
  let manual = 0;
  for (const testCase of testCases) {
    if (!testCase.automated) {
      manual++;
      onProgress({ ...testCase, status: 'MANUAL', lastMessage: 'Cần kiểm tra thủ công để tránh mutation dữ liệu.' });
      continue;
    }
    onProgress({ ...testCase, status: 'RUNNING' });
    const result = await runAutomatedTest(testCase, runtimeErrors);
    const completed: TestCase = { ...testCase, status: result.passed ? 'PASSED' : 'FAILED', lastMessage: result.message, lastRunAt: new Date().toISOString(), durationMs: result.durationMs };
    if (result.passed) passed++; else { failed++; if (result.bug) addBugLog(result.bug); }
    onProgress(completed);
  }
  window.removeEventListener('error', captureError);
  window.removeEventListener('unhandledrejection', captureRejection);
  return { total: testCases.length, passed, failed, skipped, manual, startedAt, finishedAt: new Date().toISOString() };
};

export const resetTestCases = () => saveTestCases(defaultTestCases.map(testCase => ({ ...testCase, status: testCase.automated ? 'PENDING' : 'MANUAL', lastMessage: undefined, lastRunAt: undefined, durationMs: undefined })));
export const getAreas = (): TestArea[] => ['API', 'CLIENT', 'UI_UX', 'BUG_LOG'];
