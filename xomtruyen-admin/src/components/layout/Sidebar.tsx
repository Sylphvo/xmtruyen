import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Book, Hexagon, Tag, List } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const [activeMenu, setActiveMenu] = useState('dashboard');

  useEffect(() => {
    if (path.startsWith('/books') || path.startsWith('/topics') || path.startsWith('/categories')) {
      setActiveMenu('books');
    } else if (path.startsWith('/users')) {
      setActiveMenu('users');
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
      </aside>

      {/* Menu Sidebar */}
      <aside className="app-sidebar-menu">
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
              <NavLink to="/topics" className="menu-link">
                <Tag />
                <span>Topic</span>
              </NavLink>
              <NavLink to="/categories" className="menu-link">
                <List />
                <span>Category</span>
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
        </div>
      </aside>
    </div>
  );
};
