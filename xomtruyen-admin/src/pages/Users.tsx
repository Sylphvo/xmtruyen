import React, { useState, useEffect, useCallback } from 'react';
import { Form, Spinner, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight, faPlus, faPen, faTrash, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { getUsers, updateUserStatus, createUser, updateUser, type User, type SaveUserRequest } from '../api/userApi';
import { ResizableHeader } from '../components/ResizableHeader';
import toast from 'react-hot-toast';

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  key: keyof User | null;
  direction: SortDirection;
}

export const Users: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdAt', direction: 'desc' });

  // Add User State
  const [isAddingNewUser, setIsAddingNewUser] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newUser, setNewUser] = useState<SaveUserRequest>({
    email: '',
    password: '',
    fullName: '',
    isActive: true,
    coinBalance: 0,
  });

  // Inline Editing State
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<SaveUserRequest>>({});


  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLInputElement>, saveFunc: () => void, cancelFunc?: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveFunc();
    } else if (e.key === 'Escape' && cancelFunc) {
      e.preventDefault();
      cancelFunc();
    }
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchUsersData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUsers({
        page: currentPage,
        pageSize: itemsPerPage,
        searchKeyword: debouncedSearch || undefined,
      });
      setData(response.data || []);
      setTotalItems(response.totalCount || 0);
    } catch (error) {
      console.error('Lỗi load danh sách user:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, debouncedSearch]);

  useEffect(() => {
    fetchUsersData();
  }, [fetchUsersData]);

  // Client-side Sort
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

  // Handle Sort
  const handleSort = (key: keyof User) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null; 
    }
    setSortConfig({ key: direction ? key : null, direction });
  };

  const getSortIcon = (key: keyof User) => {
    if (sortConfig.key !== key) return <FontAwesomeIcon icon={faSort} className="text-muted ms-1" style={{ fontSize: '12px' }} />;
    if (sortConfig.direction === 'asc') return <FontAwesomeIcon icon={faSortUp} className="ms-1" style={{ fontSize: '12px' }} />;
    if (sortConfig.direction === 'desc') return <FontAwesomeIcon icon={faSortDown} className="ms-1" style={{ fontSize: '12px' }} />;
    return <FontAwesomeIcon icon={faSort} className="text-muted ms-1" style={{ fontSize: '12px' }} />;
  };

  const handleStatusChange = async (id: string, currentStatus: boolean) => {
    try {
      await updateUserStatus(id, !currentStatus);
      // Update local state without reloading
      setData(prev => prev.map(u => u.id === id ? { ...u, isActive: !currentStatus } : u));
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      toast.error('Không thể cập nhật trạng thái user.');
    }
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
      await createUser(newUser);
      handleCloseAdd();
      // Reload list from page 1 to see new user (assuming they show up at top depending on sort)
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchUsersData();
      }
    } catch (error: any) {
      console.error('Lỗi khi tạo user:', error);
      toast.error(error.message || 'Không thể tạo user. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUserId(user.id);
    setEditFormData({
      email: user.email,
      fullName: user.fullName || '',
      coinBalance: user.coinBalance,
      isActive: user.isActive,
      currentPlanId: user.currentPlanId || undefined,
    });
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
      // Update local state
      setData(prev => prev.map(u => u.id === id ? { ...u, ...editFormData, fullName: editFormData.fullName || null } : u));
      setEditingUserId(null);
    } catch (error: any) {
      console.error('Lỗi khi cập nhật user:', error);
      toast.error(error.message || 'Không thể cập nhật user.');
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="card border-0 shadow-sm h-auto" style={{ backgroundColor: 'var(--bs-body-bg)' }}>
      <div className="card-header border-bottom-0 pt-4 pb-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: 'transparent' }}>
        <h5 className="mb-0 fw-semibold" style={{ color: 'var(--bs-heading-color)' }}>Quản lý User</h5>
        <Button variant="primary" size="sm" onClick={() => setIsAddingNewUser(true)} className="d-flex align-items-center gap-2 rounded-2">
          <FontAwesomeIcon icon={faPlus} />
          Thêm User
        </Button>
      </div>
      
      <div className="card-body d-flex flex-column">
        {/* Top Controls */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <Form.Select 
              size="sm" 
              className="bg-transparent text-body border-secondary-subtle"
              style={{ width: '70px' }}
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
            <span className="text-muted small">dòng / trang</span>
          </div>
          
          <div style={{ width: '250px' }}>
            <Form.Control 
              size="sm" 
              type="text" 
              className="bg-transparent text-body border-secondary-subtle"
              placeholder="Tìm kiếm Email / Tên..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive flex-grow-1" style={{ minHeight: '616px', maxHeight: '1756px', overflowY: 'auto' }}>
          <table className="table table-bordered align-middle mb-0 text-body" style={{ borderCollapse: 'collapse', backgroundColor: 'transparent', tableLayout: 'fixed', minWidth: '1300px' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--bs-body-bg)' }}>
              <tr style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                <ResizableHeader initialWidth={220} style={{ cursor: 'pointer', padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }} onClick={() => handleSort('fullName')}>
                  <span className="fw-semibold text-nowrap">Họ tên {getSortIcon('fullName')}</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={220} style={{ cursor: 'pointer', padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }} onClick={() => handleSort('email')}>
                  <span className="fw-semibold text-nowrap">Email {getSortIcon('email')}</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={100} style={{ cursor: 'pointer', padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }} onClick={() => handleSort('provider')}>
                  <span className="fw-semibold text-nowrap">Nguồn {getSortIcon('provider')}</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={100} style={{ cursor: 'pointer', padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }} onClick={() => handleSort('coinBalance')}>
                  <span className="fw-semibold text-nowrap">Xu {getSortIcon('coinBalance')}</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={120} style={{ cursor: 'pointer', padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }} onClick={() => handleSort('currentPlanId')}>
                  <span className="fw-semibold text-nowrap">Gói Cước {getSortIcon('currentPlanId')}</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={150} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }}>
                  <span className="fw-semibold text-nowrap">Lượt Đọc (Ngày/Tổng)</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={130} style={{ cursor: 'pointer', padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }} onClick={() => handleSort('createdAt')}>
                  <span className="fw-semibold text-nowrap">Ngày tham gia {getSortIcon('createdAt')}</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={120} style={{ cursor: 'pointer', padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }} onClick={() => handleSort('isActive')}>
                  <span className="fw-semibold text-nowrap">Trạng thái {getSortIcon('isActive')}</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={120} style={{ padding: '12px 16px', textAlign: 'right', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }}>
                  <span className="fw-semibold text-nowrap">Thao Tác</span>
                </ResizableHeader>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-5">
                    <Spinner animation="border" variant="secondary" size="sm" />
                    <div className="mt-2 text-muted small">Đang tải dữ liệu...</div>
                  </td>
                </tr>
              ) : (
                <>
              {isAddingNewUser && (
                <tr className="inline-edit-row" style={{ borderBottom: '1px solid var(--bs-border-color)', height: '46px' }}>
                  <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <div className="d-flex align-items-center gap-3">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.fullName || newUser.email || 'U')}&background=random`} 
                        alt="New User" 
                        className="rounded-circle"
                        style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                      />
                      <Form.Control 
                        size="sm" 
                        value={newUser.fullName || ''} 
                        onChange={(e) => setNewUser({...newUser, fullName: e.target.value})} 
                        onKeyDown={(e) => handleKeyDown(e, () => handleAddSubmit(), handleCloseAdd)}
                        placeholder="Họ tên"
                        className="inline-edit-input text-body w-100"
                        autoFocus
                      />
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <Form.Control 
                      size="sm" 
                      value={newUser.email || ''} 
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})} 
                      onKeyDown={(e) => handleKeyDown(e, () => handleAddSubmit(), handleCloseAdd)}
                      placeholder="Email"
                      className="inline-edit-input text-body w-100"
                    />
                  </td>
                  <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <span className="badge bg-light text-dark border border-secondary-subtle">Local</span>
                  </td>
                  <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <Form.Control 
                      size="sm" 
                      type="number" 
                      value={newUser.coinBalance ?? 0} 
                      onChange={(e) => setNewUser({...newUser, coinBalance: Number(e.target.value)})} 
                      onKeyDown={(e) => handleKeyDown(e, () => handleAddSubmit(), handleCloseAdd)}
                      style={{ width: '90px' }}
                      className="inline-edit-input text-warning fw-bold"
                    />
                  </td>
                  <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <span className="text-muted small">Miễn phí</span>
                  </td>
                  <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <span className="fw-medium">0</span> / <span className="text-muted small">0</span>
                  </td>
                  <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    -
                  </td>
                  <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <Form.Check 
                      type="switch"
                      id="add-status"
                      checked={newUser.isActive ?? true}
                      onChange={(e) => setNewUser({...newUser, isActive: e.target.checked})}
                      onKeyDown={(e) => handleKeyDown(e, () => handleAddSubmit(), handleCloseAdd)}
                      className="d-inline-block"
                    />
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <div className="d-flex gap-2 justify-content-end">
                      <Button variant="success" size="sm" onClick={() => handleAddSubmit()} disabled={isSubmitting} className="px-3 rounded-2 fw-medium">Lưu</Button>
                      <Button variant="light" size="sm" onClick={handleCloseAdd} className="px-3 rounded-2 border border-secondary-subtle">Hủy</Button>
                    </div>
                  </td>
                </tr>
              )}
              {sortedData.length > 0 ? (
                sortedData.map((user) => (
                  editingUserId === user.id ? (
                    <tr key={user.id} className="inline-edit-row" style={{ borderBottom: '1px solid var(--bs-border-color)', height: '46px' }}>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                        <div className="d-flex align-items-center gap-3">
                          <img 
                            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.email || 'U')}&background=random`} 
                            alt={user.fullName || 'User'} 
                            className="rounded-circle"
                            style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                          />
                          <Form.Control 
                            size="sm" 
                            value={editFormData.fullName || ''} 
                            onChange={(e) => setEditFormData({...editFormData, fullName: e.target.value})} 
                            onKeyDown={(e) => handleKeyDown(e, () => handleSaveEdit(user.id), handleCancelEdit)}
                            placeholder="Họ tên"
                            className="inline-edit-input text-body w-100"
                            autoFocus
                          />
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                        <Form.Control 
                          size="sm" 
                          value={editFormData.email || ''} 
                          onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} 
                          onKeyDown={(e) => handleKeyDown(e, () => handleSaveEdit(user.id), handleCancelEdit)}
                          placeholder="Email"
                          className="inline-edit-input text-body w-100"
                        />
                      </td>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                        <span className="badge bg-light text-dark border border-secondary-subtle">{user.provider || 'Local'}</span>
                      </td>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                        <Form.Control 
                          size="sm" 
                          type="number" 
                          value={editFormData.coinBalance ?? 0} 
                          onChange={(e) => setEditFormData({...editFormData, coinBalance: Number(e.target.value)})} 
                          onKeyDown={(e) => handleKeyDown(e, () => handleSaveEdit(user.id), handleCancelEdit)}
                          style={{ width: '90px' }}
                          className="inline-edit-input text-warning fw-bold"
                        />
                      </td>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                        {user.currentPlanName ? (
                          <span className="badge bg-info-subtle text-info border border-info-subtle px-2 py-1">{user.currentPlanName}</span>
                        ) : (
                          <span className="text-muted small">Miễn phí</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                        <span className="fw-medium">{user.dailyReadCount || 0}</span> / <span className="text-muted small">{user.totalGuestReads || 0}</span>
                      </td>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                        {formatDate(user.createdAt)}
                      </td>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                        <Form.Check 
                          type="switch"
                          id={`edit-status-${user.id}`}
                          checked={editFormData.isActive ?? true}
                          onChange={(e) => setEditFormData({...editFormData, isActive: e.target.checked})}
                          onKeyDown={(e) => handleKeyDown(e, () => handleSaveEdit(user.id), handleCancelEdit)}
                          className="d-inline-block"
                        />
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                        <div className="d-flex gap-2 justify-content-end">
                          <Button variant="success" size="sm" onClick={() => handleSaveEdit(user.id)} className="px-3 rounded-2 fw-medium">Lưu</Button>
                          <Button variant="light" size="sm" onClick={handleCancelEdit} className="px-3 rounded-2 border border-secondary-subtle">Hủy</Button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--bs-border-color)', height: '46px' }} onDoubleClick={() => handleEditClick(user)}>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                      <div className="d-flex align-items-center gap-3">
                        <img 
                          src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.email || 'U')}&background=random`} 
                          alt={user.fullName || 'User'} 
                          className="rounded-circle"
                          style={{ width: '36px', height: '36px', objectFit: 'cover' }}
                        />
                        <div className="fw-medium text-truncate" style={{ maxWidth: '200px' }}>{user.fullName || 'Chưa cập nhật'}</div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                      <div className="text-body text-truncate" style={{ maxWidth: '200px' }}>{user.email}</div>
                    </td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                      <span className="badge bg-light text-dark border border-secondary-subtle">{user.provider || 'Local'}</span>
                    </td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                      <span className="text-warning fw-bold">{user.coinBalance?.toLocaleString() || 0}</span>
                    </td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                      {user.currentPlanName ? (
                        <span className="badge bg-info-subtle text-info border border-info-subtle px-2 py-1">{user.currentPlanName}</span>
                      ) : (
                        <span className="text-muted small">Miễn phí</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                      <span className="fw-medium">{user.dailyReadCount || 0}</span> / <span className="text-muted small">{user.totalGuestReads || 0}</span>
                    </td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                      {formatDate(user.createdAt)}
                    </td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                      <div
                        className={`fw-medium d-flex align-items-center justify-content-center border-0 no-caret ${user.isActive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}
                        style={{
                          minWidth: '90px',
                          padding: '6px 12px',
                          boxShadow: 'none',
                          borderRadius: '20px',
                          gap: '8px',
                          display: 'inline-flex'
                        }}
                      >
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: user.isActive ? '#198754' : '#dc3545' }}></span>
                        {user.isActive ? 'Hoạt động' : 'Bị khóa'}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                      <div className="d-flex gap-2 justify-content-end">
                        <Button variant="light" size="sm" onClick={() => handleStatusChange(user.id, !user.isActive)} className="px-2 py-1 bg-white d-flex align-items-center" style={{ fontSize: '13px', color: '#4b5563', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                          <FontAwesomeIcon icon={faExchangeAlt} className="me-2" style={{ color: '#9ca3af' }} />
                          Change
                        </Button>
                        <Button variant="light" size="sm" onClick={() => handleEditClick(user)} className="px-2 py-1 bg-white d-flex align-items-center" style={{ fontSize: '13px', color: '#4b5563', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                          <FontAwesomeIcon icon={faPen} className="me-2" style={{ color: '#9ca3af' }} />
                          Sửa
                        </Button>
                        <Button variant="light" size="sm" onClick={() => toast.error('Chức năng đang được phát triển')} className="px-2 py-1 bg-white d-flex align-items-center" style={{ fontSize: '13px', color: '#dc3545', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
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
                  <td colSpan={9} className="text-center py-5 text-muted" style={{ backgroundColor: 'transparent' }}>
                    Không tìm thấy dữ liệu
                  </td>
                </tr>
              )}
              </>
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Controls */}
        <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top border-secondary-subtle bg-transparent">
          <div className="text-muted" style={{ fontSize: '13px' }}>
            Hiển thị {totalItems === 0 ? 0 : startIndex + 1} đến {Math.min(startIndex + itemsPerPage, totalItems)} trong {totalItems} user
          </div>
          
          {totalPages > 1 && (
            <div className="d-flex" style={{ gap: '4px' }}>
              <button
                className="btn btn-sm border-0 d-flex align-items-center justify-content-center rounded-2"
                style={{ width: '32px', height: '32px', backgroundColor: '#f4f5f8', color: currentPage === 1 ? '#a9b1c0' : '#5955D1' }}
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <FontAwesomeIcon icon={faAngleDoubleLeft} style={{ fontSize: '12px' }} />
              </button>
              <button
                className="btn btn-sm border-0 d-flex align-items-center justify-content-center rounded-2"
                style={{ width: '32px', height: '32px', backgroundColor: '#f4f5f8', color: currentPage === 1 ? '#a9b1c0' : '#5955D1' }}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <FontAwesomeIcon icon={faAngleLeft} style={{ fontSize: '12px' }} />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  className="btn btn-sm border-0 d-flex align-items-center justify-content-center rounded-2 fw-medium"
                  style={{
                    width: '32px', height: '32px', fontSize: '13px',
                    backgroundColor: i + 1 === currentPage ? '#5955D1' : '#f4f5f8',
                    color: i + 1 === currentPage ? '#fff' : '#5955D1'
                  }}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="btn btn-sm border-0 d-flex align-items-center justify-content-center rounded-2"
                style={{ width: '32px', height: '32px', backgroundColor: '#f4f5f8', color: currentPage === totalPages ? '#a9b1c0' : '#5955D1' }}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <FontAwesomeIcon icon={faAngleRight} style={{ fontSize: '12px' }} />
              </button>
              <button
                className="btn btn-sm border-0 d-flex align-items-center justify-content-center rounded-2"
                style={{ width: '32px', height: '32px', backgroundColor: '#f4f5f8', color: currentPage === totalPages ? '#a9b1c0' : '#5955D1' }}
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <FontAwesomeIcon icon={faAngleDoubleRight} style={{ fontSize: '12px' }} />
              </button>
            </div>
          )}
        </div>
      </div>

      
    </div>
  );
};
