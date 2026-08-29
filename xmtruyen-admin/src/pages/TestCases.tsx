import React, { useMemo, useState } from 'react';
import { Bug, CheckCircle2, CircleAlert, ClipboardCheck, Play, Plus, RefreshCw, RotateCcw, ShieldCheck, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { addBugLog, getBugLogs, getTestCases, resetTestCases, runTestSuite, saveTestCases } from '../services/testCaseService';
import type { BugLog, BugSeverity, TestArea, TestCase, TestStatus, TestRunSummary } from '../types/testCase';

const areaLabels: Record<TestArea, string> = { API: 'API', CLIENT: 'Client', UI_UX: 'UI/UX', BUG_LOG: 'Bug Log' };
const statusLabels: Record<TestStatus, string> = { PENDING: 'Chưa chạy', RUNNING: 'Đang chạy', PASSED: 'Đạt', FAILED: 'Lỗi', SKIPPED: 'Bỏ qua', MANUAL: 'Thủ công' };

const statusClass: Record<TestStatus, string> = { PENDING: 'bg-light text-secondary', RUNNING: 'bg-warning-subtle text-warning-emphasis', PASSED: 'bg-success-subtle text-success-emphasis', FAILED: 'bg-danger-subtle text-danger-emphasis', SKIPPED: 'bg-secondary-subtle text-secondary-emphasis', MANUAL: 'bg-info-subtle text-info-emphasis' };

export const TestCases: React.FC = () => {
  const [testCases, setTestCases] = useState<TestCase[]>(getTestCases);
  const [bugLogs, setBugLogs] = useState<BugLog[]>(getBugLogs);
  const [areaFilter, setAreaFilter] = useState<'ALL' | TestArea>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | TestStatus>('ALL');
  const [activeTab, setActiveTab] = useState<'cases' | 'bugs'>('cases');
  const [running, setRunning] = useState(false);
  const [summary, setSummary] = useState<TestRunSummary | null>(null);
  const [showBugForm, setShowBugForm] = useState(false);
  const [bugForm, setBugForm] = useState({ title: '', message: '', area: 'UI_UX' as TestArea, severity: 'medium' as BugSeverity });

  const visibleTestCases = useMemo(() => testCases.filter(testCase => (areaFilter === 'ALL' || testCase.area === areaFilter) && (statusFilter === 'ALL' || testCase.status === statusFilter)), [areaFilter, statusFilter, testCases]);
  const passedCount = testCases.filter(testCase => testCase.status === 'PASSED').length;
  const failedCount = testCases.filter(testCase => testCase.status === 'FAILED').length;
  const manualCount = testCases.filter(testCase => testCase.status === 'MANUAL').length;

  const updateCase = (updated: TestCase) => {
    setTestCases(current => {
      const next = current.map(testCase => testCase.id === updated.id ? updated : testCase);
      saveTestCases(next);
      return next;
    });
  };

  const handleRun = async () => {
    if (running) return;
    setRunning(true);
    setSummary(null);
    try {
      const result = await runTestSuite(updateCase);
      setSummary(result);
      setBugLogs(getBugLogs());
      toast.success(`Đã chạy ${result.total} test case độc lập.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể chạy test suite.');
    } finally {
      setRunning(false);
    }
  };

  const handleReset = () => {
    resetTestCases();
    setTestCases(getTestCases());
    setSummary(null);
    toast.success('Đã reset trạng thái test case.');
  };

  const handleAddBug = (event: React.FormEvent) => {
    event.preventDefault();
    if (!bugForm.title.trim() || !bugForm.message.trim()) return;
    const bug = addBugLog({ ...bugForm, source: 'MANUAL' });
    setBugLogs(current => [bug, ...current]);
    setBugForm({ title: '', message: '', area: 'UI_UX', severity: 'medium' });
    setShowBugForm(false);
    setActiveTab('bugs');
    toast.success('Đã thêm bug vào Bug Log local.');
  };

  return (
    <div className="container-fluid py-4 px-4">
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2">
            <ClipboardCheck size={28} className="text-primary" />
            <h1 className="h3 mb-0">Test Case Center</h1>
          </div>
          <p className="text-muted mb-0 mt-2">Chạy kiểm tra độc lập, theo dõi lỗi API, Client và UI/UX.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={handleReset} disabled={running} title="Đặt lại trạng thái test">
            <RotateCcw size={17} /> Reset
          </button>
          <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleRun} disabled={running} title="Chạy luồng kiểm tra độc lập">
            {running ? <RefreshCw size={17} className="spin" /> : <Play size={17} />}
            {running ? 'Đang chạy...' : 'Bắt đầu chạy'}
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3"><div className="card border-0 shadow-sm h-100"><div className="card-body"><small className="text-muted">Tổng test case</small><div className="fs-3 fw-bold">{testCases.length}</div></div></div></div>
        <div className="col-6 col-xl-3"><div className="card border-0 shadow-sm h-100"><div className="card-body"><small className="text-muted">Đã đạt</small><div className="fs-3 fw-bold text-success">{passedCount}</div></div></div></div>
        <div className="col-6 col-xl-3"><div className="card border-0 shadow-sm h-100"><div className="card-body"><small className="text-muted">Đang lỗi</small><div className="fs-3 fw-bold text-danger">{failedCount}</div></div></div></div>
        <div className="col-6 col-xl-3"><div className="card border-0 shadow-sm h-100"><div className="card-body"><small className="text-muted">Cần kiểm tra thủ công</small><div className="fs-3 fw-bold text-info">{manualCount}</div></div></div></div>
      </div>

      {summary && <div className={`alert ${summary.failed ? 'alert-danger' : 'alert-success'} d-flex align-items-center gap-2`}><ShieldCheck size={19} /> Lượt chạy lúc {new Date(summary.startedAt).toLocaleTimeString('vi-VN')}: {summary.passed} đạt, {summary.failed} lỗi, {summary.manual} thủ công.</div>}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 pt-3 px-3">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <ul className="nav nav-tabs border-0">
              <li className="nav-item"><button className={`nav-link ${activeTab === 'cases' ? 'active' : ''}`} onClick={() => setActiveTab('cases')}>Test Cases ({testCases.length})</button></li>
              <li className="nav-item"><button className={`nav-link ${activeTab === 'bugs' ? 'active' : ''}`} onClick={() => setActiveTab('bugs')}>Bug Log ({bugLogs.length})</button></li>
            </ul>
            {activeTab === 'cases' ? <div className="d-flex gap-2"><select className="form-select form-select-sm" value={areaFilter} onChange={event => setAreaFilter(event.target.value as 'ALL' | TestArea)}><option value="ALL">Tất cả nhóm</option><option value="API">API</option><option value="CLIENT">Client</option><option value="UI_UX">UI/UX</option><option value="BUG_LOG">Bug Log</option></select><select className="form-select form-select-sm" value={statusFilter} onChange={event => setStatusFilter(event.target.value as 'ALL' | TestStatus)}><option value="ALL">Tất cả trạng thái</option>{Object.keys(statusLabels).map(status => <option key={status} value={status}>{statusLabels[status as TestStatus]}</option>)}</select></div> : <button className="btn btn-sm btn-outline-danger d-flex align-items-center gap-2" onClick={() => setShowBugForm(value => !value)}><Plus size={15} /> Thêm bug</button>}
          </div>
        </div>

        {activeTab === 'cases' ? <div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead className="table-light"><tr><th>ID</th><th>Test case</th><th>Nhóm</th><th>Chế độ</th><th>Trạng thái</th><th>Kết quả gần nhất</th><th>Thời gian</th></tr></thead><tbody>{visibleTestCases.map(testCase => <tr key={testCase.id}><td className="fw-semibold text-nowrap">{testCase.id}</td><td><div className="fw-semibold">{testCase.title}</div><small className="text-muted">{testCase.description}</small></td><td><span className="badge text-bg-light">{areaLabels[testCase.area]}</span></td><td>{testCase.automated ? <span className="text-success small">Tự động</span> : <span className="text-muted small">Manual</span>}</td><td><span className={`badge ${statusClass[testCase.status]}`}>{testCase.status === 'PASSED' ? <CheckCircle2 size={13} /> : testCase.status === 'FAILED' ? <XCircle size={13} /> : <CircleAlert size={13} />} {statusLabels[testCase.status]}</span></td><td className="small">{testCase.lastMessage || testCase.expected}</td><td className="text-nowrap small text-muted">{testCase.durationMs ? `${testCase.durationMs} ms` : '-'}</td></tr>)}</tbody></table>{visibleTestCases.length === 0 && <div className="text-center text-muted py-5">Không có test case phù hợp.</div>}</div> : <div className="p-3">{showBugForm && <form className="border rounded p-3 mb-3 bg-light" onSubmit={handleAddBug}><div className="row g-2"><div className="col-md-4"><input className="form-control" placeholder="Tiêu đề bug" value={bugForm.title} onChange={event => setBugForm({ ...bugForm, title: event.target.value })} required /></div><div className="col-md-4"><input className="form-control" placeholder="Mô tả lỗi thực tế" value={bugForm.message} onChange={event => setBugForm({ ...bugForm, message: event.target.value })} required /></div><div className="col-md-2"><select className="form-select" value={bugForm.area} onChange={event => setBugForm({ ...bugForm, area: event.target.value as TestArea })}><option value="API">API</option><option value="CLIENT">Client</option><option value="UI_UX">UI/UX</option><option value="BUG_LOG">Bug Log</option></select></div><div className="col-md-2"><select className="form-select" value={bugForm.severity} onChange={event => setBugForm({ ...bugForm, severity: event.target.value as BugSeverity })}><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></div></div><div className="d-flex justify-content-end gap-2 mt-3"><button type="button" className="btn btn-sm btn-light" onClick={() => setShowBugForm(false)}>Hủy</button><button type="submit" className="btn btn-sm btn-danger">Lưu bug</button></div></form>}{bugLogs.length === 0 ? <div className="text-center text-muted py-5"><Bug size={30} className="mb-2" /><div>Chưa có bug log.</div></div> : <div className="table-responsive"><table className="table table-hover align-middle"><thead className="table-light"><tr><th>Thời gian</th><th>Tiêu đề</th><th>Nhóm</th><th>Severity</th><th>Nguồn</th><th>Chi tiết</th></tr></thead><tbody>{bugLogs.map(bug => <tr key={bug.id}><td className="text-nowrap small">{new Date(bug.createdAt).toLocaleString('vi-VN')}</td><td className="fw-semibold">{bug.title}</td><td>{areaLabels[bug.area]}</td><td><span className={`badge ${bug.severity === 'critical' || bug.severity === 'high' ? 'text-bg-danger' : bug.severity === 'medium' ? 'text-bg-warning' : 'text-bg-secondary'}`}>{bug.severity}</span></td><td><span className="badge text-bg-light">{bug.source}</span></td><td className="small text-muted">{bug.message}</td></tr>)}</tbody></table></div>}</div>}
      </div>
    </div>
  );
};
