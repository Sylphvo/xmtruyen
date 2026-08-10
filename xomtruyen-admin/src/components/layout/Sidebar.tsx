import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Book, Hexagon, Tag, List, Database, TableProperties } from 'lucide-react';
import { getTables } from '../../api/managerDbApi';
import { getTableInfo } from '../../constants/databaseDictionary';

interface SidebarProps {
  isCollapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false }) => {
  const location = useLocation();
  const path = location.pathname;

  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [dbTables, setDbTables] = useState<string[]>([]);

  useEffect(() => {
    getTables().then(setDbTables).catch(console.error);
  }, []);

  useEffect(() => {
    if (path.startsWith('/books') || path.startsWith('/topics') || path.startsWith('/categories') || path.startsWith('/book-files')) {
      setActiveMenu('books');
    } else if (path.startsWith('/users')) {
      setActiveMenu('users');
    } else if (path.startsWith('/database')) {
      setActiveMenu('database');
    } else {
      setActiveMenu('dashboard');
    }
  }, [path]);

  return (
    <div className="app-menubar-wrapper">
      {/* Icon Sidebar */}
      <aside className="app-sidebar-icon">
        <NavLink to="/" className="brand-icon" title="Xóm Truyện">
          <Hexagon fill="white" size={24} />
        </NavLink>
        <div 
          className={`icon-nav-item ${activeMenu === 'dashboard' ? 'active' : ''}`} 
          onClick={() => setActiveMenu('dashboard')}
          style={{ cursor: 'pointer' }}
          title="Dashboard (Bảng điều khiển)"
        >
          <LayoutDashboard />
        </div>
        <div 
          className={`icon-nav-item ${activeMenu === 'books' ? 'active' : ''}`} 
          onClick={() => setActiveMenu('books')}
          style={{ cursor: 'pointer' }}
          title="Quản lý Sách"
        >
          <Book />
        </div>
        <div 
          className={`icon-nav-item ${activeMenu === 'users' ? 'active' : ''}`} 
          onClick={() => setActiveMenu('users')}
          style={{ cursor: 'pointer' }}
          title="Quản lý User"
        >
          <Users />
        </div>
        <div 
          className={`icon-nav-item ${activeMenu === 'database' ? 'active' : ''}`} 
          onClick={() => setActiveMenu('database')}
          style={{ cursor: 'pointer' }}
          title="Quản lý Database"
        >
          <Database />
        </div>
      </aside>

      {/* Menu Sidebar */}
      <aside className="app-sidebar-menu" style={{ display: isCollapsed ? 'none' : 'flex' }}>
        <div className="sidebar-header">
          Xóm Truyện
        </div>
        <div className="d-flex flex-column h-100" style={{ overflowY: 'auto' }}>
          {activeMenu === 'dashboard' && (
            <>
              <div className="menu-heading">Dashboard</div>
              <NavLink to="/" className="menu-link" end>
                <LayoutDashboard />
                <span>Dashboard <span className="text-secondary small" style={{ fontSize: '12px' }}>(Bảng điều khiển)</span></span>
              </NavLink>
            </>
          )}

          {activeMenu === 'books' && (
            <>
              <div className="menu-heading">Quản lý Sách</div>
              <NavLink to="/books" className="menu-link">
                <Book />
                <span>Sách <span className="text-secondary small" style={{ fontSize: '12px' }}>(Tác phẩm)</span></span>
              </NavLink>
              <NavLink to="/book-files" className="menu-link">
                <Database />
                <span>File sách <span className="text-secondary small" style={{ fontSize: '12px' }}>(Lưu trữ)</span></span>
              </NavLink>
              <NavLink to="/topics" className="menu-link">
                <Tag />
                <span>Chủ đề <span className="text-secondary small" style={{ fontSize: '12px' }}>(Topics)</span></span>
              </NavLink>
              <NavLink to="/categories" className="menu-link">
                <List />
                <span>Thể loại <span className="text-secondary small" style={{ fontSize: '12px' }}>(Categories)</span></span>
              </NavLink>
            </>
          )}

          {activeMenu === 'users' && (
            <>
              <div className="menu-heading">Quản lý User</div>
              <NavLink to="/users" className="menu-link">
                <Users />
                <span>User <span className="text-secondary small" style={{ fontSize: '12px' }}>(Người dùng)</span></span>
              </NavLink>
            </>
          )}

          {activeMenu === 'database' && (
            <>
              <div className="menu-heading">Quản lý Database</div>
              <NavLink to="/database" className="menu-link" end>
                <Database />
                <span>Overview <span className="text-secondary small" style={{ fontSize: '12px' }}>(Tổng quan)</span></span>
              </NavLink>
              {dbTables.map(table => {
                const info = getTableInfo(table);
                return (
                  <NavLink 
                    key={table} 
                    to={`/database/${table}`} 
                    className="menu-link" 
                    style={{ paddingLeft: '32px', fontSize: '13px' }}
                    title={`${table}: ${info.vietnameseName} - ${info.summary}`}
                  >
                    <TableProperties size={15} className="flex-shrink-0" />
                    <span className="text-truncate">
                      {table} <span className="text-secondary" style={{ fontSize: '11.5px', fontWeight: 400, opacity: 0.85 }}>({info.vietnameseName})</span>
                    </span>
                  </NavLink>
                );
              })}
            </>
          )}
        </div>
      </aside>
    </div>
  );
};
