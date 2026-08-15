import React, { useState, useEffect, useCallback } from 'react';
import { Form, Spinner, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight, faPlus, faPen, faTrash, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { getUsers, updateUserStatus, createUser, updateUser, type User, type SaveUserRequest } from '../api/userApi';
import { ResizableHeader } from '../components/ResizableHeader';
import { ExcelActionButtons } from '../components/ExcelActionButtons';
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
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'createdAt', direction: 'asc' });

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const handleImportExcel = async (importedData: any[]) => {
    let successCount = 0;
    let errorCount = 0;
    
    setLoading(true);
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
    setLoading(false);
    
    if (successCount > 0) {
      toast.success(`Nhập thành công ${successCount} user`);
      fetchUsersData();
    }
    if (errorCount > 0) {
      toast.error(`Lỗi khi nhập ${errorCount} user (có thể email đã tồn tại)`);
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
    <div className="jira-table-container">
        <div className="px-4 py-3 border-bottom d-flex justify-content-between align-items-center bg-white" style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
          <h5 className="mb-0 fw-bold" style={{ color: '#1e293b', fontSize: '16px' }}>
            Quản lý Người dùng
          </h5>
          <div className="text-muted fw-bold" style={{ cursor: 'pointer', letterSpacing: '2px' }}>...</div>
        </div>
      {/* Custom Header for search and filters */}
      <div className="d-flex justify-content-between align-items-center p-3" style={{ borderBottom: '1px solid #dfe1e6' }}>
        <h5 className="mb-0 fw-semibold" style={{ color: '#172b4d', fontSize: '16px' }}>Quản lý User</h5>
        <div className="d-flex align-items-center gap-3">
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
            isLoading={loading}
          />
          <Button variant="primary" size="sm" onClick={() => setIsAddingNewUser(true)} className="d-flex align-items-center gap-2 rounded-2">
            <FontAwesomeIcon icon={faPlus} />
            Thêm User
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
              placeholder="Tìm kiếm Email / Tên..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="table-responsive flex-grow-1 d-flex flex-column jira-scroll" style={{ minHeight: '616px', maxHeight: '1756px', overflowX: 'auto', overflowY: 'auto' }}>
        <table className="table align-middle mb-0" style={{ flexGrow: 1, borderCollapse: 'collapse', backgroundColor: 'transparent', tableLayout: 'fixed', minWidth: '1300px' }}>
          <thead className="jira-table-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                <ResizableHeader initialWidth={220} style={{ borderLeft: 0, cursor: 'pointer', padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }} onClick={() => handleSort('fullName')}>
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
                <ResizableHeader initialWidth={120} style={{ cursor: 'pointer', padding: '12px 16px', backgroundColor: 'transparent', textAlign: 'center', color: 'var(--bs-heading-color)' }} onClick={() => handleSort('isActive')}>
                  <span className="fw-semibold text-nowrap">Status {getSortIcon('isActive')}</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={220} style={{ borderRight: 0, padding: '12px 16px', backgroundColor: 'var(--bs-body-bg)', textAlign: 'center', color: 'var(--bs-heading-color)', position: 'sticky', right: 0, zIndex: 11, borderLeft: '1px solid var(--bs-border-color)' }}>
                  <span className="fw-semibold text-nowrap">Thao Tác</span>
                </ResizableHeader>
              </tr>
            </thead>
            <tbody style={{ height: '1px' }}>
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
                      <td style={{ borderLeft: 0, padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
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
                            onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
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
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
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
                          onChange={(e) => setNewUser({ ...newUser, coinBalance: Number(e.target.value) })}
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
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)', textAlign: 'center' }}>
                        <Form.Check
                          type="switch"
                          id="add-status"
                          checked={newUser.isActive ?? true}
                          onChange={(e) => setNewUser({ ...newUser, isActive: e.target.checked })}
                          onKeyDown={(e) => handleKeyDown(e, () => handleAddSubmit(), handleCloseAdd)}
                          className="d-inline-block"
                        />
                      </td>
                      <td style={{ borderRight: 0, padding: '12px 16px', textAlign: 'center', backgroundColor: 'var(--bs-body-bg)', color: 'var(--bs-body-color)', position: 'sticky', right: 0, zIndex: 5, borderLeft: '1px solid var(--bs-border-color)' }}>
                        <div className="d-flex gap-2 justify-content-center">
                          <Button variant="success" size="sm" onClick={() => handleAddSubmit()} disabled={isSubmitting} className="px-3 rounded-2 fw-medium">Lưu</Button>
                          <Button variant="light" size="sm" onClick={handleCloseAdd} className="px-3 rounded-2 border border-secondary-subtle">Hủy</Button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {sortedData.length > 0 ? (
                    sortedData.map((user) => (
                      <React.Fragment key={user.id}>
                        {editingUserId === user.id ? (
                          <tr className="jira-table-row inline-edit-row" style={{ height: '46px' }}>
                            <td style={{ borderLeft: 0, padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
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
                                  onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
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
                                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
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
                                onChange={(e) => setEditFormData({ ...editFormData, coinBalance: Number(e.target.value) })}
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
                            <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)', textAlign: 'center' }}>
                              <Form.Check
                                type="switch"
                                id={`edit-status-${user.id}`}
                                checked={editFormData.isActive ?? true}
                                onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                                onKeyDown={(e) => handleKeyDown(e, () => handleSaveEdit(user.id), handleCancelEdit)}
                                className="d-inline-block"
                              />
                            </td>
                            <td style={{ borderRight: 0, padding: '12px 16px', textAlign: 'center', backgroundColor: 'var(--bs-body-bg)', color: 'var(--bs-body-color)', position: 'sticky', right: 0, zIndex: 5, borderLeft: '1px solid var(--bs-border-color)' }}>
                              <div className="d-flex gap-2 justify-content-center">
                                <Button variant="success" size="sm" onClick={() => handleSaveEdit(user.id)} className="px-3 rounded-2 fw-medium">Lưu</Button>
                                <Button variant="light" size="sm" onClick={handleCancelEdit} className="px-3 rounded-2 border border-secondary-subtle">Hủy</Button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          <tr className="jira-table-row" style={{ height: '46px' }} onDoubleClick={() => handleEditClick(user)}>
                            <td style={{ borderLeft: 0, padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
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
                            <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)', textAlign: 'center' }}>
                              <div
                                className={`fw-medium d-inline-flex align-items-center justify-content-center border-0 no-caret ${user.isActive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}
                                style={{
                                  minWidth: '90px',
                                  padding: '6px 12px',
                                  boxShadow: 'none',
                                  borderRadius: '20px',
                                  gap: '8px'
                                }}
                              >
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: user.isActive ? '#198754' : '#dc3545' }}></span>
                                {user.isActive ? 'Hoạt động' : 'Bị khóa'}
                              </div>
                            </td>
                            <td style={{ borderRight: 0, padding: '12px 16px', textAlign: 'center', backgroundColor: 'var(--bs-body-bg)', color: 'var(--bs-body-color)', position: 'sticky', right: 0, zIndex: 5, borderLeft: '1px solid var(--bs-border-color)' }}>
                              <div className="d-flex gap-2 justify-content-center">
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
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} style={{ borderLeft: 0, borderRight: 0, padding: 0 }}>
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
              <tbody style={{ height: 'auto' }}>
                {/* Filler row to push the table height and extend the sticky border */}
                <tr style={{ height: '100%' }}>
                  <td style={{ borderBottom: 0, borderLeft: 0, padding: 0, backgroundColor: 'transparent' }}></td>
                  <td style={{ borderBottom: 0, padding: 0, backgroundColor: 'transparent' }}></td>
                  <td style={{ borderBottom: 0, padding: 0, backgroundColor: 'transparent' }}></td>
                  <td style={{ borderBottom: 0, padding: 0, backgroundColor: 'transparent' }}></td>
                  <td style={{ borderBottom: 0, padding: 0, backgroundColor: 'transparent' }}></td>
                  <td style={{ borderBottom: 0, padding: 0, backgroundColor: 'transparent' }}></td>
                  <td style={{ borderBottom: 0, padding: 0, backgroundColor: 'transparent' }}></td>
                  <td style={{ borderBottom: 0, padding: 0, backgroundColor: 'transparent' }}></td>
                  <td style={{ borderBottom: 0, borderRight: 0, padding: 0, backgroundColor: 'var(--bs-body-bg)', position: 'sticky', right: 0, zIndex: 5, borderLeft: '1px solid var(--bs-border-color)' }}></td>
                </tr>
              </tbody>
          </table>
        </div>

      {/* Bottom Controls */}
      <div className="jira-table-footer">
        <div style={{ visibility: 'hidden' }}>
          {/* Placeholder to balance space for pagination centering */}
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
    </div>
  );
};
