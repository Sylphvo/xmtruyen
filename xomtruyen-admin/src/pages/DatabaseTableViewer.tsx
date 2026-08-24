import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTableData, insertRow, updateRow, deleteRow, getTableSchema, type TableSchemaColumn } from '../api/managerDbApi';
import { Button, Form, Modal, Spinner, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus, faEdit, faTrash, faSave, faKey, faLink, faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight, faInfoCircle, faBookOpen, faDatabase, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import { ResizableHeader } from '../components/ResizableHeader';
import { FloatingBulkActionBar } from '../components/FloatingBulkActionBar';
import { getTableInfo, getColumnInfo } from '../constants/databaseDictionary';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { LoadingMoreIndicator } from '../components/LoadingMoreIndicator';
import { InfiniteScrollFooter } from '../components/InfiniteScrollFooter';
import { ExcelActionButtons } from '../components/ExcelActionButtons';


export const DatabaseTableViewer: React.FC = () => {
  const { tableName } = useParams<{ tableName: string }>();
  const navigate = useNavigate();
  
  const [schemaColumns, setSchemaColumns] = useState<TableSchemaColumn[]>([]);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const {
    items: data,
    totalCount: totalItems,
    isLoading,
    isLoadingMore,
    hasMore,
    loadedCount,
    sentinelRef,
    refresh
  } = useInfiniteScroll<any>({
    fetchFn: async (params) => {
      if (!tableName) return { data: [], totalCount: 0, page: 1, pageSize: 50 };
      
      const schema = await getTableSchema(tableName);
      setSchemaColumns(schema || []);

      const res = await getTableData(tableName, params.page, params.pageSize);
      return {
        data: res.data || [],
        totalCount: res.totalCount || 0,
        page: params.page,
        pageSize: params.pageSize
      };
    },
    pageSize: 50,
    params: { tableName, refreshTrigger }
  });
  
  const [showModal, setShowModal] = useState(false);
  const [showDictionaryModal, setShowDictionaryModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [currentId, setCurrentId] = useState<any>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const [selectedIds, setSelectedIds] = useState<any[]>([]);

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


  const columns = useMemo(() => {
    if (schemaColumns.length > 0) {
      return schemaColumns.map(c => c.name);
    }
    if (data.length > 0) {
      return Object.keys(data[0]);
    }
    return [];
  }, [schemaColumns, data]);

  const primaryKeyCol = useMemo(() => {
    const pk = schemaColumns.find(c => c.isPrimaryKey);
    if (pk) return pk.name;
    if (columns.includes('Id')) return 'Id';
    if (columns.includes('id')) return 'id';
    return columns[0];
  }, [schemaColumns, columns]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      if (primaryKeyCol) {
        setSelectedIds(data.map(row => row[primaryKeyCol]));
      } else {
        setSelectedIds(data.map((_, i) => i));
      }
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (row: any, i: number) => {
    const id = primaryKeyCol ? row[primaryKeyCol] : i;
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

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
        refresh();
      } catch (error) {
        console.error(error);
        toast.error('Lỗi xóa dữ liệu');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length || !window.confirm(`Xóa ${selectedIds.length} bản ghi đã chọn?`)) return;
    const deletePromise = Promise.all(selectedIds.map(id => deleteRow(tableName!, id)));
    toast.promise(deletePromise, { loading: 'Đang xóa...', success: 'Xóa thành công!', error: 'Có lỗi xảy ra khi xóa' });
    try {
      await deletePromise;
      setSelectedIds([]);
      refresh();
    } catch (error) { console.error('Lỗi khi xóa hàng loạt:', error); }
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
      refresh();
    } catch (error: any) {
      console.error(error);
      toast.error('Lỗi lưu dữ liệu: ' + (error.message || ''));
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };


  return (
    <>
      <div className="jira-table-container">
      {/* Header with Table Description Banner */}
      <div className="d-flex justify-content-between align-items-center p-3" style={{ borderBottom: '1px solid #dfe1e6' }}>
        <div className="d-flex align-items-start gap-3">
          <Button variant="light" size="sm" onClick={() => navigate('/database')} className="mt-1" title="Quay lại danh sách bảng">
            <FontAwesomeIcon icon={faArrowLeft} />
          </Button>
          <div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
          <ExcelActionButtons 
            dataToExport={data || []}
            exportFileName={typeof document !== 'undefined' ? document.title.replace(' | Xóm Truyện', '').replace(/ /g, '_') : 'Export'}
            onRefresh={typeof refresh !== 'undefined' ? refresh : undefined}
            isLoading={typeof isLoading !== 'undefined' ? isLoading : false}
          />

              <h5 className="mb-0 fw-semibold" style={{ color: '#172b4d', fontSize: '16px' }}>Chi tiết bảng: {tableName}</h5>
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

        <div className="d-flex align-items-center gap-3">
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

      <div className="d-flex justify-content-between align-items-center mb-3 mt-3 px-3">
      </div>

      <div className="table-responsive flex-grow-1 jira-scroll" style={{ maxHeight: '1756px', overflowY: 'auto', overflowX: 'auto', minHeight: '616px' }}>
        {isLoading ? (
          <div className="text-center py-5"><Spinner animation="border" variant="secondary" size="sm" /></div>
        ) : (
          <table className="table align-middle mb-0" style={{ borderCollapse: 'collapse', backgroundColor: 'transparent', tableLayout: 'fixed' }}>
            <thead className="jira-table-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                <ResizableHeader initialWidth={40} minWidth={40} style={{ borderLeft: 0, padding: '10px 10px', backgroundColor: 'transparent', textAlign: 'center' }}>
                  <Form.Check
                    type="checkbox"
                    checked={data.length > 0 && selectedIds.length === data.length}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = selectedIds.length > 0 && selectedIds.length < data.length;
                      }
                    }}
                    onChange={handleSelectAll}
                  />
                </ResizableHeader>
                  {columns.map(col => {
                    const schemaCol = schemaColumns.find(sc => sc.name === col);
                    const colInfo = getColumnInfo(tableName, col);
                    return (
                      <ResizableHeader key={col} initialWidth={getInitialColumnWidth(col)} style={{ padding: '10px 14px', backgroundColor: 'transparent', color: 'var(--jira-text)', verticalAlign: 'top' }}>
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
                  <ResizableHeader initialWidth={110} style={{ padding: '10px 14px', textAlign: 'center', backgroundColor: 'transparent', color: 'var(--jira-text)', verticalAlign: 'top' }}>
                    <div className="d-flex flex-column gap-1 align-items-center">
                      <span className="fw-bold text-nowrap" style={{ fontSize: '13.5px' }}>Thao tác</span>
                      <span className="text-secondary text-nowrap" style={{ fontSize: '11.5px', fontWeight: 500, opacity: 0.85 }}>Sửa / Xóa</span>
                    </div>
                  </ResizableHeader>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((row, i) => {
                    const rowId = primaryKeyCol ? row[primaryKeyCol] : i;
                    const isSelected = selectedIds.includes(rowId);
                    return (
                    <tr key={i} className={`jira-table-row${isSelected ? ' jira-row-selected' : ''}`} style={{ height: '46px' }}>
                      <td style={{ borderLeft: 0, padding: '10px 10px', backgroundColor: 'transparent', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                        <Form.Check
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(row, i)}
                        />
                      </td>
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
                          <td key={col} className="text-truncate" style={{ maxWidth: '220px', padding: '10px 14px', backgroundColor: 'transparent', color: 'var(--jira-text)' }} title={strVal}>
                            {strVal}
                          </td>
                        );
                      })}
                      <td className="text-center" style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                        <Button variant="light" size="sm" className="me-2 px-2 py-1  d-inline-flex align-items-center" style={{ fontSize: '13px', color: '#0d6efd', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} onClick={() => handleOpenEdit(row)} title="Chỉnh sửa bản ghi">
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button variant="light" size="sm" className="px-2 py-1  d-inline-flex align-items-center" style={{ fontSize: '13px', color: '#dc3545', border: '1px solid #e2e8f0', borderRadius: '6px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} onClick={() => handleDelete(row)} title="Xóa bản ghi">
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </td>
                    </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={columns.length + 2} style={{ borderLeft: 0, borderRight: 0, padding: 0 }}>
                      <div className="jira-empty-state">
                        <img src="/empty-state.svg" alt="No data" style={{ width: '120px', marginBottom: '20px', opacity: 0.5 }} onError={(e) => e.currentTarget.style.display = 'none'} />
                        <h4>There are no work items here yet</h4>
                        <p>We couldn't find any data matching your criteria. Try adjusting your filters or search terms.</p>
                      </div>
                    </td>
                  </tr>
                )}
              {!isLoading && <LoadingMoreIndicator isVisible={isLoadingMore} colSpan={columns.length + 2} />}
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
          onBulkDelete={handleBulkDelete}
        />
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
    </>
  );
};

