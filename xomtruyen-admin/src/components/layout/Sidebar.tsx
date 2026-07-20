import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Book, Hexagon, Tag, List, Database, TableProperties } from 'lucide-react';
import { getTables } from '../../api/managerDbApi';

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
        <NavLink to="/" className="brand-icon">
          <Hexagon fill="white" size={24} />
        </NavLink>
        <div 
          className={`icon-nav-item ${activeMenu === 'dashboard' ? 'active' : ''}`} 
          onClick={() => setActiveMenu('dashboard')}
          style={{ cursor: 'pointer' }}
        >
          <LayoutDashboard />
        </div>
        <div 
          className={`icon-nav-item ${activeMenu === 'books' ? 'active' : ''}`} 
          onClick={() => setActiveMenu('books')}
          style={{ cursor: 'pointer' }}
        >
          <Book />
        </div>
        <div 
          className={`icon-nav-item ${activeMenu === 'users' ? 'active' : ''}`} 
          onClick={() => setActiveMenu('users')}
          style={{ cursor: 'pointer' }}
        >
          <Users />
        </div>
        <div 
          className={`icon-nav-item ${activeMenu === 'database' ? 'active' : ''}`} 
          onClick={() => setActiveMenu('database')}
          style={{ cursor: 'pointer' }}
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
                <span>Dashboard</span>
              </NavLink>
            </>
          )}

          {activeMenu === 'books' && (
            <>
              <div className="menu-heading">Quản lý Sách</div>
              <NavLink to="/books" className="menu-link">
                <Book />
                <span>Sách</span>
              </NavLink>
              <NavLink to="/book-files" className="menu-link">
                <Database />
                <span>File sách</span>
              </NavLink>
              <NavLink to="/topics" className="menu-link">
                <Tag />
                <span>Chủ đề</span>
              </NavLink>
              <NavLink to="/categories" className="menu-link">
                <List />
                <span>Thể loại</span>
              </NavLink>
            </>
          )}

          {activeMenu === 'users' && (
            <>
              <div className="menu-heading">Quản lý User</div>
              <NavLink to="/users" className="menu-link">
                <Users />
                <span>User</span>
              </NavLink>
            </>
          )}

          {activeMenu === 'database' && (
            <>
              <div className="menu-heading">Quản lý Database</div>
              <NavLink to="/database" className="menu-link" end>
                <Database />
                <span>Overview</span>
              </NavLink>
              {dbTables.map(table => (
                <NavLink key={table} to={`/database/${table}`} className="menu-link" style={{ paddingLeft: '42px', fontSize: '13px' }}>
                  <TableProperties size={16} />
                  <span>{table}</span>
                </NavLink>
              ))}
            </>
          )}
        </div>
      </aside>
    </div>
  );
};
