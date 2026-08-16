import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Badge, Pagination } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { Trash, Plus, Bell, Send } from 'lucide-react';
import * as api from '../api/notificationApi';
import { ResizableHeader } from '../components/ResizableHeader';
import { FloatingBulkActionBar } from '../components/FloatingBulkActionBar';

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<api.Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [typeFilter, setTypeFilter] = useState('');
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(notifications.map(n => n.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<api.SaveNotificationRequest>({
    title: '',
    message: '',
    type: 'system',
    userId: null
  });

  useEffect(() => {
    fetchNotifications();
  }, [page, typeFilter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.getNotifications(typeFilter || undefined, page, pageSize);
      setNotifications(res.data);
      setTotalCount(res.totalCount);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách thông báo');
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = () => {
    setFormData({
      title: '',
      message: '',
      type: 'system',
      userId: null
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createNotification(formData);
      toast.success('Gửi thông báo thành công');
      handleCloseModal();
      setPage(1);
      fetchNotifications();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi gửi thông báo');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) return;
    
    try {
      await api.deleteNotification(id);
      toast.success('Xóa thông báo thành công');
      fetchNotifications();
    } catch (error) {
      toast.error('Lỗi khi xóa thông báo');
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <>
      <div className="jira-table-container m-4">
        <div className="d-flex justify-content-between align-items-center p-3" style={{ borderBottom: '1px solid #dfe1e6' }}>
          <h5 className="mb-0 fw-semibold" style={{ color: '#172b4d', fontSize: '16px' }}>
            <Bell size={18} className="me-2 text-primary" />
            Lịch sử Thông báo
          </h5>
          <div className="d-flex gap-3">
            <Form.Select 
              size="sm"
              value={typeFilter} 
              onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
              style={{ width: '180px' }}
            >
              <option value="">Tất cả loại</option>
              <option value="system">Hệ thống (System)</option>
              <option value="chapter_update">Chương mới</option>
              <option value="payment">Thanh toán</option>
              <option value="promotion">Khuyến mãi</option>
            </Form.Select>
            
            <Button variant="primary" size="sm" onClick={handleShowModal}>
              <Send size={16} className="me-2" />
              Gửi Thông báo
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center p-4">Đang tải dữ liệu...</div>
        ) : (
          <div className="table-responsive flex-grow-1 jira-scroll" style={{ maxHeight: '1756px', overflowY: 'auto', overflowX: 'auto', minHeight: '616px' }}>
            <table className="table align-middle mb-0" style={{ borderCollapse: 'collapse', backgroundColor: 'transparent', tableLayout: 'fixed', minWidth: '800px' }}>
              <thead className="jira-table-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <tr style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                <ResizableHeader initialWidth={40} minWidth={40} style={{ borderLeft: 0, padding: '12px 10px', backgroundColor: 'transparent', textAlign: 'center' }}>
                  <Form.Check
                    type="checkbox"
                    checked={notifications.length > 0 && selectedIds.length === notifications.length}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = selectedIds.length > 0 && selectedIds.length < notifications.length;
                      }
                    }}
                    onChange={handleSelectAll}
                  />
                </ResizableHeader>
                <ResizableHeader initialWidth={250} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                  <span className="fw-semibold text-nowrap">Tiêu đề</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={120} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                  <span className="fw-semibold text-nowrap">Loại</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={150} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                  <span className="fw-semibold text-nowrap">Người nhận</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={120} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                  <span className="fw-semibold text-nowrap">Trạng thái</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={180} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                  <span className="fw-semibold text-nowrap">Thời gian</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={120} style={{ padding: '12px 16px', textAlign: 'right', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                  <span className="fw-semibold text-nowrap">Thao tác</span>
                </ResizableHeader>
                </tr>
              </thead>
                <tbody>
                  {notifications.map(noti => (
                    <tr key={noti.id} className="jira-table-row" style={{ height: '46px', backgroundColor: selectedIds.includes(noti.id) ? '#ebf2fc' : 'transparent' }}>
                      <td style={{ borderLeft: 0, padding: '12px 10px', backgroundColor: 'transparent', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                        <Form.Check
                          type="checkbox"
                          checked={selectedIds.includes(noti.id)}
                          onChange={() => toggleSelect(noti.id)}
                        />
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div className="fw-bold">{noti.title}</div>
                        <div className="text-secondary small text-truncate" style={{ maxWidth: '300px' }}>{noti.message}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Badge bg={
                          noti.type === 'system' ? 'primary' :
                          noti.type === 'payment' ? 'success' :
                          noti.type === 'promotion' ? 'warning' : 'info'
                        }>
                          {noti.type}
                        </Badge>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {noti.userId ? (
                          <span className="text-primary">Cá nhân ({noti.userId.substring(0, 8)})</span>
                        ) : (
                          <span className="text-success fw-bold">Tất cả (Broadcast)</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {noti.isRead ? <Badge bg="secondary">Đã đọc</Badge> : <Badge bg="danger">Chưa đọc</Badge>}
                      </td>
                      <td className="text-secondary small" style={{ padding: '12px 16px' }}>
                        {new Date(noti.createdAt).toLocaleString('vi-VN')}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDelete(noti.id)}>
                          <Trash size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {notifications.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ borderLeft: 0, borderRight: 0, padding: 0 }}>
                        <div className="jira-empty-state">
                          <img src="/empty-state.svg" alt="No data" style={{ width: '120px', marginBottom: '20px', opacity: 0.5 }} onError={(e) => e.currentTarget.style.display = 'none'} />
                          <h4>Chưa có thông báo nào</h4>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              {totalPages > 1 && (
                <div className="p-3 border-top d-flex justify-content-end">
                  <Pagination size="sm" className="mb-0">
                    <Pagination.Prev disabled={page === 1} onClick={() => setPage(p => p - 1)} />
                    {[...Array(totalPages)].map((_, i) => (
                      <Pagination.Item key={i + 1} active={page === i + 1} onClick={() => setPage(i + 1)}>
                        {i + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next disabled={page === totalPages} onClick={() => setPage(p => p + 1)} />
                  </Pagination>
                </div>
              )}
            </div>
          )}
          <FloatingBulkActionBar 
            selectedCount={selectedIds.length} 
            onClearSelection={() => setSelectedIds([])} 
          />
        </div>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" data-bs-theme={document.documentElement.getAttribute('data-bs-theme')}>
        <Modal.Header closeButton style={{ backgroundColor: 'var(--bs-tertiary-bg)', borderBottomColor: 'var(--bs-border-color)' }}>
          <Modal.Title>Gửi Thông báo mới</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body style={{ backgroundColor: 'transparent' }}>
            <div className="row">
              <div className="col-md-8">
                <Form.Group className="mb-3">
                  <Form.Label>Tiêu đề thông báo</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    required 
                    placeholder="VD: Khuyến mãi Tết Nguyên Đán 50%"
                    style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--jira-text)', borderColor: 'var(--bs-border-color)' }}
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Loại thông báo</Form.Label>
                  <Form.Select 
                    name="type" 
                    value={formData.type} 
                    onChange={handleChange} 
                    style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--jira-text)', borderColor: 'var(--bs-border-color)' }}
                  >
                    <option value="system">Hệ thống</option>
                    <option value="promotion">Khuyến mãi</option>
                    <option value="chapter_update">Chương mới</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Nội dung</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4}
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                required 
                placeholder="Nhập nội dung chi tiết gửi đến người dùng..."
                style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--jira-text)', borderColor: 'var(--bs-border-color)' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Người nhận</Form.Label>
              <Form.Select 
                name="userId" 
                value={formData.userId || ''} 
                onChange={e => setFormData(prev => ({ ...prev, userId: e.target.value === '' ? null : e.target.value }))} 
                style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--jira-text)', borderColor: 'var(--bs-border-color)' }}
              >
                <option value="">Tất cả người dùng (Broadcast)</option>
                <option value="specific" disabled>Gửi 1 người dùng cụ thể (Tính năng đang phát triển)</option>
              </Form.Select>
              <Form.Text className="text-muted">
                Lưu ý: Broadcast sẽ gửi thông báo này tới toàn bộ user trên hệ thống.
              </Form.Text>
            </Form.Group>

          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: 'var(--bs-tertiary-bg)', borderTopColor: 'var(--bs-border-color)' }}>
            <Button variant="secondary" onClick={handleCloseModal}>Hủy</Button>
            <Button variant="primary" type="submit"><Send size={16} className="me-2"/> Gửi ngay</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
