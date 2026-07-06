import React, { useState, useMemo } from 'react';
import { MOCK_BOOKS, STATUSES } from '../constants/mockData';
import type { IBook } from '../types/book';
import { Dropdown, Form, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faSort, faSortUp, faSortDown, faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight, faPlus } from '@fortawesome/free-solid-svg-icons';

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  key: keyof IBook | null;
  direction: SortDirection;
}

export const Books: React.FC = () => {
  const [data, setData] = useState<IBook[]>(MOCK_BOOKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItem, setNewItem] = useState<Partial<IBook>>({});

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, saveFunc: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveFunc();
    }
  };

  const handleCloseAdd = () => {
    setIsAddingNew(false);
    setNewItem({});
  };

  const handleAddSubmit = () => {
    const newEntry: any = {
      id: Math.random().toString(36).substr(2, 9),
      ...newItem,
      status: 'New'
    };
    setData([newEntry, ...data]);
    handleCloseAdd();
  };

  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });

  const handleSort = (key: keyof IBook) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null;
    }
    setSortConfig({ key: direction ? key : null, direction });
  };

  const getSortIcon = (key: keyof IBook) => {
    if (sortConfig.key !== key) return <FontAwesomeIcon icon={faSort} className="text-muted ms-1" style={{ fontSize: '12px' }} />;
    if (sortConfig.direction === 'asc') return <FontAwesomeIcon icon={faSortUp} className="ms-1" style={{ fontSize: '12px' }} />;
    if (sortConfig.direction === 'desc') return <FontAwesomeIcon icon={faSortDown} className="ms-1" style={{ fontSize: '12px' }} />;
    return <FontAwesomeIcon icon={faSort} className="text-muted ms-1" style={{ fontSize: '12px' }} />;
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(book => 
      Object.values(book).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

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

  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const validCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
  
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleStatusChange = (id: string, newStatus: string) => {
    setData(prev => prev.map(book => book.id === id ? { ...book, status: newStatus } : book));
  };

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
    <div className="card border-0 shadow-sm h-auto" style={{ backgroundColor: 'var(--bs-body-bg)' }}>
      <div className="card-header border-bottom-0 pt-4 pb-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: 'transparent' }}>
        <h5 className="mb-0 fw-semibold" style={{ color: 'var(--bs-heading-color)' }}>Quản lý Sách</h5>
        <Button variant="primary" size="sm" onClick={() => setIsAddingNew(true)} className="d-flex align-items-center gap-2 rounded-2">
          <FontAwesomeIcon icon={faPlus} />
          Thêm Mới
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
              className="bg-transparent text-body border-secondary-subtle"
              placeholder="Search" 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="table-responsive flex-grow-1" style={{ minHeight: '616px', maxHeight: '1756px', overflowY: 'auto' }}>
          <table className="table table-bordered align-middle mb-0 text-body" style={{ borderCollapse: 'collapse', backgroundColor: 'transparent' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'var(--bs-body-bg)' }}>
              <tr style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                <th style={{ cursor: 'pointer', backgroundColor: 'transparent', padding: '12px 16px' , color: 'var(--bs-heading-color)'}} onClick={() => handleSort('title')}>
                  <span className="fw-semibold text-nowrap">Title {getSortIcon('title')}</span>
                </th>
                <th style={{ cursor: 'pointer', backgroundColor: 'transparent', padding: '12px 16px' , color: 'var(--bs-heading-color)'}} onClick={() => handleSort('author')}>
                  <span className="fw-semibold text-nowrap">Author {getSortIcon('author')}</span>
                </th>
                <th style={{ cursor: 'pointer', backgroundColor: 'transparent', padding: '12px 16px' , color: 'var(--bs-heading-color)'}} onClick={() => handleSort('category')}>
                  <span className="fw-semibold text-nowrap">Category {getSortIcon('category')}</span>
                </th>
                <th style={{ cursor: 'pointer', backgroundColor: 'transparent', padding: '12px 16px' , color: 'var(--bs-heading-color)'}} onClick={() => handleSort('published')}>
                  <span className="fw-semibold text-nowrap">Published {getSortIcon('published')}</span>
                </th>
                <th style={{ cursor: 'pointer', backgroundColor: 'transparent', padding: '12px 16px' , color: 'var(--bs-heading-color)'}} onClick={() => handleSort('status')}>
                  <span className="fw-semibold text-nowrap">Status {getSortIcon('status')}</span>
                </th>
                <th style={{ backgroundColor: 'transparent', padding: '12px 16px', textAlign: 'right' , color: 'var(--bs-heading-color)'}}>
                  <span className="fw-semibold text-nowrap">Action <FontAwesomeIcon icon={faSort} className="text-muted ms-1" style={{ fontSize: '12px' }} /></span>
                </th>
              </tr>
            </thead>
            <tbody>
              <>
              {isAddingNew && (
                <tr style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                  
                  <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <div className="d-flex align-items-center gap-3">
                      <img src="https://via.placeholder.com/32x48" alt="New" className="rounded" style={{ width: '32px', height: '48px', objectFit: 'cover' }} />
                      <Form.Control size="sm" value={newItem.title || ''} onChange={(e) => setNewItem({...newItem, title: e.target.value})} onKeyDown={(e) => handleKeyDown(e, handleAddSubmit)} placeholder="Title" className="bg-transparent text-body border-secondary-subtle" />
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <Form.Control size="sm" value={newItem.author || ''} onChange={(e) => setNewItem({...newItem, author: e.target.value})} onKeyDown={(e) => handleKeyDown(e, handleAddSubmit)} placeholder="Author" className="bg-transparent text-body border-secondary-subtle" />
                  </td>
                  <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <Form.Control size="sm" value={newItem.category || ''} onChange={(e) => setNewItem({...newItem, category: e.target.value})} onKeyDown={(e) => handleKeyDown(e, handleAddSubmit)} placeholder="Category" className="bg-transparent text-body border-secondary-subtle" />
                  </td>
                  <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <Form.Control size="sm" value={newItem.published || ''} onChange={(e) => setNewItem({...newItem, published: e.target.value})} onKeyDown={(e) => handleKeyDown(e, handleAddSubmit)} placeholder="YYYY" className="bg-transparent text-body border-secondary-subtle" />
                  </td>
                  <td style={{ padding: '12px 16px', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <span className="badge bg-light text-dark border border-secondary-subtle">New</span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', backgroundColor: 'transparent', color: 'var(--bs-body-color)' }}>
                    <div className="d-flex gap-2 justify-content-end">
                      <Button variant="success" size="sm" onClick={handleAddSubmit} className="px-3 rounded-2 fw-medium">Lưu</Button>
                      <Button variant="light" size="sm" onClick={handleCloseAdd} className="px-3 rounded-2 border border-secondary-subtle">Hủy</Button>
                    </div>
                  </td>
                </tr>
              )}
              {paginatedData.length > 0 ? (
                paginatedData.map((book) => (
                  <tr key={book.id} style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent' , color: 'var(--bs-body-color)'}}>
                      <div className="d-flex align-items-center gap-3">
                        <img 
                          src={book.cover} 
                          alt={book.title} 
                          className="rounded"
                          style={{ width: '32px', height: '48px', objectFit: 'cover' }}
                        />
                        <span className="fw-medium">{book.title}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent' , color: 'var(--bs-body-color)'}}>
                      {book.author}
                    </td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent' , color: 'var(--bs-body-color)'}}>
                      {book.category}
                    </td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent' , color: 'var(--bs-body-color)'}}>
                      {book.published}
                    </td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent' , color: 'var(--bs-body-color)'}}>
                      <Dropdown>
                        <Dropdown.Toggle 
                          variant="light" 
                          size="sm" 
                          className="fw-medium d-flex align-items-center justify-content-between"
                          style={{ 
                            ...getStatusStyle(book.status),
                            minWidth: '110px',
                            padding: '6px 12px',
                            boxShadow: 'none'
                          }}
                        >
                          {book.status}
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="shadow-sm border-0 py-2">
                          {STATUSES.map(status => (
                            <Dropdown.Item 
                              key={status}
                              onClick={() => handleStatusChange(book.id, status)}
                              className="text-secondary py-2 px-3"
                              style={{ fontSize: '14px' }}
                            >
                              {status}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                    <td style={{ padding: '12px 16px', backgroundColor: 'transparent', textAlign: 'right' , color: 'var(--bs-body-color)'}}>
                      <Dropdown align="end">
                        <Dropdown.Toggle as="div" bsPrefix="p-0 border-0 bg-transparent" style={{ cursor: 'pointer', display: 'inline-block' }}>
                          <button className="btn btn-light btn-sm bg-white border shadow-sm rounded-2 px-2 py-1">
                            <FontAwesomeIcon icon={faEllipsisH} />
                          </button>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="shadow-sm border-0 py-2">
                          <Dropdown.Item onClick={() => {}} className="py-2 px-3 text-body" style={{ fontSize: '14px' }}>
                            Edit
                          </Dropdown.Item>
                          <Dropdown.Item onClick={() => {}} className="py-2 px-3 text-danger" style={{ fontSize: '14px' }}>
                            Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">
                    No records found
                  </td>
                </tr>
              )}
              </>
            </tbody>
          </table>
        </div>

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
