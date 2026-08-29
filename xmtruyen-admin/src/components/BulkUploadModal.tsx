import React, { useState, useRef } from 'react';
import { Modal, Button, ProgressBar, Form, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCloudUploadAlt,
  faFileArchive,
  faTimes,
  faCheckCircle,
  faInfoCircle,
  faLayerGroup,
  faImages,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import { chapterApi, type BulkUploadChapterResult } from '../api/chapterApi';
import toast from 'react-hot-toast';

interface BulkUploadModalProps {
  show: boolean;
  onHide: () => void;
  publicationId: string;
  bookTitle?: string;
  onSuccess: () => void;
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  show,
  onHide,
  publicationId,
  bookTitle,
  onSuccess
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessingOnServer, setIsProcessingOnServer] = useState(false);
  const [resultData, setResultData] = useState<BulkUploadChapterResult | null>(null);

  // Options
  const [overwriteExisting, setOverwriteExisting] = useState(true);
  const [defaultCoinPrice, setDefaultCoinPrice] = useState<number>(0);
  const [isLocked, setIsLocked] = useState(false);
  const [imagesPerChapter, setImagesPerChapter] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isUploading) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validExtensions = ['.zip', '.cbz', '.rar', '.cbr'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validExtensions.includes(ext)) {
      toast.error('Chỉ hỗ trợ file nén định dạng .zip, .cbz, .rar, .cbr');
      return;
    }
    setSelectedFile(file);
    setResultData(null);
    setUploadProgress(0);
  };

  const handleStartUpload = async () => {
    if (!selectedFile || !publicationId) return;

    setIsUploading(true);
    setIsProcessingOnServer(false);
    setUploadProgress(0);
    setResultData(null);

    try {
      const res = await chapterApi.bulkUploadChapters(
        publicationId,
        selectedFile,
        {
          overwriteExisting,
          defaultCoinPrice: defaultCoinPrice > 0 ? defaultCoinPrice : 0,
          isLocked,
          imagesPerChapter: imagesPerChapter > 0 ? imagesPerChapter : undefined
        },
        (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
            if (percent >= 100) {
              setIsProcessingOnServer(true);
            }
          }
        }
      );

      if (res && (res.success || res.data)) {
        const data = res.data;
        setResultData(data);
        toast.success(res.message || 'Tải lên và xử lý chapter thành công!');
        onSuccess();
      } else {
        toast.error((res as any)?.message || 'Xử lý file thất bại.');
      }
    } catch (err: any) {
      console.error('Bulk upload error:', err);
      const errMsg = err.response?.data?.message || err.message || 'Lỗi trong quá trình upload.';
      toast.error('Lỗi: ' + errMsg);
    } finally {
      setIsUploading(false);
      setIsProcessingOnServer(false);
    }
  };

  const handleClose = () => {
    if (isUploading) return;
    setSelectedFile(null);
    setUploadProgress(0);
    setIsProcessingOnServer(false);
    setResultData(null);
    onHide();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop={isUploading ? 'static' : true} size="lg">
      <Modal.Header closeButton={!isUploading} className="border-bottom-0 pb-0">
        <Modal.Title className="fs-5 fw-bold d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faCloudUploadAlt} className="text-primary" />
          <span>Tải lên hàng loạt Chapter (Zip / CBZ)</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-3 pb-4 px-4">
        {bookTitle && (
          <p className="text-muted small mb-3">
            Truyện: <strong className="text-body">{bookTitle}</strong>
          </p>
        )}

        {/* Success Result View */}
        {resultData ? (
          <div className="p-4 rounded-3 border bg-success-subtle border-success-subtle text-success-emphasis mb-3">
            <div className="d-flex align-items-center gap-3 mb-3">
              <FontAwesomeIcon icon={faCheckCircle} className="fs-2 text-success" />
              <div>
                <h6 className="fw-bold mb-1">Xử lý hoàn tất thành công!</h6>
                <p className="small mb-0">{resultData.message}</p>
              </div>
            </div>

            <div className="row g-3 text-dark mt-2">
              <div className="col-sm-4">
                <div className="p-2 bg-white rounded border text-center">
                  <div className="text-muted small d-flex align-items-center justify-content-center gap-1">
                    <FontAwesomeIcon icon={faLayerGroup} className="text-primary" /> Chapters
                  </div>
                  <div className="fw-bold fs-5 text-primary">
                    +{resultData.totalChaptersCreated + resultData.totalChaptersUpdated}
                  </div>
                  <div className="small text-muted" style={{ fontSize: '0.75rem' }}>
                    ({resultData.totalChaptersCreated} mới, {resultData.totalChaptersUpdated} cập nhật)
                  </div>
                </div>
              </div>

              <div className="col-sm-4">
                <div className="p-2 bg-white rounded border text-center">
                  <div className="text-muted small d-flex align-items-center justify-content-center gap-1">
                    <FontAwesomeIcon icon={faImages} className="text-success" /> Trang ảnh
                  </div>
                  <div className="fw-bold fs-5 text-success">+{resultData.totalPagesCreated}</div>
                  <div className="small text-muted" style={{ fontSize: '0.75rem' }}>Đã lưu vào bộ nhớ</div>
                </div>
              </div>

              <div className="col-sm-4">
                <div className="p-2 bg-white rounded border text-center">
                  <div className="text-muted small d-flex align-items-center justify-content-center gap-1">
                    <FontAwesomeIcon icon={faClock} className="text-info" /> Thời gian
                  </div>
                  <div className="fw-bold fs-5 text-info">{(resultData.elapsedMilliseconds / 1000).toFixed(1)}s</div>
                  <div className="small text-muted" style={{ fontSize: '0.75rem' }}>Tổng thời gian xử lý</div>
                </div>
              </div>
            </div>

            {resultData.processedChapters?.length > 0 && (
              <div className="mt-3 bg-white p-2 rounded border" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                <div className="small fw-semibold text-muted mb-1">Danh sách chapter đã xử lý:</div>
                <div className="d-flex flex-wrap gap-1">
                  {resultData.processedChapters.map((name, idx) => (
                    <span key={idx} className="badge bg-light text-dark border">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Guidance Alert */}
            <Alert variant="primary" className="d-flex align-items-start gap-2 py-2 px-3 mb-3 border-0 bg-primary-subtle text-primary-emphasis">
              <FontAwesomeIcon icon={faInfoCircle} className="mt-1" />
              <div className="small">
                <strong>Quy ước cấu trúc file nén:</strong>
                <br />
                File <code>.zip</code> hoặc <code>.cbz</code> nên chứa các thư mục con cho từng chapter (Ví dụ: <code>Chap 1</code>, <code>Chap 2</code>, <code>Chapter 10</code>...).
                Bên trong mỗi thư mục là các file ảnh (<code>01.jpg</code>, <code>02.png</code>...).
              </div>
            </Alert>

            {/* Drop Zone */}
            <div
              className="p-4 text-center rounded-3 mb-3 border-2"
              style={{
                border: selectedFile ? '2px solid #5955D1' : '2px dashed var(--bs-border-color, #dee2e6)',
                backgroundColor: selectedFile ? 'rgba(89, 85, 209, 0.05)' : 'var(--bs-tertiary-bg, #f8f9fa)',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => !selectedFile && !isUploading && fileInputRef.current?.click()}
            >
              {!selectedFile ? (
                <>
                  <FontAwesomeIcon icon={faCloudUploadAlt} className="fs-1 text-primary opacity-75 mb-2" />
                  <p className="mb-1 fw-medium text-body">
                    Kéo & thả file nén vào đây hoặc <span className="text-primary text-decoration-underline">chọn file</span>
                  </p>
                  <p className="small text-muted mb-0">Hỗ trợ định dạng: .ZIP, .CBZ, .RAR, .CBR (Tối đa 1GB)</p>
                </>
              ) : (
                <div className="d-flex align-items-center justify-content-between p-3 bg-body border rounded shadow-sm">
                  <div className="d-flex align-items-center overflow-hidden">
                    <div
                      className="bg-primary-subtle text-primary rounded p-2 me-3 d-flex align-items-center justify-content-center"
                      style={{ width: '46px', height: '46px' }}
                    >
                      <FontAwesomeIcon icon={faFileArchive} className="fs-4" />
                    </div>
                    <div className="text-start overflow-hidden">
                      <p className="mb-0 fw-bold text-body text-truncate" style={{ maxWidth: '380px' }}>
                        {selectedFile.name}
                      </p>
                      <span className="small text-muted">{formatFileSize(selectedFile.size)}</span>
                    </div>
                  </div>

                  {!isUploading && (
                    <button
                      className="btn btn-sm btn-light text-muted border-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setUploadProgress(0);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Upload Options */}
            <div className="bg-light-subtle p-3 rounded border mb-3">
              <div className="fw-semibold small text-body mb-2">Tùy chọn tải lên:</div>
              <div className="row g-2">
                <div className="col-sm-6">
                  <Form.Check
                    type="switch"
                    id="overwrite-switch"
                    label="Ghi đè chapter nếu đã tồn tại"
                    checked={overwriteExisting}
                    disabled={isUploading}
                    onChange={(e) => setOverwriteExisting(e.target.checked)}
                    className="small"
                  />
                </div>
                <div className="col-sm-6">
                  <Form.Check
                    type="switch"
                    id="islocked-switch"
                    label="Khóa chapter (Yêu cầu Coin/VIP)"
                    checked={isLocked}
                    disabled={isUploading}
                    onChange={(e) => setIsLocked(e.target.checked)}
                    className="small"
                  />
                </div>
                <div className="col-sm-6 mt-2">
                  <Form.Group className="d-flex align-items-center gap-2">
                    <Form.Label className="small mb-0 text-nowrap">Giá Coin mặc định:</Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      min={0}
                      value={defaultCoinPrice}
                      disabled={isUploading || !isLocked}
                      onChange={(e) => setDefaultCoinPrice(Number(e.target.value))}
                      style={{ width: '100px' }}
                    />
                  </Form.Group>
                </div>
                <div className="col-sm-6 mt-2">
                  <Form.Group className="d-flex align-items-center gap-2">
                    <Form.Label className="small mb-0 text-nowrap">Số ảnh/Chapter (tùy chọn):</Form.Label>
                    <Form.Control
                      type="number"
                      size="sm"
                      min={0}
                      placeholder="VD: 100"
                      value={imagesPerChapter || ''}
                      disabled={isUploading}
                      onChange={(e) => setImagesPerChapter(Number(e.target.value))}
                      style={{ width: '100px' }}
                    />
                  </Form.Group>
                </div>
              </div>
            </div>

            {/* Progress Bar & Processing Indicator */}
            {isUploading && (
              <div className="mb-3">
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>
                    {isProcessingOnServer ? (
                      <span className="text-primary fw-medium">
                        <Spinner animation="border" size="sm" className="me-2" />
                        Đang giải nén & xử lý trên máy chủ... Vui lòng không tắt trang.
                      </span>
                    ) : (
                      `Đang tải lên: ${uploadProgress}%`
                    )}
                  </span>
                  <span>{uploadProgress}%</span>
                </div>
                <ProgressBar
                  now={uploadProgress}
                  animated={isProcessingOnServer}
                  variant={isProcessingOnServer ? 'info' : 'primary'}
                  style={{ height: '8px' }}
                />
              </div>
            )}
          </>
        )}

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept=".zip,.cbz,.rar,.cbr"
        />

        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button variant="light" onClick={handleClose} disabled={isUploading} className="px-4 fw-medium border">
            {resultData ? 'Đóng' : 'Hủy'}
          </Button>

          {!resultData && (
            <Button
              variant="primary"
              onClick={handleStartUpload}
              disabled={!selectedFile || isUploading}
              className="px-4 fw-medium border-0 d-flex align-items-center gap-2"
              style={{ backgroundColor: '#5955D1' }}
            >
              {isUploading ? (
                <>
                  <Spinner animation="border" size="sm" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCloudUploadAlt} />
                  <span>Bắt đầu Tải lên</span>
                </>
              )}
            </Button>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};
