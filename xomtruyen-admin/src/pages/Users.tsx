import React, { useState, useEffect, useCallback } from 'react';
import { Dropdown, Form, Spinner, Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faSort, faSortUp, faSortDown, faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight, faPlus } from '@fortawesome/free-solid-svg-icons';
import { getUsers, updateUserStatus, createUser, updateUser, type User, type SaveUserRequest } from '../api/userApi';


type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  key: keyof User | null;
  direction: SortDirection;
}

const CustomToggle = React.forwardRef(({ children, onClick }: any, ref: any) => (
  <button
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    className="btn btn-sm border border-secondary-subtle rounded-2 px-2 py-1 bg-transparent"
    style={{ boxShadow: 'none' }}
  >
    {children}
  </button>
));

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
  const [showAddModal, setShowAddModal] = useState(false);
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
      alert('Không thể cập nhật trạng thái user.');
    }
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewUser({ email: '', password: '', fullName: '', isActive: true, coinBalance: 0 });
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email) return;
    
    setIsSubmitting(true);
    try {
      await createUser(newUser);
      handleCloseAddModal();
      // Reload list from page 1 to see new user (assuming they show up at top depending on sort)
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchUsersData();
      }
    } catch (error: any) {
      console.error('Lỗi khi tạo user:', error);
      alert(error.message || 'Không thể tạo user. Vui lòng kiểm tra lại thông tin.');
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
      alert('Email là bắt buộc');
      return;
    }
    try {
      await updateUser(id, editFormData as SaveUserRequest);
      // Update local state
      setData(prev => prev.map(u => u.id === id ? { ...u, ...editFormData, fullName: editFormData.fullName || null } : u));
      setEditingUserId(null);
    } catch (error: any) {
      console.error('Lỗi khi cập nhật user:', error);
      alert(error.message || 'Không thể cập nhật user.');
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
        <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)} className="d-flex align-items-center gap-2 rounded-2">
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
          <table className="table table-bordered align-middle mb-0 text-body" style={{ borderCollapse: 'collapse', backgroundColor: 'transparent' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--bs-body-bg)' }}>
              <tr style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                <th style={{ cursor: 'pointer', padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }} onClick={() => handleSort('fullName')}>
                  <span className="fw-semibold text-nowrap">Họ tên {getSortIcon('fullName')}</span>
                </th>
                <th style={{ cursor: 'pointer', padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }} onClick={() => handleSort('email')}>
                  <span className="fw-semibold text-nowrap">Email {getSortIcon('email')}</span>
                </th>
                <th style={{ cursor: 'pointer', padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }} onClick={() => handleSort('provider')}>
                  <span className="fw-semibold text-nowrap">Provider {getSortIcon('provider')}</span>
                </th>
                <th style={{ cursor: 'pointer', padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }} onClick={() => handleSort('coinBalance')}>
                  <span className="fw-semibold text-nowrap">Xu {getSortIcon('coinBalance')}</span>
                </th>
                <th style={{ cursor: 'pointer', padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }} onClick={() => handleSort('currentPlanId')}>
                  <span className="fw-semibold text-nowrap">Plan {getSortIcon('currentPlanId')}</span>
                </th>
                <th style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }}>
                  <span className="fw-semibold text-nowrap">Reads (Daily/Total)</span>
                </th>
                <th style={{ cursor: 'pointer', padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }} onClick={() => handleSort('createdAt')}>
                  <span className="fw-semibold text-nowrap">Ngày tham gia {getSortIcon('createdAt')}</span>
                </th>
                <th style={{ cursor: 'pointer', padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }} onClick={() => handleSort('isActive')}>
                  <span className="fw-semibold text-nowrap">Trạng thái {getSortIcon('isActive')}</span>
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }}>
                  <span className="fw-semibold text-nowrap">Action</span>
                </th>
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
              ) : sortedData.length > 0 ? (
                sortedData.map((user) => (
                  editingUserId === user.id ? (
                    <tr key={user.id} style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
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
                            placeholder="Họ tên"
                            className="bg-transparent text-body border-secondary-subtle"
                          />
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                        <Form.Control 
                          size="sm" 
                          value={editFormData.email || ''} 
                          onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} 
                          placeholder="Email"
                          className="bg-transparent text-body border-secondary-subtle"
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
                          style={{ width: '90px' }}
                          className="bg-transparent text-warning fw-bold border-secondary-subtle"
                        />
                      </td>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                        {user.currentPlanName ? (
                          <span className="badge bg-info-subtle text-info border border-info-subtle px-2 py-1">{user.currentPlanName}</span>
                        ) : (
                          <span className="text-muted small">Free</span>
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
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
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
                        <span className="text-muted small">Free</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                      <span className="fw-medium">{user.dailyReadCount || 0}</span> / <span className="text-muted small">{user.totalGuestReads || 0}</span>
                    </td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                      {formatDate(user.createdAt)}
                    </td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                      <Dropdown>
                        <Dropdown.Toggle 
                          variant="none" 
                          size="sm" 
                          className={`fw-medium d-flex align-items-center justify-content-between ${user.isActive ? 'bg-success-subtle text-success border-0' : 'bg-danger-subtle text-danger border-0'}`}
                          style={{ 
                            minWidth: '90px',
                            padding: '6px 12px',
                            boxShadow: 'none'
                          }}
                        >
                          {user.isActive ? 'Active' : 'Locked'}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="shadow-sm border border-secondary-subtle py-2" style={{ backgroundColor: 'var(--bs-body-bg)' }}>
                          <Dropdown.Item 
                            onClick={() => handleStatusChange(user.id, user.isActive)}
                            className="text-body py-2 px-3 hover-bg-subtle"
                            style={{ fontSize: '14px', backgroundColor: 'transparent' }}
                          >
                            {user.isActive ? 'Khóa tài khoản' : 'Mở khóa'}
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                      <Dropdown align="end">
                        <Dropdown.Toggle as={CustomToggle}>
                          <FontAwesomeIcon icon={faEllipsisH} className="text-muted" />
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="shadow-sm border border-secondary-subtle py-2" style={{ backgroundColor: 'var(--bs-body-bg)', minWidth: '120px' }}>
                          <Dropdown.Item 
                            onClick={() => handleEditClick(user)} 
                            className="text-body py-2 px-3 hover-bg-subtle" 
                            style={{ fontSize: '14px', backgroundColor: 'transparent', cursor: 'pointer' }}
                          >
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item href="#" className="text-danger py-2 px-3 hover-bg-subtle" style={{ fontSize: '14px', backgroundColor: 'transparent' }}>
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
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
                className="btn btn-sm border-0 d-flex align-items-center justify-content-center rounded-2 btn-light" 
                style={{ width: '32px', height: '32px' }}
                onClick={() => setCurrentPage(1)} 
                disabled={currentPage === 1}
              >
                <FontAwesomeIcon icon={faAngleDoubleLeft} style={{ fontSize: '12px' }} />
              </button>
              <button 
                className="btn btn-sm border-0 d-flex align-items-center justify-content-center rounded-2 btn-light" 
                style={{ width: '32px', height: '32px' }}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                disabled={currentPage === 1}
              >
                <FontAwesomeIcon icon={faAngleLeft} style={{ fontSize: '12px' }} />
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => i + 1)
                .filter(page => page === 1 || page === totalPages || Math.abs(currentPage - page) <= 1)
                .map((page, i, arr) => (
                  <React.Fragment key={page}>
                    {i > 0 && arr[i - 1] !== page - 1 && (
                      <span className="d-flex align-items-center justify-content-center px-1 text-muted">...</span>
                    )}
                    <button 
                      className={`btn btn-sm border-0 d-flex align-items-center justify-content-center rounded-2 fw-medium ${page === currentPage ? 'btn-primary' : 'btn-light'}`} 
                      style={{ width: '32px', height: '32px', fontSize: '13px' }}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                ))}
              
              <button 
                className="btn btn-sm border-0 d-flex align-items-center justify-content-center rounded-2 btn-light" 
                style={{ width: '32px', height: '32px' }}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                disabled={currentPage === totalPages}
              >
                <FontAwesomeIcon icon={faAngleRight} style={{ fontSize: '12px' }} />
              </button>
              <button 
                className="btn btn-sm border-0 d-flex align-items-center justify-content-center rounded-2 btn-light" 
                style={{ width: '32px', height: '32px' }}
                onClick={() => setCurrentPage(totalPages)} 
                disabled={currentPage === totalPages}
              >
                <FontAwesomeIcon icon={faAngleDoubleRight} style={{ fontSize: '12px' }} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Thêm User */}
      <Modal show={showAddModal} onHide={handleCloseAddModal} centered backdrop="static" contentClassName="bg-body border-0 shadow">
        <Modal.Header closeButton className="border-bottom-0 pb-0">
          <Modal.Title className="fs-5 fw-semibold text-body">Thêm User Mới</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-medium text-body">Email <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="email" 
                required 
                placeholder="name@example.com"
                className="bg-transparent text-body border-secondary-subtle"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="small fw-medium text-body">Mật khẩu</Form.Label>
              <Form.Control 
                type="password" 
                placeholder="Nhập mật khẩu (tùy chọn)"
                className="bg-transparent text-body border-secondary-subtle"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              />
              <Form.Text className="text-muted small">Để trống nếu chưa cần thiết lập mật khẩu.</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-medium text-body">Họ tên</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Nguyễn Văn A"
                className="bg-transparent text-body border-secondary-subtle"
                value={newUser.fullName}
                onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
              />
            </Form.Group>

            <div className="d-flex gap-3 mb-2">
              <Form.Group className="flex-grow-1">
                <Form.Label className="small fw-medium text-body">Số dư xu</Form.Label>
                <Form.Control 
                  type="number" 
                  min="0"
                  className="bg-transparent text-body border-secondary-subtle"
                  value={newUser.coinBalance}
                  onChange={(e) => setNewUser({...newUser, coinBalance: Number(e.target.value)})}
                />
              </Form.Group>

              <Form.Group className="d-flex flex-column justify-content-end pb-2">
                <Form.Check 
                  type="switch"
                  id="active-switch"
                  label="Tài khoản Active"
                  className="text-body fw-medium"
                  checked={newUser.isActive}
                  onChange={(e) => setNewUser({...newUser, isActive: e.target.checked})}
                />
              </Form.Group>
            </div>
            
          </Modal.Body>
          <Modal.Footer className="border-top-0 pt-0">
            <Button variant="light" onClick={handleCloseAddModal} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting} className="d-flex align-items-center gap-2">
              {isSubmitting ? <Spinner size="sm" animation="border" /> : 'Lưu User'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};
