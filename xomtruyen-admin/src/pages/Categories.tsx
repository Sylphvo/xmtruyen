import React, { useState, useEffect, useCallback } from 'react';
import type { ICategory } from '../types/category';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categoryApi';
import { Form, Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight, faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ResizableHeader } from '../components/ResizableHeader';
import { ExcelActionButtons } from '../components/ExcelActionButtons';
import { FloatingBulkActionBar } from '../components/FloatingBulkActionBar';
import toast from 'react-hot-toast';

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  key: keyof ICategory | null;
  direction: SortDirection;
}

export const Categories: React.FC = () => {
  const [data, setData] = useState<ICategory[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'asc' });

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newItem, setNewItem] = useState<Partial<ICategory>>({});

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<ICategory>>({});

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(data.map(c => c.id));
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

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getCategories({
        page: currentPage,
        pageSize: itemsPerPage,
        searchKeyword: debouncedSearch || undefined,
        sortBy: sortConfig.key || undefined,
        isDescending: sortConfig.direction === 'desc',
      });
      setData(response.data || []);
      setTotalItems(response.totalCount || 0);
    } catch (error) {
      console.error('Lỗi load danh sách category:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, debouncedSearch, sortConfig]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSort = (key: keyof ICategory) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    setSortConfig({ key: direction ? key : null, direction });
  };

  const getSortIcon = (key: keyof ICategory) => {
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
      toast.error('Tên thể loại là bắt buộc');
      return;
    }
    setIsSubmitting(true);
    try {
      await createCategory({ name: newItem.name });
      handleCloseAdd();
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchCategories();
      }
    } catch (error: any) {
      console.error('Lỗi khi tạo category:', error);
      toast.error(error.message || 'Không thể tạo category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (item: ICategory) => {
    setEditingId(item.id);
    setEditData({ ...item });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleSaveEdit = async (id: number) => {
    if (!editData.name) {
      toast.error('Tên thể loại là bắt buộc');
      return;
    }
    try {
      await updateCategory(id, { name: editData.name });
      setData(prev => prev.map(c => c.id === id ? { ...c, ...editData } as ICategory : c));
      setEditingId(null);
    } catch (error: any) {
      console.error('Lỗi khi cập nhật category:', error);
      toast.error(error.message || 'Không thể cập nhật category.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thể loại này? Không thể xóa nếu đang có sách liên kết.')) return;
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (error: any) {
      console.error('Lỗi khi xóa category:', error);
      toast.error(error.message || 'Không thể xóa category.');
    }
  };

  const handleImportExcel = async (importedData: any[]) => {
    let successCount = 0;
    let errorCount = 0;
    
    setLoading(true);
    for (const row of importedData) {
      const name = row.name || row.Name || row.Tên;
      if (!name) continue;
      
      try {
        await createCategory({ name });
        successCount++;
      } catch (error) {
        errorCount++;
      }
    }
    setLoading(false);
    
    if (successCount > 0) {
      toast.success(`Nhập thành công ${successCount} thể loại`);
      fetchCategories();
    }
    if (errorCount > 0) {
      toast.error(`Lỗi khi nhập ${errorCount} thể loại`);
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="jira-table-container">
      <div className="d-flex justify-content-between align-items-center p-3" style={{ borderBottom: '1px solid #dfe1e6' }}>
        <h5 className="mb-0 fw-semibold" style={{ color: '#172b4d', fontSize: '16px' }}>Quản lý Thể loại</h5>
        <div className="d-flex align-items-center gap-3">
          <ExcelActionButtons 
            dataToExport={data.map(c => ({ ID: c.id, Tên: c.name }))}
            exportFileName="Categories"
            onImport={handleImportExcel}
            isLoading={loading}
          />
          <Button variant="primary" size="sm" onClick={() => setIsAddingNew(true)} className="d-flex align-items-center gap-2 rounded-2">
            <FontAwesomeIcon icon={faPlus} />
            Thêm Mới
          </Button>
          
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted" style={{ fontSize: '13px' }}>Hiển thị:</span>
            <Form.Select
              size="sm"
              className="bg-transparent text-body border-secondary-subtle"
              style={{ width: '70px', height: '32px', fontSize: '13px' }}
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </Form.Select>
          </div>

          <div style={{ width: '250px' }}>
            <Form.Control
              size="sm"
              type="text"
              className="bg-transparent text-body"
              style={{ height: '32px', fontSize: '13px', border: '1px solid #dfe1e6', borderRadius: '4px' }}
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
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
                  <span className="fw-semibold text-nowrap">Tên Thể Loại {getSortIcon('name')}</span>
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
                  <td colSpan={5} className="text-center py-5">
                    <Spinner animation="border" variant="secondary" size="sm" />
                    <div className="mt-2 text-muted small">Đang tải dữ liệu...</div>
                  </td>
                </tr>
              ) : (
                <>
                  {isAddingNew && (
                    <tr className="jira-table-row inline-edit-row" style={{ height: '46px' }}>
                      <td style={{ borderLeft: 0, padding: '12px 10px', backgroundColor: 'transparent' }}></td>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                        <span className="text-muted small">Tự động</span>
                      </td>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                        <Form.Control autoFocus size="sm" value={newItem.name || ''} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} onKeyDown={(e) => handleKeyDown(e, handleAddSubmit, handleCloseAdd)} placeholder="Tên thể loại" className="inline-edit-input text-body w-100" />
                      </td>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                        <span className="text-muted small">Tự động tạo</span>
                      </td>
                      <td style={{ borderRight: 0, padding: '12px 16px', textAlign: 'right', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                        <div className="d-flex gap-2 justify-content-end">
                          <Button variant="success" size="sm" onClick={handleAddSubmit} disabled={isSubmitting} className="px-3 rounded-2 fw-medium">Lưu</Button>
                          <Button variant="light" size="sm" onClick={handleCloseAdd} className="px-3 rounded-2 border border-secondary-subtle">Hủy</Button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {data.length > 0 ? (
                    data.map((category) => (
                      editingId === category.id ? (
                        <tr key={`edit-${category.id}`} className="jira-table-row inline-edit-row" style={{ height: '46px' }}>
                          <td style={{ borderLeft: 0, padding: '12px 10px', backgroundColor: 'transparent' }}></td>
                          <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                            <span className="text-muted small">{category.id}</span>
                          </td>
                          <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                            <Form.Control autoFocus size="sm" value={editData.name || ''} onChange={(e) => setEditData({ ...editData, name: e.target.value })} onKeyDown={(e) => handleKeyDown(e, () => handleSaveEdit(category.id), handleCancelEdit)} placeholder="Tên thể loại" className="inline-edit-input text-body w-100" />
                          </td>
                          <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                            <span className="text-muted small">{category.slug}</span>
                          </td>
                          <td style={{ borderRight: 0, padding: '12px 16px', textAlign: 'right', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                            <div className="d-flex gap-2 justify-content-end">
                              <Button variant="success" size="sm" onClick={() => handleSaveEdit(category.id)} className="px-3 rounded-2 fw-medium">Lưu</Button>
                              <Button variant="light" size="sm" onClick={handleCancelEdit} className="px-3 rounded-2 border border-secondary-subtle">Hủy</Button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <tr key={`view-${category.id}`} className="jira-table-row" style={{ height: '46px', backgroundColor: selectedIds.includes(category.id) ? '#ebf2fc' : 'transparent' }} onDoubleClick={() => handleEditClick(category)}>
                          <td style={{ borderLeft: 0, padding: '12px 10px', backgroundColor: 'transparent', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                            <Form.Check
                              type="checkbox"
                              checked={selectedIds.includes(category.id)}
                              onChange={() => toggleSelect(category.id)}
                            />
                          </td>
                          <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                            <span className="text-muted small">{category.id}</span>
                          </td>
                          <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                            <span className="fw-medium">{category.name}</span>
                          </td>
                          <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                            <span className="text-muted small">{category.slug}</span>
                          </td>
                          <td style={{ borderRight: 0, padding: '12px 16px', backgroundColor: 'transparent', textAlign: 'right', color: 'var(--jira-text)' }}>
                            <div className="d-flex gap-2 justify-content-end">
                              <Button variant="light" size="sm" onClick={() => handleEditClick(category)} className="px-2 py-1  d-flex align-items-center" style={{ fontSize: '13px', color: '#4b5563', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                <FontAwesomeIcon icon={faPen} className="me-2" style={{ color: '#9ca3af' }} />
                                Sửa
                              </Button>
                              <Button variant="light" size="sm" onClick={() => handleDelete(category.id)} className="px-2 py-1  d-flex align-items-center" style={{ fontSize: '13px', color: '#dc3545', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
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
            </tbody>
            
          </table>
        </div>

      <div className="jira-table-footer">
        <div style={{ visibility: 'hidden' }}>
          <Button variant="light" size="sm" className="btn-create">
            <FontAwesomeIcon icon={faPlus} /> Create
          </Button>
        </div>

        {totalPages > 1 && (
          <div className="pagination-controls">
            <span className="text-muted" style={{ fontSize: '13px' }}>
              {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}
            </span>
            <button className="icon-btn" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              <FontAwesomeIcon icon={faAngleDoubleLeft} />
            </button>
            <button className="icon-btn" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <span className="text-muted px-2">{currentPage}</span>
            <button className="icon-btn" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>
              <FontAwesomeIcon icon={faAngleRight} />
            </button>
            <button className="icon-btn" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
              <FontAwesomeIcon icon={faAngleDoubleRight} />
            </button>
          </div>
        )}
      </div>
      <FloatingBulkActionBar 
        selectedCount={selectedIds.length} 
        onClearSelection={() => setSelectedIds([])} 
      />
    </div>
  );
};
