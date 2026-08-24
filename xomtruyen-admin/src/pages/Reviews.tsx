import React, { useState, useEffect } from 'react';
import { Button, Badge, Pagination } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { MessageSquare, Trash, Star } from 'lucide-react';
import * as api from '../api/reviewApi';
import { ResizableHeader } from '../components/ResizableHeader';
import { FloatingBulkActionBar } from '../components/FloatingBulkActionBar';
import { Form } from 'react-bootstrap';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { LoadingMoreIndicator } from '../components/LoadingMoreIndicator';
import { InfiniteScrollFooter } from '../components/InfiniteScrollFooter';
import { ExcelActionButtons } from '../components/ExcelActionButtons';


export const Reviews: React.FC = () => {
  const {
    items: reviews,
    totalCount: totalItems,
    isLoading: loading,
    isLoadingMore,
    hasMore,
    loadedCount,
    sentinelRef,
    refresh,
    removeItem
  } = useInfiniteScroll<api.Review>({
    fetchFn: async (params) => {
      const data = await api.getReviews(undefined, params.page, params.pageSize);
      return { data: data.data, totalCount: data.totalCount, page: params.page, pageSize: params.pageSize };
    },
    pageSize: 50,
  });

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


  const handleDelete = async (id: string, userName: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa đánh giá của [${userName}] không?`)) return;
    try {
      await api.deleteReview(id);
      toast.success('Xóa đánh giá thành công');
      removeItem(id);
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
        <div className="d-flex align-items-center gap-3">
          <ExcelActionButtons 
            dataToExport={reviews || []}
            exportFileName={typeof document !== 'undefined' ? document.title.replace(' | Xóm Truyện', '').replace(/ /g, '_') : 'Reviews'}
            onRefresh={typeof refresh !== 'undefined' ? refresh : undefined}
            isLoading={typeof loading !== 'undefined' ? loading : false}
          />
        </div>
      </div>

      <div className="table-responsive flex-grow-1 jira-scroll" style={{ overflowY: 'auto', overflowX: 'auto' }}>
        <table className="table align-middle mb-0" style={{ borderCollapse: 'collapse', backgroundColor: 'transparent', tableLayout: 'fixed', minWidth: '1000px' }}>
          <thead className="jira-table-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
            <tr style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
              <ResizableHeader initialWidth={40} minWidth={40} style={{ borderLeft: 0, padding: '12px 10px', backgroundColor: 'var(--jira-header-bg)', textAlign: 'center', position: 'sticky', left: 0, zIndex: 11, boxShadow: 'inset -2px 0 4px -2px rgba(0,0,0,0.12)' }}>
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
              <ResizableHeader initialWidth={100} style={{ padding: '12px 16px', textAlign: 'right', backgroundColor: 'var(--jira-header-bg)', color: 'var(--jira-text)', position: 'sticky', right: 0, zIndex: 11, boxShadow: 'inset 2px 0 4px -2px rgba(0,0,0,0.12)' }}>
                <span className="fw-semibold text-nowrap">Thao tác</span>
              </ResizableHeader>
            </tr>
          </thead>
          <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center p-4">Đang tải...</td></tr>
              ) : (
                <>
                  {reviews.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ borderLeft: 0, borderRight: 0, padding: 0 }}>
                        <div className="jira-empty-state">
                          <img src="/empty-state.svg" alt="No data" style={{ width: '120px', marginBottom: '20px', opacity: 0.5 }} onError={(e) => e.currentTarget.style.display = 'none'} />
                          <h4>Chưa có đánh giá nào</h4>
                        </div>
                      </td>
                    </tr>
                  )}
                  {reviews.map(review => (
                  <tr key={review.id} className={`jira-table-row${selectedIds.includes(review.id) ? ' jira-row-selected' : ''}`} style={{ height: '46px' }}>
                    <td className="jira-sticky-left" style={{ borderLeft: 0, padding: '12px 10px', backgroundColor: selectedIds.includes(review.id) ? 'var(--jira-selected-bg, #ebf2fc)' : 'var(--jira-table-bg, #ffffff)', textAlign: 'center', position: 'sticky', left: 0, zIndex: 2, boxShadow: 'inset -2px 0 4px -2px rgba(0,0,0,0.12)' }} onClick={(e) => e.stopPropagation()}>
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
                    <td className="px-4 text-end jira-sticky-right" style={{ padding: '12px 16px', backgroundColor: selectedIds.includes(review.id) ? 'var(--jira-selected-bg, #ebf2fc)' : 'var(--jira-table-bg, #ffffff)', color: 'var(--jira-text)', position: 'sticky', right: 0, zIndex: 2, boxShadow: 'inset 2px 0 4px -2px rgba(0,0,0,0.12)' }}>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(review.id, review.userName)}>
                        <Trash size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
                  <LoadingMoreIndicator isVisible={isLoadingMore} colSpan={7} />
                </>
              )}
            </tbody>
          </table>
          {hasMore && <div ref={sentinelRef} className="scroll-sentinel" />}
        </div>
        
        <InfiniteScrollFooter
          loadedCount={loadedCount}
          totalCount={totalItems}
          onRefresh={refresh}
          showCreate={false}
        />

        <FloatingBulkActionBar 
          selectedCount={selectedIds.length} 
          onClearSelection={() => setSelectedIds([])} 
        />
      </div>
  );
};
