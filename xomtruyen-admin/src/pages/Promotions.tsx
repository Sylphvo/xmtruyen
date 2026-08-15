import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Badge } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { Edit, Trash, Plus, Ticket } from 'lucide-react';
import * as api from '../api/promotionApi';

export const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState<api.Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<api.SavePromotionRequest>({
    code: '',
    description: '',
    discountPercent: 10,
    maxDiscountAmount: 50000,
    minPurchaseAmount: 100000,
    validFrom: new Date().toISOString().slice(0, 16),
    validTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    usageLimit: 100,
    isActive: true
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const data = await api.getAllPromotions();
      setPromotions(data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách khuyến mãi');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (promo?: api.Promotion) => {
    if (promo) {
      setEditingId(promo.id);
      setFormData({
        code: promo.code,
        description: promo.description,
        discountPercent: promo.discountPercent,
        maxDiscountAmount: promo.maxDiscountAmount,
        minPurchaseAmount: promo.minPurchaseAmount,
        validFrom: new Date(promo.validFrom).toISOString().slice(0, 16),
        validTo: new Date(promo.validTo).toISOString().slice(0, 16),
        usageLimit: promo.usageLimit,
        isActive: promo.isActive
      });
    } else {
      setEditingId(null);
      setFormData({
        code: '',
        description: '',
        discountPercent: 10,
        maxDiscountAmount: 50000,
        minPurchaseAmount: 100000,
        validFrom: new Date().toISOString().slice(0, 16),
        validTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        usageLimit: 100,
        isActive: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Chuyển lại UTC cho đúng format
      const payload = {
        ...formData,
        validFrom: new Date(formData.validFrom).toISOString(),
        validTo: new Date(formData.validTo).toISOString(),
      };

      if (editingId) {
        await api.updatePromotion(editingId, payload);
        toast.success('Cập nhật khuyến mãi thành công');
      } else {
        await api.createPromotion(payload);
        toast.success('Thêm khuyến mãi thành công');
      }
      handleCloseModal();
      fetchPromotions();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu khuyến mãi');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa khuyến mãi này?')) return;
    
    try {
      await api.deletePromotion(id);
      toast.success('Xóa khuyến mãi thành công');
      fetchPromotions();
    } catch (error) {
      toast.error('Lỗi khi xóa khuyến mãi');
    }
  };

  return (
    <>
      <div className="jira-table-container m-4">
        <div className="d-flex justify-content-between align-items-center p-3" style={{ borderBottom: '1px solid #dfe1e6' }}>
        <h5 className="mb-0 fw-semibold" style={{ color: '#172b4d', fontSize: '16px' }}>
          <Ticket size={18} className="me-2 text-warning" />
          Quản lý Khuyến mãi
        </h5>
        <div className="d-flex gap-2">
          <Button variant="primary" size="sm" onClick={() => handleShowModal()}>
            <Plus size={16} className="me-2" />
            Tạo Mã Mới
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-4">Đang tải dữ liệu...</div>
      ) : (
        <div className="table-responsive flex-grow-1 d-flex flex-column jira-scroll" style={{ maxHeight: '1756px', overflowY: 'auto', overflowX: 'auto', minHeight: '616px' }}>
          <table className="table align-middle mb-0" style={{ flexGrow: 1, borderCollapse: 'collapse', backgroundColor: 'transparent', tableLayout: 'fixed', minWidth: '800px' }}>
            <thead className="jira-table-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                <th style={{ padding: '12px 16px', color: 'var(--bs-heading-color)' }}>Mã Code</th>
                <th style={{ padding: '12px 16px', color: 'var(--bs-heading-color)' }}>Thông tin Giảm giá</th>
                <th style={{ padding: '12px 16px', color: 'var(--bs-heading-color)' }}>Thời gian hiệu lực</th>
                <th style={{ padding: '12px 16px', color: 'var(--bs-heading-color)' }}>Lượt Dùng</th>
                <th style={{ padding: '12px 16px', color: 'var(--bs-heading-color)' }}>Trạng thái</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--bs-heading-color)' }}>Thao tác</th>
              </tr>
            </thead>
              <tbody>
                {promotions.map(promo => {
                  const isValid = promo.isActive && new Date(promo.validTo) > new Date() && promo.usedCount < promo.usageLimit;
                  return (
                  <tr key={promo.id} className="jira-table-row" style={{ height: '46px' }}>
                    <td className="fw-bold text-primary" style={{ padding: '12px 16px', letterSpacing: '1px' }}>
                      {promo.code}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div className="fw-bold text-success">Giảm {promo.discountPercent}%</div>
                      <div className="text-secondary small">Tối đa: {promo.maxDiscountAmount.toLocaleString()}đ</div>
                      <div className="text-secondary small">Đơn tối thiểu: {promo.minPurchaseAmount.toLocaleString()}đ</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div className="small">Từ: {new Date(promo.validFrom).toLocaleString('vi-VN')}</div>
                      <div className="small text-danger">Đến: {new Date(promo.validTo).toLocaleString('vi-VN')}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge bg={promo.usedCount >= promo.usageLimit ? 'danger' : 'info'}>
                        {promo.usedCount} / {promo.usageLimit}
                      </Badge>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <Badge bg={isValid ? 'success' : 'secondary'}>
                        {isValid ? 'Đang hiệu lực' : 'Đã hết hạn/Hủy'}
                      </Badge>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleShowModal(promo)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(promo.id)}>
                        <Trash size={16} />
                      </Button>
                    </td>
                  </tr>
                  )
                })}
                {promotions.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ borderLeft: 0, borderRight: 0, padding: 0 }}>
                      <div className="jira-empty-state">
                        <img src="/empty-state.svg" alt="No data" style={{ width: '120px', marginBottom: '20px', opacity: 0.5 }} onError={(e) => e.currentTarget.style.display = 'none'} />
                        <h4>Chưa có mã khuyến mãi</h4>
                        <p>Bấm "Tạo Mã Mới" để thêm mã giảm giá.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" data-bs-theme={document.documentElement.getAttribute('data-bs-theme')}>
        <Modal.Header closeButton style={{ backgroundColor: 'var(--bs-tertiary-bg)', borderBottomColor: 'var(--bs-border-color)' }}>
          <Modal.Title>{editingId ? 'Sửa Khuyến mãi' : 'Tạo Mã Khuyến mãi'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body style={{ backgroundColor: 'var(--bs-body-bg)' }}>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Mã Code (Chữ in hoa viết liền)</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="code" 
                    value={formData.code} 
                    onChange={(e) => setFormData(prev => ({...prev, code: e.target.value.toUpperCase()}))} 
                    required 
                    placeholder="VD: SUMMER2024"
                    style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--bs-body-color)', borderColor: 'var(--bs-border-color)', letterSpacing: '2px', fontWeight: 'bold' }}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Mô tả ngắn</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    required 
                    style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--bs-body-color)', borderColor: 'var(--bs-border-color)' }}
                  />
                </Form.Group>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>% Giảm giá</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="discountPercent" 
                    value={formData.discountPercent} 
                    onChange={handleChange} 
                    required 
                    min="1" max="100"
                    style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--bs-body-color)', borderColor: 'var(--bs-border-color)' }}
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Giảm Tối đa (VNĐ)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="maxDiscountAmount" 
                    value={formData.maxDiscountAmount} 
                    onChange={handleChange} 
                    required 
                    min="0"
                    style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--bs-body-color)', borderColor: 'var(--bs-border-color)' }}
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Đơn Tối thiểu (VNĐ)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="minPurchaseAmount" 
                    value={formData.minPurchaseAmount} 
                    onChange={handleChange} 
                    required 
                    min="0"
                    style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--bs-body-color)', borderColor: 'var(--bs-border-color)' }}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Từ ngày</Form.Label>
                  <Form.Control 
                    type="datetime-local" 
                    name="validFrom" 
                    value={formData.validFrom} 
                    onChange={handleChange} 
                    required 
                    style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--bs-body-color)', borderColor: 'var(--bs-border-color)' }}
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Đến ngày</Form.Label>
                  <Form.Control 
                    type="datetime-local" 
                    name="validTo" 
                    value={formData.validTo} 
                    onChange={handleChange} 
                    required 
                    style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--bs-body-color)', borderColor: 'var(--bs-border-color)' }}
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Số lượt dùng tối đa</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="usageLimit" 
                    value={formData.usageLimit} 
                    onChange={handleChange} 
                    required 
                    min="1"
                    style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--bs-body-color)', borderColor: 'var(--bs-border-color)' }}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox"
                name="isActive"
                label="Đang kích hoạt"
                checked={formData.isActive}
                onChange={handleChange}
              />
            </Form.Group>

          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: 'var(--bs-tertiary-bg)', borderTopColor: 'var(--bs-border-color)' }}>
            <Button variant="secondary" onClick={handleCloseModal}>Hủy</Button>
            <Button variant="primary" type="submit">Lưu lại</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
