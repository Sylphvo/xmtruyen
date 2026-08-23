import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { debounce } from 'lodash';
import { getBooks, createBook, updateBook, deleteBook, uploadBookFile, uploadCoverImage, toggleStatus, type SaveBookRequest } from '../api/bookApi';
import { getAuthors, createAuthor, type Author } from '../api/authorApi';
import type { IBook } from '../types/book';
import type { ICategory } from '../types/category';
import type { ITopic } from '../types/topic';
import { getCategories } from '../api/categoryApi';
import { getTopics } from '../api/topicApi';
import { updateAdminPreferences, getUserById } from '../api/userApi';
import { useAuth } from '../contexts/AuthContext';
import { Form, Button, Modal, ProgressBar, Spinner, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faPlus, faExchangeAlt, faTrash, faUpload, faFileAlt, faTimes, faCheckCircle, faSyncAlt, faUser, faEllipsisH, faColumns, faBook, faTags } from '@fortawesome/free-solid-svg-icons';
import Select, { components } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import defaultBookImage from '../assets/images/default.png';
import toast from 'react-hot-toast';

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  key: keyof IBook | null;
  direction: SortDirection;
}

const CheckboxOption = (props: any) => {
  return (
    <components.Option {...props}>
      <div className="d-flex align-items-center w-100">
        <Form.Check 
          type="checkbox"
          checked={props.isSelected}
          onChange={() => {}}
          className="me-2"
          style={{ pointerEvents: 'none' }}
        />
        <span className="text-truncate">{props.label}</span>
      </div>
    </components.Option>
  );
};

const MultiValueSummary = (props: any) => {
  const { index, getValue } = props;
  const values = getValue();
  if (index > 0) return null;
  return (
    <div className="d-flex align-items-center">
      <components.MultiValue {...props} />
      {values.length > 1 && (
        <span className="badge border ms-1 fw-normal text-dark" style={{ backgroundColor: '#fff', fontSize: '12px', padding: '3px 6px' }}>
          +{values.length - 1}
        </span>
      )}
    </div>
  );
};

const CustomMenuList = (props: any) => {
  const { options, getValue, setValue } = props;
  const selectedValues = getValue();
  const allSelected = selectedValues.length === options.length && options.length > 0;
  const someSelected = selectedValues.length > 0 && selectedValues.length < options.length;

  const handleSelectAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (allSelected) {
      setValue([]); 
    } else {
      setValue(options); 
    }
  };

  return (
    <components.MenuList {...props}>
      {options.length > 0 && (
        <div 
          className="d-flex align-items-center px-3 py-2 border-bottom" 
          style={{ cursor: 'pointer', backgroundColor: 'var(--jira-hover-bg)' }}
          onMouseDown={handleSelectAll}
        >
          <Form.Check 
            type="checkbox"
            checked={allSelected}
            ref={(input: HTMLInputElement | null) => { if (input) input.indeterminate = someSelected; }}
            onChange={() => {}}
            className="me-2"
            style={{ pointerEvents: 'none' }}
          />
          <span className="fw-semibold text-dark">Select all</span>
        </div>
      )}
      {props.children}
    </components.MenuList>
  );
};

const getAvatarColor = (name: string) => {
  if (!name) return '#dfe1e6';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = ['#0052CC', '#172B4D', '#00875A', '#FF5630', '#FFAB00', '#6554C0', '#00B8D9'];
  return colors[Math.abs(hash) % colors.length];
};

const AvatarLabel = ({ name, avatarUrl }: { name: string, avatarUrl?: string }) => {
  if (!name) return (
    <div className="d-flex align-items-center gap-2">
      <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#dfe1e6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5e6c84', flexShrink: 0 }}>
        <FontAwesomeIcon icon={faUser} style={{ fontSize: '10px' }} />
      </div>
      <span className="text-truncate text-muted" style={{ fontStyle: 'italic' }}>Chưa có tác giả</span>
    </div>
  );
  return (
    <div className="d-flex align-items-center gap-2">
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
      ) : (
        <div style={{
          width: '24px', height: '24px', borderRadius: '50%',
          backgroundColor: getAvatarColor(name), color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px', fontWeight: 'bold', flexShrink: 0
        }}>
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      <span className="text-truncate" title={name}>{name}</span>
    </div>
  );
};

import { ResizableHeader } from '../components/ResizableHeader';
import { FloatingBulkActionBar } from '../components/FloatingBulkActionBar';
import { FloatingBulkActionPopover } from '../components/FloatingBulkActionPopover';
import { useNavigate, useLocation } from 'react-router-dom';
import { TableSkeleton } from '../components/Skeleton/TableSkeleton';
import { useSkeleton } from '../hooks/useSkeleton';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { LoadingMoreIndicator } from '../components/LoadingMoreIndicator';
import { InfiniteScrollFooter } from '../components/InfiniteScrollFooter';
import { ExcelActionButtons } from '../components/ExcelActionButtons';


