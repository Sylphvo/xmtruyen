import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Book, Hexagon, Tag, List, Database, TableProperties, Bell, Ticket, Bot, Languages, ShieldAlert, FileText, HelpCircle, MessageSquare, BookOpen, BarChart2, Settings, Headphones } from 'lucide-react';
import { getTables } from '../../api/managerDbApi';
import { getTableInfo } from '../../constants/databaseDictionary';

interface SidebarProps {
  isCollapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false }) => {
  const location = useLocation();
  const path = location.pathname;

  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [activeBookSubMenu, setActiveBookSubMenu] = useState('');
  const [dbTables, setDbTables] = useState<string[]>([]);

  // Resize states
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const savedWidth = localStorage.getItem('appSidebarWidth');
    return savedWidth ? parseInt(savedWidth, 10) : 280;
  });
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    getTables().then(setDbTables).catch(console.error);
  }, []);

  useEffect(() => {
    localStorage.setItem('appSidebarWidth', sidebarWidth.toString());
  }, [sidebarWidth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      // 80 is the width of .app-sidebar-icon
      const newWidth = Math.max(200, Math.min(e.clientX - 80, 800));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isResizing]);

  useEffect(() => {
    // Trang chi tiết sách (/books/[id]) - dùng referrer để biết active menu con nào
    if (/^\/books\/[^/]+$/.test(path)) {
      const referrer = sessionStorage.getItem('bookDetailReferrer') || '';
      setActiveMenu('books');
      if (referrer.startsWith('/all-books')) setActiveBookSubMenu('/all-books');
      else if (referrer === '/books' || referrer.startsWith('/books?')) setActiveBookSubMenu('/books');
      else if (referrer.startsWith('/comics')) setActiveBookSubMenu('/comics');
      else setActiveBookSubMenu('');
      return;
    }
    // Xóa referrer và sub-menu khi rời khỏi trang chi tiết
    if (!path.startsWith('/books/')) {
      sessionStorage.removeItem('bookDetailReferrer');
      setActiveBookSubMenu('');
    }

    if (path.startsWith('/all-books') || path.startsWith('/books') || path.startsWith('/comics') || path.startsWith('/book-files') || path.startsWith('/topics') || path.startsWith('/categories') || path.startsWith('/book-chapters') || path.startsWith('/authors') || path.startsWith('/reading-analytics')) {
      setActiveMenu('books');
    } else if (path.startsWith('/plans')) {
      setActiveMenu('plans');
    } else if (path.startsWith('/users')) {
      setActiveMenu('users');
    } else if (path.startsWith('/database') || path.startsWith('/system-configs')) {
      setActiveMenu('database');
    } else if (path.startsWith('/transactions') || path.startsWith('/coin-packages')) {
      setActiveMenu('transactions');
    } else if (path.startsWith('/notifications') || path.startsWith('/reports') || path.startsWith('/reviews')) {
      setActiveMenu('notifications');
    } else if (path.startsWith('/promotions') || path.startsWith('/banners') || path.startsWith('/home-sections') || path.startsWith('/email-templates') || path.startsWith('/help-articles') || path.startsWith('/static-pages') || path.startsWith('/faq-management')) {
      setActiveMenu('marketing');
    } else if (path.startsWith('/crawlers') || path.startsWith('/translation') || path.startsWith('/import') || path.startsWith('/print-pipeline')) {
      setActiveMenu('automation');
    } else if (path.startsWith('/audio') || path.startsWith('/book-video') || path.startsWith('/comic-video')) {
      setActiveMenu('audio');
    } else {
      setActiveMenu('dashboard');
    }
  }, [path]);

  return (
    <div className="app-menubar-wrapper">
      <aside className="app-sidebar-icon">
        <div className="sidebar-icon-header">
          <NavLink to="/" className="brand-icon" title="Xóm Truyện">
            <Hexagon fill="white" size={24} />
          </NavLink>
        </div>
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
        <div 
          className={`icon-nav-item ${activeMenu === 'transactions' ? 'active' : ''}`} 
          onClick={() => setActiveMenu('transactions')}
          style={{ cursor: 'pointer' }}
          title="Giao dịch"
        >
          <Tag />
        </div>
        <div 
          className={`icon-nav-item ${activeMenu === 'plans' ? 'active' : ''}`} 
          onClick={() => setActiveMenu('plans')}
          style={{ cursor: 'pointer' }}
          title="Gói VIP"
        >
          <TableProperties />
        </div>
        <div 
          className={`icon-nav-item ${activeMenu === 'notifications' ? 'active' : ''}`} 
          onClick={() => setActiveMenu('notifications')}
          style={{ cursor: 'pointer' }}
          title="Thông báo"
        >
          <Bell />
        </div>
        <div 
          className={`icon-nav-item ${activeMenu === 'marketing' ? 'active' : ''}`} 
          onClick={() => setActiveMenu('marketing')}
          style={{ cursor: 'pointer' }}
          title="Marketing"
        >
          <Ticket />
        </div>
        <div 
          className={`icon-nav-item ${activeMenu === 'automation' ? 'active' : ''}`} 
          onClick={() => setActiveMenu('automation')}
          style={{ cursor: 'pointer' }}
          title="Tự động hóa"
        >
          <Bot />
        </div>
        <div 
          className={`icon-nav-item ${activeMenu === 'audio' ? 'active' : ''}`} 
          onClick={() => setActiveMenu('audio')}
          style={{ cursor: 'pointer' }}
          title="Audio & Video"
        >
          <Headphones />
        </div>
      </aside>

      {/* Menu Sidebar */}
      <aside className="app-sidebar-menu" style={{ display: isCollapsed ? 'none' : 'flex', width: sidebarWidth, minWidth: sidebarWidth, position: 'relative' }}>
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
              <NavLink to="/all-books" className={({ isActive }) => `menu-link${isActive || activeBookSubMenu === '/all-books' ? ' active' : ''}`} end>
                <Database />
                <span>Tất cả sách <span className="text-secondary small" style={{ fontSize: '12px' }}>(All Books)</span></span>
              </NavLink>
              <NavLink to="/books" className={({ isActive }) => `menu-link${isActive || activeBookSubMenu === '/books' ? ' active' : ''}`} end>
                <Book />
                <span>Sách <span className="text-secondary small" style={{ fontSize: '12px' }}>(Books)</span></span>
              </NavLink>
              <NavLink to="/book-chapters" className="menu-link">
                <Book />
                <span>QL Chương <span className="text-secondary small" style={{ fontSize: '12px' }}>(Chapters)</span></span>
              </NavLink>
              <NavLink to="/reading-analytics" className="menu-link">
                <BarChart2 />
                <span>Phân tích Lượt đọc <span className="text-secondary small" style={{ fontSize: '12px' }}>(Analytics)</span></span>
              </NavLink>
              <NavLink to="/comics" className={({ isActive }) => `menu-link${isActive || activeBookSubMenu === '/comics' ? ' active' : ''}`}>
                <Book />
                <span>Truyện <span className="text-secondary small" style={{ fontSize: '12px' }}>(Truyện tranh)</span></span>
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
              <NavLink to="/authors" className="menu-link">
                <Users />
                <span>Tác giả <span className="text-secondary small" style={{ fontSize: '12px' }}>(Authors)</span></span>
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

          {activeMenu === 'audio' && (
            <>
              <div className="menu-heading">🎧 Sách nói (Audiobooks)</div>
              <NavLink to="/audio" className="menu-link" end>
                <LayoutDashboard />
                <span>Tổng quan Audio</span>
              </NavLink>
              <NavLink to="/audio/voices" className="menu-link" end>
                <Users />
                <span>Quản lý Giọng đọc</span>
              </NavLink>
              
              <div className="menu-heading mt-3">🎬 Video (Storytelling)</div>
              <NavLink to="/book-video" className="menu-link" end>
                <LayoutDashboard />
                <span>Video Truyện Chữ</span>
              </NavLink>
              <NavLink to="/comic-video" className="menu-link" end>
                <LayoutDashboard />
                <span>Video Truyện Tranh</span>
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
              <NavLink to="/system-configs" className="menu-link" end>
                <Settings />
                <span>Cấu hình (System Config)</span>
              </NavLink>
            </>
          )}

          {activeMenu === 'plans' && (
            <>
              <div className="menu-heading">Cấu hình VIP</div>
              <NavLink to="/plans" className="menu-link" end>
                <TableProperties />
                <span>Gói VIP <span className="text-secondary small" style={{ fontSize: '12px' }}>(Subscription)</span></span>
              </NavLink>
            </>
          )}

          {activeMenu === 'transactions' && (
            <>
              <div className="menu-heading">Tài chính</div>
              <NavLink to="/transactions" className="menu-link">
                <Tag />
                <span>Giao dịch <span className="text-secondary small" style={{ fontSize: '12px' }}>(Nạp xu)</span></span>
              </NavLink>
              <NavLink to="/coin-packages" className="menu-link">
                <Tag />
                <span>Gói Xu <span className="text-secondary small" style={{ fontSize: '12px' }}>(Nạp tiền)</span></span>
              </NavLink>
            </>
          )}

          {activeMenu === 'notifications' && (
            <>
              <div className="menu-heading">Tương tác</div>
              <NavLink to="/notifications" className="menu-link" end>
                <Bell />
                <span>Thông báo <span className="text-secondary small" style={{ fontSize: '12px' }}>(Notifications)</span></span>
              </NavLink>
              <NavLink to="/reviews" className="menu-link" end>
                <MessageSquare />
                <span>Đánh giá <span className="text-secondary small" style={{ fontSize: '12px' }}>(Reviews)</span></span>
              </NavLink>
              <NavLink to="/reports" className="menu-link" end>
                <ShieldAlert />
                <span>Báo cáo vi phạm <span className="text-secondary small" style={{ fontSize: '12px' }}>(Reports)</span></span>
              </NavLink>
            </>
          )}

          {activeMenu === 'marketing' && (
            <>
              <div className="menu-heading">Trang chủ & Marketing</div>
              <NavLink to="/promotions" className="menu-link" end>
                <Ticket />
                <span>Khuyến mãi <span className="text-secondary small" style={{ fontSize: '12px' }}>(Promotions)</span></span>
              </NavLink>
              <NavLink to="/banners" className="menu-link" end>
                <LayoutDashboard />
                <span>Quản lý Banner</span>
              </NavLink>
              <NavLink to="/home-sections" className="menu-link" end>
                <LayoutDashboard />
                <span>Trang chủ (Home CMS)</span>
              </NavLink>
              <NavLink to="/email-templates" className="menu-link" end>
                <FileText />
                <span>Mẫu Email <span className="text-secondary small" style={{ fontSize: '12px' }}>(Templates)</span></span>
              </NavLink>
              <NavLink to="/help-articles" className="menu-link" end>
                <HelpCircle />
                <span>Trợ giúp <span className="text-secondary small" style={{ fontSize: '12px' }}>(Help Center)</span></span>
              </NavLink>
              <NavLink to="/static-pages" className="menu-link" end>
                <FileText />
                <span>Trang Tĩnh <span className="text-secondary small" style={{ fontSize: '12px' }}>(CMS)</span></span>
              </NavLink>
              <NavLink to="/faq-management" className="menu-link" end>
                <HelpCircle />
                <span>FAQ <span className="text-secondary small" style={{ fontSize: '12px' }}>(Hỏi đáp)</span></span>
              </NavLink>
            </>
          )}

          {activeMenu === 'automation' && (
            <>
              <div className="menu-heading">Tự động hóa (Phase 1)</div>
              <NavLink to="/import" className="menu-link" end>
                <Database />
                <span>Import Dữ Liệu <span className="text-secondary small" style={{ fontSize: '12px' }}>(CSV/JSON)</span></span>
              </NavLink>
              <NavLink to="/crawlers" className="menu-link" end>
                <Bot />
                <span>Crawler Pipeline <span className="text-secondary small" style={{ fontSize: '12px' }}>(Bot)</span></span>
              </NavLink>
              <NavLink to="/translation" className="menu-link" end>
                <Languages />
                <span>Dashboard Dịch thuật</span>
              </NavLink>
              <NavLink to="/translation/upload" className="menu-link" end>
                <Languages />
                <span>Upload RAW</span>
              </NavLink>
              <NavLink to="/translation/glossary" className="menu-link" end>
                <BookOpen />
                <span>Từ điển (Glossary)</span>
              </NavLink>
              
              <div className="menu-heading mt-3">Dàn Trang & In Ấn (Phase 5)</div>
              <NavLink to="/print-pipeline" className="menu-link" end>
                <BookOpen />
                <span>Xuất bản PDF / CMYK</span>
              </NavLink>
            </>
          )}
        </div>

        {/* Resizer Handle */}
        <div
          onMouseDown={() => setIsResizing(true)}
          style={{
            position: 'absolute',
            top: 0,
            right: -3,
            width: 6,
            height: '100%',
            cursor: 'col-resize',
            zIndex: 9999,
          }}
          title="Kéo để thay đổi kích thước"
        />
      </aside>
    </div>
  );
};
