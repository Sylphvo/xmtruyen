import React, { useState, useRef } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faFileExcel, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

interface ImportExcelModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: (data: any[]) => void;
}

export const ImportExcelModal: React.FC<ImportExcelModalProps> = ({ show, onHide, onConfirm }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const [columns, setColumns] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const validExtensions = ['.xlsx', '.xls'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validExtensions.includes(ext)) {
      toast.error('Chỉ hỗ trợ file định dạng .xlsx, .xls');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData && jsonData.length > 0) {
          setSelectedFile(file);
          setPreviewData(jsonData);
          // Lấy danh sách cột từ dòng đầu tiên
          setColumns(Object.keys(jsonData[0] as object));
        } else {
          toast.error('File Excel không có dữ liệu');
        }
      } catch (error) {
        console.error('Lỗi khi đọc file Excel:', error);
        toast.error('Có lỗi xảy ra khi đọc file Excel');
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    reader.onerror = () => {
      toast.error('Không thể đọc file');
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.readAsBinaryString(file);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewData(null);
    setColumns([]);
    onHide();
  };

  const handleConfirm = () => {
    if (previewData) {
      onConfirm(previewData);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title className="fs-5 fw-bold d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faFileExcel} className="text-success" />
          <span>Nhập dữ liệu từ Excel</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-3 pb-4 px-4">
        {!selectedFile ? (
          <>
            <Alert variant="info" className="d-flex align-items-start gap-2 py-2 px-3 mb-3 border-0 bg-info-subtle text-info-emphasis">
              <FontAwesomeIcon icon={faInfoCircle} className="mt-1" />
              <div className="small">
                <strong>Hướng dẫn:</strong> File Excel (.xlsx, .xls) cần có dòng tiêu đề (header) ở hàng đầu tiên. Hệ thống sẽ tự động ánh xạ dữ liệu theo tên cột tương ứng.
              </div>
            </Alert>

            <div
              className="p-5 text-center rounded-3 border-2"
              style={{
                border: '2px dashed var(--bs-border-color, #dee2e6)',
                backgroundColor: 'var(--bs-tertiary-bg, #f8f9fa)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <FontAwesomeIcon icon={faCloudUploadAlt} className="fs-1 text-primary opacity-75 mb-3" />
              <h5 className="fw-medium text-body mb-2">Kéo & thả file Excel vào đây</h5>
              <p className="text-muted mb-0">hoặc click để chọn file từ máy tính</p>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept=".xlsx,.xls"
            />
          </>
        ) : (
          <div>
            <div className="d-flex align-items-center justify-content-between p-3 bg-body border rounded shadow-sm mb-4">
              <div className="d-flex align-items-center overflow-hidden">
                <div className="bg-success-subtle text-success rounded p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '46px', height: '46px' }}>
                  <FontAwesomeIcon icon={faFileExcel} className="fs-4" />
                </div>
                <div className="text-start overflow-hidden">
                  <p className="mb-0 fw-bold text-body text-truncate" style={{ maxWidth: '400px' }}>{selectedFile.name}</p>
                  <span className="small text-muted">{formatFileSize(selectedFile.size)} • {previewData?.length} dòng dữ liệu</span>
                </div>
              </div>
              <Button variant="light" size="sm" className="text-muted border-0" onClick={() => setSelectedFile(null)}>
                <FontAwesomeIcon icon={faTimes} className="me-1" /> Hủy bỏ
              </Button>
            </div>

            {previewData && columns.length > 0 && (
              <div className="border rounded-3 overflow-hidden">
                <div className="bg-light p-2 border-bottom fw-medium small text-muted d-flex justify-content-between">
                  <span>Dữ liệu xem trước (Preview tối đa 10 dòng)</span>
                  <span>{columns.length} cột</span>
                </div>
                <div className="table-responsive" style={{ maxHeight: '300px' }}>
                  <table className="table table-sm table-hover mb-0" style={{ fontSize: '13px' }}>
                    <thead className="table-light sticky-top">
                      <tr>
                        <th className="text-center text-muted" style={{ width: '40px' }}>#</th>
                        {columns.map((col, idx) => (
                          <th key={idx} className="text-nowrap">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.slice(0, 10).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          <td className="text-center text-muted">{rowIndex + 1}</td>
                          {columns.map((col, colIndex) => (
                            <td key={colIndex} className="text-truncate" style={{ maxWidth: '200px' }}>
                              {row[col] !== null && row[col] !== undefined ? String(row[col]) : ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="light" onClick={handleClose} className="px-4 fw-medium border">
                Trở lại
              </Button>
              <Button variant="primary" onClick={handleConfirm} className="px-4 fw-medium">
                Xác nhận Nhập
              </Button>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};
