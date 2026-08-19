import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Spinner, Table, Badge, ProgressBar, Card, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faRefresh, faPlayCircle, faImage } from '@fortawesome/free-solid-svg-icons';
import { bookVideoApi, type BookVideoTask, type BookVideoSegment } from '../api/bookVideoApi';
import toast from 'react-hot-toast';

export const BookVideoJobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<BookVideoTask | null>(null);
  const [segments, setSegments] = useState<BookVideoSegment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      if (!id) return;
      const [taskRes, segRes] = await Promise.all([
        bookVideoApi.getTaskStatus(id),
        bookVideoApi.getPreview(id)
      ]);
      setTask(taskRes.data.data);
      setSegments(segRes.data.data);
    } catch (error) {
      toast.error('Lỗi khi tải thông tin Video');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    
    // Auto refresh every 5 seconds if not completed
    const interval = setInterval(() => {
      if (task && !['Completed', 'Failed'].includes(task.status)) {
        fetchDetails();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [id, task?.status]);

  if (loading && !task) {
    return <div className="text-center p-5"><Spinner animation="border" /></div>;
  }

  if (!task) return <div className="p-4">Không tìm thấy Video Task</div>;

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Link to="/book-video" className="btn btn-light me-3">
            <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
          </Link>
          <h2 className="d-inline">Chi tiết Video: {task.id.substring(0, 8)}...</h2>
        </div>
        <Button variant="outline-secondary" onClick={fetchDetails}>
          <FontAwesomeIcon icon={faRefresh} className="me-2" /> Làm mới
        </Button>
      </div>

      <Row>
        <Col md={4}>
          <Card className="mb-4 shadow-sm">
            <Card.Header className="fw-bold">Tiến độ tổng quan</Card.Header>
            <Card.Body>
              <div className="mb-3">
                <strong>Trạng thái:</strong> <Badge bg={task.status === 'Completed' ? 'success' : task.status === 'Failed' ? 'danger' : 'primary'}>{task.status}</Badge>
              </div>
              <div className="mb-3">
                <strong>Bước hiện tại:</strong> {task.currentStep || 'Khởi tạo'}
              </div>
              <div className="mb-3">
                <strong>Tiến trình:</strong>
                <ProgressBar 
                  now={task.progressPercent} 
                  label={`${task.progressPercent}%`}
                  variant={task.status === 'Failed' ? 'danger' : 'primary'}
                />
              </div>
              <div className="mb-3">
                <strong>Segments hoàn thành:</strong> {task.completedSegments} / {task.totalSegments}
              </div>
              {task.errorMessage && (
                <div className="alert alert-danger mt-3 mb-0">
                  {task.errorMessage}
                </div>
              )}
              {task.status === 'Completed' && task.outputVideoUrl && (
                <div className="mt-4">
                  <a href={task.outputVideoUrl} target="_blank" rel="noreferrer" className="btn btn-success w-100">
                    <FontAwesomeIcon icon={faPlayCircle} className="me-2" /> Xem Video Thành Phẩm
                  </a>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Header className="fw-bold">Segments (Cảnh quay)</Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '50px' }}>#</th>
                    <th style={{ width: '120px' }}>Hình ảnh AI</th>
                    <th>Nội dung (Phụ đề)</th>
                    <th>Prompt Ảnh</th>
                    <th>Audio</th>
                  </tr>
                </thead>
                <tbody>
                  {segments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center p-4">Chưa có phân cảnh nào được tạo.</td>
                    </tr>
                  ) : (
                    segments.map(seg => (
                      <tr key={seg.id}>
                        <td>{seg.orderIndex + 1}</td>
                        <td>
                          {seg.imageUrl ? (
                            <img src={seg.imageUrl} alt="Scene" style={{ width: '100px', height: '56px', objectFit: 'cover', borderRadius: '4px' }} />
                          ) : (
                            <div className="bg-light d-flex align-items-center justify-content-center" style={{ width: '100px', height: '56px', borderRadius: '4px' }}>
                              <FontAwesomeIcon icon={faImage} className="text-muted" />
                            </div>
                          )}
                        </td>
                        <td><small>{seg.subtitleText}</small></td>
                        <td><small className="text-muted">{seg.sceneDescription}</small></td>
                        <td>
                          {seg.audioUrl ? (
                            <Badge bg="success">Sẵn sàng ({seg.audioDurationSeconds}s)</Badge>
                          ) : (
                            <Badge bg="secondary">Đang chờ</Badge>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
