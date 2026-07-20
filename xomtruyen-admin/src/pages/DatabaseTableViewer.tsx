import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTableData, insertRow, updateRow, deleteRow, getTableSchema, type TableSchemaColumn } from '../api/managerDbApi';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faEdit, faTrash, faSave, faKey, faLink } from '@fortawesome/free-solid-svg-icons';

export const DatabaseTableViewer: React.FC = () => {
  const { tableName } = useParams<{ tableName: string }>();
  const navigate = useNavigate();
  
  const [data, setData] = useState<any[]>([]);
  const [schemaColumns, setSchemaColumns] = useState<TableSchemaColumn[]>([]);
  const [, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const [page] = useState(1);
  const [pageSize] = useState(100);
  
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
      alert('Không thể tải dữ liệu bảng ' + tableName);
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
        alert('Lỗi xóa dữ liệu');
      }
    }
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData };
      
      // Dynamic Type conversion based on schema
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
      alert('Lỗi lưu dữ liệu: ' + (error.message || ''));
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: 'var(--bs-body-bg)' }}>
      <div className="card-header border-bottom-0 pt-4 pb-3 d-flex justify-content-between align-items-center bg-transparent">
        <div className="d-flex align-items-center gap-3">
          <Button variant="light" size="sm" onClick={() => navigate('/database')}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </Button>
          <h5 className="mb-0 fw-semibold text-body">Chi tiết bảng: {tableName}</h5>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenAdd} className="d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faPlus} />
          Thêm dòng
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
                  {columns.map(col => {
                    const schemaCol = schemaColumns.find(sc => sc.name === col);
                    return (
                      <th key={col} className="text-nowrap">
                        {col}
                        {schemaCol?.isPrimaryKey && <FontAwesomeIcon icon={faKey} className="text-warning ms-2" title="Primary Key" />}
                        {schemaCol?.isForeignKey && <FontAwesomeIcon icon={faLink} className="text-secondary ms-2" title="Foreign Key" />}
                      </th>
                    );
                  })}
                  <th className="text-center" style={{ width: '100px' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((row, i) => (
                    <tr key={i}>
                      {columns.map(col => (
                        <td key={col} className="text-truncate" style={{ maxWidth: '200px' }}>
                          {String(row[col] ?? '')}
                        </td>
                      ))}
                      <td className="text-center">
                        <Button variant="light" size="sm" className="me-2 text-primary border" onClick={() => handleOpenEdit(row)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button variant="light" size="sm" className="text-danger border" onClick={() => handleDelete(row)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length + 1} className="text-center py-4">Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
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
