import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { comicVideoApi } from '../api/comicVideoApi';

export const ComicVideoJobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<any>(null);
  const [segments, setSegments] = useState<any[]>([]);

  const fetchData = async () => {
    if (!id) return;
    try {
      const [statusRes, previewRes] = await Promise.all([
        comicVideoApi.getStatus(id),
        comicVideoApi.getPreview(id)
      ]);
      if (statusRes.data?.success) setTask(statusRes.data.data);
      if (previewRes.data?.success) setSegments(previewRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (!task) return <div className="p-4 text-light">Loading...</div>;

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Chi Tiết Task: Comic Video</h2>
        <button className="btn btn-secondary" onClick={() => navigate('/comic-video')}>
          Quay lại
        </button>
      </div>

      <div className="card bg-dark text-light border-secondary mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-8">
              <h4>Trạng thái: 
                <span className={`badge ms-2 ${task.status === 'Completed' ? 'bg-success' : task.status === 'Failed' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                  {task.status}
                </span>
              </h4>
              <p>Bước hiện tại: <strong className="text-info">{task.currentStep}</strong></p>
              
              <div className="progress mt-3 mb-2" style={{ height: '25px' }}>
                <div className={`progress-bar ${task.status === 'Completed' ? 'bg-success' : 'progress-bar-striped progress-bar-animated'}`} 
                     role="progressbar" style={{ width: `${task.progressPercent}%` }}>
                  {task.progressPercent}%
                </div>
              </div>
            </div>
            <div className="col-md-4 text-end">
              {task.status === 'Completed' && task.outputVideoUrl && (
                <div className="mt-3">
                  <a href={task.outputVideoUrl} target="_blank" rel="noreferrer" className="btn btn-lg btn-success">
                    🎬 Tải/Xem Video MP4
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <h4 className="mb-3">Pages / Segments ({segments.length} trang)</h4>
      <div className="row">
        {segments.map((seg, idx) => (
          <div className="col-md-6 col-lg-4 mb-4" key={seg.id || idx}>
            <div className="card h-100 bg-secondary text-light border-dark">
              <img src={seg.imageUrl || 'https://via.placeholder.com/300x400?text=Comic+Page'} className="card-img-top" alt="Page" style={{ height: '300px', objectFit: 'contain', backgroundColor: '#000' }} />
              <div className="card-body">
                <h6 className="card-title">Trang {seg.orderIndex + 1}</h6>
                <p className="card-text small text-warning fst-italic">
                  "{seg.textContent || 'Đang chờ xử lý lời thoại...'}"
                </p>
                <div className="mt-2">
                  <span className="badge bg-dark">Audio: {seg.audioDurationSeconds ? `${seg.audioDurationSeconds}s` : 'N/A'}</span>
                  <span className="badge bg-info text-dark ms-2">{seg.status}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
