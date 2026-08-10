import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTableData, insertRow, updateRow, deleteRow, getTableSchema, type TableSchemaColumn } from '../api/managerDbApi';
import { Button, Form, Modal, Spinner, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faEdit, faTrash, faSave, faKey, faLink, faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight, faInfoCircle, faBookOpen, faDatabase, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { ResizableHeader } from '../components/ResizableHeader';
import { getTableInfo, getColumnInfo } from '../constants/databaseDictionary';

export const DatabaseTableViewer: React.FC = () => {
  const { tableName } = useParams<{ tableName: string }>();
  const navigate = useNavigate();
  
  const [data, setData] = useState<any[]>([]);
  const [schemaColumns, setSchemaColumns] = useState<TableSchemaColumn[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [showModal, setShowModal] = useState(false);
  const [showDictionaryModal, setShowDictionaryModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [currentId, setCurrentId] = useState<any>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const tableMeta = useMemo(() => getTableInfo(tableName), [tableName]);

  const handleCopy = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    toast.success('Đã chép ID vào clipboard!', { duration: 1500 });
    setTimeout(() => setCopiedText(null), 1800);
  };

  const isUuid = (val: any): boolean => {
    if (typeof val !== 'string') return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
  };

  const formatShortId = (idStr: string): string => {
    if (!idStr) return '';
    if (isUuid(idStr)) {
      return `${idStr.substring(0, 8)}...`;
    }
    if (idStr.length > 14) {
      return `${idStr.substring(0, 8)}...`;
    }
    return idStr;
  };

  const getInitialColumnWidth = (colName: string): number => {
    const lower = colName.toLowerCase();
    if (lower === 'id') return 115;
    if (lower.endsWith('id')) return 135;
    if (lower.startsWith('is') || lower.startsWith('has')) return 110;
    if (lower.includes('date') || lower.endsWith('at')) return 160;
    if (lower.includes('title') || lower.includes('name') || lower.includes('description') || lower.includes('content')) return 240;
    return 170;
  };

  useEffect(() => {
    if (tableName) {
      loadData();
    }
  }, [tableName, page, pageSize]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const schema = await getTableSchema(tableName!);
      setSchemaColumns(schema || []);

      const res = await getTableData(tableName!, page, pageSize);
      setData(res.data || []);
      setTotalItems(res.totalCount || 0);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải dữ liệu bảng ' + tableName);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = useMemo(() => {
    if (schemaColumns.length > 0) {
      return schemaColumns.map(c => c.name);
    }
    if (data.length > 0) {
      return Object.keys(data[0]);
    }
    return [];
  }, [schemaColumns, data]);

  const handleOpenAdd = () => {
    const initialData: any = {};
    columns.forEach(c => initialData[c] = '');
    setFormData(initialData);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEdit = (row: any) => {
    setFormData({ ...row });
    const pkCol = schemaColumns.find(c => c.isPrimaryKey);
    const idKey = pkCol ? pkCol.name : (Object.keys(row).find(k => k.toLowerCase() === 'id') || Object.keys(row)[0]);
    setCurrentId(row[idKey]);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (row: any) => {
    const pkCol = schemaColumns.find(c => c.isPrimaryKey);
    const idKey = pkCol ? pkCol.name : (Object.keys(row).find(k => k.toLowerCase() === 'id') || Object.keys(row)[0]);
    const idValue = row[idKey];
    
    if (window.confirm(`Xóa bản ghi có ${idKey}=${idValue}?`)) {
      try {
        await deleteRow(tableName!, idValue);
        loadData();
      } catch (error) {
        console.error(error);
        toast.error('Lỗi xóa dữ liệu');
      }
    }
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData };
      
      schemaColumns.forEach(col => {
        const val = payload[col.name];
        if (val !== undefined && val !== null && val !== '') {
          const type = col.type.toLowerCase();
          if (type.includes('int') || type.includes('long') || type.includes('double') || type.includes('decimal')) {
             payload[col.name] = Number(val);
          } else if (type.includes('bool')) {
             payload[col.name] = (val === 'true' || val === true);
          }
        }
      });

      if (isEditing) {
        await updateRow(tableName!, currentId, payload);
      } else {
        await insertRow(tableName!, payload);
      }
      setShowModal(false);
      loadData();
    } catch (error: any) {
      console.error(error);
      toast.error('Lỗi lưu dữ liệu: ' + (error.message || ''));
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;

  return (
    <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: 'var(--bs-body-bg)' }}>
      {/* Header with Table Description Banner */}
      <div className="card-header border-bottom-0 pt-4 pb-2 bg-transparent">
        <div className="d-flex justify-content-between align-items-start gap-3">
          <div className="d-flex align-items-start gap-3">
            <Button variant="light" size="sm" onClick={() => navigate('/database')} className="mt-1" title="Quay lại danh sách bảng">
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
            <div>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <h5 className="mb-0 fw-bold text-body">Chi tiết bảng: {tableName}</h5>
                <Badge bg="primary-subtle" className="text-primary border border-primary-subtle px-2 py-1" style={{ fontSize: '12px', fontWeight: 600 }}>
                  {tableMeta.vietnameseName}
                </Badge>
                <Badge bg="secondary-subtle" className="text-secondary border border-secondary-subtle px-2 py-1" style={{ fontSize: '11px' }}>
                  {columns.length} cột
                </Badge>
              </div>

              {/* Dòng mô tả chi tiết chức năng bảng và thông tin lưu trữ */}
              <div className="text-muted mt-2 d-flex align-items-baseline gap-2 flex-wrap" style={{ fontSize: '13px', lineHeight: '1.5' }}>
                <span className="text-body-secondary">
                  <strong>📌 Quy cách lưu trữ:</strong> {tableMeta.summary}
                </span>
                <button
                  type="button"
                  onClick={() => setShowDictionaryModal(true)}
                  className="btn btn-link btn-sm p-0 text-decoration-none fw-semibold d-inline-flex align-items-center gap-1"
                  style={{ fontSize: '12.5px', color: '#5955D1' }}
                >
                  <FontAwesomeIcon icon={faInfoCircle} />
                  Xem chi tiết từng cột & ví dụ
                </button>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowDictionaryModal(true)}
              className="d-flex align-items-center gap-2 rounded-2 text-nowrap"
              title="Tra cứu từ điển dữ liệu của bảng"
            >
              <FontAwesomeIcon icon={faBookOpen} />
              Từ điển cột
            </Button>
            <Button variant="primary" size="sm" onClick={handleOpenAdd} className="d-flex align-items-center gap-2 rounded-2 text-nowrap">
              <FontAwesomeIcon icon={faPlus} />
              Thêm dòng
            </Button>
          </div>
        </div>
      </div>

      <div className="card-body d-flex flex-column" style={{ overflow: 'hidden' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <Form.Select
              size="sm"
              className="bg-transparent text-body border-secondary-subtle"
              style={{ width: '70px' }}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
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
                  {columns.map(col => {
                    const schemaCol = schemaColumns.find(sc => sc.name === col);
                    const colInfo = getColumnInfo(tableName, col);
                    return (
                      <ResizableHeader key={col} initialWidth={getInitialColumnWidth(col)} style={{ padding: '10px 14px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)', verticalAlign: 'top' }}>
                        <div className="d-flex flex-column gap-1">
                          <div className="d-flex align-items-center gap-1">
                            <span className="fw-bold text-nowrap" style={{ fontSize: '13.5px' }}>{col}</span>
                            {schemaCol?.isPrimaryKey && <FontAwesomeIcon icon={faKey} className="text-warning ms-1" title="Khóa chính (Primary Key)" />}
                            {schemaCol?.isForeignKey && <FontAwesomeIcon icon={faLink} className="text-primary ms-1" title="Khóa ngoại (Foreign Key)" />}
                          </div>
                          {/* Dòng nhỏ mô tả ý nghĩa cột */}
                          <div
                            className="text-secondary text-nowrap"
                            style={{ fontSize: '11.5px', fontWeight: 500, opacity: 0.85, maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                            title={`${colInfo.label}: ${colInfo.description}`}
                          >
                            {colInfo.label}
                          </div>
                        </div>
                      </ResizableHeader>
                    );
                  })}
                  <ResizableHeader initialWidth={110} style={{ padding: '10px 14px', textAlign: 'center', backgroundColor: 'transparent', color: 'var(--bs-heading-color)', verticalAlign: 'top' }}>
                    <div className="d-flex flex-column gap-1 align-items-center">
                      <span className="fw-bold text-nowrap" style={{ fontSize: '13.5px' }}>Thao tác</span>
                      <span className="text-secondary text-nowrap" style={{ fontSize: '11.5px', fontWeight: 500, opacity: 0.85 }}>Sửa / Xóa</span>
                    </div>
                  </ResizableHeader>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                      {columns.map(col => {
                        const rawVal = row[col];
                        const strVal = rawVal != null ? String(rawVal) : '';
                        const isIdField = col.toLowerCase() === 'id' || col.toLowerCase().endsWith('id') || isUuid(strVal);

                        if (isIdField && strVal) {
                          const isCopied = copiedText === strVal;
                          return (
                            <td key={col} style={{ padding: '10px 14px', backgroundColor: 'transparent' }}>
                              <span
                                role="button"
                                onClick={(e) => handleCopy(strVal, e)}
                                title={`ID: ${strVal}\n(Click để sao chép toàn bộ ID)`}
                                className="badge d-inline-flex align-items-center gap-1 font-monospace text-decoration-none"
                                style={{
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  padding: '4px 7px',
                                  backgroundColor: col.toLowerCase() === 'id' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                                  color: col.toLowerCase() === 'id' ? '#6366f1' : 'var(--bs-body-color)',
                                  border: `1px solid ${col.toLowerCase() === 'id' ? 'rgba(99, 102, 241, 0.25)' : 'var(--bs-border-color)'}`,
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  letterSpacing: '0.3px',
                                  transition: 'all 0.15s ease-in-out'
                                }}
                              >
                                <span>{formatShortId(strVal)}</span>
                                <FontAwesomeIcon 
                                  icon={isCopied ? faCheck : faCopy} 
                                  style={{ fontSize: '10px', opacity: 0.8, color: isCopied ? '#10b981' : undefined }} 
                                />
                              </span>
                            </td>
                          );
                        }

                        if (typeof rawVal === 'boolean') {
                          return (
                            <td key={col} style={{ padding: '10px 14px', backgroundColor: 'transparent' }}>
                              <span className={`badge ${rawVal ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-secondary-subtle text-secondary border border-secondary-subtle'}`} style={{ fontSize: '11.5px', borderRadius: '6px' }}>
                                {rawVal ? 'True' : 'False'}
                              </span>
                            </td>
                          );
                        }

                        return (
                          <td key={col} className="text-truncate" style={{ maxWidth: '220px', padding: '10px 14px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }} title={strVal}>
                            {strVal}
                          </td>
                        );
                      })}
                      <td className="text-center" style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                        <Button variant="light" size="sm" className="me-2 px-2 py-1 bg-white d-inline-flex align-items-center" style={{ fontSize: '13px', color: '#0d6efd', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} onClick={() => handleOpenEdit(row)} title="Chỉnh sửa bản ghi">
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button variant="light" size="sm" className="px-2 py-1 bg-white d-inline-flex align-items-center" style={{ fontSize: '13px', color: '#dc3545', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} onClick={() => handleDelete(row)} title="Xóa bản ghi">
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length + 1} className="text-center py-5 text-muted" style={{ backgroundColor: 'transparent' }}>Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {!isLoading && (
          <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top bg-transparent">
            <div className="text-muted" style={{ fontSize: '13px' }}>
              Hiển thị {totalItems === 0 ? 0 : startIndex + 1} đến {Math.min(startIndex + pageSize, totalItems)} trong {totalItems} bản ghi
            </div>

            {totalPages > 1 && (
              <div className="d-flex" style={{ gap: '4px' }}>
                <button
                  className="btn btn-sm border-0 d-flex align-items-center justify-content-center rounded-2"
                  style={{ width: '32px', height: '32px', backgroundColor: 'var(--bs-tertiary-bg)', color: page === 1 ? 'var(--bs-secondary-color)' : '#5955D1' }}
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                >
                  <FontAwesomeIcon icon={faAngleDoubleLeft} style={{ fontSize: '12px' }} />
                </button>
                <button
                  className="btn btn-sm border-0 d-flex align-items-center justify-content-center rounded-2"
                  style={{ width: '32px', height: '32px', backgroundColor: 'var(--bs-tertiary-bg)', color: page === 1 ? 'var(--bs-secondary-color)' : '#5955D1' }}
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page === 1}
                >
                  <FontAwesomeIcon icon={faAngleLeft} style={{ fontSize: '12px' }} />
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  if (i + 1 < page - 2 || i + 1 > page + 2) {
                    if (i + 1 === 1 || i + 1 === totalPages) return null;
                    if (i + 1 === page - 3 || i + 1 === page + 3) return <span key={i} className="px-1 text-muted">...</span>;
                    return null;
                  }
                  return (
                    <button
                      key={i + 1}
                      className="btn btn-sm border-0 d-flex align-items-center justify-content-center rounded-2 fw-medium"
                      style={{
                        width: '32px', height: '32px', fontSize: '13px',
                        backgroundColor: i + 1 === page ? '#5955D1' : 'var(--bs-tertiary-bg)',
                        color: i + 1 === page ? '#fff' : '#5955D1'
                      }}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  );
                })}

                <button
                  className="btn btn-sm border-0 d-flex align-items-center justify-content-center rounded-2"
                  style={{ width: '32px', height: '32px', backgroundColor: 'var(--bs-tertiary-bg)', color: page === totalPages ? 'var(--bs-secondary-color)' : '#5955D1' }}
                  onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                >
                  <FontAwesomeIcon icon={faAngleRight} style={{ fontSize: '12px' }} />
                </button>
                <button
                  className="btn btn-sm border-0 d-flex align-items-center justify-content-center rounded-2"
                  style={{ width: '32px', height: '32px', backgroundColor: 'var(--bs-tertiary-bg)', color: page === totalPages ? 'var(--bs-secondary-color)' : '#5955D1' }}
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                >
                  <FontAwesomeIcon icon={faAngleDoubleRight} style={{ fontSize: '12px' }} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Thêm / Sửa Bản Ghi */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? `Sửa bản ghi trong bảng ${tableName}` : `Thêm bản ghi mới vào bảng ${tableName}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              {schemaColumns.length > 0 ? schemaColumns.map(col => {
                const colInfo = getColumnInfo(tableName, col.name);
                return (
                  <div key={col.name} className="col-md-6 mb-3">
                    <Form.Group>
                      <Form.Label className="d-flex align-items-center justify-content-between">
                        <span className="fw-semibold">
                          {col.name}
                          {col.isPrimaryKey && <FontAwesomeIcon icon={faKey} className="text-warning ms-1" title="Khóa chính (PK)" />}
                          {col.isForeignKey && <FontAwesomeIcon icon={faLink} className="text-primary ms-1" title="Khóa ngoại (FK)" />}
                        </span>
                        <span className="text-muted small" style={{ fontSize: '11.5px' }}>{colInfo.label}</span>
                      </Form.Label>
                      {col.type.toLowerCase().includes('bool') ? (
                         <Form.Check 
                           type="switch"
                           checked={formData[col.name] === true || formData[col.name] === 'true'}
                           onChange={(e) => handleInputChange(col.name, e.target.checked)}
                           disabled={isEditing && col.isPrimaryKey}
                         />
                      ) : col.type.toLowerCase().includes('int') || col.type.toLowerCase().includes('double') || col.type.toLowerCase().includes('decimal') ? (
                         <Form.Control
                           type="number"
                           value={formData[col.name] ?? ''}
                           onChange={(e) => handleInputChange(col.name, e.target.value)}
                           disabled={isEditing && col.isPrimaryKey}
                         />
                      ) : (
                         <Form.Control
                           type="text"
                           value={formData[col.name] || ''}
                           onChange={(e) => handleInputChange(col.name, e.target.value)}
                           disabled={isEditing && col.isPrimaryKey}
                         />
                      )}
                      <Form.Text className="text-muted" style={{ fontSize: '11px' }}>
                        {colInfo.description}
                      </Form.Text>
                    </Form.Group>
                  </div>
                );
              }) : Object.keys(formData).map(col => {
                const colInfo = getColumnInfo(tableName, col);
                return (
                  <div key={col} className="col-md-6 mb-3">
                    <Form.Group>
                      <Form.Label className="d-flex align-items-center justify-content-between">
                        <span className="fw-semibold">{col}</span>
                        <span className="text-muted small" style={{ fontSize: '11.5px' }}>{colInfo.label}</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        value={formData[col] || ''}
                        onChange={(e) => handleInputChange(col, e.target.value)}
                        disabled={isEditing && col.toLowerCase() === 'id'}
                      />
                    </Form.Group>
                  </div>
                );
              })}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="light" onClick={() => setShowModal(false)}>Hủy</Button>
          <Button variant="primary" onClick={handleSave} className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faSave} /> Lưu
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Từ Điển Ý Nghĩa Bảng & Chi Tiết Từng Cột */}
      <Modal show={showDictionaryModal} onHide={() => setShowDictionaryModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <div className="d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faDatabase} className="text-primary" />
            <Modal.Title className="fs-5 fw-bold">Từ Điển Dữ Liệu Bảng: {tableName}</Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '75vh', overflowY: 'auto' }}>
          {/* Tổng quan bảng */}
          <div className="p-3 mb-4 rounded-3 border" style={{ backgroundColor: 'var(--bs-tertiary-bg)' }}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <Badge bg="primary">{tableMeta.vietnameseName}</Badge>
              <span className="fw-bold text-body">{tableName}</span>
            </div>
            <p className="mb-2 text-body" style={{ fontSize: '13.5px', lineHeight: '1.5' }}>
              {tableMeta.summary}
            </p>
            <div className="text-muted small" style={{ fontSize: '12px', lineHeight: '1.5' }}>
              <strong>Chi tiết kỹ thuật:</strong> {tableMeta.storageDetails}
            </div>
          </div>

          {/* Bảng chi tiết từng cột */}
          <h6 className="fw-bold mb-3 text-body">Ý Nghĩa Chi Tiết Từng Cột Dữ Liệu:</h6>
          <div className="table-responsive border rounded-3">
            <table className="table table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
              <thead className="table-light">
                <tr>
                  <th style={{ width: '180px' }}>Tên Cột</th>
                  <th style={{ width: '160px' }}>Tên Tiếng Việt</th>
                  <th>Mô Tả Ý Nghĩa & Quy Tắc</th>
                  <th style={{ width: '130px' }}>Ví Dụ</th>
                </tr>
              </thead>
              <tbody>
                {columns.map(col => {
                  const schemaCol = schemaColumns.find(sc => sc.name === col);
                  const info = getColumnInfo(tableName, col);
                  return (
                    <tr key={col}>
                      <td>
                        <span className="fw-bold text-primary font-monospace">{col}</span>
                        {schemaCol?.isPrimaryKey && <Badge bg="warning" text="dark" className="ms-1" style={{ fontSize: '10px' }}>PK</Badge>}
                        {schemaCol?.isForeignKey && <Badge bg="info" className="ms-1" style={{ fontSize: '10px' }}>FK</Badge>}
                      </td>
                      <td>
                        <span className="fw-semibold text-body">{info.label}</span>
                      </td>
                      <td className="text-body-secondary">
                        {info.description}
                      </td>
                      <td>
                        {info.example ? (
                          <code className="text-muted small">{info.example}</code>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowDictionaryModal(false)}>
            Đã Hiểu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

