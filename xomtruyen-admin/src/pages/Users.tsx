import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Home } from 'lucide-react';
import { MOCK_USERS, STATUSES } from '../constants/mockData';
import { ActionCellRenderer } from '../components/users/ActionCellRenderer';

export const Users: React.FC = () => {
  const [rowData] = useState(MOCK_USERS);
  const [gridTheme, setGridTheme] = useState(
    document.documentElement.getAttribute('data-bs-theme') === 'light' ? 'ag-theme-quartz' : 'ag-theme-quartz-dark'
  );
  const [gridApi, setGridApi] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 0,
    totalPages: 1,
    startRow: 1,
    endRow: 10,
    totalRows: 0,
    pageSize: 10
  });

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-bs-theme') {
          const theme = document.documentElement.getAttribute('data-bs-theme');
          setGridTheme(theme === 'light' ? 'ag-theme-quartz' : 'ag-theme-quartz-dark');
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  const updatePaginationInfo = (api: any) => {
    if (!api) return;
    const currentPage = api.paginationGetCurrentPage();
    const totalPages = api.paginationGetTotalPages();
    const pageSize = api.paginationGetPageSize();
    const totalRows = api.getDisplayedRowCount();
    const startRow = totalRows === 0 ? 0 : (currentPage * pageSize) + 1;
    const endRow = Math.min((currentPage + 1) * pageSize, totalRows);
    setPaginationInfo({ currentPage, totalPages, startRow, endRow, totalRows, pageSize });
  };

  const onGridReady = (params: any) => {
    setGridApi(params.api);
    updatePaginationInfo(params.api);
  };

  const onPaginationChanged = (params: any) => {
    updatePaginationInfo(params.api);
  };

  const [colDefs] = useState<ColDef[]>([
    { 
      field: 'name', 
      headerName: 'Name', 
      flex: 1.5,
      cellRenderer: (params: any) => (
        <div className="d-flex align-items-center gap-2 h-100">
          <img src={params.data.avatar} alt="avatar" className="rounded-circle" style={{ width: '28px', height: '28px' }} />
          <span style={{ color: 'var(--app-text-heading)', fontWeight: 500 }}>{params.value}</span>
        </div>
      )
    },
    { 
      field: 'leaveType', 
      headerName: 'Leave Type', 
      flex: 1,
      cellRenderer: (params: any) => {
        let color = 'var(--app-text-main)';
        if (params.value === 'Casual Leave') color = '#198754';
        else if (params.value === 'Sick Leave' || params.value === 'Paternity Leave') color = '#fd7e14';
        return <span style={{ color, fontWeight: 500 }}>{params.value}</span>;
      }
    },
    { field: 'department', headerName: 'Department', flex: 1.2 },
    { field: 'days', headerName: 'Days', width: 100 },
    { field: 'start', headerName: 'Start', width: 120 },
    { field: 'end', headerName: 'End', width: 120 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 140,
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: STATUSES },
      onCellClicked: (params: any) => {
        params.api.startEditingCell({ rowIndex: params.node.rowIndex, colKey: params.column.getId() });
      },
      cellRenderer: (params: any) => {
        let bgColor = '';
        let color = '';
        switch (params.value) {
          case 'Approved': bgColor = 'rgba(89, 85, 209, 0.1)'; color = '#5955D1'; break;
          case 'Rejected': bgColor = 'rgba(21, 21, 33, 0.05)'; color = 'var(--app-text-main)'; break;
          case 'New': bgColor = 'rgba(25, 135, 84, 0.1)'; color = '#198754'; break;
          case 'Pending': bgColor = 'rgba(21, 21, 33, 0.05)'; color = 'var(--app-text-main)'; break;
          default: bgColor = 'transparent'; color = 'var(--app-text-heading)';
        }
        return (
          <div className="d-flex align-items-center h-100" style={{ cursor: 'pointer' }}>
            <span className="badge rounded-pill px-3 py-2 w-100 d-flex justify-content-between align-items-center" style={{ backgroundColor: bgColor, color: color, border: 'none', fontWeight: 500 }}>
              {params.value}
              <ChevronDown size={14} style={{ opacity: 0.5 }} />
            </span>
          </div>
        );
      }
    },
    {
      colId: 'action',
      headerName: 'Action',
      width: 100,
      cellRenderer: ActionCellRenderer,
      filter: false,
      sortable: false
    }
  ]);

  return (
    <div className="container-fluid p-0">
      {/* Breadcrumb */}
      <div className="d-flex align-items-center mb-4 text-muted" style={{ fontSize: '13px' }}>
        <Home size={14} className="me-2" />
        <span className="me-2">Home</span>
        <ChevronRight size={14} className="me-2" style={{ opacity: 0.5 }} />
        <span style={{ color: 'var(--app-text-heading)' }}>Datatable</span>
      </div>

      <div className="card border shadow-sm rounded-3" style={{ backgroundColor: 'var(--app-bg-card)', borderColor: 'var(--app-border-color) !important' }}>
        <div className="card-header bg-transparent border-bottom px-4 py-3" style={{ borderColor: 'var(--app-border-color) !important' }}>
          <h5 className="mb-0 fw-bold" style={{ color: 'var(--app-text-heading)' }}>DataTable basic</h5>
        </div>
        <div className="card-body p-0">
          {/* Top Controls */}
          <div className="d-flex justify-content-between align-items-center px-4 py-3">
            <div className="d-flex align-items-center text-muted" style={{ fontSize: '13px' }}>
              <select 
                className="form-select form-select-sm bg-transparent shadow-none" 
                style={{width: '75px', borderColor: 'var(--app-border-color)', color: 'var(--app-text-heading)'}} 
                value={paginationInfo.pageSize}
                onChange={(e) => gridApi?.paginationSetPageSize(Number(e.target.value))}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
              <span className="ms-3">entries per page</span>
            </div>
            <div>
              <input 
                type="text" 
                className="form-control form-control-sm shadow-none bg-transparent" 
                placeholder="Search" 
                style={{minWidth: '220px', borderColor: 'var(--app-border-color)', color: 'var(--app-text-heading)', fontSize: '13px'}} 
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)} 
              />
            </div>
          </div>

          {/* AG Grid container */}
          <div className={gridTheme} style={{ height: 600, width: '100%', '--ag-background-color': 'var(--app-bg-card)', '--ag-header-background-color': 'var(--app-bg-card)', '--ag-odd-row-background-color': 'var(--app-bg-card)', '--ag-border-color': 'var(--app-border-color)', '--ag-row-border-color': 'var(--app-border-color)' } as React.CSSProperties}>
            <AgGridReact
              rowData={rowData}
              columnDefs={colDefs}
              defaultColDef={{ filter: true, sortable: true, unSortIcon: true }}
              icons={{
                sortAscending: '<span style="opacity: 0.5; font-size: 11px;">↑</span>',
                sortDescending: '<span style="opacity: 0.5; font-size: 11px;">↓</span>',
                sortUnSort: '<span style="opacity: 0.3; font-size: 11px;">↑↓</span>'
              }}
              pagination={true}
              paginationPageSize={10}
              suppressPaginationPanel={true}
              onGridReady={onGridReady}
              onPaginationChanged={onPaginationChanged}
              quickFilterText={searchText}
              rowHeight={55}
              headerHeight={45}
            />
          </div>

          {/* Bottom Controls */}
          <div className="d-flex justify-content-between align-items-center px-4 py-3 border-top" style={{ borderColor: 'var(--app-border-color) !important' }}>
            <div className="text-muted" style={{ fontSize: '13px' }}>
              Showing {paginationInfo.startRow} to {paginationInfo.endRow} of {paginationInfo.totalRows} entries
            </div>
            <div className="d-flex gap-1">
              <button className="btn btn-sm btn-icon bg-transparent text-muted" style={{ border: '1px solid var(--app-border-color)' }} onClick={() => gridApi?.paginationGoToFirstPage()} disabled={paginationInfo.currentPage === 0}>
                <ChevronsLeft size={14}/>
              </button>
              <button className="btn btn-sm btn-icon bg-transparent text-muted" style={{ border: '1px solid var(--app-border-color)' }} onClick={() => gridApi?.paginationGoToPreviousPage()} disabled={paginationInfo.currentPage === 0}>
                <ChevronLeft size={14}/>
              </button>
              
              {/* Page numbers */}
              {Array.from({length: paginationInfo.totalPages}).map((_, i) => (
                <button 
                  key={i} 
                  className={`btn btn-sm btn-icon rounded-2 ${paginationInfo.currentPage === i ? 'bg-primary text-white border-primary' : 'bg-transparent text-muted'}`}
                  style={{ width: '32px', height: '32px', border: paginationInfo.currentPage === i ? '1px solid var(--primary)' : '1px solid var(--app-border-color)' }}
                  onClick={() => gridApi?.paginationGoToPage(i)}
                >
                  {i + 1}
                </button>
              ))}

              <button className="btn btn-sm btn-icon bg-transparent text-muted" style={{ border: '1px solid var(--app-border-color)' }} onClick={() => gridApi?.paginationGoToNextPage()} disabled={paginationInfo.currentPage === paginationInfo.totalPages - 1}>
                <ChevronRight size={14}/>
              </button>
              <button className="btn btn-sm btn-icon bg-transparent text-muted" style={{ border: '1px solid var(--app-border-color)' }} onClick={() => gridApi?.paginationGoToLastPage()} disabled={paginationInfo.currentPage === paginationInfo.totalPages - 1}>
                <ChevronsRight size={14}/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

