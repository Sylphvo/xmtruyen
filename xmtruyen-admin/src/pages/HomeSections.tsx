import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Badge, Card } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { Edit2, Trash, Plus, Layout } from 'lucide-react';
import * as api from '../api/homeCmsApi';

export const HomeSections: React.FC = () => {
  const [sections, setSections] = useState<api.HomeSection[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Grid',
    isActive: true,
    orderIndex: 0,
    publicationIds: '',
    queryType: 'Latest',
    itemLimit: 10
  });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const data = await api.getHomeSections();
      setSections(data);
    } catch (error) {
      toast.error('Lỗi khi tải Home Sections');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (section?: api.HomeSection) => {
    if (section) {
      setEditingId(section.id);
      setFormData({
        title: section.title,
        description: section.description || '',
        type: section.type,
        isActive: section.isActive,
        orderIndex: section.orderIndex,
        publicationIds: section.publicationIds || '',
        queryType: section.queryType || '',
        itemLimit: section.itemLimit
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        type: 'Grid',
        isActive: true,
        orderIndex: 0,
        publicationIds: '',
        queryType: 'Latest',
        itemLimit: 10
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateHomeSection(editingId, formData);
        toast.success('Cập nhật Section thành công');
      } else {
        await api.createHomeSection(formData);
        toast.success('Tạo Section thành công');
      }
      handleCloseModal();
      fetchSections();
    } catch (error) {
      toast.error('Lỗi khi lưu Section');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa Section này?')) return;
    try {
      await api.deleteHomeSection(id);
      toast.success('Xóa Section thành công');
      fetchSections();
    } catch (error) {
      toast.error('Lỗi khi xóa');
    }
  };

  return (
    <div className="m-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 fw-semibold" style={{ color: '#172b4d' }}>
          <Layout className="me-2 text-primary" />
          Quản lý Trang chủ (Sections)
        </h4>
        <Button variant="primary" onClick={() => handleShowModal()}>
          <Plus size={16} className="me-2" />
          Thêm Section
        </Button>
      </div>

      {loading ? (
        <div className="text-center p-4">Đang tải...</div>
      ) : (
        <div className="row g-4">
          {sections.map(section => (
            <div key={section.id} className="col-12">
              <Card className="shadow-sm border-0 border-start border-4 border-primary">
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <div className="d-flex align-items-center mb-2">
                      <h5 className="mb-0 me-3">{section.title}</h5>
                      {section.isActive ? <Badge bg="success">Đang bật</Badge> : <Badge bg="secondary">Đã tắt</Badge>}
                      <Badge bg="info" className="ms-2">{section.type}</Badge>
                      <Badge bg="light" text="dark" className="ms-2 border">Thứ tự: {section.orderIndex}</Badge>
                    </div>
                    <div className="text-muted small">
                      {section.description && <span className="me-3">{section.description}</span>}
                      {section.publicationIds ? (
                        <span className="text-primary">Manual (Custom IDs)</span>
                      ) : (
                        <span className="text-secondary">Auto: {section.queryType} (Top {section.itemLimit})</span>
                      )}
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <Button variant="outline-primary" size="sm" onClick={() => handleShowModal(section)}>
                      <Edit2 size={16} className="me-1" /> Sửa
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(section.id)}>
                      <Trash size={16} />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
          {sections.length === 0 && (
            <div className="col-12 text-center p-5 text-muted">
              Chưa có section nào.
            </div>
          )}
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editingId ? 'Sửa Section' : 'Thêm Section'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row mb-3">
              <Form.Group className="col-md-8">
                <Form.Label>Tiêu đề hiển thị <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="text" 
                  required 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder="VD: Truyện Mới Cập Nhật"
                />
              </Form.Group>
              <Form.Group className="col-md-4">
                <Form.Label>Thứ tự (Order)</Form.Label>
                <Form.Control 
                  type="number" 
                  value={formData.orderIndex} 
                  onChange={e => setFormData({...formData, orderIndex: parseInt(e.target.value)})} 
                />
              </Form.Group>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả ngắn</Form.Label>
              <Form.Control 
                type="text" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
              />
            </Form.Group>

            <div className="row mb-3">
              <Form.Group className="col-md-6">
                <Form.Label>Kiểu hiển thị (Layout Type)</Form.Label>
                <Form.Select 
                  value={formData.type} 
                  onChange={e => setFormData({...formData, type: e.target.value})}
                >
                  <option value="Grid">Lưới (Grid)</option>
                  <option value="Carousel">Trượt (Carousel)</option>
                  <option value="List">Danh sách dọc (List)</option>
                  <option value="TopRanking">Bảng xếp hạng (Top Ranking)</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="col-md-6 d-flex align-items-end pb-2">
                <Form.Check 
                  type="switch" 
                  id="is-active"
                  label="Bật (Active)" 
                  checked={formData.isActive} 
                  onChange={e => setFormData({...formData, isActive: e.target.checked})} 
                />
              </Form.Group>
            </div>

            <hr />
            <h6 className="mb-3 fw-bold text-muted">Cấu hình dữ liệu (Data Source)</h6>
            
            <Form.Group className="mb-3">
              <Form.Label>Danh sách ID truyện cụ thể (Cách nhau bằng dấu phẩy)</Form.Label>
              <Form.Control 
                type="text" 
                value={formData.publicationIds} 
                onChange={e => setFormData({...formData, publicationIds: e.target.value})} 
                placeholder="Guid1, Guid2..."
              />
              <Form.Text className="text-muted">
                Nếu điền ô này, hệ thống sẽ BỎ QUA Query Type và chỉ hiển thị đúng các truyện này.
              </Form.Text>
            </Form.Group>

            <div className="row mb-3">
              <Form.Group className="col-md-8">
                <Form.Label>Hoặc tự động lấy theo (Query Type)</Form.Label>
                <Form.Select 
                  value={formData.queryType} 
                  onChange={e => setFormData({...formData, queryType: e.target.value})}
                  disabled={!!formData.publicationIds}
                >
                  <option value="Latest">Mới cập nhật</option>
                  <option value="MostViewed">Xem nhiều nhất</option>
                  <option value="HighestRated">Đánh giá cao nhất</option>
                  <option value="Random">Ngẫu nhiên</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="col-md-4">
                <Form.Label>Số lượng (Limit)</Form.Label>
                <Form.Control 
                  type="number" 
                  value={formData.itemLimit} 
                  onChange={e => setFormData({...formData, itemLimit: parseInt(e.target.value)})} 
                  min={1} max={50}
                />
              </Form.Group>
            </div>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Hủy</Button>
            <Button variant="primary" type="submit">Lưu thay đổi</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};
