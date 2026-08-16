import React, { useState, useEffect } from 'react';
import { Button, Table, Card, Badge, Pagination } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { MessageSquare, Trash, Star } from 'lucide-react';
import * as api from '../api/reviewApi';
import { ResizableHeader } from '../components/ResizableHeader';
import { FloatingBulkActionBar } from '../components/FloatingBulkActionBar';
import { Form } from 'react-bootstrap';

export const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<api.Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 20;

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(reviews.map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  useEffect(() => {
    fetchReviews(currentPage);
  }, [currentPage]);

  const fetchReviews = async (page: number) => {
    setLoading(true);
    try {
      const data = await api.getReviews(undefined, page, pageSize);
      setReviews(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, userName: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa đánh giá của [${userName}] không?`)) return;
    try {
      await api.deleteReview(id);
      toast.success('Xóa đánh giá thành công');
      fetchReviews(currentPage);
    } catch (error) {
      toast.error('Lỗi khi xóa đánh giá');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, idx) => (
      <Star 
        key={idx} 
        size={14} 
        className={idx < rating ? "text-warning fill-warning" : "text-muted"} 
        fill={idx < rating ? "currentColor" : "none"} 
      />
    ));
  };

  return (
    <div className="jira-table-container">
      <div className="d-flex justify-content-between align-items-center p-3" style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
        <h5 className="mb-0 fw-semibold" style={{ color: '#172b4d', fontSize: '16px' }}>
          <MessageSquare className="me-2 text-primary" size={18} />
          Quản lý Đánh giá (Reviews)
        </h5>
      </div>

      <div className="table-responsive flex-grow-1 jira-scroll" style={{ maxHeight: '1756px', overflowY: 'auto', overflowX: 'auto', minHeight: '616px' }}>
        <table className="table align-middle mb-0" style={{ borderCollapse: 'collapse', backgroundColor: 'transparent', tableLayout: 'fixed', minWidth: '1000px' }}>
          <thead className="jira-table-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
            <tr style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
              <ResizableHeader initialWidth={40} minWidth={40} style={{ borderLeft: 0, padding: '12px 10px', backgroundColor: 'transparent', textAlign: 'center' }}>
                <Form.Check
                  type="checkbox"
                  checked={reviews.length > 0 && selectedIds.length === reviews.length}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = selectedIds.length > 0 && selectedIds.length < reviews.length;
                    }
                  }}
                  onChange={handleSelectAll}
                />
              </ResizableHeader>
              <ResizableHeader initialWidth={150} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                <span className="fw-semibold text-nowrap">Người dùng</span>
              </ResizableHeader>
              <ResizableHeader initialWidth={200} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                <span className="fw-semibold text-nowrap">Truyện</span>
              </ResizableHeader>
              <ResizableHeader initialWidth={150} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                <span className="fw-semibold text-nowrap">Đánh giá</span>
              </ResizableHeader>
              <ResizableHeader initialWidth={300} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                <span className="fw-semibold text-nowrap">Nội dung</span>
              </ResizableHeader>
              <ResizableHeader initialWidth={150} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                <span className="fw-semibold text-nowrap">Ngày gửi</span>
              </ResizableHeader>
              <ResizableHeader initialWidth={100} style={{ padding: '12px 16px', textAlign: 'right', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                <span className="fw-semibold text-nowrap">Thao tác</span>
              </ResizableHeader>
            </tr>
          </thead>
          <tbody style={{ height: '1px' }}>
              {loading ? (
                <tr><td colSpan={7} className="text-center p-4">Đang tải...</td></tr>
              ) : reviews.length === 0 ? (
                <tr><td colSpan={7} className="text-center p-4 text-muted">Chưa có đánh giá nào.</td></tr>
              ) : (
                reviews.map(review => (
                  <tr key={review.id} className="jira-table-row" style={{ height: '46px', backgroundColor: selectedIds.includes(review.id) ? '#ebf2fc' : 'transparent' }}>
                    <td style={{ borderLeft: 0, padding: '12px 10px', backgroundColor: 'transparent', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <Form.Check
                        type="checkbox"
                        checked={selectedIds.includes(review.id)}
                        onChange={() => toggleSelect(review.id)}
                      />
                    </td>
                    <td className="px-4 fw-medium text-primary" style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>{review.userName}</td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}><Badge bg="info">{review.publicationTitle}</Badge></td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>{renderStars(review.rating)}</td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                      <div className="text-wrap text-muted" style={{ fontSize: '14px' }}>
                        {review.content || <i>(Không có nội dung)</i>}
                      </div>
                    </td>
                    <td className="text-muted small" style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                      {review.createdAt ? new Date(review.createdAt).toLocaleString() : ''}
                    </td>
                    <td className="px-4 text-end" style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(review.id, review.userName)}>
                        <Trash size={14} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="d-flex justify-content-center p-3 border-top" style={{ borderColor: 'var(--bs-border-color)' }}>
            <Pagination className="mb-0">
              <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)} />
              {Array.from({ length: totalPages }).map((_, idx) => (
                <Pagination.Item key={idx + 1} active={idx + 1 === currentPage} onClick={() => setCurrentPage(idx + 1)}>
                  {idx + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next disabled={currentPage === totalPages} onClick={() => setCurrentPage(c => c + 1)} />
            </Pagination>
          </div>
        )}
        <FloatingBulkActionBar 
          selectedCount={selectedIds.length} 
          onClearSelection={() => setSelectedIds([])} 
        />
      </div>
  );
};
