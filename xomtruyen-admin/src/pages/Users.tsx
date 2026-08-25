import React, { useState, useEffect, useRef } from 'react';
import { Form, Spinner, Button, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faPlus, faCheckCircle, faTimes, faEllipsisH, faColumns } from '@fortawesome/free-solid-svg-icons';
import { getUsers, updateUserStatus, createUser, updateUser, type User, type SaveUserRequest } from '../api/userApi';
import { ResizableHeader } from '../components/ResizableHeader';
import { ExcelActionButtons } from '../components/ExcelActionButtons';
import { FloatingBulkActionBar } from '../components/FloatingBulkActionBar';
import { TableSkeleton } from '../components/Skeleton/TableSkeleton';
import { useSkeleton } from '../hooks/useSkeleton';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { InfiniteScrollFooter } from '../components/InfiniteScrollFooter';
import { RoleAssignmentModal } from '../components/RoleAssignmentModal';
import toast from 'react-hot-toast';

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  key: keyof User | null;
  direction: SortDirection;
}

export const Users: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdAt', direction: 'desc' });

  // Role Assignment State
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState<{ id: string, name: string } | null>(null);

  // Columns Drag & Drop State
  const initialColumns = ['checkbox', 'id', 'avatar', 'fullName', 'email', 'provider', 'coinBalance', 'currentPlanId', 'planExpiredAt', 'readCount', 'createdAt', 'role', 'status', 'action'];
  const [columnOrder, setColumnOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem('usersColumnOrder_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === initialColumns.length) return parsed;
      } catch (e) {}
    }
    return initialColumns;
  });
  
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const {
    items: data,
    totalCount: totalItems,
    isLoading,
    isLoadingMore,
    hasMore,
    loadedCount,
    sentinelRef,
    refresh,
    updateItem,
    prependItem
  } = useInfiniteScroll<User>({
    fetchFn: async (params) => {
      const res = await getUsers({
        page: params.page,
        pageSize: params.pageSize,
        searchKeyword: params.debouncedSearch || undefined,
      });
      return {
        data: res.data || [],
        totalCount: res.totalCount || 0,
        page: params.page,
        pageSize: params.pageSize
      };
    },
    pageSize: 20,
    params: { debouncedSearch, refreshTrigger }
  });

  const { showSkeleton } = useSkeleton({ isLoading });

  // Add User State
  const [isAddingNewUser, setIsAddingNewUser] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUser, setNewUser] = useState<SaveUserRequest>({
    email: '', password: '', fullName: '', isActive: true, coinBalance: 0
  });

  // Inline Editing State
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [activeEditField, setActiveEditField] = useState<string | null>(null);
  const [focusedCell, setFocusedCell] = useState<{ id: string, field: string } | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<SaveUserRequest>>({});

  // Bulk Selection State
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Drag Handlers
  const handleColumnDragStart = (e: React.DragEvent, colId: string) => {
    setDraggedColumn(colId);
    e.dataTransfer.effectAllowed = 'move';
    if (e.dataTransfer.setDragImage) {
      const crt = e.currentTarget.cloneNode(true) as HTMLElement;
      crt.style.position = 'absolute';
      crt.style.top = '-1000px';
      crt.style.opacity = '0.5';
      document.body.appendChild(crt);
      e.dataTransfer.setDragImage(crt, 0, 0);
      setTimeout(() => document.body.removeChild(crt), 0);
    }
  };

  const handleColumnDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (colId !== 'checkbox' && colId !== 'action' && colId !== draggedColumn) {
      setDragOverColumn(colId);
    }
  };

  const handleColumnDrop = (e: React.DragEvent, targetColId: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    if (!draggedColumn || targetColId === 'checkbox' || targetColId === 'action' || draggedColumn === targetColId) return;

    const newOrder = [...columnOrder];
    const draggedIndex = newOrder.indexOf(draggedColumn);
    const overIndex = newOrder.indexOf(targetColId);

    newOrder.splice(draggedIndex, 1);
    newOrder.splice(overIndex, 0, draggedColumn);

    setColumnOrder(newOrder);
    localStorage.setItem('usersColumnOrder_v4', JSON.stringify(newOrder));
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  const handleColumnDragEnd = () => {
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  // -------------------------

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key!];
      const bVal = b[sortConfig.key!];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
      if (bVal === null || bVal === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const handleSort = (key: keyof User) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    else if (sortConfig.key === key && sortConfig.direction === 'desc') direction = null;
    setSortConfig({ key: direction ? key : null, direction });
  };

  const getSortIcon = (key: keyof User) => {
    if (sortConfig.key !== key) return <FontAwesomeIcon icon={faSort} className="text-muted ms-1" style={{ fontSize: '12px' }} />;
    if (sortConfig.direction === 'asc') return <FontAwesomeIcon icon={faSortUp} className="ms-1" style={{ fontSize: '12px' }} />;
    if (sortConfig.direction === 'desc') return <FontAwesomeIcon icon={faSortDown} className="ms-1" style={{ fontSize: '12px' }} />;
    return <FontAwesomeIcon icon={faSort} className="text-muted ms-1" style={{ fontSize: '12px' }} />;
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedUserIds(sortedData.map(u => u.id));
    else setSelectedUserIds([]);
  };

  const toggleSelectUser = (id: string) => {
    setSelectedUserIds(prev => prev.includes(id) ? prev.filter(userId => userId !== id) : [...prev, id]);
  };

  useEffect(() => { setSelectedUserIds([]); }, [debouncedSearch, refreshTrigger]);

  const handleKeyDown = (e: React.KeyboardEvent<any>, saveFunc: () => void, cancelFunc?: () => void) => {
    if (e.key === 'Enter') { e.preventDefault(); saveFunc(); }
    else if (e.key === 'Escape' && cancelFunc) { e.preventDefault(); cancelFunc(); }
  };

  const handleCellKeyDown = (e: React.KeyboardEvent<any>, field: string, user: User) => {
    handleKeyDown(e, () => handleSaveEdit(user.id), handleCancelEdit);
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleCellDoubleClick = (user: User, field: string) => {
    setEditingUserId(user.id);
    setActiveEditField(field);
    setEditFormData({
      email: user.email,
      fullName: user.fullName || '',
      coinBalance: user.coinBalance,
      isActive: user.isActive,
      currentPlanId: user.currentPlanId || undefined,
      planExpiredAt: user.planExpiredAt || undefined,
    });
  };

  const getCellStyle = (userId: string, field: string, defaultStyle: React.CSSProperties) => {
    if (focusedCell?.id === userId && focusedCell?.field === field && editingUserId !== userId) {
      return { ...defaultStyle, border: '2px solid #388bff', padding: '3px 4px' };
    }
    return defaultStyle;
  };

  const handleCloseAdd = () => {
    setIsAddingNewUser(false);
    setNewUser({ email: '', password: '', fullName: '', isActive: true, coinBalance: 0 });
  };

  const handleAddSubmit = async (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (!newUser.email) {
      toast.error('Email là bắt buộc');
      return;
    }

    setIsSubmitting(true);
    try {
      const createdUser = await createUser(newUser);
      prependItem(createdUser);
      handleCloseAdd();
    } catch (error: any) {
      console.error('Lỗi khi tạo user:', error);
      toast.error(error.message || 'Không thể tạo user. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditFormData({});
  };

  const handleSaveEdit = async (id: string) => {
    if (!editFormData.email) {
      toast.error('Email là bắt buộc');
      return;
    }
    try {
      await updateUser(id, editFormData as SaveUserRequest);
      updateItem(id, (prev) => ({ ...prev, ...editFormData, fullName: editFormData.fullName || null }) as any);
      setEditingUserId(null);
    } catch (error: any) {
      console.error('Lỗi khi cập nhật user:', error);
      toast.error(error.message || 'Không thể cập nhật user.');
    }
  };

  const handleStatusChange = async (id: string, currentStatus: boolean) => {
    try {
      await updateUserStatus(id, !currentStatus);
      updateItem(id, (prev) => ({ ...prev, isActive: !currentStatus }) as any);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      toast.error('Không thể cập nhật trạng thái user.');
    }
  };

  const handleImportExcel = async (importedData: any[]) => {
    let successCount = 0;
    let errorCount = 0;

    for (const row of importedData) {
      const email = row.email || row.Email || row['Email'];
      const fullName = row.fullName || row.FullName || row['Họ tên'];
      const password = row.password || row.Password || '123456';

      if (!email || !fullName) continue;

      try {
        await createUser({
          email,
          fullName,
          password: password,
          isActive: true,
          coinBalance: 0
        });
        successCount++;
      } catch (error) {
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`Nhập thành công ${successCount} user`);
      setRefreshTrigger(prev => prev + 1);
    }
    if (errorCount > 0) {
      toast.error(`Lỗi khi nhập ${errorCount} user (có thể email đã tồn tại)`);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <>
      <div className="jira-table-container" style={{ position: 'relative', opacity: selectedUserIds.length > 0 ? 0.5 : 1, transition: 'opacity 0.15s ease', pointerEvents: selectedUserIds.length > 0 ? 'none' : undefined }}>
        {/* Custom Header for search and filters */}
        <div className="d-flex justify-content-between align-items-center p-3" style={{ borderBottom: '1px solid var(--jira-border)' }}>
          <h5 className="mb-0 fw-semibold" style={{ color: '#172b4d', fontSize: '16px' }}>Quản lý Người dùng</h5>
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: '250px' }}>
              <Form.Control
                size="sm"
                type="text"
                className="bg-transparent text-body border-secondary-subtle"
                placeholder="Tìm kiếm Email / Tên..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
            </div>
            <ExcelActionButtons
              dataToExport={data.map(u => ({
                'ID': u.id,
                'Họ tên': u.fullName,
                'Email': u.email,
                'Nguồn': u.provider,
                'Xu': u.coinBalance,
                'Trạng thái': u.isActive ? 'Hoạt động' : 'Bị khóa'
              }))}
              exportFileName="Users"
              onImport={handleImportExcel}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Table Area */}
        <div className="table-responsive jira-scroll" style={{ overflowX: 'auto', overflowY: 'auto' }}>
          <table className="table align-middle mb-0" style={{ borderCollapse: 'separate', borderSpacing: 0, backgroundColor: 'transparent', tableLayout: 'fixed', minWidth: '1700px' }}>
            <thead className="jira-table-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                {columnOrder.map((colId) => {
                  let headerContent = null;
                  let initialWidth = 150;
                  let minWidth: number | undefined = undefined;
                  let onClick = undefined;

                  switch(colId) {
                    case 'checkbox':
                      initialWidth = 40; minWidth = 40;
                      headerContent = (
                        <Form.Check
                          type="checkbox"
                          checked={sortedData.length > 0 && selectedUserIds.length === sortedData.length}
                          ref={(input) => {
                            if (input) {
                              input.indeterminate = selectedUserIds.length > 0 && selectedUserIds.length < sortedData.length;
                            }
                          }}
                          onChange={handleSelectAll}
                        />
                      );
                      break;
                    case 'id':
                      initialWidth = 150; onClick = () => handleSort('id' as keyof User);
                      headerContent = <span className="fw-semibold text-nowrap">ID {getSortIcon('id' as keyof User)}</span>;
                      break;
                    case 'avatar':
                      initialWidth = 70; minWidth = 70;
                      headerContent = <span className="fw-semibold text-nowrap">Avatar</span>;
                      break;
                    case 'fullName':
                      initialWidth = 260; onClick = () => handleSort('fullName');
                      headerContent = <span className="fw-semibold text-nowrap">Họ tên {getSortIcon('fullName')}</span>;
                      break;
                    case 'email':
                      initialWidth = 260; onClick = () => handleSort('email');
                      headerContent = <span className="fw-semibold text-nowrap">Email {getSortIcon('email')}</span>;
                      break;
                    case 'provider':
                      initialWidth = 130; onClick = () => handleSort('provider');
                      headerContent = <span className="fw-semibold text-nowrap">Nguồn {getSortIcon('provider')}</span>;
                      break;
                    case 'coinBalance':
                      initialWidth = 120; onClick = () => handleSort('coinBalance');
                      headerContent = <span className="fw-semibold text-nowrap">Xu {getSortIcon('coinBalance')}</span>;
                      break;
                    case 'currentPlanId':
                      initialWidth = 140; onClick = () => handleSort('currentPlanId');
                      headerContent = <span className="fw-semibold text-nowrap">Gói Cước {getSortIcon('currentPlanId')}</span>;
                      break;
                    case 'planExpiredAt':
                      initialWidth = 150; onClick = () => handleSort('planExpiredAt');
                      headerContent = <span className="fw-semibold text-nowrap">Hạn Gói {getSortIcon('planExpiredAt')}</span>;
                      break;
                    case 'readCount':
                      initialWidth = 150;
                      headerContent = <span className="fw-semibold text-nowrap">Lượt Đọc</span>;
                      break;
                    case 'createdAt':
                      initialWidth = 150; onClick = () => handleSort('createdAt');
                      headerContent = <span className="fw-semibold text-nowrap">Tham gia {getSortIcon('createdAt')}</span>;
                      break;
                    case 'role':
                      initialWidth = 120; onClick = () => handleSort('role' as any);
                      headerContent = <span className="fw-semibold text-nowrap">Quyền {getSortIcon('role' as any)}</span>;
                      break;
                    case 'status':
                      initialWidth = 130; onClick = () => handleSort('isActive');
                      headerContent = <span className="fw-semibold text-nowrap">Status {getSortIcon('isActive')}</span>;
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
                      onClick={onClick}
                      style={{ 
                        borderLeft: stickyCheckbox ? 0 : undefined,
                        borderRight: stickyAction ? 0 : undefined,
                        backgroundColor: dragOverColumn === colId ? 'rgba(9, 30, 66, 0.08)' : 'var(--jira-header-bg)', 
                        padding: '5px 6px', 
                        textAlign: ['coinBalance', 'readCount'].includes(colId) ? 'right' : 'center', 
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
              <>
                {isAddingNewUser && (
                  <tr className="inline-edit-row" style={{ backgroundColor: 'var(--jira-table-bg)' }}>
                    {columnOrder.map((colId) => {
                      switch(colId) {
                        case 'checkbox':
                          return (
                            <td className="jira-sticky-left" key={colId} style={{ borderLeft: 0, padding: '5px 6px', backgroundColor: 'var(--jira-table-bg, #ffffff)', textAlign: 'center', position: 'sticky', left: 0, zIndex: 2, boxShadow: 'inset -2px 0 4px -2px rgba(0,0,0,0.12)' }}></td>
                          );
                        case 'id':
                          return (
                            <td key={colId} style={{ padding: '5px 6px' }}>
                              <span className="text-muted small">Tự động</span>
                            </td>
                          );
                        case 'avatar':
                          return (
                            <td key={colId} style={{ padding: '5px 6px', textAlign: 'center' }}>
                              <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.fullName || newUser.email || 'U')}&background=random`}
                                alt="New User"
                                className="rounded-circle"
                                style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                              />
                            </td>
                          );
                        case 'fullName':
                          return (
                            <td key={colId} style={{ padding: '5px 6px' }}>
                              <Form.Control size="sm" value={newUser.fullName || ''} onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })} onKeyDown={(e) => handleKeyDown(e, () => handleAddSubmit(), handleCloseAdd)} placeholder="Họ tên" className="cell-edit-input flex-grow-1" autoFocus />
                            </td>
                          );
                        case 'email':
                          return (
                            <td key={colId} style={{ padding: '5px 6px' }}>
                              <Form.Control size="sm" value={newUser.email || ''} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} onKeyDown={(e) => handleKeyDown(e, () => handleAddSubmit(), handleCloseAdd)} placeholder="Email" className="cell-edit-input flex-grow-1" />
                            </td>
                          );
                        case 'provider':
                          return (
                            <td key={colId} style={{ padding: '5px 6px', textAlign: 'center' }}>
                              <span className="jira-status-toggle no-arrow" style={{ display: 'inline-block', cursor: 'default' }}>Local</span>
                            </td>
                          );
                        case 'coinBalance':
                          return (
                            <td key={colId} style={{ padding: '5px 6px', textAlign: 'right' }}>
                              <Form.Control size="sm" type="number" value={newUser.coinBalance ?? 0} onChange={(e) => setNewUser({ ...newUser, coinBalance: Number(e.target.value) })} onKeyDown={(e) => handleKeyDown(e, () => handleAddSubmit(), handleCloseAdd)} className="cell-edit-input text-warning fw-bold w-100 text-end" />
                            </td>
                          );
                        case 'currentPlanId':
                          return (
                            <td key={colId} style={{ padding: '5px 6px' }}>
                              <span className="text-muted small">Miễn phí</span>
                            </td>
                          );
                        case 'planExpiredAt':
                          return (
                            <td key={colId} style={{ padding: '5px 6px' }}>
                              <Form.Control size="sm" type="date" value={newUser.planExpiredAt || ''} onChange={(e) => setNewUser({ ...newUser, planExpiredAt: e.target.value })} onKeyDown={(e) => handleKeyDown(e, () => handleAddSubmit(), handleCloseAdd)} className="cell-edit-input flex-grow-1" />
                            </td>
                          );
                        case 'readCount':
                          return (
                            <td key={colId} style={{ padding: '5px 6px', textAlign: 'right' }}>-</td>
                          );
                        case 'createdAt':
                          return (
                            <td key={colId} style={{ padding: '5px 6px' }}>-</td>
                          );
                        case 'role':
                          return (
                            <td key={colId} style={{ padding: '5px 6px' }}>-</td>
                          );
                        case 'status':
                          return (
                            <td key={colId} style={{ padding: '5px 6px', textAlign: 'center' }}>
                              <Form.Check type="switch" checked={newUser.isActive ?? true} onChange={(e) => setNewUser({ ...newUser, isActive: e.target.checked })} onKeyDown={(e) => handleKeyDown(e, () => handleAddSubmit(), handleCloseAdd)} className="d-inline-block" />
                            </td>
                          );
                        case 'action':
                          return (
                            <td className="jira-sticky-right" key={colId} style={{ borderRight: 0, padding: '5px 6px', textAlign: 'center', backgroundColor: 'var(--jira-table-bg, #ffffff)', position: 'sticky', right: 0, zIndex: 5, boxShadow: 'inset 2px 0 4px -2px rgba(0,0,0,0.12)' }}>
                              <div className="d-flex gap-2 justify-content-center">
                                <Button variant="light" size="sm" onClick={() => handleAddSubmit()} disabled={isSubmitting} className="px-2 py-1  d-flex align-items-center" style={{ fontSize: '13px', color: '#198754', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                                  <FontAwesomeIcon icon={faCheckCircle} />
                                </Button>
                                <Button variant="light" size="sm" onClick={handleCloseAdd} className="px-2 py-1  d-flex align-items-center" style={{ fontSize: '13px', color: '#6c757d', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                                  <FontAwesomeIcon icon={faTimes} />
                                </Button>
                              </div>
                            </td>
                          );
                        default:
                          return null;
                      }
                    })}
                  </tr>
                )}

                {showSkeleton ? (
                  <tr>
                    <td colSpan={11} style={{ borderLeft: 0, borderRight: 0, padding: 0 }}>
                      <TableSkeleton columns={11} rows={15} hasCheckbox hasActions />
                    </td>
                  </tr>
                ) : sortedData.length > 0 ? (
                  sortedData.map((user) => (
                    <tr key={user.id} className={`jira-table-row${selectedUserIds.includes(user.id) ? ' jira-row-selected' : ''}`} style={{ height: '46px', backgroundColor: selectedUserIds.includes(user.id) ? '#ebf2fc' : 'transparent' }}>
                      {columnOrder.map((colId) => {
                        switch(colId) {
                          case 'checkbox':
                            return (
                              <td className="jira-sticky-left" key={colId} style={{ borderLeft: 0, padding: '5px 6px', backgroundColor: selectedUserIds.includes(user.id) ? 'var(--jira-selected-bg, #ebf2fc)' : 'var(--jira-table-bg, #ffffff)', textAlign: 'center', position: 'sticky', left: 0, zIndex: 2, boxShadow: 'inset -2px 0 4px -2px rgba(0,0,0,0.12)' }} onClick={(e) => e.stopPropagation()}>
                                <Form.Check type="checkbox" checked={selectedUserIds.includes(user.id)} onChange={() => toggleSelectUser(user.id)} />
                              </td>
                            );
                          case 'id':
                            return (
                              <td key={colId} onClick={() => setFocusedCell({ id: user.id, field: 'id' })} style={getCellStyle(user.id, 'id', { padding: '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' })}>
                                <span className="text-muted small text-truncate d-block w-100" title={user.id}>
                                  {user.shortId || user.id.substring(0, 8)}
                                </span>
                              </td>
                            );
                          case 'avatar':
                            return (
                              <td key={colId} style={{ padding: '5px 6px', textAlign: 'center' }}>
                                <img
                                  src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.email || 'U')}&background=random`}
                                  alt={user.fullName || 'User'}
                                  className="rounded-circle"
                                  style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                                />
                              </td>
                            );
                          case 'fullName':
                            return (
                              <td key={colId} onClick={() => setFocusedCell({ id: user.id, field: 'fullName' })} style={getCellStyle(user.id, 'fullName', { padding: editingUserId === user.id && activeEditField === 'fullName' ? '0 16px' : '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' })}>
                                {editingUserId === user.id && activeEditField === 'fullName' ? (
                                  <Form.Control value={editFormData.fullName || ''} onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })} onKeyDown={(e) => handleCellKeyDown(e, 'fullName', user)} onBlur={() => handleSaveEdit(user.id)} className="cell-edit-input flex-grow-1 w-100" autoFocus />
                                ) : (
                                  <span onDoubleClick={() => handleCellDoubleClick(user, 'fullName')} className="fw-medium flex-grow-1 text-truncate d-block w-100" style={{ cursor: 'text', color: 'var(--jira-text)' }} title={user.fullName || 'Chưa cập nhật'}>
                                    {user.fullName || 'Chưa cập nhật'}
                                  </span>
                                )}
                              </td>
                            );
                          case 'email':
                            return (
                              <td key={colId} onClick={() => setFocusedCell({ id: user.id, field: 'email' })} style={getCellStyle(user.id, 'email', { padding: editingUserId === user.id && activeEditField === 'email' ? '0 16px' : '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' })}>
                                {editingUserId === user.id && activeEditField === 'email' ? (
                                  <Form.Control value={editFormData.email || ''} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} onKeyDown={(e) => handleCellKeyDown(e, 'email', user)} onBlur={() => handleSaveEdit(user.id)} className="cell-edit-input flex-grow-1 w-100" autoFocus />
                                ) : (
                                  <span onDoubleClick={() => handleCellDoubleClick(user, 'email')} className="text-body flex-grow-1 text-truncate d-block" style={{ cursor: 'text', color: 'var(--jira-text)', maxWidth: '200px' }} title={user.email}>
                                    {user.email}
                                  </span>
                                )}
                              </td>
                            );
                          case 'provider':
                            return (
                              <td key={colId} style={{ padding: '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)', textAlign: 'center' }}>
                                <span className="jira-status-toggle no-arrow" style={{ display: 'inline-block', cursor: 'default' }}>{user.provider || 'Local'}</span>
                              </td>
                            );
                          case 'coinBalance':
                            return (
                              <td key={colId} onClick={() => setFocusedCell({ id: user.id, field: 'coinBalance' })} style={getCellStyle(user.id, 'coinBalance', { padding: editingUserId === user.id && activeEditField === 'coinBalance' ? '0 16px' : '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)', textAlign: 'right' })}>
                                {editingUserId === user.id && activeEditField === 'coinBalance' ? (
                                  <Form.Control type="number" value={editFormData.coinBalance ?? 0} onChange={(e) => setEditFormData({ ...editFormData, coinBalance: Number(e.target.value) })} onKeyDown={(e) => handleCellKeyDown(e, 'coinBalance', user)} onBlur={() => handleSaveEdit(user.id)} className="cell-edit-input flex-grow-1 text-warning fw-bold w-100 text-end" autoFocus />
                                ) : (
                                  <span onDoubleClick={() => handleCellDoubleClick(user, 'coinBalance')} className="text-warning fw-bold d-block w-100 text-end" style={{ cursor: 'text' }}>
                                    {user.coinBalance?.toLocaleString() || 0}
                                  </span>
                                )}
                              </td>
                            );
                          case 'currentPlanId':
                            return (
                              <td key={colId} style={{ padding: '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                                {user.currentPlanName ? (
                                  <span className="badge bg-info-subtle text-info border border-info-subtle px-2 py-1">{user.currentPlanName}</span>
                                ) : (
                                  <span className="text-muted small">Miễn phí</span>
                                )}
                              </td>
                            );
                          case 'planExpiredAt':
                            return (
                              <td key={colId} onClick={() => setFocusedCell({ id: user.id, field: 'planExpiredAt' })} style={getCellStyle(user.id, 'planExpiredAt', { padding: editingUserId === user.id && activeEditField === 'planExpiredAt' ? '0 16px' : '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' })}>
                                {editingUserId === user.id && activeEditField === 'planExpiredAt' ? (
                                  <Form.Control type="date" value={editFormData.planExpiredAt ? new Date(editFormData.planExpiredAt).toISOString().split('T')[0] : ''} onChange={(e) => setEditFormData({ ...editFormData, planExpiredAt: e.target.value })} onKeyDown={(e) => handleCellKeyDown(e, 'planExpiredAt', user)} onBlur={() => handleSaveEdit(user.id)} className="cell-edit-input flex-grow-1 w-100" autoFocus />
                                ) : (
                                  <span onDoubleClick={() => handleCellDoubleClick(user, 'planExpiredAt')} className="d-block small text-muted" style={{ cursor: 'text' }}>
                                    {formatDate(user.planExpiredAt)}
                                  </span>
                                )}
                              </td>
                            );
                          case 'readCount':
                            return (
                              <td key={colId} style={{ padding: '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)', textAlign: 'right' }}>
                                <span className="fw-medium">{user.dailyReadCount || 0}</span> / <span className="text-muted small">{user.totalGuestReads || 0}</span>
                              </td>
                            );
                          case 'createdAt':
                            return (
                              <td key={colId} style={{ padding: '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                                <span className="d-block small text-muted">{formatDate(user.createdAt)}</span>
                              </td>
                            );
                          case 'role':
                            return (
                              <td key={colId} style={{ padding: '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)', textAlign: 'center' }}>
                                <span className="jira-status-toggle no-arrow" style={{ display: 'inline-block', cursor: 'pointer' }} onClick={() => { setSelectedUserForRole({ id: user.id, name: user.fullName || user.email }); setRoleModalVisible(true); }}>
                                  {user.role || 'User'}
                                </span>
                              </td>
                            );
                          case 'status':
                            return (
                              <td key={colId} style={{ padding: '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                                <Dropdown className="d-inline-block w-100 text-center">
                                  <Dropdown.Toggle variant="none" className="jira-status-toggle">
                                    {user.isActive ? 'Hoạt động' : 'Bị khóa'}
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu className="jira-status-menu" popperConfig={{ strategy: 'fixed' }} renderOnMount>
                                    <Dropdown.Item className="jira-status-item" active={user.isActive} onClick={() => handleStatusChange(user.id, false)}>
                                      Hoạt động
                                    </Dropdown.Item>
                                    <Dropdown.Item className="jira-status-item" active={!user.isActive} onClick={() => handleStatusChange(user.id, true)}>
                                      Bị khóa
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </td>
                            );
                          case 'action':
                            return (
                              <td className="jira-sticky-right" key={colId} style={{ borderRight: 0, padding: '5px 6px', backgroundColor: selectedUserIds.includes(user.id) ? 'var(--jira-selected-bg, #ebf2fc)' : 'var(--jira-table-bg, #ffffff)', textAlign: 'center', color: 'var(--jira-text)', position: 'sticky', right: 0, zIndex: 2, boxShadow: 'inset 2px 0 4px -2px rgba(0,0,0,0.12)' }}>
                                {editingUserId === user.id ? (
                                  <div className="d-flex gap-2 justify-content-center">
                                    <Button variant="light" size="sm" onClick={() => handleSaveEdit(user.id)} className="px-2 py-1  d-flex align-items-center" style={{ fontSize: '13px', color: '#198754', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                                      <FontAwesomeIcon icon={faCheckCircle} />
                                    </Button>
                                    <Button variant="light" size="sm" onClick={handleCancelEdit} className="px-2 py-1  d-flex align-items-center" style={{ fontSize: '13px', color: '#6c757d', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                                      <FontAwesomeIcon icon={faTimes} />
                                    </Button>
                                  </div>
                                ) : (
                                  <Dropdown className="d-inline-block">
                                    <Dropdown.Toggle variant="none" className="jira-action-toggle p-1 border-0 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'transparent', color: 'var(--jira-text)', width: '32px', height: '32px', margin: '0 auto' }}>
                                      <FontAwesomeIcon icon={faEllipsisH} />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu className="shadow-sm border-0 py-2" popperConfig={{ strategy: 'fixed' }} renderOnMount>
                                      <Dropdown.Item onClick={() => toast.error('Chức năng đang phát triển')} className="py-2 px-3 text-body" style={{ fontSize: '14px' }}>
                                        Xem hồ sơ
                                      </Dropdown.Item>
                                      <Dropdown.Divider />
                                      <Dropdown.Item onClick={() => toast.error('Chức năng đang phát triển')} className="py-2 px-3 text-danger" style={{ fontSize: '14px' }}>
                                        Xóa người dùng
                                      </Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                )}
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
                    <td colSpan={11} style={{ borderLeft: 0, borderRight: 0, padding: 0 }}>
                      <div className="jira-empty-state">
                        <img src="/empty-state.svg" alt="No data" style={{ width: '120px', marginBottom: '20px', opacity: 0.5 }} onError={(e) => e.currentTarget.style.display = 'none'} />
                        <h4>There are no work items here yet</h4>
                        <p>We couldn't find any data matching your criteria. Try adjusting your filters or search terms.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
              <tr ref={sentinelRef} style={{ height: '1px', visibility: 'hidden' }}>
                <td colSpan={11}></td>
              </tr>
            </tbody>
          </table>
        </div>

        <InfiniteScrollFooter
          loadedCount={loadedCount}
          totalCount={totalItems}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          onCreateClick={() => setIsAddingNewUser(true)}
          showCreate={true}
        />
      </div>

      <FloatingBulkActionBar 
        selectedCount={selectedUserIds.length} 
        onClearSelection={() => setSelectedUserIds([])} 
      />

      {selectedUserForRole && (
        <RoleAssignmentModal
          show={roleModalVisible}
          userId={selectedUserForRole.id}
          userName={selectedUserForRole.name}
          onClose={() => setRoleModalVisible(false)}
          onSuccess={() => {
            setRoleModalVisible(false);
            refresh();
          }}
        />
      )}
    </>
  );
};
