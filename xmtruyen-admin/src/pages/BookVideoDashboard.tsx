import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Spinner, Table, Badge, ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEye, faVideo } from '@fortawesome/free-solid-svg-icons';
import { bookVideoApi, type BookVideoTask } from '../api/bookVideoApi';
import toast from 'react-hot-toast';

export const BookVideoDashboard: React.FC = () => {
  const [tasks, setTasks] = useState<BookVideoTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await bookVideoApi.getTasks();
        setTasks(res.data.data.items);
      } catch (error) {
        toast.error('Lỗi khi tải danh sách Video Tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Queued': return <Badge bg="secondary">Đang chờ</Badge>;
      case 'Processing': return <Badge bg="primary">Đang xử lý</Badge>;
      case 'Completed': return <Badge bg="success">Hoàn thành</Badge>;
      case 'Failed': return <Badge bg="danger">Lỗi</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🎬 Quản lý Video Truyện Chữ</h2>
        <Link to="/book-video/create" className="btn btn-primary">
          <FontAwesomeIcon icon={faPlus} className="me-2" /> Tạo Video Mới
        </Link>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Task ID</th>
                  <th>Truyện</th>
                  <th>Trạng thái</th>
                  <th>Tiến độ</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4 text-muted">
                      Chưa có Video nào được tạo. Hãy tạo mới!
                    </td>
                  </tr>
                ) : (
                  tasks.map(task => (
                    <tr key={task.id}>
                      <td><small className="text-muted">{task.id.substring(0, 8)}...</small></td>
                      <td>{task.publicationTitle || 'N/A'}</td>
                      <td>{getStatusBadge(task.status)}</td>
                      <td style={{ minWidth: '150px' }}>
                        <ProgressBar 
                          now={task.progressPercent} 
                          label={`${task.progressPercent}%`} 
                          variant={task.status === 'Failed' ? 'danger' : 'primary'}
                          className="mb-1"
                        />
                        <small className="text-muted">{task.currentStep || 'Khởi tạo'}</small>
                      </td>
                      <td>{new Date(task.createdAt).toLocaleString('vi-VN')}</td>
                      <td>
                        <Link to={`/book-video/${task.id}`} className="btn btn-sm btn-outline-primary me-2">
                          <FontAwesomeIcon icon={faEye} /> Chi tiết
                        </Link>
                        {task.outputVideoUrl && (
                          <a href={task.outputVideoUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-success">
                            <FontAwesomeIcon icon={faVideo} /> Xem Video
                          </a>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};
