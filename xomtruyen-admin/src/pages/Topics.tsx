import React, { useState, useEffect, useCallback } from 'react';
import type { ITopic } from '../types/topic';
import { getTopics, createTopic, updateTopic, deleteTopic } from '../api/topicApi';
import { Dropdown, Form, Button, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faSort, faSortUp, faSortDown, faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight, faPlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ResizableHeader } from '../components/ResizableHeader';

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  key: keyof ITopic | null;
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

export const Topics: React.FC = () => {
  const [data, setData] = useState<ITopic[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'desc' });

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newItem, setNewItem] = useState<Partial<ITopic>>({});

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<ITopic>>({});

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getTopics({
        page: currentPage,
        pageSize: itemsPerPage,
        searchKeyword: debouncedSearch || undefined,
        sortBy: sortConfig.key || undefined,
        isDescending: sortConfig.direction === 'desc',
      });
      setData(response.data || []);
      setTotalItems(response.totalCount || 0);
    } catch (error) {
      console.error('Lỗi load danh sách topic:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, debouncedSearch, sortConfig]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

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
      alert('Tên chủ đề là bắt buộc');
      return;
    }
    setIsSubmitting(true);
    try {
      await createTopic({ name: newItem.name });
      handleCloseAdd();
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchTopics();
      }
    } catch (error: any) {
      console.error('Lỗi khi tạo topic:', error);
      alert(error.message || 'Không thể tạo topic.');
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
      alert('Tên chủ đề là bắt buộc');
      return;
    }
    try {
      await updateTopic(id, { name: editData.name });
      setData(prev => prev.map(c => c.id === id ? { ...c, ...editData } as ITopic : c));
      setEditingId(null);
    } catch (error: any) {
      console.error('Lỗi khi cập nhật topic:', error);
      alert(error.message || 'Không thể cập nhật topic.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa chủ đề này? Không thể xóa nếu đang có sách liên kết.')) return;
    try {
      await deleteTopic(id);
      fetchTopics();
    } catch (error: any) {
      console.error('Lỗi khi xóa topic:', error);
      alert(error.message || 'Không thể xóa topic.');
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="card border-0 shadow-sm h-auto" style={{ backgroundColor: 'var(--bs-body-bg)' }}>
      <div className="card-header border-bottom-0 pt-4 pb-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: 'transparent' }}>
        <h5 className="mb-0 fw-semibold" style={{ color: 'var(--bs-heading-color)' }}>Quản lý Chủ đề</h5>
        <Button variant="primary" size="sm" onClick={() => setIsAddingNew(true)} className="d-flex align-items-center gap-2 rounded-2">
          <FontAwesomeIcon icon={faPlus} />
          Thêm Mới
        </Button>
      </div>
      
      <div className="card-body d-flex flex-column">
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
              placeholder="Tìm kiếm..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="table-responsive flex-grow-1" style={{ minHeight: '616px', maxHeight: '1756px', overflowY: 'auto' }}>
          <table className="table table-bordered align-middle mb-0 text-body" style={{ borderCollapse: 'collapse', backgroundColor: 'transparent', tableLayout: 'fixed', minWidth: '800px' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--bs-body-bg)' }}>
              <tr style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                <ResizableHeader initialWidth={100} style={{ cursor: 'pointer', backgroundColor: 'transparent', padding: '12px 16px' , color: 'var(--bs-heading-color)'}} onClick={() => handleSort('id')}>
                  <span className="fw-semibold text-nowrap">ID {getSortIcon('id')}</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={300} style={{ cursor: 'pointer', backgroundColor: 'transparent', padding: '12px 16px' , color: 'var(--bs-heading-color)'}} onClick={() => handleSort('name')}>
                  <span className="fw-semibold text-nowrap">Tên Chủ đề {getSortIcon('name')}</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={280} style={{ cursor: 'pointer', backgroundColor: 'transparent', padding: '12px 16px' , color: 'var(--bs-heading-color)'}} onClick={() => handleSort('slug')}>
                  <span className="fw-semibold text-nowrap">Slug (Đường dẫn) {getSortIcon('slug')}</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={120} style={{ backgroundColor: 'transparent', padding: '12px 16px', textAlign: 'right' , color: 'var(--bs-heading-color)'}}>
                  <span className="fw-semibold text-nowrap">Thao tác</span>
                </ResizableHeader>
              </tr>
            </thead>
            <tbody>
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
                  <tr className="inline-edit-row" style={{ borderBottom: '1px solid var(--bs-border-color)', height: '46px' }}>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                      <span className="text-muted small">Tự động</span>
                    </td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                      <Form.Control autoFocus size="sm" value={newItem.name || ''} onChange={(e) => setNewItem({...newItem, name: e.target.value})} onKeyDown={(e) => handleKeyDown(e, handleAddSubmit, handleCloseAdd)} placeholder="Tên chủ đề" className="inline-edit-input text-body w-100" />
                    </td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                      <span className="text-muted small">Tự động tạo</span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                      <div className="d-flex gap-2 justify-content-end">
                        <Button variant="success" size="sm" onClick={handleAddSubmit} disabled={isSubmitting} className="px-3 rounded-2 fw-medium">Lưu</Button>
                        <Button variant="light" size="sm" onClick={handleCloseAdd} className="px-3 rounded-2 border border-secondary-subtle">Hủy</Button>
                      </div>
                    </td>
                  </tr>
                )}
                {data.length > 0 ? (
                  data.map((topic) => (
                    editingId === topic.id ? (
                      <tr key={topic.id} className="inline-edit-row" style={{ borderBottom: '1px solid var(--bs-border-color)', height: '46px' }}>
                        <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                          {topic.id}
                        </td>
                        <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                          <Form.Control autoFocus size="sm" value={editData.name || ''} onChange={(e) => setEditData({...editData, name: e.target.value})} onKeyDown={(e) => handleKeyDown(e, () => handleSaveEdit(topic.id), handleCancelEdit)} placeholder="Tên chủ đề" className="inline-edit-input text-body w-100" />
                        </td>
                        <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                          <span className="text-muted">{topic.slug}</span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                          <div className="d-flex gap-2 justify-content-end">
                            <Button variant="success" size="sm" onClick={() => handleSaveEdit(topic.id)} className="px-3 rounded-2 fw-medium">Lưu</Button>
                            <Button variant="light" size="sm" onClick={handleCancelEdit} className="px-3 rounded-2 border border-secondary-subtle">Hủy</Button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                    <tr key={topic.id} style={{ borderBottom: '1px solid var(--bs-border-color)', height: '46px' }} onDoubleClick={() => handleEditClick(topic)}>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent' , color: 'var(--bs-body-color)'}}>
                        {topic.id}
                      </td>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent' , color: 'var(--bs-body-color)'}}>
                        <span className="fw-medium">{topic.name}</span>
                      </td>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent' , color: 'var(--bs-body-color)'}}>
                        <span className="text-muted">{topic.slug}</span>
                      </td>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent', textAlign: 'right' , color: 'var(--bs-body-color)'}}>
                        <div className="d-flex gap-2 justify-content-end">
                          <Button variant="light" size="sm" onClick={() => handleEditClick(topic)} className="px-2 py-1 bg-white d-flex align-items-center" style={{ fontSize: '13px', color: '#4b5563', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <FontAwesomeIcon icon={faPen} className="me-2" style={{ color: '#9ca3af' }} />
                            Sửa
                          </Button>
                          <Button variant="light" size="sm" onClick={() => handleDelete(topic.id)} className="px-2 py-1 bg-white d-flex align-items-center" style={{ fontSize: '13px', color: '#dc3545', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
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
                    <td colSpan={4} className="text-center py-5 text-muted">
                      Không tìm thấy dữ liệu
                    </td>
                  </tr>
                )}
              </>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top border-secondary-subtle bg-transparent">
          <div className="text-muted" style={{ fontSize: '13px' }}>
            Hiển thị {totalItems === 0 ? 0 : startIndex + 1} đến {Math.min(startIndex + itemsPerPage, totalItems)} trong {totalItems} chủ đề
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
