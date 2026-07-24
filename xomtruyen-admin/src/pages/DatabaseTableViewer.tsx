import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTableData, insertRow, updateRow, deleteRow, getTableSchema, type TableSchemaColumn } from '../api/managerDbApi';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faEdit, faTrash, faSave, faKey, faLink, faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { ResizableHeader } from '../components/ResizableHeader';

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
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [currentId, setCurrentId] = useState<any>(null);

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
      <div className="card-header border-bottom-0 pt-4 pb-3 d-flex justify-content-between align-items-center bg-transparent">
        <div className="d-flex align-items-center gap-3">
          <Button variant="light" size="sm" onClick={() => navigate('/database')}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </Button>
          <h5 className="mb-0 fw-semibold text-body">Chi tiết bảng: {tableName}</h5>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenAdd} className="d-flex align-items-center gap-2 rounded-2">
          <FontAwesomeIcon icon={faPlus} />
          Thêm dòng
        </Button>
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
                    return (
                      <ResizableHeader key={col} initialWidth={180} style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }}>
                        <span className="fw-semibold text-nowrap">
                          {col}
                          {schemaCol?.isPrimaryKey && <FontAwesomeIcon icon={faKey} className="text-warning ms-2" title="Primary Key" />}
                          {schemaCol?.isForeignKey && <FontAwesomeIcon icon={faLink} className="text-secondary ms-2" title="Foreign Key" />}
                        </span>
                      </ResizableHeader>
                    );
                  })}
                  <ResizableHeader initialWidth={120} style={{ padding: '12px 16px', textAlign: 'center', backgroundColor: 'transparent', color: 'var(--bs-heading-color)' }}>
                    <span className="fw-semibold text-nowrap">Thao tác</span>
                  </ResizableHeader>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                      {columns.map(col => (
                        <td key={col} className="text-truncate" style={{ maxWidth: '200px', padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                          {String(row[col] ?? '')}
                        </td>
                      ))}
                      <td className="text-center" style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                        <Button variant="light" size="sm" className="me-2 px-2 py-1 bg-white d-inline-flex align-items-center" style={{ fontSize: '13px', color: '#0d6efd', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} onClick={() => handleOpenEdit(row)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button variant="light" size="sm" className="px-2 py-1 bg-white d-inline-flex align-items-center" style={{ fontSize: '13px', color: '#dc3545', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} onClick={() => handleDelete(row)}>
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
                  // Hiển thị tối đa 5 trang xung quanh trang hiện tại để khỏi bị quá dài
                  if (i + 1 < page - 2 || i + 1 > page + 2) {
                    if (i + 1 === 1 || i + 1 === totalPages) return null; // vẫn giữ nhưng ẩn bớt nếu cần thiết, thực tế với admin tool để đơn giản mình render vài trang thôi.
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

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Sửa bản ghi' : 'Thêm bản ghi'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              {schemaColumns.length > 0 ? schemaColumns.map(col => (
                <div key={col.name} className="col-md-6 mb-3">
                  <Form.Group>
                    <Form.Label>
                      {col.name}
                      {col.isPrimaryKey && <FontAwesomeIcon icon={faKey} className="text-warning ms-2" title="Primary Key" />}
                      {col.isForeignKey && <FontAwesomeIcon icon={faLink} className="text-secondary ms-2" title="Foreign Key" />}
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
                  </Form.Group>
                </div>
              )) : Object.keys(formData).map(col => (
                <div key={col} className="col-md-6 mb-3">
                  <Form.Group>
                    <Form.Label>{col}</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData[col] || ''}
                      onChange={(e) => handleInputChange(col, e.target.value)}
                      disabled={isEditing && col.toLowerCase() === 'id'}
                    />
                  </Form.Group>
                </div>
              ))}
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
    </div>
  );
};
