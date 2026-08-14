import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Modal, Table } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { Edit, Trash, Plus } from 'lucide-react';
import * as planApi from '../api/subscriptionPlanApi';

export const SubscriptionPlans = () => {
  const [plans, setPlans] = useState<planApi.ISubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<planApi.SaveSubscriptionPlanRequest>({
    name: '',
    price: 0,
    durationDays: 30,
    isUnlimited: false,
    maxChaptersPerDay: null,
    removeAds: false
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const data = await planApi.getPlans();
      setPlans(data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách gói VIP');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (plan?: planApi.ISubscriptionPlan) => {
    if (plan) {
      setEditingId(plan.id);
      setFormData({
        name: plan.name,
        price: plan.price,
        durationDays: plan.durationDays,
        isUnlimited: plan.isUnlimited,
        maxChaptersPerDay: plan.maxChaptersPerDay,
        removeAds: plan.removeAds
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        price: 0,
        durationDays: 30,
        isUnlimited: false,
        maxChaptersPerDay: null,
        removeAds: false
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await planApi.updatePlan(editingId, formData);
        toast.success('Cập nhật gói VIP thành công');
      } else {
        await planApi.createPlan(formData);
        toast.success('Thêm gói VIP thành công');
      }
      handleCloseModal();
      fetchPlans();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu gói VIP');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa gói VIP này?')) return;
    
    try {
      await planApi.deletePlan(id);
      toast.success('Xóa gói VIP thành công');
      fetchPlans();
    } catch (error) {
      toast.error('Lỗi khi xóa gói VIP');
    }
  };

  return (
    <>
      <div className="jira-table-container m-4">
        <div className="d-flex justify-content-between align-items-center p-3" style={{ borderBottom: '1px solid #dfe1e6' }}>
        <h5 className="mb-0 fw-semibold" style={{ color: '#172b4d', fontSize: '16px' }}>Cấu hình Gói VIP</h5>
        <div className="d-flex gap-2">
          <Button variant="primary" size="sm" onClick={() => handleShowModal()}>
            <Plus size={16} className="me-2" />
            Thêm Gói Mới
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
                <th style={{ padding: '12px 16px', color: 'var(--bs-heading-color)' }}>ID</th>
                <th style={{ padding: '12px 16px', color: 'var(--bs-heading-color)' }}>Tên Gói</th>
                <th style={{ padding: '12px 16px', color: 'var(--bs-heading-color)' }}>Giá (VNĐ)</th>
                <th style={{ padding: '12px 16px', color: 'var(--bs-heading-color)' }}>Thời gian (Ngày)</th>
                <th style={{ padding: '12px 16px', color: 'var(--bs-heading-color)' }}>Quyền lợi</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--bs-heading-color)' }}>Thao tác</th>
              </tr>
            </thead>
              <tbody>
                {plans.map(plan => (
                  <tr key={plan.id} className="jira-table-row" style={{ height: '46px' }}>
                    <td style={{ padding: '12px 16px' }}>{plan.id}</td>
                    <td className="fw-bold" style={{ padding: '12px 16px' }}>{plan.name}</td>
                    <td className="text-success fw-bold" style={{ padding: '12px 16px' }}>{plan.price.toLocaleString()}đ</td>
                    <td style={{ padding: '12px 16px' }}>{plan.durationDays} ngày</td>
                    <td style={{ padding: '12px 16px' }}>
                      <ul className="mb-0 ps-3">
                        {plan.isUnlimited ? <li>Đọc không giới hạn</li> : (plan.maxChaptersPerDay && <li>Giới hạn {plan.maxChaptersPerDay} chương/ngày</li>)}
                        {plan.removeAds && <li>Không quảng cáo</li>}
                      </ul>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleShowModal(plan)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(plan.id)}>
                        <Trash size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
                {plans.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ borderLeft: 0, borderRight: 0, padding: 0 }}>
                      <div className="jira-empty-state">
                        <img src="/empty-state.svg" alt="No data" style={{ width: '120px', marginBottom: '20px', opacity: 0.5 }} onError={(e) => e.currentTarget.style.display = 'none'} />
                        <h4>There are no work items here yet</h4>
                        <p>We couldn't find any data matching your criteria. Try adjusting your filters or search terms.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Thêm/Sửa Gói VIP */}
      <Modal show={showModal} onHide={handleCloseModal} data-bs-theme={document.documentElement.getAttribute('data-bs-theme')}>
        <Modal.Header closeButton style={{ backgroundColor: 'var(--bs-tertiary-bg)', borderBottomColor: 'var(--bs-border-color)' }}>
          <Modal.Title>{editingId ? 'Sửa Gói VIP' : 'Thêm Gói VIP'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body style={{ backgroundColor: 'var(--bs-body-bg)' }}>
            <Form.Group className="mb-3">
              <Form.Label>Tên gói</Form.Label>
              <Form.Control 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--bs-body-color)', borderColor: 'var(--bs-border-color)' }}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Giá tiền (VNĐ)</Form.Label>
              <Form.Control 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                required 
                min="0"
                style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--bs-body-color)', borderColor: 'var(--bs-border-color)' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Thời hạn (Ngày)</Form.Label>
              <Form.Control 
                type="number" 
                name="durationDays" 
                value={formData.durationDays} 
                onChange={handleChange} 
                required 
                min="1"
                style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--bs-body-color)', borderColor: 'var(--bs-border-color)' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox"
                name="isUnlimited"
                label="Đọc không giới hạn (Unlimited)"
                checked={formData.isUnlimited}
                onChange={handleChange}
              />
            </Form.Group>

            {!formData.isUnlimited && (
              <Form.Group className="mb-3">
                <Form.Label>Giới hạn số chương/ngày</Form.Label>
                <Form.Control 
                  type="number" 
                  name="maxChaptersPerDay" 
                  value={formData.maxChaptersPerDay || 0} 
                  onChange={handleChange} 
                  min="0"
                  style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--bs-body-color)', borderColor: 'var(--bs-border-color)' }}
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox"
                name="removeAds"
                label="Bỏ qua quảng cáo (Remove Ads)"
                checked={formData.removeAds}
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
