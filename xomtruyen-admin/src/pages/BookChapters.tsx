import React, { useState, useEffect } from 'react';
import { Button, Form, Modal, Badge } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import { Book, Edit2, Trash, Save, Lock, Unlock } from 'lucide-react';
import * as api from '../api/bookChapterApi';
import { getTableData } from '../api/managerDbApi';
import { ResizableHeader } from '../components/ResizableHeader';
import { FloatingBulkActionBar } from '../components/FloatingBulkActionBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { LoadingMoreIndicator } from '../components/LoadingMoreIndicator';
import { InfiniteScrollFooter } from '../components/InfiniteScrollFooter';
import { ExcelActionButtons } from '../components/ExcelActionButtons';


export const BookChapters: React.FC = () => {
  const [publications, setPublications] = useState<any[]>([]);
  const [selectedPubId, setSelectedPubId] = useState<string>('');
  
  const {
    items: chapters,
    totalCount,
    isLoading: loading,
    isLoadingMore,
    hasMore,
    loadedCount,
    sentinelRef,
    refresh
  } = useInfiniteScroll<api.BookChapter>({
    fetchFn: async () => {
      if (!selectedPubId) return { data: [], totalCount: 0, page: 1, pageSize: 50 };
      const data = await api.getChapters(selectedPubId);
      return {
        data,
        totalCount: data.length,
        page: 1,
        pageSize: data.length
      };
    },
    pageSize: 50,
    params: { selectedPubId }
  });
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<api.BookChapter>>({
    chapterNumber: 1,
    title: '',
    content: '',
    isLocked: false,
    coinPrice: 0
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(chapters.map(c => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const res = await getTableData('Publications', 1, 500);
      // Giả định FormatType = 0 là Text (hoặc lấy tất cả)
      const textPubs = res.data.filter((p: any) => p.formatType === 0 || p.formatType === 'Text');
      setPublications(textPubs);
      if (textPubs.length > 0) {
        setSelectedPubId(textPubs[0].id);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách truyện chữ');
    }
  };


  const handleShowModal = async (chapter?: api.BookChapter) => {
    if (chapter) {
      setIsEditing(true);
      try {
        const fullChapter = await api.getChapter(chapter.id);
        setFormData({
          id: fullChapter.id,
          publicationId: fullChapter.publicationId,
          chapterNumber: fullChapter.chapterNumber,
          title: fullChapter.title || '',
          content: fullChapter.content || '',
          isLocked: fullChapter.isLocked,
          coinPrice: fullChapter.coinPrice || 0
        });
      } catch (error) {
        toast.error('Không thể tải chi tiết chương');
        return;
      }
    } else {
      setIsEditing(false);
      const nextNum = chapters.length > 0 ? Math.max(...chapters.map(c => c.chapterNumber)) + 1 : 1;
      setFormData({
        publicationId: selectedPubId,
        chapterNumber: nextNum,
        title: `Chương ${nextNum}`,
        content: '',
        isLocked: false,
        coinPrice: 0
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.publicationId) return;
    
    try {
      if (isEditing && formData.id) {
        await api.updateChapter(formData.id, formData);
        toast.success('Cập nhật chương thành công');
      } else {
        await api.createChapter(formData);
        toast.success('Thêm chương mới thành công');
      }
      handleCloseModal();
      refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi lưu chương');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa [${name}]?`)) return;
    try {
      await api.deleteChapter(id);
      toast.success('Xóa chương thành công');
      refresh();
    } catch (error) {
      toast.error('Lỗi khi xóa chương');
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length || !window.confirm(`Bạn có chắc muốn xóa ${selectedIds.length} chương đã chọn?`)) return;
    const deletePromise = Promise.all(selectedIds.map(api.deleteChapter));
    toast.promise(deletePromise, { loading: 'Đang xóa...', success: 'Xóa thành công!', error: 'Có lỗi xảy ra khi xóa' });
    try {
      await deletePromise;
      selectedIds.forEach(removeItem);
      setSelectedIds([]);
    } catch (error) { console.error('Lỗi khi xóa hàng loạt:', error); }
  };

  return (
    <>
      <div className="jira-table-container">
      <div className="d-flex justify-content-between align-items-center p-3" style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
        <h5 className="mb-0 fw-semibold" style={{ color: '#172b4d', fontSize: '16px' }}>
          <Book className="me-2 text-primary" size={18} />
          Quản lý Chương truyện chữ
        </h5>
        <div className="d-flex align-items-center gap-3">
          

          <div className="d-flex align-items-center gap-2">
            <span className="text-muted" style={{ fontSize: '13px' }}>Chọn truyện:</span>
            <Form.Select 
              size="sm"
              className="bg-transparent text-body border-secondary-subtle"
              style={{ width: '250px', height: '32px', fontSize: '13px' }}
              value={selectedPubId} 
              onChange={e => setSelectedPubId(e.target.value)}
            >
              {publications.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </Form.Select>
          </div>
          <Button variant="primary" size="sm" onClick={() => handleShowModal()} disabled={!selectedPubId} className="d-flex align-items-center gap-2 rounded-2">
            <FontAwesomeIcon icon={faPlus} />
            Thêm Chương mới
          </Button>
        </div>
      <ExcelActionButtons 
            dataToExport={chapters || []}
            exportFileName={typeof document !== 'undefined' ? document.title.replace(' | Xóm Truyện', '').replace(/ /g, '_') : 'Export'}
            onRefresh={typeof refresh !== 'undefined' ? refresh : undefined}
            isLoading={typeof loading !== 'undefined' ? loading : false}
          /></div>

      <div className="table-responsive flex-grow-1 jira-scroll" style={{ overflowY: 'auto', overflowX: 'auto' }}>
        <table className="table align-middle mb-0" style={{ borderCollapse: 'collapse', backgroundColor: 'transparent', tableLayout: 'fixed', minWidth: '1000px' }}>
          <thead className="jira-table-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
            <tr style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
              <ResizableHeader initialWidth={40} minWidth={40} style={{ borderLeft: 0, padding: '12px 10px', backgroundColor: 'var(--jira-header-bg)', textAlign: 'center', position: 'sticky', left: 0, zIndex: 11, boxShadow: 'inset -2px 0 4px -2px rgba(0,0,0,0.12)' }}>
                <Form.Check
                  type="checkbox"
                  checked={chapters.length > 0 && selectedIds.length === chapters.length}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = selectedIds.length > 0 && selectedIds.length < chapters.length;
                    }
                  }}
                  onChange={handleSelectAll}
                />
              </ResizableHeader>
              <ResizableHeader initialWidth={80} style={{ padding: '12px 16px', textAlign: 'center', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                <span className="fw-semibold text-nowrap">STT</span>
              </ResizableHeader>
              <ResizableHeader initialWidth={200} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                <span className="fw-semibold text-nowrap">Tên chương</span>
              </ResizableHeader>
              <ResizableHeader initialWidth={300} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                <span className="fw-semibold text-nowrap">Nội dung (Xem trước)</span>
              </ResizableHeader>
              <ResizableHeader initialWidth={120} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                <span className="fw-semibold text-nowrap">Thu phí</span>
              </ResizableHeader>
              <ResizableHeader initialWidth={100} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                <span className="fw-semibold text-nowrap">Lượt xem</span>
              </ResizableHeader>
              <ResizableHeader initialWidth={120} style={{ padding: '12px 16px', textAlign: 'right', backgroundColor: 'var(--jira-header-bg)', color: 'var(--jira-text)', position: 'sticky', right: 0, zIndex: 11, boxShadow: 'inset 2px 0 4px -2px rgba(0,0,0,0.12)' }}>
                <span className="fw-semibold text-nowrap">Thao tác</span>
              </ResizableHeader>
            </tr>
          </thead>
          <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center p-4">Đang tải...</td></tr>
              ) : !selectedPubId ? (
                <tr><td colSpan={7} className="text-center p-4 text-muted">Vui lòng chọn một truyện để xem danh sách chương.</td></tr>
              ) : chapters.length === 0 ? (
                <tr><td colSpan={7} className="text-center p-4 text-muted">Truyện này chưa có chương nào.</td></tr>
              ) : (
                chapters.map(chapter => (
                  <tr key={chapter.id} className={`jira-table-row${selectedIds.includes(chapter.id) ? ' jira-row-selected' : ''}`} style={{ height: '46px' }}>
                    <td className="jira-sticky-left" style={{ borderLeft: 0, padding: '12px 10px', backgroundColor: selectedIds.includes(chapter.id) ? 'var(--jira-selected-bg, #ebf2fc)' : 'var(--jira-table-bg, #ffffff)', textAlign: 'center', position: 'sticky', left: 0, zIndex: 2, boxShadow: 'inset -2px 0 4px -2px rgba(0,0,0,0.12)' }} onClick={(e) => e.stopPropagation()}>
                      <Form.Check
                        type="checkbox"
                        checked={selectedIds.includes(chapter.id)}
                        onChange={() => toggleSelect(chapter.id)}
                      />
                    </td>
                    <td className="px-4 fw-bold text-muted" style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>Chương {chapter.chapterNumber}</td>
                    <td className="fw-medium" style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>{chapter.title}</td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                      <div className="text-muted small text-truncate" style={{ maxWidth: '300px' }}>
                        {chapter.contentPreview || <i>Trống</i>}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                      {chapter.isLocked ? (
                        <Badge bg="warning" text="dark"><Lock size={12} className="me-1"/>{chapter.coinPrice} Xu</Badge>
                      ) : (
                        <Badge bg="success"><Unlock size={12} className="me-1"/>Miễn phí</Badge>
                      )}
                    </td>
                    <td className="text-muted" style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>{chapter.viewCount || 0}</td>
                    <td className="px-4 text-end jira-sticky-right" style={{ padding: '12px 16px', backgroundColor: selectedIds.includes(chapter.id) ? 'var(--jira-selected-bg, #ebf2fc)' : 'var(--jira-table-bg, #ffffff)', color: 'var(--jira-text)', position: 'sticky', right: 0, zIndex: 2, boxShadow: 'inset 2px 0 4px -2px rgba(0,0,0,0.12)' }}>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(chapter)}>
                        <Edit2 size={14} />
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(chapter.id, chapter.title || `Chương ${chapter.chapterNumber}`)}>
                        <Trash size={14} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
              
              {!loading && <LoadingMoreIndicator isVisible={isLoadingMore} colSpan={7} />}
            </tbody>
          </table>
          {hasMore && <div ref={sentinelRef} className="scroll-sentinel" />}
        </div>
        
        {!loading && (
          <InfiniteScrollFooter
            loadedCount={loadedCount}
            totalCount={totalCount}
            onRefresh={refresh}
            showCreate={false}
          />
        )}
        <FloatingBulkActionBar 
          selectedCount={selectedIds.length} 
          onClearSelection={() => setSelectedIds([])} 
          onBulkDelete={handleBulkDelete}
        />
      </div>

      <Modal show={showModal} onHide={handleCloseModal} size="xl">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>{isEditing ? 'Sửa Chương' : 'Thêm Chương mới'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-3">
                <Form.Group className="mb-3">
                  <Form.Label>Số thứ tự chương <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="number" step="0.1" required 
                    value={formData.chapterNumber} 
                    onChange={e => setFormData({...formData, chapterNumber: Number(e.target.value)})} 
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Tên chương</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                  />
                </Form.Group>
                
                <hr />
                <h6 className="fw-bold mb-3 text-warning">Thu phí chương</h6>
                
                <Form.Check 
                  type="switch"
                  id="isLocked-switch"
                  label="Khóa chương (Bắt buộc mua)"
                  checked={formData.isLocked}
                  onChange={e => setFormData({...formData, isLocked: e.target.checked})}
                />
                
                {formData.isLocked && (
                  <Form.Group className="mt-3">
                    <Form.Label>Giá xu</Form.Label>
                    <Form.Control 
                      type="number" 
                      value={formData.coinPrice} 
                      onChange={e => setFormData({...formData, coinPrice: Number(e.target.value)})} 
                    />
                  </Form.Group>
                )}
              </div>
              <div className="col-md-9 border-start">
                <Form.Group className="mb-3 h-100 d-flex flex-column">
                  <Form.Label>Nội dung chữ (Text) <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    as="textarea" required className="flex-grow-1" style={{ minHeight: '500px' }}
                    value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} 
                    placeholder="Dán nội dung truyện chữ vào đây..."
                  />
                  <Form.Text className="text-muted mt-2">Hỗ trợ ngắt dòng bằng Enter.</Form.Text>
                </Form.Group>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Hủy</Button>
            <Button variant="primary" type="submit"><Save size={16} className="me-1" /> Lưu chương</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
