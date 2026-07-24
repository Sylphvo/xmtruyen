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
    <div className="card border-0 shadow-sm h-auto" style={{ backgroundColor: 'var(--bs-body-bg)' }}>
      <div className="card-header border-bottom-0 pt-4 pb-3 d-flex justify-content-between align-items-center bg-transparent">
        <h5 className="mb-0 fw-semibold" style={{ color: 'var(--bs-heading-color)' }}>Quản lý File sách (Uploads)</h5>
        <Button variant="outline-primary" size="sm" onClick={fetchFiles} className="d-flex align-items-center gap-2 rounded-2">
          <FontAwesomeIcon icon={faSync} /> Làm mới
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
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </Form.Select>
            <span className="text-muted small">dòng / trang</span>
          </div>
        </div>

        <div className="table-responsive flex-grow-1" style={{ minHeight: '616px', maxHeight: '1756px', overflowY: 'auto' }}>
          {isLoading ? (
            <div className="text-center py-5"><Spinner animation="border" variant="secondary" size="sm" /></div>
          ) : (
            <table className="table table-bordered mb-0 align-middle text-body" style={{ borderCollapse: 'collapse', backgroundColor: 'transparent' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--bs-body-bg)' }}>
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
                    <tr key={file.name} style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
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
                    <td colSpan={5} className="text-center py-5 text-muted" style={{ backgroundColor: 'transparent' }}>Chưa có file sách nào được upload.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {!isLoading && (
          <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top bg-transparent">
            <div className="text-muted" style={{ fontSize: '13px' }}>
              Hiển thị {totalItems === 0 ? 0 : startIndex + 1} đến {Math.min(startIndex + itemsPerPage, totalItems)} trong {totalItems} file
            </div>

            {totalPages > 1 && (
              <div className="d-flex" style={{ gap: '4px' }}>
                <button
                  className="btn btn-sm border-0 d-flex align-items-center justify-content-center rounded-2"
                  style={{ width: '32px', height: '32px', backgroundColor: 'var(--bs-tertiary-bg)', color: validCurrentPage === 1 ? 'var(--bs-secondary-color)' : '#5955D1' }}
                  onClick={() => setCurrentPage(1)}
                  disabled={validCurrentPage === 1}
                >
                  <FontAwesomeIcon icon={faAngleDoubleLeft} style={{ fontSize: '12px' }} />
                </button>
                <button
                  className="btn btn-sm border-0 d-flex align-items-center justify-content-center rounded-2"
                  style={{ width: '32px', height: '32px', backgroundColor: 'var(--bs-tertiary-bg)', color: validCurrentPage === 1 ? 'var(--bs-secondary-color)' : '#5955D1' }}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={validCurrentPage === 1}
                >
                  <FontAwesomeIcon icon={faAngleLeft} style={{ fontSize: '12px' }} />
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  if (i + 1 < validCurrentPage - 2 || i + 1 > validCurrentPage + 2) {
                    if (i + 1 === 1 || i + 1 === totalPages) return null;
                    if (i + 1 === validCurrentPage - 3 || i + 1 === validCurrentPage + 3) return <span key={i} className="px-1 text-muted">...</span>;
                    return null;
                  }
                  return (
                    <button
                      key={i + 1}
                      className="btn btn-sm border-0 d-flex align-items-center justify-content-center rounded-2 fw-medium"
                      style={{
                        width: '32px', height: '32px', fontSize: '13px',
                        backgroundColor: i + 1 === validCurrentPage ? '#5955D1' : 'var(--bs-tertiary-bg)',
                        color: i + 1 === validCurrentPage ? '#fff' : '#5955D1'
                      }}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  );
                })}

                <button
                  className="btn btn-sm border-0 d-flex align-items-center justify-content-center rounded-2"
                  style={{ width: '32px', height: '32px', backgroundColor: 'var(--bs-tertiary-bg)', color: validCurrentPage === totalPages ? 'var(--bs-secondary-color)' : '#5955D1' }}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={validCurrentPage === totalPages}
                >
                  <FontAwesomeIcon icon={faAngleRight} style={{ fontSize: '12px' }} />
                </button>
                <button
                  className="btn btn-sm border-0 d-flex align-items-center justify-content-center rounded-2"
                  style={{ width: '32px', height: '32px', backgroundColor: 'var(--bs-tertiary-bg)', color: validCurrentPage === totalPages ? 'var(--bs-secondary-color)' : '#5955D1' }}
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={validCurrentPage === totalPages}
                >
                  <FontAwesomeIcon icon={faAngleDoubleRight} style={{ fontSize: '12px' }} />
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
    </div>
  );
};
