import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { comicVideoApi } from '../api/comicVideoApi';

export const ComicVideoDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);

  const fetchTasks = async () => {
    try {
      const res = await comicVideoApi.getList();
      if (res.data?.success) {
        setTasks(res.data.data.items);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🎬 Truyện Tranh {'>'} Video (Dashboard)</h2>
        <button className="btn btn-primary" onClick={() => navigate('/comic-video/create')}>
          + Tạo Video Mới
        </button>
      </div>

      <div className="card bg-dark text-light border-secondary">
        <div className="card-body table-responsive">
          <table className="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th>Truyện</th>
                <th>Giọng đọc</th>
                <th>Trạng thái</th>
                <th>Tiến độ</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id}>
                  <td>{t.publicationTitle}</td>
                  <td>{t.voiceId} ({t.language})</td>
                  <td>
                    {t.status === 'Completed' ? <span className="badge bg-success">Hoàn thành</span> :
                     t.status === 'Processing' ? <span className="badge bg-warning text-dark">Đang xử lý</span> :
                     t.status === 'Failed' ? <span className="badge bg-danger">Thất bại</span> :
                     <span className="badge bg-secondary">Hàng đợi</span>}
                  </td>
                  <td>
                    <div className="progress" style={{ height: '20px' }}>
                      <div className={`progress-bar ${t.status === 'Completed' ? 'bg-success' : 'progress-bar-striped progress-bar-animated'}`} 
                           role="progressbar" style={{ width: `${t.progressPercent}%` }}>
                        {t.progressPercent}%
                      </div>
                    </div>
                    <small className="text-muted">{t.currentStep}</small>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-info" onClick={() => navigate(`/comic-video/${t.id}`)}>
                      Chi tiết
                    </button>
                    {t.status === 'Completed' && t.outputVideoUrl && (
                      <a href={t.outputVideoUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-success ms-2">
                        Tải MP4
                      </a>
                    )}
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">Chưa có video nào. Bấm "Tạo Video Mới" để bắt đầu.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
