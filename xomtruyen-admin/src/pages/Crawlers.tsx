import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Badge, ProgressBar } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { Play, Trash, Search, Settings } from 'lucide-react';
import * as api from '../api/crawlerApi';
import { FloatingBulkActionBar } from '../components/FloatingBulkActionBar';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { LoadingMoreIndicator } from '../components/LoadingMoreIndicator';
import { InfiniteScrollFooter } from '../components/InfiniteScrollFooter';
import { ExcelActionButtons } from '../components/ExcelActionButtons';


export const Crawlers: React.FC = () => {
  const {
    items: jobs,
    totalCount: totalItems,
    isLoading: loading,
    isLoadingMore,
    hasMore,
    loadedCount,
    sentinelRef,
    refresh,
    removeItem
  } = useInfiniteScroll<api.CrawlJob>({
    fetchFn: async () => {
      const data = await api.getAllCrawlJobs();
      return { data, totalCount: data.length, page: 1, pageSize: data.length };
    },
    pageSize: 50,
  });
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<api.StartCrawlRequest>({
    sourceName: 'qidian',
    targetUrl: '',
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(jobs.map(j => j.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Refresh without resetting loaded count to simulate real-time updates silently
      refresh();
    }, 10000);
    return () => clearInterval(interval);
  }, [refresh]);

  const handleShowModal = () => {
    setFormData({ sourceName: 'qidian', targetUrl: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.startCrawlJob(formData);
      toast.success('Đã bắt đầu Crawl Job');
      handleCloseModal();
      refresh();
    } catch (error) {
      toast.error('Có lỗi xảy ra khi bắt đầu Crawl');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa lịch sử Crawl này?')) return;
    
    try {
      await api.deleteCrawlJob(id);
      toast.success('Xóa thành công');
      removeItem(id);
    } catch (error) {
      toast.error('Lỗi khi xóa');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Running': return <Badge bg="primary">Đang chạy</Badge>;
      case 'Completed': return <Badge bg="success">Hoàn thành</Badge>;
      case 'Failed': return <Badge bg="danger">Lỗi</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      <div className="jira-table-container m-4">
        <div className="d-flex justify-content-between align-items-center p-3" style={{ borderBottom: '1px solid #dfe1e6' }}>
        <h5 className="mb-0 fw-semibold" style={{ color: '#172b4d', fontSize: '16px' }}>
          <Settings size={18} className="me-2 text-danger" />
          Crawler Pipeline Management
        </h5>
        <div className="d-flex gap-2">
          <Button variant="danger" size="sm" onClick={handleShowModal}>
            <Play size={16} className="me-2" />
            Start New Job
          </Button>
        </div>
      </div>

      {loading && jobs.length === 0 ? (
        <div className="text-center p-4">Đang tải dữ liệu...</div>
      ) : (
        <div className="table-responsive flex-grow-1 jira-scroll" style={{ maxHeight: '1756px', overflowY: 'auto', overflowX: 'auto', minHeight: '616px' }}>
          <table className="table align-middle mb-0" style={{ borderCollapse: 'collapse', backgroundColor: 'transparent', tableLayout: 'fixed', minWidth: '800px' }}>
            <thead className="jira-table-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                <th style={{ padding: '12px 10px', textAlign: 'center', width: '40px' }}>
                  <Form.Check
                    type="checkbox"
                    checked={jobs.length > 0 && selectedIds.length === jobs.length}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = selectedIds.length > 0 && selectedIds.length < jobs.length;
                      }
                    }}
                    onChange={handleSelectAll}
                  />
                </th>
                <th style={{ padding: '12px 16px', color: 'var(--jira-text)' }}>Source</th>
                <th style={{ padding: '12px 16px', color: 'var(--jira-text)' }}>Target URL</th>
                <th style={{ padding: '12px 16px', color: 'var(--jira-text)' }}>Trạng thái</th>
                <th style={{ padding: '12px 16px', color: 'var(--jira-text)', width: '250px' }}>Tiến độ</th>
                <th style={{ padding: '12px 16px', color: 'var(--jira-text)' }}>Bắt đầu lúc</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--jira-text)' }}>Thao tác</th>
              </tr>
            </thead>
              <tbody>
                {jobs.map(job => {
                  const percent = job.totalItems > 0 ? Math.round((job.crawledItems / job.totalItems) * 100) : 0;
                  return (
                  <tr key={job.id} className="jira-table-row" style={{ height: '46px', backgroundColor: selectedIds.includes(job.id) ? '#ebf2fc' : 'transparent' }}>
                    <td style={{ padding: '12px 10px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <Form.Check
                        type="checkbox"
                        checked={selectedIds.includes(job.id)}
                        onChange={() => toggleSelect(job.id)}
                      />
                    </td>
                    <td className="fw-bold text-uppercase" style={{ padding: '12px 16px' }}>
                      {job.sourceName}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <a href={job.targetUrl} target="_blank" rel="noreferrer" className="text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
                        {job.targetUrl}
                      </a>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {getStatusBadge(job.status)}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div className="d-flex justify-content-between small mb-1">
                        <span>{job.crawledItems} / {job.totalItems} items</span>
                        <span>{percent}%</span>
                      </div>
                      <ProgressBar 
                        now={percent} 
                        variant={job.status === 'Failed' ? 'danger' : (job.status === 'Completed' ? 'success' : 'primary')} 
                        style={{ height: '8px' }} 
                      />
                      {job.errorMessage && <div className="text-danger small mt-1 text-truncate">{job.errorMessage}</div>}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div className="small">{job.startedAt ? new Date(job.startedAt).toLocaleString('vi-VN') : '—'}</div>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <Button variant="outline-secondary" size="sm" className="me-2" title="Xem Logs">
                        <Search size={16} />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(job.id)}>
                        <Trash size={16} />
                      </Button>
                    </td>
                  </tr>
                  )
                })}
                {jobs.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ borderLeft: 0, borderRight: 0, padding: 0 }}>
                      <div className="jira-empty-state">
                        <img src="/empty-state.svg" alt="No data" style={{ width: '120px', marginBottom: '20px', opacity: 0.5 }} onError={(e) => e.currentTarget.style.display = 'none'} />
                        <h4>Chưa có tiến trình Crawl</h4>
                        <p>Bấm "Start New Job" để bắt đầu.</p>
                      </div>
                    </td>
                  </tr>
                )}
                <LoadingMoreIndicator isVisible={isLoadingMore} colSpan={7} />
              </tbody>
            </table>
            {hasMore && <div ref={sentinelRef} className="scroll-sentinel" />}
          </div>
        )}

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

      <Modal show={showModal} onHide={handleCloseModal} data-bs-theme={document.documentElement.getAttribute('data-bs-theme')}>
        <Modal.Header closeButton style={{ backgroundColor: 'var(--bs-tertiary-bg)', borderBottomColor: 'var(--bs-border-color)' }}>
          <Modal.Title>Tạo Crawl Job Mới</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body style={{ backgroundColor: 'transparent' }}>
            <Form.Group className="mb-3">
              <Form.Label>Nguồn (Source)</Form.Label>
              <Form.Select 
                value={formData.sourceName}
                onChange={(e) => setFormData({...formData, sourceName: e.target.value})}
                style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--jira-text)', borderColor: 'var(--bs-border-color)' }}
              >
                <option value="qidian">QiDian (起点)</option>
                <option value="kakaopage">Kakao Page</option>
                <option value="syosetu">Syosetu (小説家になろう)</option>
                <option value="webnovel">WebNovel</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Target URL</Form.Label>
              <Form.Control 
                type="url" 
                value={formData.targetUrl} 
                onChange={(e) => setFormData({...formData, targetUrl: e.target.value})} 
                required 
                placeholder="https://book.qidian.com/info/..."
                style={{ backgroundColor: 'var(--bs-tertiary-bg)', color: 'var(--jira-text)', borderColor: 'var(--bs-border-color)' }}
              />
              <Form.Text className="text-muted">
                Nhập link trang chủ của truyện. Crawler sẽ tự động quét tất cả các chương.
              </Form.Text>
            </Form.Group>

          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: 'var(--bs-tertiary-bg)', borderTopColor: 'var(--bs-border-color)' }}>
            <Button variant="secondary" onClick={handleCloseModal}>Hủy</Button>
            <Button variant="danger" type="submit">
              <Play size={16} className="me-2" /> Start Crawling
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
