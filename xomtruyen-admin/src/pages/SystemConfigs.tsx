import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Table, Badge, Card } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { Settings, Plus, Edit2, Trash, Save } from 'lucide-react';
import * as api from '../api/systemConfigApi';
import { ResizableHeader } from '../components/ResizableHeader';

export const SystemConfigs: React.FC = () => {
  const [configs, setConfigs] = useState<api.SystemConfig[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    description: '',
    category: 'General',
    dataType: 'string'
  });

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const data = await api.getConfigs();
      setConfigs(data);
    } catch (error) {
      toast.error('Lỗi khi tải cấu hình hệ thống');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (config?: api.SystemConfig) => {
    if (config) {
      setIsEditing(true);
      setFormData({
        key: config.key,
        value: config.value,
        description: config.description || '',
        category: config.category,
        dataType: config.dataType
      });
    } else {
      setIsEditing(false);
      setFormData({
        key: '',
        value: '',
        description: '',
        category: 'General',
        dataType: 'string'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Basic JSON validation if datatype is JSON
      if (formData.dataType === 'json') {
        try {
          JSON.parse(formData.value);
        } catch (e) {
          toast.error('Dữ liệu JSON không hợp lệ!');
          return;
        }
      }
      
      if (isEditing) {
        await api.updateConfig(formData.key, formData);
        toast.success('Cập nhật cấu hình thành công');
      } else {
        await api.createConfig(formData);
        toast.success('Thêm cấu hình thành công');
      }
      handleCloseModal();
      fetchConfigs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi lưu cấu hình');
    }
  };

  const handleDelete = async (key: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa cấu hình [${key}]?`)) return;
    try {
      await api.deleteConfig(key);
      toast.success('Xóa cấu hình thành công');
      fetchConfigs();
    } catch (error) {
      toast.error('Lỗi khi xóa cấu hình');
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'General': return <Badge bg="primary">Chung</Badge>;
      case 'Email': return <Badge bg="info">Email</Badge>;
      case 'SEO': return <Badge bg="success">SEO</Badge>;
      case 'Payment': return <Badge bg="warning" text="dark">Thanh toán</Badge>;
      case 'FeatureToggle': return <Badge bg="danger">Tính năng</Badge>;
      default: return <Badge bg="secondary">{category}</Badge>;
    }
  };

  // Group by category for easier viewing
  const groupedConfigs = configs.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {} as Record<string, api.SystemConfig[]>);

  return (
    <div className="m-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 fw-semibold" style={{ color: '#172b4d' }}>
          <Settings className="me-2 text-primary" />
          Cấu hình Hệ thống (System Config)
        </h4>
        <Button variant="primary" onClick={() => handleShowModal()}>
          <Plus size={16} className="me-2" />
          Thêm Cấu hình mới
        </Button>
      </div>

      {loading ? (
        <div className="text-center p-5">Đang tải...</div>
      ) : (
        <div className="row g-4">
          {Object.entries(groupedConfigs).map(([category, items]) => (
            <div key={category} className="col-12">
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-light border-0 py-3">
                  <h6 className="mb-0 fw-bold d-flex align-items-center">
                    {getCategoryBadge(category)}
                    <span className="ms-2">Nhóm: {category}</span>
                  </h6>
                </Card.Header>
                <Table responsive hover className="mb-0 align-middle">
                  <thead className="jira-table-header">
                    <tr style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                      <ResizableHeader initialWidth={250} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                        <span className="fw-semibold text-nowrap">Tên cấu hình (Key)</span>
                      </ResizableHeader>
                      <ResizableHeader initialWidth={300} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                        <span className="fw-semibold text-nowrap">Giá trị (Value)</span>
                      </ResizableHeader>
                      <ResizableHeader initialWidth={200} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                        <span className="fw-semibold text-nowrap">Mô tả</span>
                      </ResizableHeader>
                      <ResizableHeader initialWidth={120} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                        <span className="fw-semibold text-nowrap">Loại DL</span>
                      </ResizableHeader>
                      <ResizableHeader initialWidth={120} style={{ padding: '12px 16px', textAlign: 'right', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                        <span className="fw-semibold text-nowrap">Thao tác</span>
                      </ResizableHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(config => (
                      <tr key={config.key} className="jira-table-row" style={{ height: '46px' }}>
                        <td className="ps-4 fw-medium text-primary" style={{ fontFamily: 'monospace', fontSize: '13px', padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                          {config.key}
                        </td>
                        <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                          <div 
                            className="bg-light px-2 py-1 rounded text-truncate" 
                            style={{ maxWidth: '300px', fontFamily: config.dataType === 'json' ? 'monospace' : 'inherit', fontSize: '13px' }}
                            title={config.value}
                          >
                            {config.value}
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                          <span className="small text-muted">{config.description}</span>
                        </td>
                        <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                          <Badge bg="light" text="dark" className="border">{config.dataType}</Badge>
                        </td>
                        <td className="text-end pe-4" style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                          <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(config)}>
                            <Edit2 size={14} />
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(config.key)}>
                            <Trash size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            </div>
          ))}
          {configs.length === 0 && (
            <div className="col-12 text-center p-5 text-muted">
              Chưa có cấu hình nào.
            </div>
          )}
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{isEditing ? 'Sửa Cấu hình' : 'Thêm Cấu hình mới'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Tên cấu hình (Key) <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="text" 
                    required 
                    value={formData.key} 
                    onChange={e => setFormData({...formData, key: e.target.value.replace(/[^a-zA-Z0-9_.]/g, '')})} 
                    disabled={isEditing}
                    placeholder="VD: SITE_NAME, SMTP_HOST..."
                    style={{ fontFamily: 'monospace' }}
                  />
                  <Form.Text className="text-muted">Viết liền không dấu, dùng dấu gạch dưới hoặc chấm. (Ví dụ: <code>seo.default_title</code>)</Form.Text>
                </Form.Group>
              </div>
              <div className="col-md-3">
                <Form.Group className="mb-3">
                  <Form.Label>Nhóm (Category)</Form.Label>
                  <Form.Select 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="General">Chung (General)</option>
                    <option value="Email">Email</option>
                    <option value="SEO">SEO</option>
                    <option value="Payment">Thanh toán (Payment)</option>
                    <option value="FeatureToggle">Tính năng (Feature Toggle)</option>
                    <option value="Crawler">Trình thu thập (Crawler)</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-3">
                <Form.Group className="mb-3">
                  <Form.Label>Loại dữ liệu</Form.Label>
                  <Form.Select 
                    value={formData.dataType} 
                    onChange={e => setFormData({...formData, dataType: e.target.value})}
                  >
                    <option value="string">Chuỗi (String)</option>
                    <option value="number">Số (Number)</option>
                    <option value="boolean">Đúng/Sai (Boolean)</option>
                    <option value="json">JSON</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Giá trị (Value) <span className="text-danger">*</span></Form.Label>
              {formData.dataType === 'json' ? (
                <Form.Control 
                  as="textarea"
                  rows={6}
                  required 
                  value={formData.value} 
                  onChange={e => setFormData({...formData, value: e.target.value})} 
                  style={{ fontFamily: 'monospace' }}
                  placeholder='{"key": "value"}'
                />
              ) : (
                <Form.Control 
                  type="text"
                  required 
                  value={formData.value} 
                  onChange={e => setFormData({...formData, value: e.target.value})} 
                  placeholder="Nhập giá trị..."
                />
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả công dụng</Form.Label>
              <Form.Control 
                as="textarea"
                rows={2}
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                placeholder="Giải thích ngắn gọn cấu hình này dùng để làm gì..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Hủy</Button>
            <Button variant="primary" type="submit">
              <Save size={16} className="me-1" /> Lưu cấu hình
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};
