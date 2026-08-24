import React, { useState, useEffect, useMemo } from 'react';
import { Dropdown, Form, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faSort, faSortUp, faSortDown, faDatabase, faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { getTables } from '../api/managerDbApi';
import { ResizableHeader } from '../components/ResizableHeader';
import { FloatingBulkActionBar } from '../components/FloatingBulkActionBar';
import { getTableInfo } from '../constants/databaseDictionary';

type SortDirection = 'asc' | 'desc' | null;

interface DatabaseTable {
  id: string;
  name: string;
  rowCount: number;
  size: string;
  lastBackup: string;
  status: 'Active' | 'Locked' | 'Maintenance';
}

interface SortConfig {
  key: keyof DatabaseTable | null;
  direction: SortDirection;
}

const CustomToggle = React.forwardRef(({ children, onClick }: any, ref: any) => (
  <button
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    className="btn btn-sm border border-secondary-subtle rounded-2 px-2 py-1 bg-transparent"
    style={{ boxShadow: 'none' }}
  >
    {children}
  </button>
));

export const Database: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DatabaseTable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(data.map(t => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    setIsLoading(true);
    try {
      const tables = await getTables();
      const tableData = tables.map((t, i) => ({
        id: String(i + 1),
        name: t,
        rowCount: 0,
        size: 'N/A',
        lastBackup: new Date().toISOString(),
        status: 'Active' as const
      }));
      setData(tableData);
    } catch (error) {
      console.error('Failed to fetch tables:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sortedData = useMemo(() => {
    let filterData = data;
    if (searchTerm) {
        filterData = data.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    if (!sortConfig.key || !sortConfig.direction) return filterData;
    
    return [...filterData].sort((a, b) => {
      const aVal = a[sortConfig.key!];
      const bVal = b[sortConfig.key!];
      
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
      if (bVal === null || bVal === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig, searchTerm]);

  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const validCurrentPage = Math.min(currentPage, Math.max(1, totalPages || 1));
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (key: keyof DatabaseTable) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null; 
    }
    setSortConfig({ key: direction ? key : null, direction });
  };

  const getSortIcon = (key: keyof DatabaseTable) => {
    if (sortConfig.key !== key) return <FontAwesomeIcon icon={faSort} className="text-muted ms-1" style={{ fontSize: '12px' }} />;
    if (sortConfig.direction === 'asc') return <FontAwesomeIcon icon={faSortUp} className="ms-1" style={{ fontSize: '12px' }} />;
    if (sortConfig.direction === 'desc') return <FontAwesomeIcon icon={faSortDown} className="ms-1" style={{ fontSize: '12px' }} />;
    return <FontAwesomeIcon icon={faSort} className="text-muted ms-1" style={{ fontSize: '12px' }} />;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="jira-table-container">
      <div className="d-flex justify-content-between align-items-center p-3" style={{ borderBottom: '1px solid #dfe1e6' }}>
        <h5 className="mb-0 fw-semibold" style={{ color: '#172b4d', fontSize: '16px' }}>Quản lý Database</h5>
        <div className="d-flex align-items-center gap-3">
          <Button variant="primary" size="sm" className="d-flex align-items-center gap-2 rounded-2">
            <FontAwesomeIcon icon={faDatabase} />
            Backup Data
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
          
          <div style={{ width: '250px' }}>
            <Form.Control 
              size="sm" 
              type="text" 
              className="bg-transparent text-body"
              style={{ height: '32px', fontSize: '13px', border: '1px solid #dfe1e6', borderRadius: '4px' }}
              placeholder="Tìm kiếm bảng..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>

      <div className="table-responsive flex-grow-1 jira-scroll" style={{ overflowY: 'auto', overflowX: 'auto' }}>
        <table className="table align-middle mb-0" style={{ borderCollapse: 'collapse', backgroundColor: 'transparent', tableLayout: 'fixed', minWidth: '800px' }}>
          <thead className="jira-table-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
            <tr style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                <ResizableHeader initialWidth={40} minWidth={40} style={{ borderLeft: 0, padding: '12px 10px', backgroundColor: 'transparent', textAlign: 'center' }}>
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
                <ResizableHeader initialWidth={250} style={{ cursor: 'pointer', padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }} onClick={() => handleSort('name')}>
                  <span className="fw-semibold text-nowrap">Tên bảng {getSortIcon('name')}</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={120} style={{ cursor: 'pointer', padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }} onClick={() => handleSort('rowCount')}>
                  <span className="fw-semibold text-nowrap">Số dòng {getSortIcon('rowCount')}</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={120} style={{ cursor: 'pointer', padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }} onClick={() => handleSort('size')}>
                  <span className="fw-semibold text-nowrap">Kích thước {getSortIcon('size')}</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={150} style={{ cursor: 'pointer', padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }} onClick={() => handleSort('lastBackup')}>
                  <span className="fw-semibold text-nowrap">Lần backup cuối {getSortIcon('lastBackup')}</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={120} style={{ cursor: 'pointer', padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }} onClick={() => handleSort('status')}>
                  <span className="fw-semibold text-nowrap">Trạng thái {getSortIcon('status')}</span>
                </ResizableHeader>
                <ResizableHeader initialWidth={100} style={{ padding: '12px 16px', textAlign: 'center', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                  <span className="fw-semibold text-nowrap">Thao Tác</span>
                </ResizableHeader>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-5">
                    <Spinner animation="border" variant="secondary" size="sm" />
                    <div className="mt-2 text-muted small">Đang tải danh sách bảng...</div>
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((table) => {
                  const info = getTableInfo(table.name);
                  return (
                    <tr key={table.id} className={`jira-table-row${selectedIds.includes(table.id) ? ' jira-row-selected' : ''}`} style={{ height: '46px' }}>
                      <td style={{ borderLeft: 0, padding: '12px 10px', backgroundColor: 'transparent', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                        <Form.Check
                          type="checkbox"
                          checked={selectedIds.includes(table.id)}
                          onChange={() => toggleSelect(table.id)}
                        />
                      </td>
                      <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                        <div className="d-flex flex-column gap-1">
                          <div className="d-flex align-items-center gap-2">
                            <span className="fw-bold text-primary font-monospace" style={{ fontSize: '13.5px' }}>{table.name}</span>
                            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-1.5 py-0.5" style={{ fontSize: '10.5px' }}>
                              {info.vietnameseName}
                            </span>
                          </div>
                          <div className="text-secondary small text-truncate" style={{ maxWidth: '280px', fontSize: '12px' }} title={info.summary}>
                            {info.summary}
                          </div>
                        </div>
                      </td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                      <span className="text-body">{table.rowCount.toLocaleString()}</span>
                    </td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                      <span className="text-body">{table.size}</span>
                    </td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                      {formatDate(table.lastBackup)}
                    </td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                      <span className={`badge ${table.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'} border-0 px-2 py-1`}>
                        {table.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', backgroundColor: 'transparent', color: 'var(--jira-text)' }}>
                      <Dropdown align="end">
                        <Dropdown.Toggle as={CustomToggle}>
                          <FontAwesomeIcon icon={faEllipsisH} className="text-muted" />
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="shadow-sm border border-secondary-subtle py-2" style={{ backgroundColor: 'transparent', minWidth: '120px' }}>
                          <Dropdown.Item 
                            className="text-body py-2 px-3 hover-bg-subtle" 
                            style={{ fontSize: '14px', backgroundColor: 'transparent', cursor: 'pointer' }}
                            onClick={() => navigate(`/database/${table.name}`)}
                          >
                            Xem chi tiết
                          </Dropdown.Item>
                          <Dropdown.Item className="text-danger py-2 px-3 hover-bg-subtle" style={{ fontSize: '14px', backgroundColor: 'transparent' }}>
                            Clear data
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} style={{ borderLeft: 0, borderRight: 0, padding: 0 }}>
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
        </div>
        
        <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top bg-transparent">
          <div className="text-muted" style={{ fontSize: '13px' }}>
            Hiển thị {totalItems === 0 ? 0 : startIndex + 1} đến {Math.min(startIndex + itemsPerPage, totalItems)} trong {totalItems} bảng
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

              {[...Array(totalPages)].map((_, i) => (
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
              ))}

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
        <FloatingBulkActionBar 
          selectedCount={selectedIds.length} 
          onClearSelection={() => setSelectedIds([])} 
        />
      </div>
  );
};
