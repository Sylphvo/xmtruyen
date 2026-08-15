import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Table, Card, Badge } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { Mail, Plus, Edit2, Trash, Save } from 'lucide-react';
import * as api from '../api/emailTemplateApi';

export const EmailTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<api.EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    subject: '',
    bodyHtml: '',
    description: '',
    variables: ''
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const data = await api.getTemplates();
      setTemplates(data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách Email Template');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (template?: api.EmailTemplate) => {
    if (template) {
      setIsEditing(true);
      setFormData({
        code: template.code,
        subject: template.subject,
        bodyHtml: template.bodyHtml,
        description: template.description || '',
        variables: template.variables || ''
      });
    } else {
      setIsEditing(false);
      setFormData({ code: '', subject: '', bodyHtml: '', description: '', variables: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.updateTemplate(formData.code, formData);
        toast.success('Cập nhật mẫu Email thành công');
      } else {
        await api.createTemplate(formData);
        toast.success('Tạo mẫu Email mới thành công');
      }
      handleCloseModal();
      fetchTemplates();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi lưu mẫu Email');
    }
  };

  const handleDelete = async (code: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa mẫu Email [${code}]?`)) return;
    try {
      await api.deleteTemplate(code);
      toast.success('Xóa mẫu Email thành công');
      fetchTemplates();
    } catch (error) {
      toast.error('Lỗi khi xóa mẫu Email');
    }
  };

  return (
    <div className="m-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 fw-semibold" style={{ color: '#172b4d' }}>
          <Mail className="me-2 text-info" />
          Quản lý Mẫu Email (Email Templates)
        </h4>
        <Button variant="primary" onClick={() => handleShowModal()}>
          <Plus size={16} className="me-2" /> Thêm Mẫu mới
        </Button>
      </div>

      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="bg-light">
              <tr>
                <th className="border-0 px-4 py-3">Mã (Code)</th>
                <th className="border-0 py-3">Tiêu đề (Subject)</th>
                <th className="border-0 py-3">Biến hỗ trợ</th>
                <th className="border-0 py-3">Mô tả</th>
                <th className="border-0 px-4 py-3 text-end">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center p-4">Đang tải...</td></tr>
              ) : templates.length === 0 ? (
                <tr><td colSpan={5} className="text-center p-4 text-muted">Chưa có mẫu Email nào.</td></tr>
              ) : (
                templates.map(template => (
                  <tr key={template.code}>
                    <td className="px-4 fw-medium text-primary" style={{ fontFamily: 'monospace' }}>
                      {template.code}
                    </td>
                    <td className="fw-medium">{template.subject}</td>
                    <td>
                      {template.variables?.split(',').map(v => (
                        <Badge bg="light" text="dark" className="border me-1 mb-1 fw-normal" key={v.trim()}>{v.trim()}</Badge>
                      ))}
                    </td>
                    <td className="text-muted small">{template.description}</td>
                    <td className="px-4 text-end">
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(template)}>
                        <Edit2 size={14} />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(template.code)}>
                        <Trash size={14} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{isEditing ? 'Sửa Mẫu Email' : 'Thêm Mẫu Email mới'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Mã mẫu (Code) <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="text" required disabled={isEditing}
                    value={formData.code} 
                    onChange={e => setFormData({...formData, code: e.target.value.replace(/[^A-Z0-9_]/g, '')})} 
                    placeholder="VD: WELCOME_USER" style={{ fontFamily: 'monospace' }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Tiêu đề Email (Subject) <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="text" required 
                    value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} 
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Biến hỗ trợ (Variables)</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={formData.variables} onChange={e => setFormData({...formData, variables: e.target.value})} 
                    placeholder="VD: {{UserName}}, {{ResetLink}}"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Mô tả</Form.Label>
                  <Form.Control 
                    as="textarea" rows={3}
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} 
                  />
                </Form.Group>
              </div>
              <div className="col-md-8 border-start">
                <Form.Group className="mb-3 h-100 d-flex flex-column">
                  <Form.Label>Nội dung (HTML) <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    as="textarea" required className="flex-grow-1" style={{ minHeight: '400px', fontFamily: 'monospace' }}
                    value={formData.bodyHtml} onChange={e => setFormData({...formData, bodyHtml: e.target.value})} 
                    placeholder="<html><body>...</body></html>"
                  />
                </Form.Group>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Hủy</Button>
            <Button variant="primary" type="submit"><Save size={16} className="me-1" /> Lưu mẫu Email</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};
