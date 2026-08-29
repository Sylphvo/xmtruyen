import React, { useState, useEffect } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { UploadCloud, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api/translationApi';
import * as bookApi from '../api/bookApi';
import type { IBook } from '../types/book';

export const TranslationUpload: React.FC = () => {
  const navigate = useNavigate();
  const [publications, setPublications] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    publicationId: '',
    sourceLanguage: 'zh',
    targetLanguage: 'vi',
  });

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const res = await bookApi.getBooks({ pageSize: 1000 });
      setPublications(res.data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách truyện');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.publicationId) {
      toast.error('Vui lòng chọn truyện');
      return;
    }

    setLoading(true);
    try {
      // In real app, we would upload the ZIP file here using FormData.
      // For now, we just call the API to create the job record.
      const job = await api.createTranslationJob(formData);
      toast.success('Đã tải lên và tạo Job thành công!');
      navigate(`/translation/jobs/${job.id}`);
    } catch (error) {
      toast.error('Lỗi khi upload');
      setLoading(false);
    }
  };

  return (
    <div className="m-4 max-w-3xl mx-auto" style={{ maxWidth: '800px' }}>
      <div className="d-flex align-items-center mb-4">
        <Button variant="link" className="text-secondary p-0 me-3" onClick={() => navigate('/translation')}>
          <ArrowLeft size={20} />
        </Button>
        <h4 className="mb-0 fw-semibold" style={{ color: '#172b4d' }}>Upload RAW Truyện</h4>
      </div>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">Chọn Truyện (Publication)</Form.Label>
              <Form.Select
                value={formData.publicationId}
                onChange={(e) => setFormData({ ...formData, publicationId: e.target.value })}
                required
              >
                <option value="">-- Chọn truyện --</option>
                {publications.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="row mb-4">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-medium">Ngôn ngữ nguồn (RAW)</Form.Label>
                  <Form.Select
                    value={formData.sourceLanguage}
                    onChange={(e) => setFormData({ ...formData, sourceLanguage: e.target.value })}
                  >
                    <option value="zh">Tiếng Trung (zh)</option>
                    <option value="ko">Tiếng Hàn (ko)</option>
                    <option value="ja">Tiếng Nhật (ja)</option>
                    <option value="en">Tiếng Anh (en)</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-medium">Ngôn ngữ đích (Dịch)</Form.Label>
                  <Form.Select
                    value={formData.targetLanguage}
                    onChange={(e) => setFormData({ ...formData, targetLanguage: e.target.value })}
                  >
                    <option value="vi">Tiếng Việt (vi)</option>
                    <option value="en">Tiếng Anh (en)</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">File RAW (ZIP/CBZ)</Form.Label>
              <div
                className="border rounded p-5 text-center bg-light"
                style={{ borderStyle: 'dashed !important', cursor: 'pointer' }}
              >
                <UploadCloud size={48} className="text-muted mb-2" />
                <p className="mb-1 fw-medium">Kéo thả file ZIP/CBZ vào đây</p>
                <p className="small text-muted mb-0">Hoặc click để chọn file (Max 500MB)</p>
                <Form.Control type="file" className="d-none" id="fileUpload" accept=".zip,.cbz" />
                <Button variant="outline-primary" className="mt-3" onClick={() => document.getElementById('fileUpload')?.click()}>
                  Chọn File
                </Button>
              </div>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => navigate('/translation')}>Hủy</Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Upload & Start Process'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};
