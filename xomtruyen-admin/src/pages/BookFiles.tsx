import React, { useState, useEffect } from 'react';
import { Button, Spinner, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faFileAlt, faSync, faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { getFiles, deleteFile, type FileItem } from '../api/uploadApi';
import { ResizableHeader } from '../components/ResizableHeader';
import { FloatingBulkActionBar } from '../components/FloatingBulkActionBar';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { LoadingMoreIndicator } from '../components/LoadingMoreIndicator';
import { InfiniteScrollFooter } from '../components/InfiniteScrollFooter';
import toast from 'react-hot-toast';
import { ExcelActionButtons } from '../components/ExcelActionButtons';


export const BookFiles: React.FC = () => {
  const {
    items: files,
    totalCount: totalItems,
    isLoading,
    isLoadingMore,
    hasMore,
    loadedCount,
    sentinelRef,
    refresh,
    removeItem
  } = useInfiniteScroll<FileItem & { id: string }>({
    fetchFn: async (_params) => {
      const res = await getFiles();
      const files = (res.data || []).map(f => ({ ...f, id: f.name }));
      return {
        data: files,
        totalCount: files.length,
        page: 1,
        pageSize: files.length
      };
    },
    pageSize: 50,
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(files.map(f => f.name));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };



  const handleDelete = async (fileName: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa file "${fileName}" không?`)) {
      try {
        const res = await deleteFile(fileName);
        if (res.success) {
          refresh();
        }
      } catch (error: any) {
        console.error(error);
        toast.error('Lỗi khi xóa file: ' + (error.message || ''));
      }
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  const [viewingFile, setViewingFile] = useState<FileItem | null>(null);

  return (
    <>
      <div className="jira-table-container">
      <div className="d-flex justify-content-between align-items-center p-3" style={{ borderBottom: '1px solid #dfe1e6' }}>
        <h5 className="mb-0 fw-semibold" style={{ color: '#172b4d', fontSize: '16px' }}>Quản lý File sách (Uploads)</h5>
        <div className="d-flex align-items-center gap-3">
          

          <Button variant="light" size="sm" onClick={refresh} className="d-flex align-items-center gap-2 rounded-2">
            <FontAwesomeIcon icon={faSync} /> Làm mới
          </Button>
        <ExcelActionButtons 
            dataToExport={files || []}
            exportFileName={typeof document !== 'undefined' ? document.title.replace(' | Xóm Truyện', '').replace(/ /g, '_') : 'Export'}
            onRefresh={typeof refresh !== 'undefined' ? refresh : undefined}
            isLoading={typeof isLoading !== 'undefined' ? isLoading : false}
          /></div>
      </div>

      <div className="table-responsive flex-grow-1 jira-scroll" style={{ maxHeight: '1756px', overflowY: 'auto', overflowX: 'auto', minHeight: '616px' }}>
        {isLoading ? (
          <div className="text-center py-5"><Spinner animation="border" variant="secondary" size="sm" /></div>
        ) : (
          <table className="table align-middle mb-0" style={{ borderCollapse: 'collapse', backgroundColor: 'transparent', tableLayout: 'fixed', minWidth: '800px' }}>
            <thead className="jira-table-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <tr style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                  <ResizableHeader initialWidth={40} minWidth={40} style={{ borderLeft: 0, padding: '12px 10px', backgroundColor: 'transparent', textAlign: 'center' }}>
                    <Form.Check
                      type="checkbox"
                      checked={files.length > 0 && selectedIds.length === files.length}
                      ref={(input) => {
                        if (input) {
                          input.indeterminate = selectedIds.length > 0 && selectedIds.length < files.length;
                        }
                      }}
                      onChange={handleSelectAll}
                    />
                  </ResizableHeader>
                  <ResizableHeader initialWidth={60} style={{ padding: '12px 16px', textAlign: 'center', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                    <span className="fw-semibold text-nowrap">#</span>
                  </ResizableHeader>
                  <ResizableHeader initialWidth={300} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                    <span className="fw-semibold text-nowrap">Tên File</span>
                  </ResizableHeader>
                  <ResizableHeader initialWidth={120} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                    <span className="fw-semibold text-nowrap">Kích thước</span>
                  </ResizableHeader>
                  <ResizableHeader initialWidth={180} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                    <span className="fw-semibold text-nowrap">Ngày tạo</span>
                  </ResizableHeader>
                  <ResizableHeader initialWidth={100} style={{ padding: '12px 16px', textAlign: 'center', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                    <span className="fw-semibold text-nowrap">Thao tác</span>
                  </ResizableHeader>
                </tr>
              </thead>
              <tbody>
                {files.length > 0 ? (
                  files.map((file, i) => (
                    <tr key={file.name} className="jira-table-row" style={{ height: '46px', backgroundColor: selectedIds.includes(file.name) ? '#ebf2fc' : 'transparent' }}>
                      <td style={{ borderLeft: 0, padding: '12px 10px', backgroundColor: 'transparent', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                        <Form.Check
                          type="checkbox"
                          checked={selectedIds.includes(file.name)}
                          onChange={() => toggleSelect(file.name)}
                        />
                      </td>
                      <td className="text-center" style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>{i + 1}</td>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                        <FontAwesomeIcon icon={faFileAlt} className="text-secondary me-2" />
                        <a href={`http://localhost:5172/${file.path}`} onClick={(e) => { e.preventDefault(); setViewingFile(file); }} className="text-decoration-none" style={{ cursor: 'pointer', color: '#0d6efd' }}>
                          {file.name}
                        </a>
                      </td>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>{formatSize(file.size)}</td>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>{new Date(file.createdAt).toLocaleString('vi-VN')}</td>
                      <td className="text-center" style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                        <Button variant="light" size="sm" className="px-2 py-1  d-inline-flex align-items-center" style={{ fontSize: '13px', color: '#dc3545', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} onClick={() => handleDelete(file.name)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{ borderLeft: 0, borderRight: 0, padding: 0 }}>
                      <div className="jira-empty-state">
                        <img src="/empty-state.svg" alt="No data" style={{ width: '120px', marginBottom: '20px', opacity: 0.5 }} onError={(e) => e.currentTarget.style.display = 'none'} />
                        <h4>There are no work items here yet</h4>
                        <p>We couldn't find any data matching your criteria. Try adjusting your filters or search terms.</p>
                      </div>
                    </td>
                  </tr>
              )}
              
              <LoadingMoreIndicator isVisible={isLoadingMore} colSpan={6} />
            </tbody>
          </table>
        )}
        {hasMore && <div ref={sentinelRef} className="scroll-sentinel" />}
      </div>

      {!isLoading && (
        <InfiniteScrollFooter
          loadedCount={loadedCount}
          totalCount={totalItems}
          onRefresh={refresh}
          showCreate={false}
        />
      )}
        <FloatingBulkActionBar 
          selectedCount={selectedIds.length} 
          onClearSelection={() => setSelectedIds([])} 
        />
      </div>

      <Modal show={!!viewingFile} onHide={() => setViewingFile(null)} size="xl" centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="text-truncate fs-5" style={{ maxWidth: '90%' }}>
            {viewingFile?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '80vh', padding: 0, backgroundColor: '#f8f9fa' }}>
          {viewingFile && (
            <iframe 
              src={`http://localhost:5172/${viewingFile.path}`} 
              width="100%" 
              height="100%" 
              style={{ border: 'none' }}
              title="File Viewer"
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};
