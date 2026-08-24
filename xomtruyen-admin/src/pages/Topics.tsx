import React, { useState, useEffect, useCallback } from 'react';
import type { ITopic } from '../types/topic';
import { getTopics, createTopic, updateTopic, deleteTopic } from '../api/topicApi';
import { Form, Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight, faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ResizableHeader } from '../components/ResizableHeader';
import { ExcelActionButtons } from '../components/ExcelActionButtons';
import { FloatingBulkActionBar } from '../components/FloatingBulkActionBar';
import toast from 'react-hot-toast';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { LoadingMoreIndicator } from '../components/LoadingMoreIndicator';
import { InfiniteScrollFooter } from '../components/InfiniteScrollFooter';

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  key: keyof ITopic | null;
  direction: SortDirection;
}

export const Topics: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'asc' });

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newItem, setNewItem] = useState<Partial<ITopic>>({});

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<ITopic>>({});

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(data.map(t => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    items: data,
    totalCount: totalItems,
    isLoading: loading,
    isLoadingMore,
    hasMore,
    loadedCount,
    sentinelRef,
    refresh,
    removeItem,
    prependItem,
    updateItem
  } = useInfiniteScroll<ITopic>({
    fetchFn: (params) => getTopics({
      page: params.page,
      pageSize: params.pageSize,
      searchKeyword: params.searchKeyword || undefined,
      sortBy: params.sortBy || undefined,
      isDescending: params.isDescending,
    }),
    pageSize: 50,
    params: { searchKeyword: debouncedSearch, sortBy: sortConfig.key, isDescending: sortConfig.direction === 'desc' }
  });

  const handleSort = (key: keyof ITopic) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    setSortConfig({ key: direction ? key : null, direction });
  };

  const getSortIcon = (key: keyof ITopic) => {
    if (sortConfig.key !== key) return <FontAwesomeIcon icon={faSort} className="text-muted ms-1" style={{ fontSize: '12px' }} />;
    if (sortConfig.direction === 'asc') return <FontAwesomeIcon icon={faSortUp} className="ms-1" style={{ fontSize: '12px' }} />;
    if (sortConfig.direction === 'desc') return <FontAwesomeIcon icon={faSortDown} className="ms-1" style={{ fontSize: '12px' }} />;
    return <FontAwesomeIcon icon={faSort} className="text-muted ms-1" style={{ fontSize: '12px' }} />;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, saveFunc: () => void, cancelFunc?: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveFunc();
    } else if (e.key === 'Escape' && cancelFunc) {
      e.preventDefault();
      cancelFunc();
    }
  };

  const handleCloseAdd = () => {
    setIsAddingNew(false);
    setNewItem({});
  };

  const handleAddSubmit = async () => {
    if (!newItem.name) {
      toast.error('Tên chủ đề là bắt buộc');
      return;
    }
    setIsSubmitting(true);
    try {
      await createTopic({ name: newItem.name });
      handleCloseAdd();
      refresh();
    } catch (error: any) {
      console.error('Lỗi khi tạo topic:', error);
      toast.error(error.message || 'Không thể tạo topic.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (item: ITopic) => {
    setEditingId(item.id);
    setEditData({ ...item });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSaveEdit = async (id: number) => {
    if (!editData.name) {
      toast.error('Tên chủ đề là bắt buộc');
      return;
    }
    try {
      await updateTopic(id, { name: editData.name });
      updateItem(id, (cat) => ({ ...cat, ...editData }));
      setEditingId(null);
    } catch (error: any) {
      console.error('Lỗi khi cập nhật topic:', error);
      toast.error(error.message || 'Không thể cập nhật topic.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa chủ đề này? Không thể xóa nếu đang có sách liên kết.')) return;
    try {
      await deleteTopic(id);
      removeItem(id);
    } catch (error: any) {
      console.error('Lỗi khi xóa topic:', error);
      toast.error(error.message || 'Không thể xóa topic.');
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length || !window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} chủ đề đã chọn?`)) return;
    const deletePromise = Promise.all(selectedIds.map(deleteTopic));
    toast.promise(deletePromise, { loading: 'Đang xóa...', success: 'Xóa thành công!', error: 'Có lỗi xảy ra khi xóa' });
    try {
      await deletePromise;
      selectedIds.forEach(removeItem);
      setSelectedIds([]);
    } catch (error) {
      console.error('Lỗi khi xóa hàng loạt:', error);
    }
  };

  const handleImportExcel = async (importedData: any[]) => {
    let successCount = 0;
    let errorCount = 0;
    
    const toastId = toast.loading('Đang xử lý dữ liệu import...');
    for (const row of importedData) {
      const name = row.name || row.Name || row.Tên;
      if (!name) continue;
      
      try {
        await createTopic({ name });
        successCount++;
      } catch (error) {
        errorCount++;
      }
    }
    toast.dismiss(toastId);
    
    if (successCount > 0) {
      toast.success(`Nhập thành công ${successCount} chủ đề`);
      refresh();
    }
    if (errorCount > 0) {
      toast.error(`Lỗi khi nhập ${errorCount} chủ đề`);
    }
  };



  return (
    <div className="jira-table-container">
      <div className="d-flex justify-content-between align-items-center p-3" style={{ borderBottom: '1px solid #dfe1e6' }}>
        <h5 className="mb-0 fw-semibold" style={{ color: '#172b4d', fontSize: '16px' }}>Quản lý Chủ đề</h5>
        <div className="d-flex align-items-center gap-3">
          
          <Button variant="primary" size="sm" onClick={() => setIsAddingNew(true)} className="d-flex align-items-center gap-2 rounded-2">
            <FontAwesomeIcon icon={faPlus} />
            Thêm Mới
          </Button>
          


          <div style={{ width: '250px' }}>
            <Form.Control
              size="sm"
              type="text"
              className="bg-transparent text-body"
              style={{ height: '32px', fontSize: '13px', border: '1px solid #dfe1e6', borderRadius: '4px' }}
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="table-responsive flex-grow-1 jira-scroll" style={{ maxHeight: '1756px', overflowY: 'auto', overflowX: 'auto', minHeight: '616px' }}>
        <table className="table align-middle mb-0" style={{ borderCollapse: 'collapse', backgroundColor: 'transparent', tableLayout: 'fixed', minWidth: '800px' }}>
          <thead className="jira-table-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                <ResizableHeader initialWidth={40} minWidth={40} style={{ borderLeft: 0, padding: '12px 10px', backgroundColor: 'transparent', textAlign: 'center' }}>
                  <Form.Check
                    type="checkbox"
                    checked={data.length > 0 && selectedIds.length === data.length}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = selectedIds.length > 0 && selectedIds.length < data.length;
                      }
                    }}
                    onChange={handleSelectAll}
                  />
                </ResizableHeader>
                <ResizableHeader initialWidth={100} style={{ cursor: 'pointer', backgroundColor: 'transparent', padding: '12px 16px' , color: 'var(--jira-text)'}} onClick={() => handleSort('id')}>
                  <span className="fw-semibold text-nowrap">ID {getSortIcon('id')}</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={300} style={{ cursor: 'pointer', backgroundColor: 'transparent', padding: '12px 16px', color: 'var(--jira-text)' }} onClick={() => handleSort('name')}>
                  <span className="fw-semibold text-nowrap">Tên Chủ đề {getSortIcon('name')}</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={280} style={{ cursor: 'pointer', backgroundColor: 'transparent', padding: '12px 16px' , color: 'var(--jira-text)'}} onClick={() => handleSort('slug')}>
                  <span className="fw-semibold text-nowrap">Slug (Đường dẫn) {getSortIcon('slug')}</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={120} style={{ borderRight: 0, backgroundColor: 'transparent', padding: '12px 16px', textAlign: 'right' , color: 'var(--jira-text)'}}>
                  <span className="fw-semibold text-nowrap">Thao tác</span>
                </ResizableHeader>
              </tr>
            </thead>
            <tbody style={{ height: '1px' }}>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-5">
                    <Spinner animation="border" variant="secondary" size="sm" />
                    <div className="mt-2 text-muted small">Đang tải dữ liệu...</div>
                  </td>
                </tr>
              ) : (
                <>
                  {isAddingNew && (
                    <tr className="jira-table-row inline-edit-row" style={{ height: '46px' }}>
                      <td style={{ borderLeft: 0, padding: '12px 10px', backgroundColor: 'transparent', textAlign: 'center' }}></td>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                        <span className="text-muted small">Tự động</span>
                      </td>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                        <Form.Control autoFocus size="sm" value={newItem.name || ''} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} onKeyDown={(e) => handleKeyDown(e, handleAddSubmit, handleCloseAdd)} placeholder="Tên chủ đề" className="inline-edit-input text-body w-100" />
                      </td>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                        <span className="text-muted small">Tự động tạo</span>
                      </td>
                      <td style={{ borderRight: 0, padding: '12px 16px', textAlign: 'right', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                        <div className="d-flex gap-2 justify-content-end">
                          <Button variant="success" size="sm" onClick={handleAddSubmit} disabled={isSubmitting} className="px-3 rounded-2 fw-medium">Lưu</Button>
                          <Button variant="light" size="sm" onClick={handleCloseAdd} className="px-3 rounded-2 border border-secondary-subtle">Hủy</Button>
                        <ExcelActionButtons 
            dataToExport={data.map(c => ({ ID: c.id, Tên: c.name }))}
            exportFileName="Topics"
            onImport={handleImportExcel}
            isLoading={loading}
          /></div>
                      </td>
                    </tr>
                  )}
                  {data.length > 0 ? (
                    data.map((topic) => (
                      editingId === topic.id ? (
                        <tr key={`edit-${topic.id}`} className="jira-table-row inline-edit-row" style={{ height: '46px' }}>
                          <td style={{ borderLeft: 0, padding: '12px 10px', backgroundColor: 'transparent', textAlign: 'center' }}></td>
                          <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                            <span className="text-muted small">{topic.id}</span>
                          </td>
                          <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                            <Form.Control autoFocus size="sm" value={editData.name || ''} onChange={(e) => setEditData({ ...editData, name: e.target.value })} onKeyDown={(e) => handleKeyDown(e, () => handleSaveEdit(topic.id), handleCancelEdit)} onBlur={() => handleSaveEdit(topic.id)} placeholder="Tên chủ đề" className="inline-edit-input text-body w-100" />
                          </td>
                          <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                            <span className="text-muted small">{topic.slug}</span>
                          </td>
                          <td style={{ borderRight: 0, padding: '12px 16px', textAlign: 'right', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                            <div className="d-flex gap-2 justify-content-end">
                              <Button variant="success" size="sm" onClick={() => handleSaveEdit(topic.id)} className="px-3 rounded-2 fw-medium">Lưu</Button>
                              <Button variant="light" size="sm" onClick={handleCancelEdit} className="px-3 rounded-2 border border-secondary-subtle">Hủy</Button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <tr key={`view-${topic.id}`} className={`jira-table-row${selectedIds.includes(topic.id) ? ' jira-row-selected' : ''}`} style={{ height: '46px' }} onDoubleClick={() => handleEditClick(topic)}>
                          <td style={{ borderLeft: 0, padding: '12px 10px', backgroundColor: 'transparent', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                            <Form.Check
                              type="checkbox"
                              checked={selectedIds.includes(topic.id)}
                              onChange={() => toggleSelect(topic.id)}
                            />
                          </td>
                          <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                            <span className="text-muted small">{topic.id}</span>
                          </td>
                          <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                            <span className="fw-medium">{topic.name}</span>
                          </td>
                          <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                            <span className="text-muted small">{topic.slug}</span>
                          </td>
                          <td style={{ borderRight: 0, padding: '12px 16px', backgroundColor: 'transparent', textAlign: 'right', color: 'var(--jira-text)' }}>
                            <div className="d-flex gap-2 justify-content-end">
                              <Button variant="light" size="sm" onClick={() => handleEditClick(topic)} className="px-2 py-1  d-flex align-items-center" style={{ fontSize: '13px', color: '#4b5563', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                <FontAwesomeIcon icon={faPen} className="me-2" style={{ color: '#9ca3af' }} />
                                Sửa
                              </Button>
                              <Button variant="light" size="sm" onClick={() => handleDelete(topic.id)} className="px-2 py-1  d-flex align-items-center" style={{ fontSize: '13px', color: '#dc3545', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                <FontAwesomeIcon icon={faTrash} className="me-2" />
                                Xóa
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ borderLeft: 0, borderRight: 0, padding: 0 }}>
                        <div className="jira-empty-state">
                          <img src="/empty-state.svg" alt="No data" style={{ width: '120px', marginBottom: '20px', opacity: 0.5 }} onError={(e) => e.currentTarget.style.display = 'none'} />
                          <h4>There are no work items here yet</h4>
                          <p>We couldn't find any data matching your criteria. Try adjusting your filters or search terms.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )}
              
              <LoadingMoreIndicator isVisible={isLoadingMore} colSpan={5} />
            </tbody>
            <tbody style={{ height: 'auto' }}>
              <tr style={{ height: '100%' }}>
                <td colSpan={5} style={{ borderBottom: 0, padding: 0, backgroundColor: 'transparent' }}></td>
              </tr>
            </tbody>
          </table>
          {hasMore && <div ref={sentinelRef} className="scroll-sentinel" />}
        </div>

      <InfiniteScrollFooter
        loadedCount={loadedCount}
        totalCount={totalItems}
        onRefresh={refresh}
        onCreateClick={() => setIsAddingNew(true)}
      />
      <FloatingBulkActionBar 
        selectedCount={selectedIds.length} 
        onClearSelection={() => setSelectedIds([])} 
        onBulkDelete={handleBulkDelete}
      />
    </div>
  );
};
