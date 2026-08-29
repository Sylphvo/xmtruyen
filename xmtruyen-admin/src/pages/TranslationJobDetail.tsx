import React, { useState, useEffect } from 'react';
import { Button, Badge, ProgressBar, Card } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Play, FileText, CheckCircle, Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../api/translationApi';

export const TranslationJobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<api.TranslationJob | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchJobDetail(id);
  }, [id]);

  const fetchJobDetail = async (jobId: string) => {
    try {
      const data = await api.getTranslationJobDetail(jobId);
      setJob(data);
    } catch (error) {
      toast.error('Lỗi khi tải chi tiết Job');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-5">Đang tải...</div>;
  if (!job) return <div className="text-center p-5 text-danger">Không tìm thấy Job!</div>;

  const percent = job.totalPages > 0 ? Math.round((job.processedPages / job.totalPages) * 100) : 0;

  return (
    <div className="m-4">
      <div className="d-flex align-items-center mb-4">
        <Button variant="link" className="text-secondary p-0 me-3" onClick={() => navigate('/translation')}>
          <ArrowLeft size={20} />
        </Button>
        <h4 className="mb-0 fw-semibold" style={{ color: '#172b4d' }}>
          Job: {job.publication?.title || 'Unknown'}
        </h4>
        <Badge bg="light" text="dark" className="ms-3 border">
          {job.sourceLanguage.toUpperCase()} → {job.targetLanguage.toUpperCase()}
        </Badge>
        <Badge bg="secondary" className="ms-2">{job.status}</Badge>
      </div>

      <div className="row mb-4">
        <div className="col-md-8">
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <h6 className="fw-bold mb-3 text-muted">TIẾN ĐỘ CHUNG</h6>
              <div className="d-flex justify-content-between mb-1">
                <span className="fw-medium text-primary">{percent}% Hoàn thành</span>
                <span className="text-muted">{job.processedPages} / {job.totalPages} Trang</span>
              </div>
              <ProgressBar now={percent} className="mb-4" style={{ height: '10px' }} />

              <div className="d-flex gap-4">
                <div className="text-center">
                  <div className="text-muted small">Tổng Chapter</div>
                  <h4 className="mb-0">{job.totalChapters}</h4>
                </div>
                <div className="text-center">
                  <div className="text-muted small">Tổng Text Blocks</div>
                  <h4 className="mb-0">{job.totalTextBlocks}</h4>
                </div>
                <div className="text-center">
                  <div className="text-muted small">Ngày tạo</div>
                  <h6 className="mb-0 mt-1">{new Date(job.createdAt).toLocaleDateString()}</h6>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-4">
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <h6 className="fw-bold mb-3 text-muted">QUẢN LÝ TIẾN TRÌNH</h6>
              <div className="d-flex flex-column gap-2">
                <Button variant="outline-primary" className="text-start d-flex justify-content-between align-items-center">
                  <span><Play size={16} className="me-2" /> Start OCR (Nhận diện chữ)</span>
                  <Badge bg="light" text="dark">1</Badge>
                </Button>
                <Button variant="outline-primary" className="text-start d-flex justify-content-between align-items-center">
                  <span><Play size={16} className="me-2" /> Start Translate (Dịch AI)</span>
                  <Badge bg="light" text="dark">2</Badge>
                </Button>
                <Button variant="outline-primary" className="text-start d-flex justify-content-between align-items-center">
                  <span><Play size={16} className="me-2" /> Start Typeset (Chèn chữ)</span>
                  <Badge bg="light" text="dark">3</Badge>
                </Button>
                <Button variant="success" className="mt-2">
                  <CheckCircle size={16} className="me-2" /> Publish All Approved
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      <h5 className="fw-bold mb-3">Danh sách Chapter</h5>
      <Card className="shadow-sm border-0">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="ps-4">Chapter</th>
                <th>Trạng thái</th>
                <th>Số trang</th>
                <th>Thời gian</th>
                <th className="text-end pe-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {job.chapters?.map(chapter => (
                <tr key={chapter.id}>
                  <td className="ps-4 fw-medium">Chương {chapter.chapterNumber}</td>
                  <td>
                    {chapter.status === 'imported' ? <Badge bg="secondary">Imported</Badge> : <Badge bg="primary">{chapter.status}</Badge>}
                  </td>
                  <td>{chapter.pageCount} trang</td>
                  <td><Clock size={14} className="text-muted me-1" /> {new Date(chapter.createdAt).toLocaleString()}</td>
                  <td className="text-end pe-4">
                    <Button variant="primary" size="sm" onClick={() => navigate(`/translation/review/${chapter.id}`)}>
                      <FileText size={14} className="me-1" /> QC Review
                    </Button>
                  </td>
                </tr>
              ))}
              {(!job.chapters || job.chapters.length === 0) && (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-muted">Không có chapter nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
