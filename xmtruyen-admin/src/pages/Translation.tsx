import React, { useState, useEffect } from 'react';
import { Button, Badge, ProgressBar } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { Globe, Plus, ChevronRight, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api/translationApi';

export const Translation: React.FC = () => {
  const [jobs, setJobs] = useState<api.TranslationJob[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await api.getTranslationJobs();
      setJobs(data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách Translation Jobs');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'imported': return <Badge bg="secondary">Imported</Badge>;
      case 'ocr_processing': return <Badge bg="info">OCR</Badge>;
      case 'translating': return <Badge bg="primary">Translating</Badge>;
      case 'typesetting': return <Badge bg="warning" text="dark">Typesetting</Badge>;
      case 'reviewing': return <Badge bg="danger">Reviewing</Badge>;
      case 'approved': return <Badge bg="success">Approved</Badge>;
      case 'published': return <Badge bg="dark">Published</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="m-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 fw-semibold" style={{ color: '#172b4d' }}>
          <Globe className="me-2 text-primary" />
          Translation Dashboard
        </h4>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={() => navigate('/translation/glossary')}>
            <BookOpen size={16} className="me-2" />
            Từ điển (Glossary)
          </Button>
          <Button variant="primary" onClick={() => navigate('/translation/upload')}>
            <Plus size={16} className="me-2" />
            Upload RAW mới
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-4">Đang tải...</div>
      ) : (
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <table className="table align-middle mb-0 table-hover">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Truyện</th>
                  <th>Ngôn ngữ</th>
                  <th>Trạng thái</th>
                  <th style={{ width: '200px' }}>Tiến độ</th>
                  <th>Ngày tạo</th>
                  <th className="text-end pe-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => {
                  const percent = job.totalPages > 0 ? Math.round((job.processedPages / job.totalPages) * 100) : 0;
                  return (
                    <tr key={job.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/translation/jobs/${job.id}`)}>
                      <td className="ps-4 fw-medium text-primary">
                        {job.publication?.title || 'Unknown Publication'}
                      </td>
                      <td>
                        <Badge bg="light" text="dark" className="border">
                          {job.sourceLanguage.toUpperCase()} → {job.targetLanguage.toUpperCase()}
                        </Badge>
                      </td>
                      <td>{getStatusBadge(job.status)}</td>
                      <td>
                        <div className="d-flex justify-content-between small mb-1 text-muted">
                          <span>{job.processedPages} / {job.totalPages} trang</span>
                          <span>{percent}%</span>
                        </div>
                        <ProgressBar now={percent} style={{ height: '6px' }} />
                      </td>
                      <td className="text-muted small">
                        {new Date(job.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="text-end pe-4">
                        <Button variant="link" size="sm" className="text-decoration-none">
                          Chi tiết <ChevronRight size={16} />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {jobs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center p-5 text-muted">
                      Chưa có Job dịch thuật nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
