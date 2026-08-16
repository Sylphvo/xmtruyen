import React, { useState, useMemo, useEffect, useRef } from 'react';
import { getBooks, createBook, updateBook, deleteBook, uploadBookFile, uploadCoverImage, toggleStatus, type SaveBookRequest } from '../api/bookApi';
import type { IBook } from '../types/book';
import type { ICategory } from '../types/category';
import type { ITopic } from '../types/topic';
import { getCategories } from '../api/categoryApi';
import { getTopics } from '../api/topicApi';
import { Form, Button, Modal, ProgressBar, Spinner, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight, faPlus, faExchangeAlt, faTrash, faUpload, faFileAlt, faTimes, faCheckCircle, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import defaultBookImage from '../assets/images/default.png';
import toast from 'react-hot-toast';

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  key: keyof IBook | null;
  direction: SortDirection;
}

import { ResizableHeader } from '../components/ResizableHeader';
import { FloatingBulkActionBar } from '../components/FloatingBulkActionBar';
import { useNavigate } from 'react-router-dom';

export const Books: React.FC<{ formatType?: number }> = ({ formatType: _formatType }) => {
  const navigate = useNavigate();
  const getImageUrl = (url?: string) => {
    if (!url) return defaultBookImage;
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `http://localhost:5172/${url}`;
  };
  const [data, setData] = useState<IBook[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newItem, setNewItem] = useState<Partial<SaveBookRequest>>({});
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [editBookData, setEditBookData] = useState<Partial<SaveBookRequest>>({});
  const [activeEditField, setActiveEditField] = useState<string | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(data.map(b => b.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [popupNewItem, setPopupNewItem] = useState<Partial<SaveBookRequest>>({});

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingBookId, setUploadingBookId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [targetCoverBookId, setTargetCoverBookId] = useState<string | null>(null);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [topics, setTopics] = useState<ITopic[]>([]);

  useEffect(() => {
    const fetchSelectData = async () => {
      try {
        const [catRes, topRes] = await Promise.all([
          getCategories({ pageSize: 100 }),
          getTopics({ pageSize: 100 })
        ]);
        setCategories(catRes.data || []);
        setTopics(topRes.data || []);
      } catch (err) {
        console.error('Failed to load categories/topics', err);
      }
    };
    fetchSelectData();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        const res = await getBooks({
          page: currentPage,
          pageSize: itemsPerPage,
          keyword: searchTerm || undefined,
          formatType: _formatType !== undefined ? _formatType : undefined
        });
        setData(res.data || []);
        setTotalItems(res.totalCount || 0);
      } catch (error) {
        console.error('Failed to fetch books', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Simple debounce for search
    const timer = setTimeout(() => {
      fetchBooks();
    }, 300);
    return () => clearTimeout(timer);
  }, [currentPage, itemsPerPage, searchTerm, refreshTrigger, _formatType]);

  const handleUploadClick = (bookId: string) => {
    setUploadingBookId(bookId);
    setSelectedFile(null);
    setUploadProgress(0);
    setShowUploadModal(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCoverImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      try {
        setIsUploadingCover(true);
        let publicationIdParam: string | undefined = undefined;
        if (targetCoverBookId && targetCoverBookId !== 'NEW') {
           publicationIdParam = targetCoverBookId;
        } else if (targetCoverBookId === 'NEW' && newItem.id) {
           publicationIdParam = newItem.id;
        }

        const res = await uploadCoverImage(file, publicationIdParam);
        if (res.success && res.url) {
          if (targetCoverBookId === 'NEW' && isAddingNew) {
            setNewItem(prev => ({ ...prev, id: res.publicationId || prev.id, coverImageUrl: res.url }));
            toast.success('Upload ảnh bìa thành công');
          } else if (targetCoverBookId && targetCoverBookId === editingBookId) {
            setEditBookData(prev => ({ ...prev, coverImageUrl: res.url }));
            toast.success('Upload ảnh bìa thành công');
          } else if (targetCoverBookId && targetCoverBookId !== 'NEW') {
            const bookToUpdate = data.find(b => b.id === targetCoverBookId);
            if (bookToUpdate) {
              const req: SaveBookRequest = {
                title: bookToUpdate.title,
                author: bookToUpdate.author,
                formatType: bookToUpdate.formatType,
                accessLevel: bookToUpdate.accessLevel,
                coverImageUrl: res.url,
                categoryIds: bookToUpdate.categories?.map(c => c.id) || [],
                topicIds: bookToUpdate.topics?.map(t => t.id) || []
              };
              await updateBook(targetCoverBookId, req);
              setRefreshTrigger(prev => prev + 1);
              toast.success('Upload ảnh bìa thành công và đã lưu');
            }
          }
        }
      } catch (err) {
        console.error(err);
        toast.error('Lỗi khi upload ảnh bìa');
      } finally {
        setIsUploadingCover(false);
        setTargetCoverBookId(null);
        if (coverInputRef.current) coverInputRef.current.value = '';
      }
    }
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile || !uploadingBookId) return;
    try {
      setIsLoading(true);
      setUploadProgress(20);
      
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await uploadBookFile(selectedFile, uploadingBookId);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        toast.success('Upload file thành công. Tệp đang được xử lý ngầm.');
        setRefreshTrigger(prev => prev + 1);
        setShowUploadModal(false);
        setIsLoading(false);
      }, 500);
      
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi upload file');
      setIsLoading(false);
      setUploadProgress(0);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const isSelectMenuOpen = document.querySelector('.rs__menu');
        const isModalOpen = document.querySelector('.modal.show');

        if (!isSelectMenuOpen && !isModalOpen) {
          if (isAddingNew) {
            handleCloseAdd();
          } else if (editingBookId) {
            handleCancelEdit();
          }
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isAddingNew, editingBookId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, saveFunc: () => void, cancelFunc?: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveFunc();
    } else if (e.key === 'Escape' && cancelFunc) {
      e.preventDefault();
      cancelFunc();
    }
  };


  const handleOpenAddModal = () => {
    setPopupNewItem({
      formatType: _formatType !== undefined ? _formatType : 1,
      accessLevel: 1,
      categoryIds: [],
      topicIds: []
    });
    setShowAddModal(true);
  };

  const handlePopupAddSubmit = async () => {
    if (!popupNewItem.title || !popupNewItem.author) {
      toast.error('Vui lòng nhập đầy đủ tiêu đề và tác giả');
      return;
    }
    try {
      setIsSubmitting(true);
      const request: SaveBookRequest = {
        id: popupNewItem.id,
        title: popupNewItem.title,
        author: popupNewItem.author,
        formatType: popupNewItem.formatType || 1,
        accessLevel: popupNewItem.accessLevel || 1,
        categoryIds: popupNewItem.categoryIds || [],
        topicIds: popupNewItem.topicIds || [],
        description: popupNewItem.description,
        coverImageUrl: popupNewItem.coverImageUrl
      };
      await createBook(request);
      setShowAddModal(false);
      setRefreshTrigger(prev => prev + 1);
      toast.success('Thêm sách thành công');
    } catch (error) {
      console.error('Lỗi khi thêm sách:', error);
      toast.error('Không thể thêm sách');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAdd = () => {
    setIsAddingNew(false);
    setNewItem({});
  };

  const handleAddSubmit = async () => {
    if (!newItem.title || !newItem.author) {
      toast.error('Vui lòng nhập đầy đủ tiêu đề và tác giả');
      return;
    }
    try {
      setIsSubmitting(true);
      const request: SaveBookRequest = {
        id: newItem.id,
        title: newItem.title,
        author: newItem.author,
        formatType: newItem.formatType || 1,
        accessLevel: newItem.accessLevel || 1,
        categoryIds: newItem.categoryIds || [],
        topicIds: newItem.topicIds || [],
      };
      await createBook(request);
      handleCloseAdd();
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Lỗi khi thêm sách:', error);
      toast.error('Không thể thêm sách');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetStatus = async (book: IBook, newStatus: string) => {
    try {
      await toggleStatus(book.id, newStatus);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };



  const handleCellDoubleClick = (book: IBook, field: string) => {
    if (editingBookId !== book.id) {
      setEditingBookId(book.id);
      setEditBookData({
        title: book.title,
        author: book.author,
        formatType: book.formatType,
        accessLevel: book.accessLevel,
        categoryIds: book.categories?.map(c => c.id) || [],
        topicIds: book.topics?.map(t => t.id) || [],
      });
    }
    setActiveEditField(field);
  };

  const handleCellKeyDown = (e: React.KeyboardEvent, currentField: string, book: IBook) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const fields = ['title', 'author', 'formatType', 'categories', 'topics'];
      const currentIndex = fields.indexOf(currentField);
      if (e.shiftKey) {
        if (currentIndex > 0) setActiveEditField(fields[currentIndex - 1]);
      } else {
        if (currentIndex < fields.length - 1) setActiveEditField(fields[currentIndex + 1]);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit(book.id);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const handleCancelEdit = () => {
    setEditingBookId(null);
    setEditBookData({});
    setActiveEditField(null);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editBookData.title || !editBookData.author) {
      toast.error('Vui lòng nhập đầy đủ tiêu đề và tác giả');
      return;
    }
    try {
      await updateBook(id, editBookData as SaveBookRequest);
      setEditingBookId(null);
      setActiveEditField(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Lỗi khi cập nhật sách:', error);
      toast.error('Không thể cập nhật sách');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sách này?')) {
      try {
        await deleteBook(id);
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        console.error('Lỗi khi xóa sách:', error);
        toast.error('Không thể xóa sách');
      }
    }
  };

  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'asc' });

  const handleSort = (key: keyof IBook) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    setSortConfig({ key: direction ? key : null, direction });
  };

  const getSortIcon = (key: keyof IBook) => {
    if (sortConfig.key !== key) return <FontAwesomeIcon icon={faSort} className="text-muted ms-1" style={{ fontSize: '12px' }} />;
    if (sortConfig.direction === 'asc') return <FontAwesomeIcon icon={faSortUp} className="ms-1" style={{ fontSize: '12px' }} />;
    if (sortConfig.direction === 'desc') return <FontAwesomeIcon icon={faSortDown} className="ms-1" style={{ fontSize: '12px' }} />;
    return <FontAwesomeIcon icon={faSort} className="text-muted ms-1" style={{ fontSize: '12px' }} />;
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key!];
      const bVal = b[sortConfig.key!];

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const validCurrentPage = Math.min(currentPage, Math.max(1, totalPages || 1));

  const startIndex = (validCurrentPage - 1) * itemsPerPage;



  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active':
        return { backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' };
      case 'On Hold':
        return { backgroundColor: 'rgba(249, 115, 22, 0.15)', color: '#f97316' };
      default:
        return { backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' };
    }
  };

  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      width: '100%',
      backgroundColor: '#ffffff',
      borderColor: state.isFocused ? '#0d6efd' : 'transparent',
      borderWidth: state.isFocused ? '2px' : '1px',
      boxShadow: 'none',
      borderRadius: '2px',
      minHeight: '34px',
      maxHeight: '34px',
      '&:hover': { borderColor: state.isFocused ? '#0d6efd' : '#dee2e6' }
    }),
    valueContainer: (base: any) => ({
      ...base,
      padding: '2px 8px',
      flexWrap: 'wrap',
      overflowY: 'auto',
      '&::-webkit-scrollbar': { width: '4px', height: '4px' },
      '&::-webkit-scrollbar-thumb': { background: 'rgba(0,0,0,0.2)', borderRadius: '4px' },
      '&::-webkit-scrollbar-track': { background: 'transparent' }
    }),
    menu: (base: any) => ({ ...base, zIndex: 9999, width: '250px' })
  };

  return (
    <>
      <div className="jira-table-container">
        {/* Custom Header for search and filters */}
        <div className="d-flex justify-content-between align-items-center p-3" style={{ borderBottom: '1px solid var(--jira-border)' }}>
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
            <span className="small" style={{ color: 'var(--jira-text-muted)' }}>dòng / trang</span>
          </div>

          <div style={{ width: '250px' }}>
            <Form.Control
              size="sm"
              type="text"
              className="bg-transparent text-body border-secondary-subtle"
              style={{}}
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="table-responsive jira-scroll" style={{ maxHeight: '1756px', overflowX: 'auto', overflowY: 'auto' }}>
          <table className="table align-middle mb-0" style={{ borderCollapse: 'collapse', backgroundColor: 'transparent', tableLayout: 'fixed', minWidth: '1450px' }}>
            <thead className="jira-table-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                  <ResizableHeader initialWidth={40} minWidth={40} style={{ borderLeft: 0, padding: '5px 6px', backgroundColor: 'transparent', textAlign: 'center' }}>
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
                  <ResizableHeader initialWidth={90} style={{ backgroundColor: 'transparent', padding: '5px 6px', textAlign: 'center', color: 'var(--jira-text)' }}>
                    <span className="fw-semibold text-nowrap">Ảnh Bìa</span>
                  </ResizableHeader>
                  <ResizableHeader initialWidth={260} style={{ cursor: 'pointer', backgroundColor: 'transparent', padding: '5px 6px', textAlign: 'center', color: 'var(--jira-text)' }} onClick={() => handleSort('title')}>
                    <span className="fw-semibold text-nowrap">Tên Sách {getSortIcon('title')}</span>
                  </ResizableHeader>
                  <ResizableHeader initialWidth={150} style={{ cursor: 'pointer', backgroundColor: 'transparent', padding: '5px 6px', textAlign: 'center', color: 'var(--jira-text)' }} onClick={() => handleSort('author')}>
                    <span className="fw-semibold text-nowrap">Tác Giả {getSortIcon('author')}</span>
                  </ResizableHeader>
                  {_formatType === undefined && (
                    <ResizableHeader initialWidth={120} style={{ backgroundColor: 'transparent', padding: '5px 6px', textAlign: 'center', color: 'var(--jira-text)' }}>
                      <span className="fw-semibold text-nowrap">Loại Sách</span>
                    </ResizableHeader>
                  )}
                  <ResizableHeader initialWidth={180} style={{ backgroundColor: 'transparent', padding: '5px 6px', textAlign: 'center', color: 'var(--jira-text)' }}>
                    <span className="fw-semibold text-nowrap">Thể Loại</span>
                  </ResizableHeader>
                  <ResizableHeader initialWidth={180} style={{ backgroundColor: 'transparent', padding: '5px 6px', textAlign: 'center', color: 'var(--jira-text)' }}>
                    <span className="fw-semibold text-nowrap">Chủ Đề</span>
                  </ResizableHeader>
                  <ResizableHeader initialWidth={150} style={{ backgroundColor: 'transparent', padding: '5px 6px', textAlign: 'center', color: 'var(--jira-text)' }}>
                    <span className="fw-semibold text-nowrap">Người Tạo / Sửa</span>
                  </ResizableHeader>
                  <ResizableHeader initialWidth={180} style={{ backgroundColor: 'transparent', padding: '5px 6px', textAlign: 'center', color: 'var(--jira-text)' }}>
                    <span className="fw-semibold text-nowrap">Thời Gian Update</span>
                  </ResizableHeader>
                  <ResizableHeader initialWidth={150} minWidth={150} style={{ cursor: 'pointer', backgroundColor: 'transparent', padding: '5px 6px', textAlign: 'center', color: 'var(--jira-text)' }} onClick={() => handleSort('status')}>
                    <span className="fw-semibold text-nowrap">Trạng Thái {getSortIcon('status')}</span>
                  </ResizableHeader>
                  <ResizableHeader initialWidth={350} minWidth={350} style={{ borderRight: 0, backgroundColor: 'transparent', padding: '5px 6px', textAlign: 'center', color: 'var(--jira-text)' }}>
                    <span className="fw-semibold text-nowrap">Thao Tác <FontAwesomeIcon icon={faSort} className="text-muted ms-1" style={{ fontSize: '12px' }} /></span>
                  </ResizableHeader>
                </tr>
              </thead>
              <tbody style={{ height: '1px' }}>
                <>
                  {isAddingNew && (
                    <tr className="jira-table-row inline-edit-row" style={{ height: '46px' }}>
                      <td style={{ borderLeft: 0, padding: '5px 6px', backgroundColor: 'transparent' }}></td>
                      <td style={{ padding: '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)', textAlign: 'center' }}>
                        <div className="d-flex flex-column align-items-center gap-2">
                          <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }} onClick={() => { setTargetCoverBookId('NEW'); coverInputRef.current?.click(); }} title="Click để upload ảnh bìa">
                            <img 
                              src={getImageUrl(newItem.coverImageUrl)} 
                              alt="Cover" 
                              style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} 
                              onError={(e) => { e.currentTarget.src = defaultBookImage; }}
                            />
                            {isUploadingCover && targetCoverBookId === 'NEW' && (
                              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
                                <Spinner animation="border" size="sm" variant="primary" />
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                        <Form.Control size="sm" value={newItem.title || ''} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} onKeyDown={(e) => handleKeyDown(e, handleAddSubmit, handleCloseAdd)} placeholder="Tên sách" className="inline-edit-input text-body" />
                      </td>
                      <td style={{ padding: '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                        <Form.Control size="sm" value={newItem.author || ''} onChange={(e) => setNewItem({ ...newItem, author: e.target.value })} onKeyDown={(e) => handleKeyDown(e, handleAddSubmit, handleCloseAdd)} placeholder="Tác giả" className="inline-edit-input text-body" />
                      </td>
                      {_formatType === undefined && (
                        <td style={{ padding: '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                          <Form.Select size="sm" value={newItem.formatType || 1} onChange={(e) => setNewItem({ ...newItem, formatType: Number(e.target.value) })} className="inline-edit-input text-body">
                            <option value={1}>Sách</option>
                            <option value={2}>Truyện tranh</option>
                          </Form.Select>
                        </td>
                      )}
                      <td style={{ padding: '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                        <Select
                          isMulti
                          classNamePrefix="rs"
                          closeMenuOnSelect={false}
                          hideSelectedOptions={false}
                          options={categories.map(c => ({ value: c.id, label: c.name }))}
                          value={categories.filter(c => newItem.categoryIds?.includes(c.id as any)).map(c => ({ value: c.id, label: c.name }))}
                          onChange={(selected) => setNewItem({ ...newItem, categoryIds: selected.map(s => s.value as any) })}
                          styles={selectStyles}
                          components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null, ClearIndicator: () => null }}
                          placeholder="Chọn thể loại..."
                          menuPortalTarget={document.body}
                        />
                      </td>
                      <td style={{ padding: '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                        <Select
                          isMulti
                          classNamePrefix="rs"
                          closeMenuOnSelect={false}
                          hideSelectedOptions={false}
                          options={topics.map(t => ({ value: t.id, label: t.name }))}
                          value={topics.filter(t => newItem.topicIds?.includes(t.id as any)).map(t => ({ value: t.id, label: t.name }))}
                          onChange={(selected) => setNewItem({ ...newItem, topicIds: selected.map(s => s.value as any) })}
                          styles={selectStyles}
                          components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null, ClearIndicator: () => null }}
                          placeholder="Chọn chủ đề..."
                          menuPortalTarget={document.body}
                        />
                      </td>
                      <td style={{ padding: '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}></td>
                      <td style={{ padding: '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}></td>
                      <td style={{ padding: '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                        <div
                          className="fw-medium d-flex align-items-center justify-content-center"
                          style={{
                            ...getStatusStyle('On Hold'),
                            minWidth: '100px',
                            width: 'fit-content',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            gap: '8px',
                            margin: '0 auto'
                          }}
                        >
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getStatusStyle('On Hold').color }}></span>
                          On Hold
                        </div>
                      </td>
                      <td style={{ borderRight: 0, padding: '5px 6px', textAlign: 'center', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                        <div className="d-flex gap-2 justify-content-center">
                          <Button variant="light" size="sm" onClick={handleAddSubmit} disabled={isSubmitting} className="px-2 py-1  d-flex align-items-center" style={{ fontSize: '13px', color: '#198754', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                            Lưu
                          </Button>
                          <Button variant="light" size="sm" onClick={handleCloseAdd} className="px-2 py-1  d-flex align-items-center" style={{ fontSize: '13px', color: '#6c757d', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <FontAwesomeIcon icon={faTimes} className="me-2" />
                            Hủy
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {isLoading ? (
                    <tr>
                      <td colSpan={_formatType === undefined ? 11 : 10} style={{ borderLeft: 0, borderRight: 0 }} className="text-center py-4 text-muted">Đang tải dữ liệu...</td>
                    </tr>
                  ) : sortedData.length > 0 ? (
                    sortedData.map((book) => (
                      <React.Fragment key={book.id}>
                        <tr className={editingBookId === book.id ? "jira-table-row inline-edit-row" : "jira-table-row"} style={{ height: '46px', backgroundColor: selectedIds.includes(book.id) ? '#ebf2fc' : 'transparent' }}>
                          <td style={{ borderLeft: 0, padding: '5px 6px', backgroundColor: 'transparent', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                            <Form.Check
                              type="checkbox"
                              checked={selectedIds.includes(book.id)}
                              onChange={() => toggleSelect(book.id)}
                            />
                          </td>
                          <td style={{ padding: '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)', textAlign: 'center' }}>
                            <div className="d-flex flex-column align-items-center gap-2">
                              <div style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }} onClick={() => { setTargetCoverBookId(book.id); coverInputRef.current?.click(); }} title="Click để thay đổi ảnh bìa">
                                <img
                                  src={getImageUrl(editingBookId === book.id && editBookData.coverImageUrl !== undefined ? editBookData.coverImageUrl : book.coverImageUrl)}
                                  alt={book.title}
                                  style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                                  onError={(e) => { e.currentTarget.src = defaultBookImage; }}
                                />
                                {isUploadingCover && targetCoverBookId === book.id && (
                                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
                                    <Spinner animation="border" size="sm" variant="primary" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: editingBookId === book.id && activeEditField === 'title' ? '0 16px' : '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                            <div className="d-flex align-items-center gap-3 h-100">
                              {editingBookId === book.id && activeEditField === 'title' ? (
                                <Form.Control
                                  value={editBookData.title || ''}
                                  onChange={(e) => setEditBookData({ ...editBookData, title: e.target.value })}
                                  onKeyDown={(e) => handleCellKeyDown(e, 'title', book)}
                                  className="cell-edit-input flex-grow-1"
                                  autoFocus
                                />
                              ) : (
                                <span
                                  onDoubleClick={() => handleCellDoubleClick(book, 'title')}
                                  className="fw-medium flex-grow-1 text-truncate"
                                  style={{ cursor: 'text', color: 'var(--jira-text)' }}
                                  title={editingBookId === book.id ? editBookData.title : book.title}
                                >
                                  {editingBookId === book.id ? editBookData.title : book.title}
                                </span>
                              )}
                            </div>
                          </td>

                          <td
                            onDoubleClick={() => handleCellDoubleClick(book, 'author')}
                            style={{ padding: editingBookId === book.id && activeEditField === 'author' ? 0 : '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}
                          >
                            {editingBookId === book.id && activeEditField === 'author' ? (
                              <Form.Control
                                value={editBookData.author || ''}
                                onChange={(e) => setEditBookData({ ...editBookData, author: e.target.value })}
                                onKeyDown={(e) => handleCellKeyDown(e, 'author', book)}
                                className="cell-edit-input"
                                autoFocus
                              />
                            ) : (
                              <span>{editingBookId === book.id ? editBookData.author : book.author}</span>
                            )}
                          </td>
                          {_formatType === undefined && (
                            <td
                              onDoubleClick={() => handleCellDoubleClick(book, 'formatType')}
                              style={{ padding: editingBookId === book.id && activeEditField === 'formatType' ? 0 : '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)', textAlign: 'center' }}
                            >
                              {editingBookId === book.id && activeEditField === 'formatType' ? (
                                <Form.Select
                                  size="sm"
                                  value={editBookData.formatType || 1}
                                  onChange={(e) => setEditBookData({ ...editBookData, formatType: Number(e.target.value) })}
                                  onKeyDown={(e) => handleCellKeyDown(e, 'formatType', book)}
                                  className="cell-edit-input"
                                  style={{ border: '2px solid #0d6efd', borderRadius: '0' }}
                                  autoFocus
                                >
                                  <option value={1}>Sách</option>
                                  <option value={2}>Truyện tranh</option>
                                </Form.Select>
                              ) : (
                                <span className="badge border" style={{ backgroundColor: 'var(--jira-hover-bg)', color: 'var(--jira-text)' }}>
                                  {(editingBookId === book.id && editBookData.formatType !== undefined ? editBookData.formatType : book.formatType) === 1 ? 'Sách' : ((editingBookId === book.id && editBookData.formatType !== undefined ? editBookData.formatType : book.formatType) === 2 ? 'Truyện tranh' : 'Khác')}
                                </span>
                              )}
                            </td>
                          )}

                          <td
                            onDoubleClick={() => handleCellDoubleClick(book, 'categories')}
                            style={{ padding: editingBookId === book.id && activeEditField === 'categories' ? 0 : '4px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)', height: '100%' }}
                          >
                            {editingBookId === book.id && activeEditField === 'categories' ? (
                              <div style={{ height: '46px', display: 'flex', alignItems: 'center', padding: '0 8px', border: '2px solid #0d6efd', backgroundColor: 'var(--jira-table-bg)', overflow: 'hidden' }}>
                                <Select
                                  autoFocus
                                  isMulti
                                  classNamePrefix="rs"
                                  closeMenuOnSelect={false}
                                  hideSelectedOptions={false}
                                  options={categories.map(c => ({ value: c.id, label: c.name }))}
                                  value={categories.filter(c => editBookData.categoryIds?.includes(c.id as any)).map(c => ({ value: c.id, label: c.name }))}
                                  onChange={(selected) => setEditBookData({ ...editBookData, categoryIds: selected.map(s => s.value as any) })}
                                  onKeyDown={(e) => handleCellKeyDown(e, 'categories', book)}
                                  styles={{
                                    ...selectStyles,
                                    control: (base: any) => ({
                                      ...base,
                                      width: '100%',
                                      border: 'none',
                                      boxShadow: 'none',
                                      backgroundColor: 'transparent',
                                      minHeight: '42px',
                                      maxHeight: '42px',
                                      '&:hover': { border: 'none' }
                                    }),
                                    valueContainer: (base: any) => ({
                                      ...base,
                                      padding: '0 2px',
                                      flexWrap: 'wrap',
                                      overflowY: 'auto',
                                      maxHeight: '34px',
                                      '&::-webkit-scrollbar': { display: 'none' },
                                      msOverflowStyle: 'none',
                                      scrollbarWidth: 'none'
                                    })
                                  }}
                                  components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null, ClearIndicator: () => null }}
                                  placeholder="Chọn thể loại..."
                                  menuPortalTarget={document.body}
                                />
                              </div>
                            ) : (
                              <div className="d-flex align-content-start flex-wrap gap-1 hide-scroll" style={{ overflowY: 'auto', height: '46px', padding: '2px 0' }}>
                                {(() => {
                                  const cats = editingBookId === book.id
                                    ? categories.filter(c => editBookData.categoryIds?.includes(c.id as any))
                                    : book.categories;
                                  if (!cats || cats.length === 0) return null;
                                  return cats.map(c => (
                                    <span key={c.id} className="badge fw-normal" style={{ backgroundColor: 'var(--jira-hover-bg)', border: '1px solid var(--jira-border)', color: 'var(--jira-text)', padding: '3px 8px', fontSize: '13px', borderRadius: '4px' }}>
                                      {c.name}
                                    </span>
                                  ));
                                })()}
                              </div>
                            )}
                          </td>

                          <td
                            onDoubleClick={() => handleCellDoubleClick(book, 'topics')}
                            style={{ padding: editingBookId === book.id && activeEditField === 'topics' ? 0 : '4px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)', height: '100%' }}
                          >
                            {editingBookId === book.id && activeEditField === 'topics' ? (
                              <div style={{ height: '46px', display: 'flex', alignItems: 'center', padding: '0 8px', border: '2px solid #0d6efd', backgroundColor: 'var(--jira-table-bg)', overflow: 'hidden' }}>
                                <Select
                                  autoFocus
                                  isMulti
                                  classNamePrefix="rs"
                                  closeMenuOnSelect={false}
                                  hideSelectedOptions={false}
                                  options={topics.map(t => ({ value: t.id, label: t.name }))}
                                  value={topics.filter(t => editBookData.topicIds?.includes(t.id as any)).map(t => ({ value: t.id, label: t.name }))}
                                  onChange={(selected) => setEditBookData({ ...editBookData, topicIds: selected.map(s => s.value as any) })}
                                  onKeyDown={(e) => handleCellKeyDown(e, 'topics', book)}
                                  styles={{
                                    ...selectStyles,
                                    control: (base: any) => ({
                                      ...base,
                                      width: '100%',
                                      border: 'none',
                                      boxShadow: 'none',
                                      backgroundColor: 'transparent',
                                      minHeight: '42px',
                                      maxHeight: '42px',
                                      '&:hover': { border: 'none' }
                                    }),
                                    valueContainer: (base: any) => ({
                                      ...base,
                                      padding: '0 2px',
                                      flexWrap: 'wrap',
                                      overflowY: 'auto',
                                      maxHeight: '34px',
                                      '&::-webkit-scrollbar': { display: 'none' },
                                      msOverflowStyle: 'none',
                                      scrollbarWidth: 'none'
                                    })
                                  }}
                                  components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null, ClearIndicator: () => null }}
                                  placeholder="Chọn chủ đề..."
                                  menuPortalTarget={document.body}
                                />
                              </div>
                            ) : (
                              <div className="d-flex align-content-start flex-wrap gap-1 hide-scroll" style={{ overflowY: 'auto', height: '46px', padding: '2px 0' }}>
                                {(() => {
                                  const tops = editingBookId === book.id
                                    ? topics.filter(t => editBookData.topicIds?.includes(t.id as any))
                                    : book.topics;
                                  if (!tops || tops.length === 0) return null;
                                  return tops.map(t => (
                                    <span key={t.id} className="badge fw-normal" style={{ backgroundColor: 'var(--jira-hover-bg)', border: '1px solid var(--jira-border)', color: 'var(--jira-text)', padding: '3px 8px', fontSize: '13px', borderRadius: '4px' }}>
                                      {t.name}
                                    </span>
                                  ));
                                })()}
                              </div>
                            )}
                          </td>

                          <td style={{ padding: '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                            <span className="d-block small text-muted">Tạo: {book.createdBy || 'System'}</span>
                            {book.updatedBy && <span className="d-block small text-muted mt-1">Sửa: {book.updatedBy}</span>}
                          </td>

                          <td style={{ padding: '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                            <span className="d-block small text-muted">{book.updatedAt ? new Date(book.updatedAt).toLocaleString('vi-VN') : (book.createdAt ? new Date(book.createdAt).toLocaleString('vi-VN') : '-')}</span>
                          </td>

                          <td style={{ padding: '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                            <Dropdown className="d-inline-block">
                              <Dropdown.Toggle variant="none" className="jira-status-toggle">
                                {book.status || 'Active'}
                              </Dropdown.Toggle>
                              <Dropdown.Menu className="jira-status-menu">
                                <Dropdown.Item className="jira-status-item" onClick={() => handleSetStatus(book, 'Active')}>
                                  <span className="jira-status-badge" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderColor: '#22c55e' }}>Active</span>
                                </Dropdown.Item>
                                <Dropdown.Item className="jira-status-item" onClick={() => handleSetStatus(book, 'On Hold')}>
                                  <span className="jira-status-badge" style={{ backgroundColor: 'rgba(12, 102, 228, 0.1)', color: '#0c66e4', borderColor: '#0c66e4' }}>On Hold</span>
                                </Dropdown.Item>
                                <Dropdown.Divider style={{ borderColor: 'var(--jira-border)' }} />
                                <Dropdown.Item className="jira-status-item text-muted">
                                  View workflow
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>

                          <td style={{ borderRight: 0, padding: '5px 6px', backgroundColor: 'transparent', textAlign: 'center', color: 'var(--jira-text)' }}>
                            {editingBookId === book.id ? (
                              <div className="d-flex gap-2 justify-content-center">
                                <Button variant="light" size="sm" onClick={() => handleSaveEdit(book.id)} className="px-2 py-1  d-flex align-items-center" style={{ fontSize: '13px', color: '#198754', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                                  Lưu
                                </Button>
                                <Button variant="light" size="sm" onClick={handleCancelEdit} className="px-2 py-1  d-flex align-items-center" style={{ fontSize: '13px', color: '#6c757d', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                  <FontAwesomeIcon icon={faTimes} className="me-2" />
                                  Hủy
                                </Button>
                              </div>
                            ) : (
                              <div className="d-flex gap-2 justify-content-center">
                                <Button variant="primary" size="sm" onClick={() => navigate(`/books/${book.id}`)} className="text-nowrap" title="Chi tiết Sách">
                                  <FontAwesomeIcon icon={faExchangeAlt} className="me-2" />
                                  Chi tiết
                                </Button>
                                <Button variant="info" size="sm" onClick={() => handleUploadClick(book.id)} className="text-nowrap text-white" title="Upload File Sách">
                                  <FontAwesomeIcon icon={faUpload} className="me-2" />
                                  Up
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(book.id)} className="text-nowrap">
                                  <FontAwesomeIcon icon={faTrash} className="me-2" />
                                  Xóa
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      </React.Fragment>
                    ))
                  ) : !isAddingNew ? (
                    <tr>
                      <td colSpan={_formatType === undefined ? 11 : 10} style={{ border: 0, padding: 0 }}>
                        <div className="jira-empty-state">
                          <h4>There are no work items here yet</h4>
                          <p>You either don't have any work items or your existing ones don't match your current filters.</p>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </>
              </tbody>
              
            </table>
          </div>

          <div className="jira-table-footer" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', padding: '10px 16px', borderTop: 'none', backgroundColor: 'transparent' }}>
            <div className="d-flex align-items-center">
              <button className="btn-create" onClick={() => setIsAddingNew(true)} style={{ background: 'none', border: 'none', color: 'var(--jira-text-muted)', fontWeight: 500, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}>
                <FontAwesomeIcon icon={faPlus} /> Create
              </button>
            </div>
            <div className="pagination-controls d-flex align-items-center gap-2" style={{ color: 'var(--jira-text-muted)', fontSize: '12px' }}>
              <span>{validCurrentPage} of {totalPages || 1}</span>
              <button className="icon-btn" style={{ background: 'none', border: 'none', color: 'var(--jira-text-muted)', padding: '2px', cursor: 'pointer' }} onClick={() => setRefreshTrigger(prev => prev + 1)} title="Refresh">
                <FontAwesomeIcon icon={faSyncAlt} style={{ fontSize: '12px' }} />
              </button>
            </div>
            <div></div>
          </div>
        </div>
      
      <FloatingBulkActionBar 
        selectedCount={selectedIds.length} 
        onClearSelection={() => setSelectedIds([])} 
      />

      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange} 
        accept=".txt,.pdf,.epub,.doc,.docx,.zip,.cbz,.rar,.cbr"
      />
      <input 
        type="file" 
        ref={coverInputRef} 
        style={{ display: 'none' }} 
        onChange={handleCoverImageChange} 
        accept="image/*"
      />

      <Modal show={showUploadModal} onHide={() => !isLoading && setShowUploadModal(false)} centered backdrop="static">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fs-5 fw-semibold text-dark">Upload file sách</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2 pb-4 px-4">
          <div 
            className="upload-drop-zone p-4 text-center rounded-3 mb-4"
            style={{ 
              border: selectedFile ? '2px solid #5955D1' : '2px dashed #dee2e6',
              backgroundColor: selectedFile ? '#f8f8ff' : '#f8f9fa',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => !selectedFile && fileInputRef.current?.click()}
          >
            {!selectedFile ? (
              <>
                <FontAwesomeIcon icon={faUpload} className="fs-3 text-secondary mb-3" />
                <p className="mb-1 text-dark">
                  Kéo & Thả hoặc <span className="text-primary fw-medium" style={{ color: '#5955D1' }}>Chọn file</span> để tải lên
                </p>
                <p className="small text-muted mb-0">TXT, PDF, EPUB, DOC, DOCX, ZIP, CBZ, RAR, CBR</p>
              </>
            ) : (
              <div className="d-flex align-items-center justify-content-between text-start p-2  border rounded-2 shadow-sm">
                <div className="d-flex align-items-center overflow-hidden">
                  <div className="bg-light rounded p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                    <FontAwesomeIcon icon={faFileAlt} className="text-success fs-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="mb-0 fw-medium text-dark text-truncate" style={{ maxWidth: '250px' }}>{selectedFile.name}</p>
                    <div className="d-flex align-items-center mt-1">
                      <span className="small text-muted me-2">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                      {uploadProgress > 0 && <span className="small text-primary">{uploadProgress}%</span>}
                    </div>
                  </div>
                </div>
                {!isLoading && (
                  <button className="btn btn-sm btn-light text-muted border-0" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setUploadProgress(0); }}>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}
              </div>
            )}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <ProgressBar now={uploadProgress} variant="primary" className="mt-3" style={{ height: '4px' }} />
            )}
          </div>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="light" onClick={() => setShowUploadModal(false)} disabled={isLoading} className="px-4 fw-medium border">
              Hủy
            </Button>
            <Button variant="primary" onClick={handleConfirmUpload} disabled={!selectedFile || isLoading} className="px-4 fw-medium border-0" style={{ backgroundColor: '#5955D1' }}>
              Import
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showAddModal} onHide={() => !isSubmitting && setShowAddModal(false)} size="lg" centered backdrop="static">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fs-5 fw-semibold text-dark">Thêm mới Sách / Truyện</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3 pb-4 px-4">
          <div className="row g-3">
            <div className="col-md-6">
              <Form.Group>
                <Form.Label className="small fw-medium">Tên sách (*)</Form.Label>
                <Form.Control 
                  value={popupNewItem.title || ''} 
                  onChange={e => setPopupNewItem({ ...popupNewItem, title: e.target.value })}
                  placeholder="Nhập tên sách..."
                />
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group>
                <Form.Label className="small fw-medium">Tác giả (*)</Form.Label>
                <Form.Control 
                  value={popupNewItem.author || ''} 
                  onChange={e => setPopupNewItem({ ...popupNewItem, author: e.target.value })}
                  placeholder="Nhập tên tác giả..."
                />
              </Form.Group>
            </div>
            {_formatType === undefined && (
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="small fw-medium">Loại Sách</Form.Label>
                  <Form.Select 
                    value={popupNewItem.formatType || 1} 
                    onChange={e => setPopupNewItem({ ...popupNewItem, formatType: Number(e.target.value) })}
                  >
                    <option value={1}>Sách</option>
                    <option value={2}>Truyện tranh</option>
                  </Form.Select>
                </Form.Group>
              </div>
            )}
            <div className="col-md-6">
              <Form.Group>
                <Form.Label className="small fw-medium">Thể Loại</Form.Label>
                <Select
                  isMulti
                  classNamePrefix="rs"
                  options={categories.map(c => ({ value: c.id, label: c.name }))}
                  value={categories.filter(c => popupNewItem.categoryIds?.includes(c.id as any)).map(c => ({ value: c.id, label: c.name }))}
                  onChange={(selected) => setPopupNewItem({ ...popupNewItem, categoryIds: selected.map(s => s.value as any) })}
                  placeholder="Chọn thể loại..."
                  menuPortalTarget={document.body}
                />
              </Form.Group>
            </div>
            <div className="col-md-12">
              <Form.Group>
                <Form.Label className="small fw-medium">Chủ Đề</Form.Label>
                <Select
                  isMulti
                  classNamePrefix="rs"
                  options={topics.map(t => ({ value: t.id, label: t.name }))}
                  value={topics.filter(t => popupNewItem.topicIds?.includes(t.id as any)).map(t => ({ value: t.id, label: t.name }))}
                  onChange={(selected) => setPopupNewItem({ ...popupNewItem, topicIds: selected.map(s => s.value as any) })}
                  placeholder="Chọn chủ đề..."
                  menuPortalTarget={document.body}
                />
              </Form.Group>
            </div>
            <div className="col-md-12">
              <Form.Group>
                <Form.Label className="small fw-medium">Mô tả</Form.Label>
                <Form.Control 
                  as="textarea"
                  rows={3}
                  value={popupNewItem.description || ''} 
                  onChange={e => setPopupNewItem({ ...popupNewItem, description: e.target.value })}
                  placeholder="Nhập mô tả..."
                />
              </Form.Group>
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="light" onClick={() => setShowAddModal(false)} disabled={isSubmitting} className="px-4 fw-medium border">
              Hủy
            </Button>
            <Button variant="primary" onClick={handlePopupAddSubmit} disabled={isSubmitting} className="px-4 fw-medium border-0" style={{ backgroundColor: '#5955D1' }}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu lại'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

    </>
  );
};