export const Books: React.FC<{ formatType?: number }> = ({ formatType: _formatType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const getImageUrl = (url?: string) => {
    if (!url) return defaultBookImage;
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `http://localhost:5172/${url}`;
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const {
    items: data,
    totalCount: totalItems,
    isLoading,
    isLoadingMore,
    hasMore,
    loadedCount,
    sentinelRef,
    refresh,
    prependItem,
    updateItem,
    removeItem
  } = useInfiniteScroll<IBook>({
    fetchFn: async (params) => {
      const res = await getBooks({
        page: params.page,
        pageSize: params.pageSize,
        keyword: params.debouncedSearchTerm || undefined,
        formatType: _formatType !== undefined ? _formatType : undefined
      });
      return {
        data: res.data || [],
        totalCount: res.totalCount || 0,
        page: params.page,
        pageSize: params.pageSize
      };
    },
    pageSize: 20,
    params: { debouncedSearchTerm, refreshTrigger, _formatType }
  });

  const { showSkeleton } = useSkeleton({ isLoading });

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newItem, setNewItem] = useState<Partial<SaveBookRequest>>({});
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [editBookData, setEditBookData] = useState<Partial<SaveBookRequest>>({});
  const [activeEditField, setActiveEditField] = useState<string | null>(null);

  const [focusedCell, setFocusedCell] = useState<{ id: string, field: string } | null>(null);
  const getCellStyle = (bookId: string, field: string, baseStyle: React.CSSProperties = {}) => {
    const isFocused = focusedCell?.id === bookId && focusedCell?.field === field;
    const isEditing = editingBookId === bookId && activeEditField === field;
    return {
      ...baseStyle,
      outline: isFocused && !isEditing ? '2px solid #4c9aff' : 'none',
      outlineOffset: '-2px',
      borderRadius: isFocused && !isEditing ? '3px' : '0',
    };
  };

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const defaultColumnOrder = [
    'checkbox', 'cover', 'title', 'author', 'formatType', 'displayLabel', 
    'categories', 'topics', 'creator', 'updatedAt', 'status', 'action'
  ];
  const [columnOrder, setColumnOrder] = useState<string[]>(() => {
    const savedOrder = localStorage.getItem('booksColumnOrder');
    if (savedOrder) {
      try {
        return JSON.parse(savedOrder);
      } catch (e) {
        return defaultColumnOrder;
      }
    }
    return defaultColumnOrder;
  });

  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      getUserById(user.id).then((userData: any) => {
        if (userData?.adminPreferences) {
          try {
            const prefs = JSON.parse(userData.adminPreferences);
            if (prefs.columnOrder && Array.isArray(prefs.columnOrder)) {
              setColumnOrder(prefs.columnOrder);
            }
          } catch (e) {
            console.error('Error parsing admin preferences', e);
          }
        }
      }).catch(e => console.error('Error loading admin preferences', e));
    }
  }, [user?.id]);

  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [bulkPopoverAction, setBulkPopoverAction] = useState<'formatType' | 'status' | 'displayLabel' | null>(null);

  const handleColumnDragStart = (e: React.DragEvent<HTMLDivElement>, colId: string) => {
    setDraggedColumn(colId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleColumnDragOver = (e: React.DragEvent<HTMLDivElement>, colId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== colId) {
      setDragOverColumn(colId);
    }
  };


  const saveToDatabase = useCallback(
    debounce((newColumns: string[]) => {
      if (user?.id) {
        updateAdminPreferences(user.id, { columnOrder: newColumns })
          .then(() => toast.success('Đã lưu cấu hình bảng!'))
          .catch(e => console.error('Lỗi khi lưu cấu hình:', e));
      }
    }, 2000),
    [user]
  );

  const handleColumnDrop = (e: React.DragEvent<HTMLDivElement>, targetColId: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (draggedColumn && draggedColumn !== targetColId) {
      setColumnOrder((prevOrder) => {
        const newOrder = [...prevOrder];
        const draggedIndex = newOrder.indexOf(draggedColumn);
        const targetIndex = newOrder.indexOf(targetColId);
        
        newOrder.splice(draggedIndex, 1);
        newOrder.splice(targetIndex, 0, draggedColumn);
        
        // Bước B: Lưu ngay vào localStorage (Chống F5 mất dữ liệu)
        localStorage.setItem('booksColumnOrder', JSON.stringify(newOrder));
        
        // Bước C: Gọi hàm lưu ngầm lên server
        saveToDatabase(newOrder);
        
        return newOrder;
      });
    }
    setDraggedColumn(null);
  };

  const handleColumnDragEnd = () => {
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

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

  const [allAuthors, setAllAuthors] = useState<Author[]>([]);
  useEffect(() => {
    getAuthors().then(setAllAuthors).catch(console.error);
  }, []);

  const uniqueAuthors = useMemo(() => {
    const options = allAuthors.map(a => ({ value: a.name, label: a.name, avatarUrl: a.avatarUrl }));
    const existingNames = new Set(options.map(o => o.value));
    data.forEach(book => {
      if (book.author && !existingNames.has(book.author)) {
        options.push({ value: book.author, label: book.author, avatarUrl: undefined });
        existingNames.add(book.author);
      }
    });
    return options;
  }, [allAuthors, data]);

  const formatAuthorOptionLabel = (option: any) => {
    if (option.__isNew__) {
      return (
        <div className="d-flex align-items-center gap-2">
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#dfe1e6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5e6c84', flexShrink: 0 }}>
            <FontAwesomeIcon icon={faPlus} style={{ fontSize: '12px' }} />
          </div>
          <span>Thêm tác giả: "{option.label}"</span>
        </div>
      );
    }
    return <AvatarLabel name={option.label} avatarUrl={option.avatarUrl} />;
  };

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
              refresh();
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
    const toastId = toast.loading('Đang xử lý...');
    try {
      setUploadProgress(20);
      
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await uploadBookFile(selectedFile, uploadingBookId);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        toast.success('Upload file thành công. Tệp đang được xử lý ngầm.');
        refresh();
        setShowUploadModal(false);
        toast.dismiss(toastId);
      }, 500);
      
    } catch (err) {
      console.error(err);
      toast.error('Lỗi khi upload file');
      toast.dismiss(toastId);
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


  const handlePopupAddSubmit = async () => {
    if (!popupNewItem.title) {
      toast.error('Vui lòng nhập tiêu đề sách');
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
        displayLabel: popupNewItem.displayLabel || undefined,
        categoryIds: popupNewItem.categoryIds || [],
        topicIds: popupNewItem.topicIds || [],
        description: popupNewItem.description,
        coverImageUrl: popupNewItem.coverImageUrl
      };
      await createBook(request);
      setShowAddModal(false);
      refresh();
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
    if (!newItem.title) {
      toast.error('Vui lòng nhập tiêu đề sách');
      return;
    }
    try {
      setIsSubmitting(true);

      if (newItem.author && !allAuthors.some(a => a.name.toLowerCase() === newItem.author!.toLowerCase())) {
        try {
          const newAuth = await createAuthor({ name: newItem.author! });
          setAllAuthors(prev => [...prev, newAuth]);
        } catch (e) {
          console.error('Lỗi khi tạo tác giả mới', e);
        }
      }

      const request: SaveBookRequest = {
        id: newItem.id,
        title: newItem.title,
        author: newItem.author,
        formatType: newItem.formatType || 1,
        accessLevel: newItem.accessLevel || 1,
        displayLabel: newItem.displayLabel || undefined,
        categoryIds: newItem.categoryIds || [],
        topicIds: newItem.topicIds || [],
      };
      await createBook(request);
      handleCloseAdd();
      refresh();
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
      updateItem(book.id, b => ({ ...b, status: newStatus as any }));
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
        displayLabel: book.displayLabel,
        categoryIds: book.categories?.map(c => c.id) || [],
        topicIds: book.topics?.map(t => t.id) || [],
      });
    }
    setActiveEditField(field);
  };

  const handleCellKeyDown = (e: React.KeyboardEvent, currentField: string, book: IBook) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const fields = ['title', 'author', 'formatType', 'displayLabel', 'categories', 'topics'];
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

  const handleSaveEdit = async (id: string, overrideData?: Partial<SaveBookRequest>) => {
    const dataToSave = overrideData || editBookData;
    if (!dataToSave.title) {
      toast.error('Vui lòng nhập tiêu đề sách');
      return;
    }
    try {
      if (dataToSave.author && !allAuthors.some(a => a.name.toLowerCase() === dataToSave.author!.toLowerCase())) {
        try {
          const newAuth = await createAuthor({ name: dataToSave.author! });
          setAllAuthors(prev => [...prev, newAuth]);
        } catch (e) {
          console.error('Lỗi khi tạo tác giả mới', e);
        }
      }

      await updateBook(id, dataToSave as SaveBookRequest);
      setEditingBookId(null);
      setActiveEditField(null);
      refresh();
    } catch (error) {
      console.error('Lỗi khi cập nhật sách:', error);
      toast.error('Không thể cập nhật sách');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sách này?')) {
      try {
        await deleteBook(id);
        removeItem(id);
      } catch (error) {
        console.error('Lỗi khi xóa sách:', error);
        toast.error('Không thể xóa sách');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} sách đã chọn?`)) {
      const deletePromise = Promise.all(selectedIds.map(id => deleteBook(id)));
      toast.promise(deletePromise, {
        loading: 'Đang xóa...',
        success: 'Xóa thành công!',
        error: 'Có lỗi xảy ra khi xóa'
      });
      
      try {
        await deletePromise;
        selectedIds.forEach(i => removeItem(i));
        setSelectedIds([]);
      } catch (error) {
        console.error('Lỗi khi xóa hàng loạt:', error);
      }
    }
  };

  const handleBulkUpdate = async (
    action: 'formatType' | 'status' | 'displayLabel',
    value: string
  ) => {
    const count = selectedIds.length;
    const label = action === 'formatType' ? 'Loại sách' : action === 'status' ? 'Trạng thái' : 'Danh mục hiển thị';

    const updatePromise = Promise.all(
      selectedIds.map(async (id) => {
        const book = data.find(b => b.id === id);
        if (!book) return;

        if (action === 'status') {
          return toggleStatus(id, value);
        } else {
          const req: SaveBookRequest = {
            title: book.title,
            author: book.author || '',
            formatType: action === 'formatType' ? parseInt(value) : (book.formatType || 1),
            accessLevel: book.accessLevel || 1,
            displayLabel: action === 'displayLabel' ? value : book.displayLabel,
            categoryIds: book.categories?.map(c => c.id as any) || [],
            topicIds: book.topics?.map(t => t.id as any) || [],
          };
          return updateBook(id, req);
        }
      })
    );

    toast.promise(updatePromise, {
      loading: `Đang cập nhật ${label} cho ${count} sách...`,
      success: `Đã cập nhật ${label} thành công!`,
      error: `Lỗi khi cập nhật ${label}`
    });

    try {
      await updatePromise;
      // Cập nhật local state ngay lập tức không cần refresh toàn trang
      selectedIds.forEach(id => {
        updateItem(id, (book) => {
          if (action === 'formatType') return { ...book, formatType: parseInt(value) as any };
          if (action === 'status') return { ...book, status: value as any };
          if (action === 'displayLabel') return { ...book, displayLabel: value };
          return book;
        });
      });
      setSelectedIds([]);
    } catch (error) {
      console.error(`Lỗi khi bulk update ${action}:`, error);
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
      <div className="jira-table-container" style={{ position: 'relative', opacity: bulkPopoverAction ? 0.5 : 1, transition: 'opacity 0.15s ease', pointerEvents: bulkPopoverAction ? 'none' : undefined }}>
        {/* Custom Header for search and filters */}
        <div className="d-flex justify-content-between align-items-center p-3" style={{ borderBottom: '1px solid var(--jira-border)' }}>
          <h5 className="mb-0 fw-semibold" style={{ color: '#172b4d', fontSize: '16px' }}>Quản lý Sách</h5>
          <div className="d-flex align-items-center gap-3">
            
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
                }}
              />
            </div>
          <ExcelActionButtons 
              dataToExport={data || []}
              exportFileName={typeof document !== 'undefined' ? document.title.replace(' | Xóm Truyện', '').replace(/ /g, '_') : 'Books'}
              onRefresh={typeof refresh !== 'undefined' ? refresh : undefined}
              isLoading={typeof isLoading !== 'undefined' ? isLoading : false}
            /></div>
        </div>

        <div className="table-responsive jira-scroll" style={{ maxHeight: '1756px', overflowX: 'auto', overflowY: 'auto' }}>
          <table className="table align-middle mb-0" style={{ borderCollapse: 'separate', borderSpacing: 0, backgroundColor: 'transparent', tableLayout: 'fixed', minWidth: '1450px' }}>
            <thead className="jira-table-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                {columnOrder.map((colId) => {
                  if (colId === 'formatType' && _formatType !== undefined) return null;
                  
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
                          checked={data.length > 0 && selectedIds.length === data.length}
                          ref={(input) => {
                            if (input) {
                              input.indeterminate = selectedIds.length > 0 && selectedIds.length < data.length;
                            }
                          }}
                          onChange={handleSelectAll}
                        />
                      );
                      break;
                    case 'cover':
                      initialWidth = 90;
                      headerContent = <span className="fw-semibold text-nowrap">Ảnh Bìa</span>;
                      break;
                    case 'title':
                      initialWidth = 260; onClick = () => handleSort('title');
                      headerContent = <span className="fw-semibold text-nowrap">Tên Sách {getSortIcon('title')}</span>;
                      break;
                    case 'author':
                      initialWidth = 150; onClick = () => handleSort('author');
                      headerContent = <span className="fw-semibold text-nowrap">Tác Giả {getSortIcon('author')}</span>;
                      break;
                    case 'formatType':
                      initialWidth = 140;
                      headerContent = <span className="fw-semibold text-nowrap">Loại Sách</span>;
                      break;
                    case 'displayLabel':
                      initialWidth = 180;
                      headerContent = <span className="fw-semibold text-nowrap">Danh mục hiển thị</span>;
                      break;
                    case 'categories':
                      initialWidth = 180;
                      headerContent = <span className="fw-semibold text-nowrap">Thể Loại</span>;
                      break;
                    case 'topics':
                      initialWidth = 180;
                      headerContent = <span className="fw-semibold text-nowrap">Chủ Đề</span>;
                      break;
                    case 'creator':
                      initialWidth = 150;
                      headerContent = <span className="fw-semibold text-nowrap">Người Tạo / Sửa</span>;
                      break;
                    case 'updatedAt':
                      initialWidth = 180;
                      headerContent = <span className="fw-semibold text-nowrap">Thời Gian Update</span>;
                      break;
                    case 'status':
                      initialWidth = 150; minWidth = 150; onClick = () => handleSort('status');
                      headerContent = <span className="fw-semibold text-nowrap">Trạng Thái {getSortIcon('status')}</span>;
                      break;
                    case 'action':
                      initialWidth = 60; minWidth = 60;
                      headerContent = <span className="fw-semibold text-nowrap"><FontAwesomeIcon icon={faColumns} className="text-muted" style={{ fontSize: '14px' }} /></span>;
                      break;
                  }
                  
                  return (
                    <ResizableHeader 
                      key={colId}
                      initialWidth={initialWidth} 
                      minWidth={minWidth}
                      onClick={onClick}
                      style={{ 
                        borderLeft: colId === 'checkbox' ? 0 : undefined,
                        borderRight: colId === 'action' ? 0 : undefined,
                        backgroundColor: dragOverColumn === colId ? 'rgba(9, 30, 66, 0.08)' : 'transparent', 
                        padding: '5px 6px', 
                        textAlign: 'center', 
                        color: 'var(--jira-text)',
                        cursor: draggedColumn === colId ? 'grabbing' : 'grab',
                        opacity: draggedColumn === colId ? 0.5 : 1,
                        transition: 'background-color 0.2s, opacity 0.2s'
                      }}
                      draggable
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
              <tbody style={{ height: '1px' }}>
                <>
                  {showSkeleton ? (
                    <tr>
                      <td colSpan={_formatType === undefined ? 11 : 10} style={{ borderLeft: 0, borderRight: 0, padding: 0 }}>
                        <TableSkeleton rows={50} columns={8} hasCheckbox hasImage hasActions />
                      </td>
                    </tr>
                  ) : sortedData.length > 0 ? (
                    sortedData.map((book) => (
                      <React.Fragment key={book.id}>
                        <tr className={editingBookId === book.id ? "jira-table-row inline-edit-row" : "jira-table-row"} style={{ height: '46px', backgroundColor: selectedIds.includes(book.id) ? '#ebf2fc' : 'transparent' }}>
                          {columnOrder.map((colId) => {
                            if (colId === 'formatType' && _formatType !== undefined) return null;
                            
                            switch(colId) {
                              case 'checkbox':
                                return (
                                  <td key={colId} style={{ borderLeft: 0, padding: '5px 6px', backgroundColor: 'transparent', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                                    <Form.Check
                                      type="checkbox"
                                      checked={selectedIds.includes(book.id)}
                                      onChange={() => toggleSelect(book.id)}
                                    />
                                  </td>
                                );
                              case 'cover':
                                return (
                                  <td key={colId} style={{ padding: '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)', textAlign: 'center' }}>
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
                                );
                              case 'title':
                                return (
                                  <td key={colId}
                                    onClick={() => setFocusedCell({ id: book.id, field: 'title' })}
                                    style={getCellStyle(book.id, 'title', { padding: editingBookId === book.id && activeEditField === 'title' ? '0 16px' : '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' })}
                                  >
                                    <div className="d-flex align-items-center gap-3 h-100">
                                      {editingBookId === book.id && activeEditField === 'title' ? (
                                        <Form.Control
                                          value={editBookData.title || ''}
                                          onChange={(e) => setEditBookData({ ...editBookData, title: e.target.value })}
                                          onKeyDown={(e) => handleCellKeyDown(e, 'title', book)} onBlur={() => handleSaveEdit(book.id)}
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
                                );
                              case 'author':
                                return (
                                  <td key={colId}
                                    onClick={() => setFocusedCell({ id: book.id, field: 'author' })}
                                    onDoubleClick={(e) => {
                                      setEditingBookId(book.id);
                                      setActiveEditField('author');
                                      setEditBookData({ ...book, author: book.author });
                                    }}
                                    style={getCellStyle(book.id, 'author', { padding: editingBookId === book.id && activeEditField === 'author' ? 0 : '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' })}
                                  >
                                    {editingBookId === book.id && activeEditField === 'author' ? (
                                      <div 
                                        style={{ position: 'relative', width: '100%', height: '100%' }}
                                        onDoubleClick={(e) => { e.stopPropagation(); setEditBookData({ ...editBookData, author: '' }); }}
                                      >
                                        <div style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#dfe1e6', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setEditBookData({ ...editBookData, author: '' }); }}>
                                          <FontAwesomeIcon icon={faUser} style={{ fontSize: '10px', color: '#5e6c84' }} />
                                        </div>
                                        <CreatableSelect
                                          inputValue={editBookData.author || ''}
                                          onInputChange={(val, actionMeta) => {
                                            if (actionMeta.action === 'input-change') {
                                              setEditBookData({ ...editBookData, author: val });
                                            }
                                          }}
                                          onChange={(selected: any) => {
                                            if (selected) {
                                              const newData = { ...editBookData, author: selected.value };
                                              setEditBookData(newData);
                                              handleSaveEdit(book.id, newData);
                                            }
                                          }}
                                          options={uniqueAuthors}
                                          formatOptionLabel={formatAuthorOptionLabel}
                                          classNamePrefix="rs"
                                          placeholder="Tác giả"
                                          styles={{
                                            ...selectStyles,
                                            valueContainer: (base: any) => ({ ...base, paddingLeft: '32px' })
                                          }}
                                          menuPortalTarget={document.body}
                                          components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                          controlShouldRenderValue={false}
                                          onBlur={() => handleSaveEdit(book.id)}
                                          onKeyDown={(e: any) => { if (e.key === 'Enter') handleSaveEdit(book.id); else if (e.key === 'Escape') handleCancelEdit(); }}
                                          autoFocus
                                        />
                                      </div>
                                    ) : (
                                      <AvatarLabel 
                                        name={editingBookId === book.id ? editBookData.author || '' : book.author} 
                                        avatarUrl={uniqueAuthors.find(a => a.value === (editingBookId === book.id ? editBookData.author : book.author))?.avatarUrl}
                                      />
                                    )}
                                  </td>
                                );
                              case 'formatType':
                                return (
                                  <td key={colId} style={{ padding: '5px 6px', backgroundColor: 'transparent', textAlign: 'center', color: 'var(--jira-text)' }}>
                                    <Dropdown className="d-inline-block">
                                      <Dropdown.Toggle variant="none" className="jira-status-toggle" style={{ fontWeight: 'normal', backgroundColor: 'var(--jira-hover-bg)' }}>
                                        {book.formatType === 2 ? 'Truyện tranh' : (book.formatType === 1 ? 'Sách' : 'Khác')}
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu className="jira-status-menu" popperConfig={{ strategy: 'fixed' }} renderOnMount>
                                        <Dropdown.Item className="jira-status-item" active={book.formatType === 1 || !book.formatType} onClick={() => handleSaveEdit(book.id, { title: book.title, author: book.author, accessLevel: book.accessLevel, categoryIds: book.categories?.map(c => c.id as any) || [], topicIds: book.topics?.map(t => t.id as any) || [], formatType: 1 })}>
                                          Sách
                                        </Dropdown.Item>
                                        <Dropdown.Item className="jira-status-item" active={book.formatType === 2} onClick={() => handleSaveEdit(book.id, { title: book.title, author: book.author, accessLevel: book.accessLevel, categoryIds: book.categories?.map(c => c.id as any) || [], topicIds: book.topics?.map(t => t.id as any) || [], formatType: 2 })}>
                                          Truyện tranh
                                        </Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </td>
                                );
                              case 'displayLabel':
                                return (
                                  <td key={colId} style={{ padding: '5px 6px', backgroundColor: 'transparent', textAlign: 'center', color: 'var(--jira-text)' }}>
                                    <Dropdown className="d-inline-block">
                                      <Dropdown.Toggle variant="none" className="jira-status-toggle" style={{ fontWeight: 'normal', backgroundColor: 'var(--jira-hover-bg)', maxWidth: '160px', padding: '2px 6px' }}>
                                        <span className="text-truncate" style={{ maxWidth: '130px', display: 'inline-block', verticalAlign: 'bottom' }}>
                                          {book.displayLabel || 'Trống (-)'}
                                        </span>
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu className="jira-status-menu" popperConfig={{ strategy: 'fixed' }} renderOnMount>
                                        <Dropdown.Item className="jira-status-item" active={!book.displayLabel} onClick={() => handleSaveEdit(book.id, { title: book.title, author: book.author, accessLevel: book.accessLevel, categoryIds: book.categories?.map(c => c.id as any) || [], topicIds: book.topics?.map(t => t.id as any) || [], formatType: book.formatType, displayLabel: '' })}>
                                          Trống (-)
                                        </Dropdown.Item>
                                        <Dropdown.Item className="jira-status-item" active={book.displayLabel === 'Sách mới mỗi ngày - Free'} onClick={() => handleSaveEdit(book.id, { title: book.title, author: book.author, accessLevel: book.accessLevel, categoryIds: book.categories?.map(c => c.id as any) || [], topicIds: book.topics?.map(t => t.id as any) || [], formatType: book.formatType, displayLabel: 'Sách mới mỗi ngày - Free' })}>
                                          Sách mới mỗi ngày - Free
                                        </Dropdown.Item>
                                        <Dropdown.Item className="jira-status-item" active={book.displayLabel === 'Sách mới mỗi ngày - Dành cho Hội viên!'} onClick={() => handleSaveEdit(book.id, { title: book.title, author: book.author, accessLevel: book.accessLevel, categoryIds: book.categories?.map(c => c.id as any) || [], topicIds: book.topics?.map(t => t.id as any) || [], formatType: book.formatType, displayLabel: 'Sách mới mỗi ngày - Dành cho Hội viên!' })}>
                                          Sách mới mỗi ngày - Dành cho Hội viên!
                                        </Dropdown.Item>
                                        <Dropdown.Item className="jira-status-item" active={book.displayLabel === 'Truyện Tranh'} onClick={() => handleSaveEdit(book.id, { title: book.title, author: book.author, accessLevel: book.accessLevel, categoryIds: book.categories?.map(c => c.id as any) || [], topicIds: book.topics?.map(t => t.id as any) || [], formatType: book.formatType, displayLabel: 'Truyện Tranh' })}>
                                          Truyện Tranh
                                        </Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </td>
                                );
                              case 'categories':
                                return (
                                  <td key={colId}
                                    onClick={() => setFocusedCell({ id: book.id, field: 'categories' })}
                                    onDoubleClick={() => handleCellDoubleClick(book, 'categories')}
                                    style={getCellStyle(book.id, 'categories', { padding: editingBookId === book.id && activeEditField === 'categories' ? 0 : '4px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)', height: '100%' })}
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
                                          onKeyDown={(e) => handleCellKeyDown(e, 'categories', book)} onBlur={() => handleSaveEdit(book.id)}
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
                                            }),
                                            multiValueLabel: (base: any) => ({
                                              ...base,
                                              maxWidth: '120px',
                                              overflow: 'hidden',
                                              textOverflow: 'ellipsis',
                                              whiteSpace: 'nowrap'
                                            })
                                          }}
                                          components={{ 
                                            DropdownIndicator: () => null, 
                                            IndicatorSeparator: () => null, 
                                            ClearIndicator: () => null,
                                            Option: CheckboxOption,
                                            MultiValue: MultiValueSummary,
                                            MenuList: CustomMenuList
                                          }}
                                          placeholder="Chọn thể loại..."
                                          menuPortalTarget={document.body}
                                        />
                                      </div>
                                    ) : (
                                      <div className="d-flex align-items-center gap-1 hide-scroll" style={{ overflowY: 'auto', height: '46px', padding: '2px 0' }}>
                                        {(() => {
                                          const cats = editingBookId === book.id
                                            ? categories.filter(c => editBookData.categoryIds?.includes(c.id as any))
                                            : book.categories;
                                          if (!cats || cats.length === 0) return null;
                                          return (
                                            <>
                                              <span className="badge fw-normal text-truncate d-inline-block" style={{ backgroundColor: 'var(--jira-hover-bg)', border: '1px solid var(--jira-border)', color: 'var(--jira-text)', padding: '3px 8px', fontSize: '13px', borderRadius: '4px', maxWidth: '120px', verticalAlign: 'bottom' }}>
                                                {cats[0].name}
                                              </span>
                                              {cats.length > 1 && (
                                                <span className="badge border fw-normal text-dark" style={{ backgroundColor: '#fff', fontSize: '12px', padding: '3px 6px' }}>
                                                  +{cats.length - 1}
                                                </span>
                                              )}
                                            </>
                                          );
                                        })()}
                                      </div>
                                    )}
                                  </td>
                                );
                              case 'topics':
                                return (
                                  <td key={colId}
                                    onClick={() => setFocusedCell({ id: book.id, field: 'topics' })}
                                    onDoubleClick={() => handleCellDoubleClick(book, 'topics')}
                                    style={getCellStyle(book.id, 'topics', { padding: editingBookId === book.id && activeEditField === 'topics' ? 0 : '4px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)', height: '100%' })}
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
                                          onKeyDown={(e) => handleCellKeyDown(e, 'topics', book)} onBlur={() => handleSaveEdit(book.id)}
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
                                            }),
                                            multiValueLabel: (base: any) => ({
                                              ...base,
                                              maxWidth: '120px',
                                              overflow: 'hidden',
                                              textOverflow: 'ellipsis',
                                              whiteSpace: 'nowrap'
                                            })
                                          }}
                                          components={{ 
                                            DropdownIndicator: () => null, 
                                            IndicatorSeparator: () => null, 
                                            ClearIndicator: () => null,
                                            Option: CheckboxOption,
                                            MultiValue: MultiValueSummary,
                                            MenuList: CustomMenuList
                                          }}
                                          placeholder="Chọn chủ đề..."
                                          menuPortalTarget={document.body}
                                        />
                                      </div>
                                    ) : (
                                      <div className="d-flex align-items-center gap-1 hide-scroll" style={{ overflowY: 'auto', height: '46px', padding: '2px 0' }}>
                                        {(() => {
                                          const tops = editingBookId === book.id
                                            ? topics.filter(t => editBookData.topicIds?.includes(t.id as any))
                                            : book.topics;
                                          if (!tops || tops.length === 0) return null;
                                          return (
                                            <>
                                              <span className="badge fw-normal text-truncate d-inline-block" style={{ backgroundColor: 'var(--jira-hover-bg)', border: '1px solid var(--jira-border)', color: 'var(--jira-text)', padding: '3px 8px', fontSize: '13px', borderRadius: '4px', maxWidth: '120px', verticalAlign: 'bottom' }}>
                                                {tops[0].name}
                                              </span>
                                              {tops.length > 1 && (
                                                <span className="badge border fw-normal text-dark" style={{ backgroundColor: '#fff', fontSize: '12px', padding: '3px 6px' }}>
                                                  +{tops.length - 1}
                                                </span>
                                              )}
                                            </>
                                          );
                                        })()}
                                      </div>
                                    )}
                                  </td>
                                );
                              case 'creator':
                                return (
                                  <td key={colId} style={{ padding: '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                                    <span className="d-block small text-muted">Tạo: {book.createdBy || 'System'}</span>
                                    {book.updatedBy && <span className="d-block small text-muted mt-1">Sửa: {book.updatedBy}</span>}
                                  </td>
                                );
                              case 'updatedAt':
                                return (
                                  <td key={colId} style={{ padding: '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                                    <span className="d-block small text-muted">{book.updatedAt ? new Date(book.updatedAt).toLocaleString('vi-VN') : (book.createdAt ? new Date(book.createdAt).toLocaleString('vi-VN') : '-')}</span>
                                  </td>
                                );
                              case 'status':
                                return (
                                  <td key={colId} style={{ padding: '5px 6px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                                    <Dropdown className="d-inline-block">
                                      <Dropdown.Toggle variant="none" className="jira-status-toggle">
                                        {book.status || 'Active'}
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu className="jira-status-menu" popperConfig={{ strategy: 'fixed' }} renderOnMount>
                                        <Dropdown.Item className="jira-status-item" active={book.status === 'Active' || !book.status} onClick={() => handleSetStatus(book, 'Active')}>
                                          Active
                                        </Dropdown.Item>
                                        <Dropdown.Item className="jira-status-item" active={book.status === 'On Hold'} onClick={() => handleSetStatus(book, 'On Hold')}>
                                          On Hold
                                        </Dropdown.Item>
                                        <Dropdown.Divider style={{ borderColor: 'var(--jira-border)' }} />
                                        <Dropdown.Item className="jira-status-item text-muted">
                                          View workflow
                                        </Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </td>
                                );
                              case 'action':
                                return (
                                  <td key={colId} style={{ borderRight: 0, padding: '5px 6px', backgroundColor: 'transparent', textAlign: 'center', color: 'var(--jira-text)' }}>
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
                                      <Dropdown className="d-inline-block">
                                        <Dropdown.Toggle variant="none" className="jira-action-toggle p-1 border-0 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'transparent', color: 'var(--jira-text)', width: '32px', height: '32px', margin: '0 auto' }}>
                                          <FontAwesomeIcon icon={faEllipsisH} />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="shadow-sm border-0 py-2" popperConfig={{ strategy: 'fixed' }} renderOnMount>
                                          <Dropdown.Item onClick={() => { sessionStorage.setItem('bookDetailReferrer', location.pathname); navigate(`/books/${book.id}`); }} className="py-2 px-3 text-body" style={{ fontSize: '14px' }}>
                                            Chi tiết
                                          </Dropdown.Item>
                                          <Dropdown.Item onClick={() => handleUploadClick(book.id)} className="py-2 px-3 text-body" style={{ fontSize: '14px' }}>
                                            Upload File
                                          </Dropdown.Item>
                                          <Dropdown.Divider />
                                          <Dropdown.Item onClick={() => handleDelete(book.id)} className="py-2 px-3 text-danger" style={{ fontSize: '14px' }}>
                                            Xóa
                                          </Dropdown.Item>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    )}
                                  </td>
                                );
                            }
                            return null;
                          })}
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
                {!isLoading && <LoadingMoreIndicator isVisible={isLoadingMore} colSpan={_formatType === undefined ? 11 : 10} />}
              </tbody>
              
            </table>
            {hasMore && <div ref={sentinelRef} className="scroll-sentinel" />}
          </div>

          {isAddingNew && (
            <div style={{ padding: '8px 12px', backgroundColor: '#fff', borderTop: '1px solid var(--jira-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #4c9aff', borderRadius: '3px', backgroundColor: '#fff', padding: '4px 8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  <Button variant="light" size="sm" style={{ border: 'none', backgroundColor: 'transparent', color: '#6b778c', padding: '0 8px' }} onClick={handleCloseAdd}>
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                  <input
                    autoFocus
                    value={newItem.title || ''}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    onKeyDown={(e) => handleKeyDown(e, handleAddSubmit, handleCloseAdd)}
                    placeholder="What needs to be done?"
                    style={{ border: 'none', outline: 'none', flex: 1, width: '100%', fontSize: '14px', color: '#172b4d', backgroundColor: 'transparent', marginLeft: '4px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Button 
                    variant="light" 
                    size="sm" 
                    style={{ backgroundColor: '#0052cc', color: '#fff', border: 'none', borderRadius: '3px', fontWeight: 500, padding: '4px 12px', opacity: !newItem.title ? 0.6 : 1 }}
                    onClick={handleAddSubmit}
                    disabled={isSubmitting || !newItem.title}
                  >
                    Create <FontAwesomeIcon icon={faCheckCircle} className="ms-1" style={{ fontSize: '12px' }} />
                  </Button>
                  <Button
                    variant="light"
                    size="sm"
                    onClick={handleCloseAdd}
                    style={{ border: 'none', backgroundColor: 'transparent', color: '#6b778c', padding: '4px 8px' }}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <InfiniteScrollFooter
            loadedCount={loadedCount}
            totalCount={totalItems}
            onRefresh={refresh}
            onCreateClick={() => setIsAddingNew(true)}
            showCreate={!isAddingNew}
          />
        </div>

        {/* Backdrop + Popover được đặt bên trong container để backdrop chỉ phủ lên bảng */}
        {bulkPopoverAction && (
          <FloatingBulkActionPopover
            title={
              bulkPopoverAction === 'formatType' ? 'Loại sách' :
              bulkPopoverAction === 'status' ? 'Trạng thái' : 'Danh mục hiển thị'
            }
            options={
              bulkPopoverAction === 'formatType' ? [
                { label: 'Sách', value: '1' },
                { label: 'Truyện tranh', value: '2' }
              ] : bulkPopoverAction === 'status' ? [
                { label: 'Active', value: 'Active' },
                { label: 'On Hold', value: 'On Hold' }
              ] : [
                { label: 'Trống (-)', value: '' },
                { label: 'Sách mới mỗi ngày - Free', value: 'Sách mới mỗi ngày - Free' },
                { label: 'Sách mới mỗi ngày - Dành cho Hội viên!', value: 'Sách mới mỗi ngày - Dành cho Hội viên!' },
                { label: 'Truyện Tranh', value: 'Truyện Tranh' }
              ]
            }
            onCancel={() => setBulkPopoverAction(null)}
            onSubmit={(value) => {
              const action = bulkPopoverAction!;
              setBulkPopoverAction(null);
              handleBulkUpdate(action, value);
            }}
          />
        )}
      
      <FloatingBulkActionBar 
        selectedCount={selectedIds.length} 
        onClearSelection={() => setSelectedIds([])} 
        onBulkDelete={handleBulkDelete}
        onBulkEdit={() => setBulkPopoverAction('formatType')}
        onBulkStatusChange={() => setBulkPopoverAction('status')}
        onBulkWatch={() => setBulkPopoverAction('displayLabel')}
        editLabel="Loại sách"
        editIcon={faBook}
        statusLabel="Trạng thái"
        watchLabel="Danh mục hiển thị"
        watchIcon={faTags}
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
