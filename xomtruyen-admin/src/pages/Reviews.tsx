import React, { useState, useEffect } from 'react';
import { Button, Table, Card, Badge, Pagination } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { MessageSquare, Trash, Star } from 'lucide-react';
import * as api from '../api/reviewApi';
import { ResizableHeader } from '../components/ResizableHeader';

export const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<api.Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 20;

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

      <div className="table-responsive flex-grow-1 d-flex flex-column jira-scroll" style={{ maxHeight: '1756px', overflowY: 'auto', overflowX: 'auto', minHeight: '616px' }}>
        <table className="table align-middle mb-0" style={{ flexGrow: 1, borderCollapse: 'collapse', backgroundColor: 'transparent', tableLayout: 'fixed', minWidth: '1000px' }}>
          <thead className="jira-table-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
            <tr style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
              <ResizableHeader initialWidth={150} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }}>
                <span className="fw-semibold text-nowrap">Người dùng</span>
              </ResizableHeader>
              <ResizableHeader initialWidth={200} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }}>
                <span className="fw-semibold text-nowrap">Truyện</span>
              </ResizableHeader>
              <ResizableHeader initialWidth={150} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }}>
                <span className="fw-semibold text-nowrap">Đánh giá</span>
              </ResizableHeader>
              <ResizableHeader initialWidth={300} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }}>
                <span className="fw-semibold text-nowrap">Nội dung</span>
              </ResizableHeader>
              <ResizableHeader initialWidth={150} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }}>
                <span className="fw-semibold text-nowrap">Ngày gửi</span>
              </ResizableHeader>
              <ResizableHeader initialWidth={100} style={{ padding: '12px 16px', textAlign: 'right', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }}>
                <span className="fw-semibold text-nowrap">Thao tác</span>
              </ResizableHeader>
            </tr>
          </thead>
          <tbody style={{ height: '1px' }}>
              {loading ? (
                <tr><td colSpan={6} className="text-center p-4">Đang tải...</td></tr>
              ) : reviews.length === 0 ? (
                <tr><td colSpan={6} className="text-center p-4 text-muted">Chưa có đánh giá nào.</td></tr>
              ) : (
                reviews.map(review => (
                  <tr key={review.id} className="jira-table-row" style={{ height: '46px' }}>
                    <td className="px-4 fw-medium text-primary" style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>{review.userName}</td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}><Badge bg="info">{review.publicationTitle}</Badge></td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>{renderStars(review.rating)}</td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                      <div className="text-wrap text-muted" style={{ fontSize: '14px' }}>
                        {review.content || <i>(Không có nội dung)</i>}
                      </div>
                    </td>
                    <td className="text-muted small" style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                      {review.createdAt ? new Date(review.createdAt).toLocaleString() : ''}
                    </td>
                    <td className="px-4 text-end" style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
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
      </div>
  );
};
