import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Pagination } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { Trash, Star, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Plus } from 'lucide-react';
import * as reviewApi from '../api/reviewApi';

export const Reviews = () => {
  const [reviews, setReviews] = useState<reviewApi.IReview[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;
  const startIndex = (currentPage - 1) * itemsPerPage;

  useEffect(() => {
    fetchReviews(currentPage);
  }, [currentPage]);

  const fetchReviews = async (page: number) => {
    setLoading(true);
    try {
      const { data, totalCount } = await reviewApi.getReviews(page, itemsPerPage);
      setReviews(data);
      setTotalItems(totalCount);
      setTotalPages(Math.ceil(totalCount / itemsPerPage));
    } catch (error) {
      toast.error('Lỗi khi tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này? Việc này không thể hoàn tác.')) return;
    
    try {
      await reviewApi.deleteReview(id);
      toast.success('Xóa đánh giá thành công');
      fetchReviews(currentPage);
    } catch (error) {
      toast.error('Lỗi khi xóa đánh giá');
    }
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={14} 
        fill={i < rating ? '#ffc107' : 'none'} 
        color={i < rating ? '#ffc107' : '#ccc'} 
      />
    ));
  };

  return (
    <div className="jira-table-container m-4">
      <div className="d-flex justify-content-between align-items-center p-3" style={{ borderBottom: '1px solid #dfe1e6' }}>
        <h5 className="mb-0 fw-semibold" style={{ color: '#172b4d', fontSize: '16px' }}>Quản lý Đánh Giá (Reviews)</h5>
      </div>

      {loading ? (
        <div className="text-center p-4">Đang tải dữ liệu...</div>
      ) : (
        <div className="table-responsive flex-grow-1 d-flex flex-column jira-scroll" style={{ maxHeight: '1756px', overflowY: 'auto', overflowX: 'auto', minHeight: '616px' }}>
          <table className="table align-middle mb-0" style={{ flexGrow: 1, borderCollapse: 'collapse', backgroundColor: 'transparent', tableLayout: 'fixed', minWidth: '800px' }}>
            <thead className="jira-table-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                <th style={{ padding: '12px 16px', color: 'var(--bs-heading-color)' }}>Ngày đăng</th>
                <th style={{ padding: '12px 16px', color: 'var(--bs-heading-color)' }}>Người dùng</th>
                <th style={{ padding: '12px 16px', color: 'var(--bs-heading-color)' }}>Truyện / Tác phẩm</th>
                <th style={{ padding: '12px 16px', color: 'var(--bs-heading-color)' }}>Đánh giá</th>
                <th style={{ width: '40%', padding: '12px 16px', color: 'var(--bs-heading-color)' }}>Nội dung</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--bs-heading-color)' }}>Thao tác</th>
              </tr>
            </thead>
                <tbody>
                  {reviews.map(review => (
                    <tr key={review.id} className="jira-table-row" style={{ height: '46px' }}>
                    <td className="text-muted" style={{ fontSize: '0.9rem', padding: '12px 16px' }}>
                      {new Date(review.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div className="fw-bold">{review.user.fullName || review.user.email}</div>
                      <div className="text-muted" style={{ fontSize: '0.8rem' }}>{review.user.email}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div className="fw-bold text-primary">{review.publication.title}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div className="d-flex align-items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{
                        maxHeight: '80px',
                        overflowY: 'auto',
                        whiteSpace: 'pre-wrap',
                        fontSize: '0.95rem'
                      }}>
                        {review.content || <i className="text-muted">(Không có bình luận)</i>}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(review.id)} title="Xóa đánh giá này">
                        <Trash size={16} />
                      </Button>
                    </td>
                  </tr>
                  ))}
                  {reviews.length === 0 && (
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
        
        {/* Bottom Controls */}
        <div className="jira-table-footer">
          <div style={{ visibility: 'hidden' }}>
            <Button variant="light" size="sm" className="btn-create">
              <Plus size={16} /> Create
            </Button>
          </div>

          {totalPages > 1 && (
            <div className="pagination-controls">
              <span className="text-muted" style={{ fontSize: '13px' }}>
                {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}
              </span>
              <button className="icon-btn" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                <ChevronsLeft size={14} />
              </button>
              <button className="icon-btn" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>
                <ChevronLeft size={14} />
              </button>
              <span className="text-muted px-2">{currentPage}</span>
              <button className="icon-btn" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>
                <ChevronRight size={14} />
              </button>
              <button className="icon-btn" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                <ChevronsRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
  );
};
