import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Badge, Card } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { Edit2, Trash, Plus, Image as ImageIcon } from 'lucide-react';
import * as api from '../api/homeCmsApi';

export const Banners: React.FC = () => {
  const [banners, setBanners] = useState<api.Banner[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    imageUrl: '',
    linkUrl: '',
    title: '',
    subtitle: '',
    isActive: true,
    orderIndex: 0,
    position: 'HomeTop'
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const data = await api.getBanners();
      setBanners(data);
    } catch (error) {
      toast.error('Lỗi khi tải Banners');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (banner?: api.Banner) => {
    if (banner) {
      setEditingId(banner.id);
      setFormData({
        imageUrl: banner.imageUrl,
        linkUrl: banner.linkUrl || '',
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        isActive: banner.isActive,
        orderIndex: banner.orderIndex,
        position: banner.position
      });
    } else {
      setEditingId(null);
      setFormData({
        imageUrl: '',
        linkUrl: '',
        title: '',
        subtitle: '',
        isActive: true,
        orderIndex: 0,
        position: 'HomeTop'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateBanner(editingId, formData);
        toast.success('Cập nhật Banner thành công');
      } else {
        await api.createBanner(formData);
        toast.success('Tạo Banner thành công');
      }
      handleCloseModal();
      fetchBanners();
    } catch (error) {
      toast.error('Lỗi khi lưu Banner');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa Banner này?')) return;
    try {
      await api.deleteBanner(id);
      toast.success('Xóa Banner thành công');
      fetchBanners();
    } catch (error) {
      toast.error('Lỗi khi xóa');
    }
  };

  return (
    <div className="m-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 fw-semibold" style={{ color: '#172b4d' }}>
          <ImageIcon className="me-2 text-primary" />
          Quản lý Banner
        </h4>
        <Button variant="primary" onClick={() => handleShowModal()}>
          <Plus size={16} className="me-2" />
          Thêm Banner
        </Button>
      </div>

      {loading ? (
        <div className="text-center p-4">Đang tải...</div>
      ) : (
        <div className="row g-4">
          {banners.map(banner => (
            <div key={banner.id} className="col-md-6 col-lg-4">
              <Card className="shadow-sm border-0 h-100 position-relative overflow-hidden">
                <div style={{ height: '180px', backgroundColor: '#e9ecef' }} className="position-relative">
                  {banner.imageUrl ? (
                    <img src={banner.imageUrl} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
                      No Image
                    </div>
                  )}
                  <div className="position-absolute top-0 end-0 p-2">
                    {banner.isActive ? (
                      <Badge bg="success">Đang bật</Badge>
                    ) : (
                      <Badge bg="secondary">Đã tắt</Badge>
                    )}
                  </div>
                </div>
                <Card.Body>
                  <Card.Title className="text-truncate">{banner.title || 'Không có tiêu đề'}</Card.Title>
                  <Card.Text className="text-muted small text-truncate">
                    {banner.subtitle || 'Không có phụ đề'}
                  </Card.Text>
                  
                  <div className="d-flex justify-content-between text-muted small mb-3">
                    <span>Vị trí: <strong>{banner.position}</strong></span>
                    <span>Thứ tự: <strong>{banner.orderIndex}</strong></span>
                  </div>

                  <div className="d-flex gap-2">
                    <Button variant="outline-primary" size="sm" className="flex-grow-1" onClick={() => handleShowModal(banner)}>
                      <Edit2 size={16} className="me-1" /> Sửa
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(banner.id)}>
                      <Trash size={16} />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
          {banners.length === 0 && (
            <div className="col-12 text-center p-5 text-muted">
              Chưa có banner nào.
            </div>
          )}
        </div>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{editingId ? 'Sửa Banner' : 'Thêm Banner'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Image URL <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="url" 
                required 
                value={formData.imageUrl} 
                onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                placeholder="https://..."
              />
              {formData.imageUrl && (
                <div className="mt-2 rounded overflow-hidden" style={{ height: '100px' }}>
                  <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.currentTarget.style.display = 'none'} />
                </div>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Link URL (Trỏ đi đâu khi click)</Form.Label>
              <Form.Control 
                type="text" 
                value={formData.linkUrl} 
                onChange={e => setFormData({...formData, linkUrl: e.target.value})} 
                placeholder="/book/123..."
              />
            </Form.Group>
            <div className="row mb-3">
              <Form.Group className="col-6">
                <Form.Label>Vị trí (Position)</Form.Label>
                <Form.Select 
                  value={formData.position} 
                  onChange={e => setFormData({...formData, position: e.target.value})}
                >
                  <option value="HomeTop">Trang chủ - Trên cùng</option>
                  <option value="HomeMiddle">Trang chủ - Giữa</option>
                  <option value="ReaderSidebar">Reader - Sidebar</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="col-6">
                <Form.Label>Thứ tự hiển thị (Order)</Form.Label>
                <Form.Control 
                  type="number" 
                  value={formData.orderIndex} 
                  onChange={e => setFormData({...formData, orderIndex: parseInt(e.target.value)})} 
                />
              </Form.Group>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Tiêu đề (Hiển thị overlay)</Form.Label>
              <Form.Control 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phụ đề</Form.Label>
              <Form.Control 
                type="text" 
                value={formData.subtitle} 
                onChange={e => setFormData({...formData, subtitle: e.target.value})} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check 
                type="switch" 
                id="is-active"
                label="Bật (Active)" 
                checked={formData.isActive} 
                onChange={e => setFormData({...formData, isActive: e.target.checked})} 
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Hủy</Button>
            <Button variant="primary" type="submit">Lưu</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};
