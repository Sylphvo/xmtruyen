import React, { useState, useEffect, useMemo } from 'react';
import type { ICategory } from '../types/category';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categoryApi';
import { Form, Button, Spinner, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faEllipsisH, faSortUp, faSortDown, faPlus, faTrash, faColumns } from '@fortawesome/free-solid-svg-icons';
import { ResizableHeader } from '../components/ResizableHeader';
import { ExcelActionButtons } from '../components/ExcelActionButtons';
import { FloatingBulkActionBar } from '../components/FloatingBulkActionBar';
import toast from 'react-hot-toast';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { LoadingMoreIndicator } from '../components/LoadingMoreIndicator';
import { InfiniteScrollFooter } from '../components/InfiniteScrollFooter';
import { TableSkeleton } from '../components/Skeleton/TableSkeleton';

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  key: keyof ICategory | null;
  direction: SortDirection;
}

export const Categories: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'asc' });

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newItem, setNewItem] = useState<Partial<ICategory>>({});

  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeEditField, setActiveEditField] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<ICategory>>({});
  
  const [focusedCell, setFocusedCell] = useState<{ id: number, field: string } | null>(null);

  const getCellStyle = (categoryId: number, field: string, baseStyle: React.CSSProperties = {}) => {
    const isFocused = focusedCell?.id === categoryId && focusedCell?.field === field;
    const isEditing = editingId === categoryId && activeEditField === field;
    return {
      ...baseStyle,
      outline: isFocused && !isEditing ? '2px solid #4c9aff' : 'none',
      outlineOffset: '-2px',
      borderRadius: isFocused && !isEditing ? '3px' : '0',
    };
  };

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const defaultColumnOrder = ['checkbox', 'id', 'name', 'slug', 'action'];
  const [columnOrder, setColumnOrder] = useState<string[]>(() => {
    const savedOrder = localStorage.getItem('categoriesColumnOrder');
    if (savedOrder) {
      try { return JSON.parse(savedOrder); } catch (e) { return defaultColumnOrder; }
    }
    return defaultColumnOrder;
  });

  useEffect(() => {
    localStorage.setItem('categoriesColumnOrder', JSON.stringify(columnOrder));
  }, [columnOrder]);

  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const handleColumnDragStart = (e: React.DragEvent, colId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedColumn(colId);
  };

  const handleColumnDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (colId !== draggedColumn) {
      setDragOverColumn(colId);
    }
  };

  const handleColumnDrop = (e: React.DragEvent, targetColId: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    if (!draggedColumn || draggedColumn === targetColId) return;

    if (['checkbox', 'id', 'name'].includes(targetColId)) return;
    if (['checkbox', 'id', 'name'].includes(draggedColumn)) return;

    const newOrder = [...columnOrder];
    const sourceIndex = newOrder.indexOf(draggedColumn);
    newOrder.splice(sourceIndex, 1);
    
    const targetIndex = newOrder.indexOf(targetColId);
    newOrder.splice(targetIndex, 0, draggedColumn);
    
    setColumnOrder(newOrder);
    setDraggedColumn(null);
  };

  const handleColumnDragEnd = () => {
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

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
  } = useInfiniteScroll<ICategory>({
    fetchFn: (params) => getCategories({
      page: params.page,
      pageSize: params.pageSize,
      searchKeyword: params.searchKeyword || undefined,
      sortBy: params.sortBy || undefined,
      isDescending: params.isDescending,
    }),
    pageSize: 50,
    params: { searchKeyword: debouncedSearch, sortBy: sortConfig.key, isDescending: sortConfig.direction === 'desc' }
  });

  
  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thể loại này?')) {
      try {
        await deleteCategory(id);
        toast.success('Xóa thể loại thành công');
        loadData(true);
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa thể loại');
      }
    }
  };

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
  
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key!] as any;
      const bVal = b[sortConfig.key!] as any;
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const handleCellKeyDown = (e: React.KeyboardEvent, field: string, category: ICategory) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit(category.id);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const handleCellDoubleClick = (category: ICategory, field: keyof ICategory) => {
    setEditingId(category.id);
    setActiveEditField(field);
    setEditData({ ...category });
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
      refresh();
    } catch (error: any) {
      console.error('Lỗi khi tạo category:', error);
      toast.error(error.message || 'Không thể tạo category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setActiveEditField(null);
    setEditData({});
  };

  const handleSaveEdit = async (id: number) => {
    if (activeEditField === 'name' && !editData.name) {
      toast.error('Tên thể loại là bắt buộc');
      return;
    }
    
    // Check if anything changed
    const originalCat = data.find(c => c.id === id);
    if (originalCat && originalCat.name === editData.name && originalCat.slug === editData.slug) {
      handleCancelEdit();
      return;
    }
    
    try {
      const payload: any = { name: editData.name };
      if (editData.slug && activeEditField === 'slug') payload.slug = editData.slug;
      
      await updateCategory(id, payload);
      updateItem(id, (cat) => ({ ...cat, ...payload }));
      handleCancelEdit();
      toast.success('Cập nhật thành công');
    } catch (error: any) {
      console.error('Lỗi khi cập nhật category:', error);
      toast.error(error.message || 'Không thể cập nhật category.');
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length || !window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} thể loại đã chọn?`)) return;
    const deletePromise = Promise.all(selectedIds.map(deleteCategory));
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
        await createCategory({ name });
        successCount++;
      } catch (error) {
        errorCount++;
      }
    }
    toast.dismiss(toastId);
    
    if (successCount > 0) {
      toast.success(`Nhập thành công ${successCount} thể loại`);
      refresh();
    }
    if (errorCount > 0) {
      toast.error(`Lỗi khi nhập ${errorCount} thể loại`);
    }
  };

  return (
    <div className="jira-table-container">
      <div className="d-flex justify-content-between align-items-center p-3" style={{ borderBottom: '1px solid var(--jira-border)', backgroundColor: 'var(--jira-table-bg)', borderRadius: '8px 8px 0 0' }}>
        <h5 className="mb-0 fw-semibold" style={{ color: '#172b4d', fontSize: '16px' }}>Quản lý Thể loại</h5>
        <div className="d-flex align-items-center gap-3">
          
          <Button variant="primary" size="sm" onClick={() => setIsAddingNew(true)} className="d-flex align-items-center gap-2 rounded-2">
            <FontAwesomeIcon icon={faPlus} />
            Thêm Mới
          </Button>
          
          <div style={{ width: '250px' }}>
            <Form.Control
              size="sm"
              type="text"
              className="bg-transparent text-body border-secondary-subtle"
              style={{ height: '32px', fontSize: '13px', borderRadius: '4px' }}
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="table-responsive flex-grow-1 jira-scroll" style={{ overflowY: 'auto', overflowX: 'auto' }}>
        <table className="table align-middle mb-0" style={{ borderCollapse: 'separate', borderSpacing: 0, backgroundColor: 'transparent', tableLayout: 'fixed', minWidth: '800px' }}>
          <thead className="jira-table-header" style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--jira-header-bg)' }}>
              <tr style={{ borderBottom: '1px solid var(--jira-border)' }}>
                {columnOrder.map((colId) => {
                  let initialWidth = 100;
                  let minWidth = 60;
                  let headerContent: any = null;
                  let onClick = undefined;

                  switch(colId) {
                    case 'checkbox':
                      initialWidth = 40; minWidth = 40;
                      headerContent = (
                        <Form.Check
                          type="checkbox"
                          checked={data.length > 0 && selectedIds.length === data.length}
                          ref={(input) => {
                            if (input) input.indeterminate = selectedIds.length > 0 && selectedIds.length < data.length;
                          }}
                          onChange={handleSelectAll}
                        />
                      );
                      break;
                    case 'id':
                      initialWidth = 100; onClick = () => handleSort('id');
                      headerContent = <span className="fw-semibold text-nowrap">ID {getSortIcon('id')}</span>;
                      break;
                    case 'name':
                      initialWidth = 300; onClick = () => handleSort('name');
                      headerContent = <span className="fw-semibold text-nowrap">Tên Thể Loại {getSortIcon('name')}</span>;
                      break;
                    case 'slug':
                      initialWidth = 280; onClick = () => handleSort('slug');
                      headerContent = <span className="fw-semibold text-nowrap">Slug (Đường dẫn) {getSortIcon('slug')}</span>;
                      break;
                    case 'action':
                      initialWidth = 60; minWidth = 60;
                      headerContent = <span className="fw-semibold text-nowrap"><FontAwesomeIcon icon={faColumns} className="text-muted" style={{ fontSize: '14px' }} /></span>;
                      break;
                  }
                  
                  const stickyCheckbox = colId === 'checkbox';
                  const stickyAction = colId === 'action';
                  const isDraggable = !stickyCheckbox && !stickyAction;

                  return (
                    <ResizableHeader 
                      key={colId}
                      initialWidth={initialWidth} 
                      minWidth={minWidth}
                      onClick={onClick as any}
                      style={{ 
                        borderLeft: stickyCheckbox ? 0 : undefined,
                        borderRight: stickyAction ? 0 : undefined,
                        backgroundColor: dragOverColumn === colId ? 'rgba(9, 30, 66, 0.08)' : 'var(--jira-header-bg)', 
                        padding: '10px 16px', 
                        textAlign: stickyCheckbox || stickyAction ? 'center' : 'left', 
                        color: 'var(--jira-text)',
                        cursor: !isDraggable ? 'default' : (draggedColumn === colId ? 'grabbing' : 'grab'),
                        opacity: draggedColumn === colId ? 0.5 : 1,
                        transition: 'background-color 0.2s, opacity 0.2s',
                        position: (stickyCheckbox || stickyAction) ? 'sticky' : undefined,
                        left: stickyCheckbox ? 0 : undefined,
                        right: stickyAction ? 0 : undefined,
                        zIndex: (stickyCheckbox || stickyAction) ? 20 : undefined,
                        boxShadow: stickyCheckbox ? 'inset -2px 0 4px -2px rgba(0,0,0,0.12)' : stickyAction ? 'inset 2px 0 4px -2px rgba(0,0,0,0.12)' : undefined
                      }}
                      draggable={isDraggable}
                      onDragStart={(e) => handleColumnDragStart(e, colId)}
                      onDragOver={(e) => handleColumnDragOver(e, colId)}
                      onDrop={(e) => handleColumnDrop(e, colId)}
                      onDragEnd={handleColumnDragEnd}
                    >
                      {headerContent}
                    </ResizableHeader>
                  );
                })}
              </tr>
          </thead>
          <tbody>
            {loading && !data.length ? (
              <tr>
                <td colSpan={5} style={{ borderLeft: 0, borderRight: 0, padding: 0 }}>
                  <TableSkeleton rows={15} columns={4} hasCheckbox hasActions />
                </td>
              </tr>
            ) : (
              <>
                {isAddingNew && (
                  <tr className="jira-table-row inline-edit-row" style={{ height: '46px' }}>
                    {columnOrder.map((colId) => {
                      switch (colId) {
                        case 'checkbox':
                          return <td key={colId} style={{ borderLeft: 0, padding: '12px 10px', backgroundColor: 'transparent' }}></td>;
                        case 'id':
                          return <td key={colId} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}><span className="text-muted small">Tự động</span></td>;
                        case 'name':
                          return (
                            <td key={colId} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                              <Form.Control autoFocus size="sm" value={newItem.name || ''} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} onKeyDown={(e) => { if (e.key === 'Enter') handleAddSubmit(); else if (e.key === 'Escape') handleCloseAdd(); }} placeholder="Tên thể loại" className="inline-edit-input text-body w-100" />
                            </td>
                          );
                        case 'slug':
                          return <td key={colId} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}><span className="text-muted small">Tự động tạo</span></td>;
                        case 'action':
                          return (
                            <td key={colId} style={{ borderRight: 0, padding: '12px 16px', textAlign: 'right', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                              <div className="d-flex gap-2 justify-content-end">
                                <Button variant="success" size="sm" onClick={handleAddSubmit} disabled={isSubmitting} className="px-3 rounded-2 fw-medium">Lưu</Button>
                                <Button variant="light" size="sm" onClick={handleCloseAdd} className="px-3 rounded-2 border border-secondary-subtle">Hủy</Button>
                              </div>
                            </td>
                          );
                        default:
                          return null;
                      }
                    })}
                  </tr>
                )}
                
                {sortedData.length > 0 ? (
                  sortedData.map((category) => (
                    <tr key={category.id} className="jira-table-row" style={{ height: '46px', backgroundColor: selectedIds.includes(category.id) ? '#ebf2fc' : 'transparent' }}>
                      {columnOrder.map((colId) => {
                        switch(colId) {
                          case 'checkbox':
                            return (
                              <td className="jira-sticky-left" key={colId} style={{ borderLeft: 0, padding: '5px 6px', backgroundColor: selectedIds.includes(category.id) ? 'var(--jira-selected-bg, #ebf2fc)' : 'var(--jira-table-bg, #ffffff)', textAlign: 'center', position: 'sticky', left: 0, zIndex: 2, boxShadow: 'inset -2px 0 4px -2px rgba(0,0,0,0.12)' }} onClick={(e) => e.stopPropagation()}>
                                <Form.Check
                                  type="checkbox"
                                  checked={selectedIds.includes(category.id)}
                                  onChange={() => toggleSelect(category.id)}
                                />
                              </td>
                            );
                          case 'id':
                            return (
                              <td key={colId} style={{ padding: '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                                <span className="text-muted small">{category.id}</span>
                              </td>
                            );
                          case 'name':
                            return (
                              <td key={colId}
                                onClick={() => setFocusedCell({ id: category.id, field: 'name' })}
                                style={getCellStyle(category.id, 'name', { padding: editingId === category.id && activeEditField === 'name' ? '0 16px' : '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' })}
                              >
                                <div className="d-flex align-items-center gap-3 h-100">
                                  {editingId === category.id && activeEditField === 'name' ? (
                                    <Form.Control
                                      value={editData.name || ''}
                                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                      onKeyDown={(e) => handleCellKeyDown(e, 'name', category)} 
                                      onBlur={() => handleSaveEdit(category.id)}
                                      className="cell-edit-input flex-grow-1"
                                      autoFocus
                                    />
                                  ) : (
                                    <span
                                      onDoubleClick={() => handleCellDoubleClick(category, 'name')}
                                      className="fw-medium flex-grow-1 text-truncate"
                                      style={{ cursor: 'text', color: 'var(--jira-text)' }}
                                      title={editingId === category.id ? editData.name : category.name}
                                    >
                                      {editingId === category.id ? editData.name : category.name}
                                    </span>
                                  )}
                                </div>
                              </td>
                            );
                          case 'slug':
                            return (
                              <td key={colId}
                                onClick={() => setFocusedCell({ id: category.id, field: 'slug' })}
                                style={getCellStyle(category.id, 'slug', { padding: editingId === category.id && activeEditField === 'slug' ? '0 16px' : '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' })}
                              >
                                <div className="d-flex align-items-center gap-3 h-100">
                                  {editingId === category.id && activeEditField === 'slug' ? (
                                    <Form.Control
                                      value={editData.slug || ''}
                                      onChange={(e) => setEditData({ ...editData, slug: e.target.value })}
                                      onKeyDown={(e) => handleCellKeyDown(e, 'slug', category)} 
                                      onBlur={() => handleSaveEdit(category.id)}
                                      className="cell-edit-input flex-grow-1 text-muted small"
                                      autoFocus
                                    />
                                  ) : (
                                    <span
                                      onDoubleClick={() => handleCellDoubleClick(category, 'slug')}
                                      className="text-muted small flex-grow-1 text-truncate"
                                      style={{ cursor: 'text', color: 'var(--jira-text)' }}
                                      title={editingId === category.id ? editData.slug : category.slug}
                                    >
                                      {editingId === category.id ? editData.slug : category.slug}
                                    </span>
                                  )}
                                </div>
                              </td>
                            );
                          case 'action':
                            return (
                              <td className="jira-sticky-right" key={colId} style={{ borderRight: 0, padding: '5px 6px', backgroundColor: selectedIds.includes(category.id) ? 'var(--jira-selected-bg, #ebf2fc)' : 'var(--jira-table-bg, #ffffff)', textAlign: 'center', color: 'var(--jira-text)', position: 'sticky', right: 0, zIndex: 2, boxShadow: 'inset 2px 0 4px -2px rgba(0,0,0,0.12)' }}>
                                <Dropdown className="d-inline-block">
                                  <Dropdown.Toggle variant="none" className="jira-action-toggle p-1 border-0 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'transparent', color: 'var(--jira-text)', width: '32px', height: '32px', margin: '0 auto' }}>
                                    <FontAwesomeIcon icon={faEllipsisH} />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu className="shadow-sm border-0 py-2" popperConfig={{ strategy: 'fixed' }} renderOnMount>
                                    <Dropdown.Item onClick={() => handleDelete(category.id)} className="py-2 px-3 text-danger" style={{ fontSize: '14px' }}>
                                      Xóa
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </td>
                            );
                          default:
                            return null;
                        }
                      })}
                    </tr>
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
          
        </table>
        {hasMore && <div ref={sentinelRef} className="scroll-sentinel" />}
      </div>

      <InfiniteScrollFooter
        loadedCount={loadedCount}
        totalCount={totalItems}
        onRefresh={refresh}
        onCreateClick={() => setIsAddingNew(true)}
        extraButtons={
          <ExcelActionButtons 
            dataToExport={data.map(c => ({ ID: c.id, Tên: c.name, Slug: c.slug }))}
            exportFileName="Categories"
            onImport={handleImportExcel}
            isLoading={loading}
          />
        }
      />
      <FloatingBulkActionBar 
        selectedCount={selectedIds.length} 
        onClearSelection={() => setSelectedIds([])} 
        onBulkDelete={handleBulkDelete}
      />
    </div>
  );
};
