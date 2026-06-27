import React, { useState, useMemo } from 'react';
import { MOCK_USERS, STATUSES } from '../constants/mockData';
import type { IUser } from '../types/user';
import { Dropdown, Pagination, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faSort, faSortUp, faSortDown, faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  key: keyof IUser | null;
  direction: SortDirection;
}

export const Users: React.FC = () => {
  const [data, setData] = useState<IUser[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });

  // Handle Sort
  const handleSort = (key: keyof IUser) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null; // Reset sort
    }
    setSortConfig({ key: direction ? key : null, direction });
  };

  // Get Sort Icon
  const getSortIcon = (key: keyof IUser) => {
    if (sortConfig.key !== key) return <FontAwesomeIcon icon={faSort} className="text-muted ms-1" style={{ fontSize: '12px' }} />;
    if (sortConfig.direction === 'asc') return <FontAwesomeIcon icon={faSortUp} className="ms-1" style={{ fontSize: '12px' }} />;
    if (sortConfig.direction === 'desc') return <FontAwesomeIcon icon={faSortDown} className="ms-1" style={{ fontSize: '12px' }} />;
    return <FontAwesomeIcon icon={faSort} className="text-muted ms-1" style={{ fontSize: '12px' }} />;
  };

  // Filter Data
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(user => 
      Object.values(user).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Sort Data
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key!];
      const bVal = b[sortConfig.key!];
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Ensure current page is valid after filtering
  const validCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
  
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleStatusChange = (id: string, newStatus: string) => {
    setData(prev => prev.map(user => user.id === id ? { ...user, status: newStatus } : user));
  };

  // Helper for Leave Type colors
  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'Casual Leave': return 'text-success';
      case 'Paternity Leave': return 'text-warning';
      case 'Sick Leave': return 'text-warning';
      case 'Maternity Leave': return 'text-secondary';
      default: return 'text-muted';
    }
  };

  // Helper for Status Badge styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Approved':
        return { backgroundColor: '#f0efff', color: '#635bff', border: '1px solid transparent' };
      case 'Rejected':
        return { backgroundColor: '#f3f4f6', color: '#4b5563', border: '1px solid transparent' };
      case 'Pending':
      case 'New':
        return { backgroundColor: '#ffffff', color: '#4b5563', border: '1px solid #e5e7eb' };
      default:
        return { backgroundColor: '#f3f4f6', color: '#4b5563', border: '1px solid transparent' };
    }
  };

  return (
    <div className="card border-0 shadow-sm bg-white h-auto">
      <div className="card-header bg-white border-bottom-0 pt-4 pb-0">
        <h5 className="mb-0 fw-semibold text-dark">DataTable basic</h5>
      </div>
      
      <div className="card-body d-flex flex-column">
        {/* Top Controls */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <Form.Select 
              size="sm" 
              style={{ width: '70px' }}
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </Form.Select>
            <span className="text-muted small">entries per page</span>
          </div>
          
          <div style={{ width: '250px' }}>
            <Form.Control 
              size="sm" 
              type="text" 
              placeholder="Search" 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive flex-grow-1 bg-white" style={{ minHeight: '616px', maxHeight: '1756px', overflowY: 'auto' }}>
          <table className="table align-middle mb-0" style={{ borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: '#fff' }}>
              <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                <th style={{ cursor: 'pointer', border: 'none', padding: '12px 16px' }} onClick={() => handleSort('name')}>
                  <span className="text-dark fw-semibold text-nowrap">Name {getSortIcon('name')}</span>
                </th>
                <th style={{ cursor: 'pointer', border: 'none', padding: '12px 16px' }} onClick={() => handleSort('leaveType')}>
                  <span className="text-dark fw-semibold text-nowrap">Leave Type {getSortIcon('leaveType')}</span>
                </th>
                <th style={{ cursor: 'pointer', border: 'none', padding: '12px 16px' }} onClick={() => handleSort('department')}>
                  <span className="text-dark fw-semibold text-nowrap">Department {getSortIcon('department')}</span>
                </th>
                <th style={{ cursor: 'pointer', border: 'none', padding: '12px 16px' }} onClick={() => handleSort('days')}>
                  <span className="text-dark fw-semibold text-nowrap">Days {getSortIcon('days')}</span>
                </th>
                <th style={{ cursor: 'pointer', border: 'none', padding: '12px 16px' }} onClick={() => handleSort('start')}>
                  <span className="text-dark fw-semibold text-nowrap">Start {getSortIcon('start')}</span>
                </th>
                <th style={{ cursor: 'pointer', border: 'none', padding: '12px 16px' }} onClick={() => handleSort('end')}>
                  <span className="text-dark fw-semibold text-nowrap">End {getSortIcon('end')}</span>
                </th>
                <th style={{ cursor: 'pointer', border: 'none', padding: '12px 16px' }} onClick={() => handleSort('status')}>
                  <span className="text-dark fw-semibold text-nowrap">Status {getSortIcon('status')}</span>
                </th>
                <th style={{ border: 'none', padding: '12px 16px', textAlign: 'right' }}>
                  <span className="text-dark fw-semibold text-nowrap">Action <FontAwesomeIcon icon={faSort} className="text-muted ms-1" style={{ fontSize: '12px' }} /></span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', border: 'none' }}>
                      <div className="d-flex align-items-center gap-3">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="rounded-circle"
                          style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                        />
                        <span className="text-secondary fw-medium">{user.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', border: 'none' }}>
                      <span className={`fw-medium ${getLeaveTypeColor(user.leaveType)}`}>{user.leaveType}</span>
                    </td>
                    <td style={{ padding: '12px 16px', border: 'none' }} className="text-secondary">
                      {user.department}
                    </td>
                    <td style={{ padding: '12px 16px', border: 'none' }} className="text-secondary">
                      {user.days}
                    </td>
                    <td style={{ padding: '12px 16px', border: 'none' }} className="text-secondary">
                      {user.start}
                    </td>
                    <td style={{ padding: '12px 16px', border: 'none' }} className="text-secondary">
                      {user.end}
                    </td>
                    <td style={{ padding: '12px 16px', border: 'none' }}>
                      <Dropdown>
                        <Dropdown.Toggle 
                          variant="light" 
                          size="sm" 
                          className="fw-medium d-flex align-items-center justify-content-between"
                          style={{ 
                            ...getStatusStyle(user.status),
                            minWidth: '110px',
                            padding: '6px 12px',
                            boxShadow: 'none'
                          }}
                        >
                          {user.status}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="shadow-sm border-0 py-2">
                          {STATUSES.map(status => (
                            <Dropdown.Item 
                              key={status}
                              onClick={() => handleStatusChange(user.id, status)}
                              className="text-secondary py-2 px-3"
                              style={{ fontSize: '14px' }}
                            >
                              {status}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                    <td style={{ padding: '12px 16px', border: 'none', textAlign: 'right' }}>
                      <button className="btn btn-light btn-sm bg-white border shadow-sm rounded-2 px-2 py-1">
                        <FontAwesomeIcon icon={faEllipsisH} className="text-secondary" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-muted">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Controls */}
        <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top bg-white">
          <div className="text-muted" style={{ fontSize: '13px' }}>
            Showing {totalItems === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} entries
          </div>
          
          {totalPages > 1 && (
            <div className="d-flex" style={{ gap: '4px' }}>
              <button 
                className="btn btn-sm border-0 d-flex align-items-center justify-content-center rounded-2" 
                style={{ width: '32px', height: '32px', backgroundColor: '#f4f5f8', color: validCurrentPage === 1 ? '#a9b1c0' : '#5955D1' }}
                onClick={() => setCurrentPage(1)} 
                disabled={validCurrentPage === 1}
              >
                <FontAwesomeIcon icon={faAngleDoubleLeft} style={{ fontSize: '12px' }} />
              </button>
              <button 
                className="btn btn-sm border-0 d-flex align-items-center justify-content-center rounded-2" 
                style={{ width: '32px', height: '32px', backgroundColor: '#f4f5f8', color: validCurrentPage === 1 ? '#a9b1c0' : '#5955D1' }}
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
                    backgroundColor: i + 1 === validCurrentPage ? '#5955D1' : '#f4f5f8', 
                    color: i + 1 === validCurrentPage ? '#fff' : '#5955D1' 
                  }}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              
              <button 
                className="btn btn-sm border-0 d-flex align-items-center justify-content-center rounded-2" 
                style={{ width: '32px', height: '32px', backgroundColor: '#f4f5f8', color: validCurrentPage === totalPages ? '#a9b1c0' : '#5955D1' }}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                disabled={validCurrentPage === totalPages}
              >
                <FontAwesomeIcon icon={faAngleRight} style={{ fontSize: '12px' }} />
              </button>
              <button 
                className="btn btn-sm border-0 d-flex align-items-center justify-content-center rounded-2" 
                style={{ width: '32px', height: '32px', backgroundColor: '#f4f5f8', color: validCurrentPage === totalPages ? '#a9b1c0' : '#5955D1' }}
                onClick={() => setCurrentPage(totalPages)} 
                disabled={validCurrentPage === totalPages}
              >
                <FontAwesomeIcon icon={faAngleDoubleRight} style={{ fontSize: '12px' }} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
