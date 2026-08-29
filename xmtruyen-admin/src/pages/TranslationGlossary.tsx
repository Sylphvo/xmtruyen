import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Badge, Table } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { BookOpen, Plus, Upload, Trash, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api/translationApi';

export const TranslationGlossary: React.FC = () => {
  const navigate = useNavigate();
  const [glossaries, setGlossaries] = useState<api.TranslationGlossary[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    sourceText: '',
    targetText: '',
    sourceLanguage: 'zh',
    targetLanguage: 'vi',
    category: 'general'
  });

  useEffect(() => {
    fetchGlossaries();
  }, []);

  const fetchGlossaries = async () => {
    try {
      const data = await api.getGlossaries();
      setGlossaries(data);
    } catch (error) {
      toast.error('Lỗi khi tải từ điển');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createGlossary(formData);
      toast.success('Đã thêm từ vựng mới');
      setShowModal(false);
      setFormData({ ...formData, sourceText: '', targetText: '' });
      fetchGlossaries();
    } catch (error) {
      toast.error('Lỗi khi lưu');
    }
  };

  const getCategoryBadge = (category?: string) => {
    switch (category) {
      case 'cultivation': return <Badge bg="success">Tu luyện</Badge>;
      case 'martial_arts': return <Badge bg="danger">Võ công</Badge>;
      case 'names': return <Badge bg="info">Tên riêng</Badge>;
      case 'sfx': return <Badge bg="warning" text="dark">SFX</Badge>;
      default: return <Badge bg="secondary">Chung</Badge>;
    }
  };

  return (
    <div className="m-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <Button variant="link" className="text-secondary p-0 me-3" onClick={() => navigate('/translation')}>
            <ArrowLeft size={20} />
          </Button>
          <h4 className="mb-0 fw-semibold" style={{ color: '#172b4d' }}>
            <BookOpen className="me-2 text-primary" />
            Từ điển thuật ngữ (Glossary)
          </h4>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary">
            <Upload size={16} className="me-2" />
            Import CSV
          </Button>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <Plus size={16} className="me-2" />
            Thêm từ
          </Button>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center p-4">Đang tải...</div>
          ) : (
            <Table hover responsive className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Từ gốc (Source)</th>
                  <th>Nghĩa dịch (Target)</th>
                  <th>Ngôn ngữ</th>
                  <th>Phân loại</th>
                  <th className="text-end pe-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {glossaries.map(g => (
                  <tr key={g.id}>
                    <td className="ps-4 fw-medium text-danger">{g.sourceText}</td>
                    <td className="fw-medium text-success">{g.targetText}</td>
                    <td>
                      <Badge bg="light" text="dark" className="border">
                        {g.sourceLanguage.toUpperCase()} → {g.targetLanguage.toUpperCase()}
                      </Badge>
                    </td>
                    <td>{getCategoryBadge(g.category)}</td>
                    <td className="text-end pe-4">
                      <Button variant="link" size="sm" className="text-danger p-0">
                        <Trash size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
                {glossaries.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-5 text-muted">
                      Chưa có từ vựng nào trong từ điển.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Thêm từ vựng</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Từ gốc (Source Text)</Form.Label>
              <Form.Control 
                required 
                value={formData.sourceText} 
                onChange={e => setFormData({...formData, sourceText: e.target.value})} 
                placeholder="VD: 修炼"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nghĩa dịch (Target Text)</Form.Label>
              <Form.Control 
                required 
                value={formData.targetText} 
                onChange={e => setFormData({...formData, targetText: e.target.value})} 
                placeholder="VD: Tu luyện"
              />
            </Form.Group>
            <div className="row mb-3">
              <div className="col-6">
                <Form.Label>Ngôn ngữ gốc</Form.Label>
                <Form.Select value={formData.sourceLanguage} onChange={e => setFormData({...formData, sourceLanguage: e.target.value})}>
                  <option value="zh">Trung (zh)</option>
                  <option value="ko">Hàn (ko)</option>
                  <option value="ja">Nhật (ja)</option>
                  <option value="en">Anh (en)</option>
                </Form.Select>
              </div>
              <div className="col-6">
                <Form.Label>Ngôn ngữ đích</Form.Label>
                <Form.Select value={formData.targetLanguage} onChange={e => setFormData({...formData, targetLanguage: e.target.value})}>
                  <option value="vi">Việt (vi)</option>
                  <option value="en">Anh (en)</option>
                </Form.Select>
              </div>
            </div>
            <Form.Group>
              <Form.Label>Phân loại (Category)</Form.Label>
              <Form.Select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="general">Chung (General)</option>
                <option value="cultivation">Tu luyện (Tiên hiệp)</option>
                <option value="martial_arts">Võ công (Kiếm hiệp)</option>
                <option value="names">Tên riêng (Character/Place)</option>
                <option value="sfx">Hiệu ứng âm thanh (SFX)</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
            <Button variant="primary" type="submit">Lưu từ vựng</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};
