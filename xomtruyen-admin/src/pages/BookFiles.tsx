import React, { useState, useEffect } from 'react';
import { Button, Spinner, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faFileAlt, faSync, faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { getFiles, deleteFile, type FileItem } from '../api/uploadApi';
import { ResizableHeader } from '../components/ResizableHeader';
import toast from 'react-hot-toast';

export const BookFiles: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingFile, setViewingFile] = useState<FileItem | null>(null);

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const res = await getFiles();
      if (res.success) {
        setFiles(res.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
      toast.error('Không thể tải danh sách file.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDelete = async (fileName: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa file "${fileName}" không?`)) {
      try {
        const res = await deleteFile(fileName);
        if (res.success) {
          fetchFiles();
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

  const totalItems = files.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const validCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const paginatedData = files.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className="jira-table-container">
      <div className="d-flex justify-content-between align-items-center p-3" style={{ borderBottom: '1px solid #dfe1e6' }}>
        <h5 className="mb-0 fw-semibold" style={{ color: '#172b4d', fontSize: '16px' }}>Quản lý File sách (Uploads)</h5>
        <div className="d-flex align-items-center gap-3">
          <Button variant="light" size="sm" onClick={fetchFiles} className="d-flex align-items-center gap-2 rounded-2">
            <FontAwesomeIcon icon={faSync} /> Làm mới
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
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </Form.Select>
          </div>
        </div>
      </div>

      <div className="table-responsive flex-grow-1 d-flex flex-column jira-scroll" style={{ maxHeight: '1756px', overflowY: 'auto', overflowX: 'auto', minHeight: '616px' }}>
        {isLoading ? (
          <div className="text-center py-5"><Spinner animation="border" variant="secondary" size="sm" /></div>
        ) : (
          <table className="table align-middle mb-0" style={{ flexGrow: 1, borderCollapse: 'collapse', backgroundColor: 'transparent', tableLayout: 'fixed', minWidth: '800px' }}>
            <thead className="jira-table-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <tr style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                  <ResizableHeader initialWidth={60} style={{ padding: '12px 16px', textAlign: 'center', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }}>
                    <span className="fw-semibold text-nowrap">#</span>
                  </ResizableHeader>
                  <ResizableHeader initialWidth={300} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }}>
                    <span className="fw-semibold text-nowrap">Tên File</span>
                  </ResizableHeader>
                  <ResizableHeader initialWidth={120} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }}>
                    <span className="fw-semibold text-nowrap">Kích thước</span>
                  </ResizableHeader>
                  <ResizableHeader initialWidth={180} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }}>
                    <span className="fw-semibold text-nowrap">Ngày tạo</span>
                  </ResizableHeader>
                  <ResizableHeader initialWidth={100} style={{ padding: '12px 16px', textAlign: 'center', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }}>
                    <span className="fw-semibold text-nowrap">Thao tác</span>
                  </ResizableHeader>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((file, i) => (
                    <tr key={file.name} className="jira-table-row" style={{ height: '46px' }}>
                      <td className="text-center" style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>{startIndex + i + 1}</td>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                        <FontAwesomeIcon icon={faFileAlt} className="text-secondary me-2" />
                        <a href={`http://localhost:5172/${file.path}`} onClick={(e) => { e.preventDefault(); setViewingFile(file); }} className="text-decoration-none" style={{ cursor: 'pointer', color: '#0d6efd' }}>
                          {file.name}
                        </a>
                      </td>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>{formatSize(file.size)}</td>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>{new Date(file.createdAt).toLocaleString('vi-VN')}</td>
                      <td className="text-center" style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                        <Button variant="light" size="sm" className="px-2 py-1 bg-white d-inline-flex align-items-center" style={{ fontSize: '13px', color: '#dc3545', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} onClick={() => handleDelete(file.name)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
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
              </tbody>
            </table>
          )}
        </div>

        {!isLoading && (
          <div className="jira-table-footer">
            <div style={{ visibility: 'hidden' }}>
              <Button variant="light" size="sm" className="btn-create">
                Create
              </Button>
            </div>

            {totalPages > 1 && (
              <div className="pagination-controls">
                <span className="text-muted" style={{ fontSize: '13px' }}>
                  {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems}
                </span>
                <button className="icon-btn" onClick={() => setCurrentPage(1)} disabled={validCurrentPage === 1}>
                  <FontAwesomeIcon icon={faAngleDoubleLeft} />
                </button>
                <button className="icon-btn" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={validCurrentPage === 1}>
                  <FontAwesomeIcon icon={faAngleLeft} />
                </button>
                <span className="text-muted px-2">{validCurrentPage}</span>
                <button className="icon-btn" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={validCurrentPage === totalPages}>
                  <FontAwesomeIcon icon={faAngleRight} />
                </button>
                <button className="icon-btn" onClick={() => setCurrentPage(totalPages)} disabled={validCurrentPage === totalPages}>
                  <FontAwesomeIcon icon={faAngleDoubleRight} />
                </button>
              </div>
            )}
          </div>
        )}
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
