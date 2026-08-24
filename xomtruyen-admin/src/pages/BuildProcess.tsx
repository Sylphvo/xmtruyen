import React, { useState } from 'react';
import { GitBranch, Package, Play, Save, Server, Settings2 } from 'lucide-react';
import toast from 'react-hot-toast';

type Environment = 'dev' | 'pilot' | 'production';
type EnvironmentConfig = { enabled: boolean; autoBuild: boolean; autoDeploy: boolean; apiUrl: string; databaseMode: string };
type PipelineLog = { id: string; createdAt: string; environment: Environment; status: 'SUCCESS' | 'RUNNING' | 'FAILED'; message: string };

const configKey = 'xomtruyen_build_environment_config';
const logsKey = 'xomtruyen_build_pipeline_logs';
const defaults: Record<Environment, EnvironmentConfig> = {
  dev: { enabled: true, autoBuild: false, autoDeploy: false, apiUrl: 'http://localhost:5172', databaseMode: 'Database dev riêng' },
  pilot: { enabled: true, autoBuild: false, autoDeploy: false, apiUrl: 'https://pilot-api.example.com', databaseMode: 'Clone có kiểm soát từ production' },
  production: { enabled: true, autoBuild: false, autoDeploy: false, apiUrl: 'https://api.example.com', databaseMode: 'Database production thực' }
};

const readConfig = (): Record<Environment, EnvironmentConfig> => {
  try { return { ...defaults, ...JSON.parse(localStorage.getItem(configKey) || '{}') }; } catch { return defaults; }
};
const readLogs = (): PipelineLog[] => {
  try { return JSON.parse(localStorage.getItem(logsKey) || '[]') as PipelineLog[]; } catch { return []; }
};

export const BuildProcess: React.FC = () => {
  const [environment, setEnvironment] = useState<Environment>('dev');
  const [configs, setConfigs] = useState(readConfig);
  const [logs, setLogs] = useState(readLogs);
  const current = configs[environment];

  const update = (patch: Partial<EnvironmentConfig>) => setConfigs(value => ({ ...value, [environment]: { ...value[environment], ...patch } }));
  const save = () => { localStorage.setItem(configKey, JSON.stringify(configs)); toast.success('Đã lưu cấu hình môi trường trên trình duyệt.'); };
  const startPipeline = () => {
    const log: PipelineLog = { id: `${Date.now()}`, createdAt: new Date().toISOString(), environment, status: 'RUNNING', message: 'Đã ghi nhận yêu cầu. Workflow GitHub Actions sẽ chạy khi push hoặc dispatch.' };
    const next = [log, ...logs].slice(0, 30);
    setLogs(next); localStorage.setItem(logsKey, JSON.stringify(next));
    toast.success('Đã ghi nhận pipeline. Hãy theo dõi GitHub Actions để xem log build thật.');
  };

  return <div className="container-fluid py-4 px-4">
    <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
      <div><div className="d-flex align-items-center gap-2"><GitBranch size={28} className="text-primary" /><h1 className="h3 mb-0">Build Process</h1></div><p className="text-muted mb-0 mt-2">Đóng gói Web, Admin và API thành artifact để deploy.</p></div>
      <div className="d-flex gap-2"><button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={save}><Save size={17} /> Lưu cấu hình</button><button className="btn btn-primary d-flex align-items-center gap-2" onClick={startPipeline}><Play size={17} /> Chạy pipeline</button></div>
    </div>

    <div className="alert alert-warning"><strong>Quy tắc dữ liệu:</strong> Dev dùng database riêng. Pilot chỉ nhận bản clone đã ẩn danh/được phê duyệt từ production. Production là dữ liệu thật; không clone ngược và không seed từ trình duyệt.</div>
    <div className="card border-0 shadow-sm mb-4"><div className="card-body"><div className="d-flex align-items-center gap-2 mb-3"><Settings2 size={20} /><h2 className="h5 mb-0">Môi trường</h2></div><div className="btn-group mb-4" role="group">{(['dev', 'pilot', 'production'] as Environment[]).map(item => <button key={item} className={`btn ${environment === item ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setEnvironment(item)}>{item.toUpperCase()}</button>)}</div><div className="row g-3"><div className="col-md-4"><label className="form-label">API URL</label><input className="form-control" value={current.apiUrl} onChange={event => update({ apiUrl: event.target.value })} /></div><div className="col-md-4"><label className="form-label">Database</label><input className="form-control" value={current.databaseMode} onChange={event => update({ databaseMode: event.target.value })} /></div><div className="col-md-4 d-flex align-items-end"><div className="form-check form-switch"><input className="form-check-input" type="checkbox" checked={current.enabled} onChange={event => update({ enabled: event.target.checked })} id="environment-enabled" /><label className="form-check-label" htmlFor="environment-enabled">Cho phép deploy môi trường này</label></div></div></div><div className="d-flex gap-4 mt-4"><div className="form-check form-switch"><input className="form-check-input" type="checkbox" checked={current.autoBuild} onChange={event => update({ autoBuild: event.target.checked })} id="auto-build" /><label className="form-check-label" htmlFor="auto-build">Tự động build khi push</label></div><div className="form-check form-switch"><input className="form-check-input" type="checkbox" checked={current.autoDeploy} onChange={event => update({ autoDeploy: event.target.checked })} id="auto-deploy" /><label className="form-check-label" htmlFor="auto-deploy">Tự động deploy sau build</label></div></div></div></div>
    <div className="row g-3 mb-4"><div className="col-md-4"><div className="card border-0 shadow-sm h-100"><div className="card-body"><Package className="text-primary mb-2" /><h3 className="h6">web/</h3><p className="text-muted small mb-0">xom-truyen/dist</p></div></div></div><div className="col-md-4"><div className="card border-0 shadow-sm h-100"><div className="card-body"><Package className="text-success mb-2" /><h3 className="h6">admin/</h3><p className="text-muted small mb-0">xomtruyen-admin/dist</p></div></div></div><div className="col-md-4"><div className="card border-0 shadow-sm h-100"><div className="card-body"><Server className="text-warning mb-2" /><h3 className="h6">api/</h3><p className="text-muted small mb-0">dotnet publish Release</p></div></div></div></div>
    <div className="card border-0 shadow-sm"><div className="card-header bg-white"><h2 className="h5 mb-0">Pipeline log</h2></div><div className="table-responsive"><table className="table table-hover align-middle mb-0"><thead><tr><th>Thời gian</th><th>Môi trường</th><th>Trạng thái</th><th>Thông tin</th></tr></thead><tbody>{logs.length === 0 ? <tr><td colSpan={4} className="text-center text-muted py-4">Chưa có lượt chạy local.</td></tr> : logs.map(log => <tr key={log.id}><td>{new Date(log.createdAt).toLocaleString('vi-VN')}</td><td>{log.environment.toUpperCase()}</td><td><span className="badge text-bg-warning">{log.status}</span></td><td>{log.message}</td></tr>)}</tbody></table></div></div>
  </div>;
};