import React, { useState, useEffect } from 'react';
import { Button, Spinner, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faFileAlt, faSync } from '@fortawesome/free-solid-svg-icons';
import { getFiles, deleteFile, type FileItem } from '../api/uploadApi';

export const BookFiles: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingFile, setViewingFile] = useState<FileItem | null>(null);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const res = await getFiles();
      if (res.success) {
        setFiles(res.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
      alert('Không thể tải danh sách file.');
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
        alert('Lỗi khi xóa file: ' + (error.message || ''));
      }
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: 'var(--bs-body-bg)' }}>
      <div className="card-header border-bottom-0 pt-4 pb-3 d-flex justify-content-between align-items-center bg-transparent">
        <h5 className="mb-0 fw-semibold text-body">Quản lý File sách (Uploads)</h5>
        <Button variant="outline-primary" size="sm" onClick={fetchFiles} className="d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faSync} /> Làm mới
        </Button>
      </div>

      <div className="card-body d-flex flex-column" style={{ overflow: 'hidden' }}>
        {isLoading ? (
          <div className="text-center py-5"><Spinner animation="border" /></div>
        ) : (
          <div className="table-responsive flex-grow-1 border rounded bg-white">
            <table className="table table-hover table-bordered mb-0 align-middle text-body">
              <thead className="table-light" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <tr>
                  <th style={{ width: '50px' }} className="text-center">#</th>
                  <th>Tên File</th>
                  <th>Kích thước</th>
                  <th>Ngày tạo</th>
                  <th className="text-center" style={{ width: '100px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {files.length > 0 ? (
                  files.map((file, i) => (
                    <tr key={file.name}>
                      <td className="text-center">{i + 1}</td>
                      <td>
                        <FontAwesomeIcon icon={faFileAlt} className="text-secondary me-2" />
                        <a href={`http://localhost:5172/${file.path}`} onClick={(e) => { e.preventDefault(); setViewingFile(file); }} className="text-decoration-none" style={{ cursor: 'pointer' }}>
                          {file.name}
                        </a>
                      </td>
                      <td>{formatSize(file.size)}</td>
                      <td>{new Date(file.createdAt).toLocaleString('vi-VN')}</td>
                      <td className="text-center">
                        <Button variant="light" size="sm" className="text-danger border" onClick={() => handleDelete(file.name)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-4">Chưa có file sách nào được upload.</td>
                  </tr>
                )}
              </tbody>
            </table>
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
