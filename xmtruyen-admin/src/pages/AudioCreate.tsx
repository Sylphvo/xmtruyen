import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSave, faCogs } from '@fortawesome/free-solid-svg-icons';
import { audioApi } from '../api/audioApi';
import toast from 'react-hot-toast';

export const AudioCreate: React.FC = () => {
  const navigate = useNavigate();
  const [publicationId, setPublicationId] = useState('');
  const [chapterIds, setChapterIds] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicationId || !chapterIds) {
      toast.error('Vui lòng nhập ID truyện và ID chương');
      return;
    }

    const ids = chapterIds.split(',').map(id => id.trim()).filter(id => id.length > 0);
    
    setIsSubmitting(true);
    try {
      const res = await audioApi.createJobFromBookChapter({
        publicationId,
        sourceChapterIds: ids
      });
      toast.success('Đã tạo Audio Job thành công!');
      navigate(`/audio/jobs/${res.data.id}`);
    } catch (error: any) {
      toast.error(error.response?.data || 'Lỗi khi tạo job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex align-items-center mb-4">
        <Link to="/audio" className="btn btn-outline-secondary me-3">
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
        <h2 className="mb-0">🎧 Tạo Sách Nói Mới</h2>
      </div>

      <Card className="shadow-sm max-w-2xl">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Publication ID (ID Truyện)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập UUID của truyện..."
                    value={publicationId}
                    onChange={(e) => setPublicationId(e.target.value)}
                    required
                  />
                  <Form.Text className="text-muted">
                    Ví dụ: 3fa85f64-5717-4562-b3fc-2c963f66afa6
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Book Chapter IDs (Các chương cần chuyển đổi)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Nhập danh sách UUID các chương, phân cách bằng dấu phẩy (,)"
                    value={chapterIds}
                    onChange={(e) => setChapterIds(e.target.value)}
                    required
                  />
                  <Form.Text className="text-muted">
                    Các chương sẽ được ghép lại thành 1 audio duy nhất.
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end">
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faCogs} spin className="me-2" /> Đang xử lý...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="me-2" /> Tạo Job
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};
