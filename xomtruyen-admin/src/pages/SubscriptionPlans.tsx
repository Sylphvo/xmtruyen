import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { Edit, Trash, Plus } from 'lucide-react';
import * as planApi from '../api/subscriptionPlanApi';
import { ResizableHeader } from '../components/ResizableHeader';
import { FloatingBulkActionBar } from '../components/FloatingBulkActionBar';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { LoadingMoreIndicator } from '../components/LoadingMoreIndicator';
import { InfiniteScrollFooter } from '../components/InfiniteScrollFooter';
import { ExcelActionButtons } from '../components/ExcelActionButtons';


export const SubscriptionPlans = () => {
  const {
    items: plans,
    totalCount,
    isLoading: loading,
    isLoadingMore,
    hasMore,
    loadedCount,
    sentinelRef,
    refresh
  } = useInfiniteScroll<planApi.ISubscriptionPlan>({
    fetchFn: async () => {
      const data = await planApi.getPlans();
      return {
        data,
        totalCount: data.length,
        page: 1,
        pageSize: data.length
      };
    },
    pageSize: 50
  });
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(plans.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  
  const [formData, setFormData] = useState<planApi.SaveSubscriptionPlanRequest>({
    name: '',
    price: 0,
    durationDays: 30,
    isUnlimited: false,
    maxChaptersPerDay: null,
    removeAds: false
  });


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
      refresh();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu gói VIP');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa gói VIP này?')) return;
    
    try {
      await planApi.deletePlan(id);
      toast.success('Xóa gói VIP thành công');
      refresh();
    } catch (error) {
      toast.error('Lỗi khi xóa gói VIP');
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length || !window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} gói VIP đã chọn?`)) return;
    const deletePromise = Promise.all(selectedIds.map(planApi.deletePlan));
    toast.promise(deletePromise, { loading: 'Đang xóa...', success: 'Xóa thành công!', error: 'Có lỗi xảy ra khi xóa' });
    try {
      await deletePromise;
      selectedIds.forEach(removeItem);
      setSelectedIds([]);
    } catch (error) { console.error('Lỗi khi xóa hàng loạt:', error); }
  };

  return (
    <>
      <div className="jira-table-container">
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
        <div className="table-responsive flex-grow-1 jira-scroll" style={{ overflowY: 'auto', overflowX: 'auto' }}>
          <table className="table align-middle mb-0" style={{ borderCollapse: 'collapse', backgroundColor: 'transparent', tableLayout: 'fixed', minWidth: '800px' }}>
            <thead className="jira-table-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                <ResizableHeader initialWidth={40} minWidth={40} style={{ borderLeft: 0, padding: '12px 10px', backgroundColor: 'transparent', textAlign: 'center' }}>
                  <Form.Check
                    type="checkbox"
                    checked={plans.length > 0 && selectedIds.length === plans.length}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = selectedIds.length > 0 && selectedIds.length < plans.length;
                      }
                    }}
                    onChange={handleSelectAll}
                  />
                </ResizableHeader>
                <ResizableHeader initialWidth={60} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                  <span className="fw-semibold text-nowrap">ID</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={200} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                  <span className="fw-semibold text-nowrap">Tên Gói</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={120} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                  <span className="fw-semibold text-nowrap">Giá (VNĐ)</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={150} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                  <span className="fw-semibold text-nowrap">Thời gian (Ngày)</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={250} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                  <span className="fw-semibold text-nowrap">Quyền lợi</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={120} style={{ padding: '12px 16px', textAlign: 'right', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                  <span className="fw-semibold text-nowrap">Thao tác</span>
                </ResizableHeader>
              </tr>
            </thead>
              <tbody>
                {plans.map(plan => (
                  <tr key={plan.id} className={`jira-table-row${selectedIds.includes(plan.id) ? ' jira-row-selected' : ''}`} style={{ height: '46px' }}>
                    <td style={{ borderLeft: 0, padding: '12px 10px', backgroundColor: 'transparent', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <Form.Check
                        type="checkbox"
                        checked={selectedIds.includes(plan.id)}
                        onChange={() => toggleSelect(plan.id)}
                      />
                    </td>
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
                    <td colSpan={7} style={{ borderLeft: 0, borderRight: 0, padding: 0 }}>
                      <div className="jira-empty-state">
                        <img src="/empty-state.svg" alt="No data" style={{ width: '120px', marginBottom: '20px', opacity: 0.5 }} onError={(e) => e.currentTarget.style.display = 'none'} />
                        <h4>There are no work items here yet</h4>
                        <p>We couldn't find any data matching your criteria. Try adjusting your filters or search terms.</p>
                      </div>
                    </td>
                  </tr>
                )}
              {!loading && <LoadingMoreIndicator isVisible={isLoadingMore} colSpan={7} />}
              </tbody>
            </table>
            {hasMore && <div ref={sentinelRef} className="scroll-sentinel" />}
          </div>
        )}
        {!loading && (
          <InfiniteScrollFooter
            loadedCount={loadedCount}
            totalCount={totalCount}
            onRefresh={refresh}
            showCreate={false}
          />
        )}
        <FloatingBulkActionBar 
          selectedCount={selectedIds.length} 
          onClearSelection={() => setSelectedIds([])} 
          onBulkDelete={handleBulkDelete}
        />
      </div>

      {/* Modal Thêm/Sửa Gói VIP */}
      <Modal show={showModal} onHide={handleCloseModal} data-bs-theme={document.documentElement.getAttribute('data-bs-theme')}>
        <Modal.Header closeButton style={{ backgroundColor: 'var(--bs-tertiary-bg)', borderBottomColor: 'var(--bs-border-color)' }}>
          <Modal.Title>{editingId ? 'Sửa Gói VIP' : 'Thêm Gói VIP'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body style={{ backgroundColor: 'transparent' }}>
            <Form.Group className="mb-3">
              <Form.Label>Tên gói</Form.Label>
              <Form.Control 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--jira-text)', borderColor: 'var(--bs-border-color)' }}
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
                style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--jira-text)', borderColor: 'var(--bs-border-color)' }}
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
                style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--jira-text)', borderColor: 'var(--bs-border-color)' }}
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
                  style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--jira-text)', borderColor: 'var(--bs-border-color)' }}
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
