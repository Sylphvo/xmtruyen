import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Spinner, Button, Table, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEye } from '@fortawesome/free-solid-svg-icons';
import { audioApi, type AudioJob } from '../api/audioApi';
import toast from 'react-hot-toast';

export const AudioDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<AudioJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await audioApi.getJobs();
        setJobs(res.data);
      } catch (error) {
        toast.error('Lỗi khi tải danh sách audio jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge bg="secondary">Chờ xử lý</Badge>;
      case 'preprocessing': return <Badge bg="info">Đang tiền xử lý</Badge>;
      case 'generating': return <Badge bg="primary">Đang tạo audio</Badge>;
      case 'review': return <Badge bg="warning" text="dark">Cần duyệt</Badge>;
      case 'published': return <Badge bg="success">Đã xuất bản</Badge>;
      case 'failed': return <Badge bg="danger">Lỗi</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🎧 Quản lý Sách nói</h2>
        <Link to="/audio/create" className="btn btn-primary">
          <FontAwesomeIcon icon={faPlus} className="me-2" /> Tạo Sách Nói Mới
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
                  <th>Job ID</th>
                  <th>Truyện (Publication ID)</th>
                  <th>Nguồn</th>
                  <th>Trạng thái</th>
                  <th>Tiến độ</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-4 text-muted">
                      Chưa có Job nào. Hãy tạo mới!
                    </td>
                  </tr>
                ) : (
                  jobs.map(job => (
                    <tr key={job.id}>
                      <td><small className="text-muted">{job.id.substring(0, 8)}...</small></td>
                      <td>{job.publicationId.substring(0, 8)}...</td>
                      <td>
                        {job.sourceType === 'book_chapter' ? 'Truyện chữ' : 
                         job.sourceType === 'comic_chapter' ? 'Truyện tranh' : job.sourceType}
                      </td>
                      <td>{getStatusBadge(job.status)}</td>
                      <td>
                        {job.totalSegments > 0 
                          ? `${job.processedSegments} / ${job.totalSegments}`
                          : '-'}
                      </td>
                      <td>{new Date(job.createdAt).toLocaleString('vi-VN')}</td>
                      <td>
                        <Link to={`/audio/jobs/${job.id}`} className="btn btn-sm btn-outline-primary">
                          <FontAwesomeIcon icon={faEye} /> Chi tiết
                        </Link>
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
