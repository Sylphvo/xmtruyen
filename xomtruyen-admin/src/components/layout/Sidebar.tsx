import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Book, Hexagon, Tag, List, Database, TableProperties, Bell, Ticket, Bot, Languages, ShieldAlert, FileText, HelpCircle, MessageSquare, BookOpen, BarChart2, Settings, Headphones, ClipboardCheck, GitBranch } from 'lucide-react';
import { getTables } from '../../api/managerDbApi';
import { getTableInfo } from '../../constants/databaseDictionary';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableMenuItem } from './SortableMenuItem';


interface SidebarProps {
  isCollapsed?: boolean;
}


const DEFAULT_MENU_DATA = {
  books: [
    { id: 'all-books', path: '/all-books', icon: Database, title: 'Tất cả sách', subtitle: '(All Books)' },
    { id: 'books', path: '/books', icon: Book, title: 'Sách', subtitle: '(Books)' },
    { id: 'book-chapters', path: '/book-chapters', icon: Book, title: 'QL Chương', subtitle: '(Chapters)' },
    { id: 'reading-analytics', path: '/reading-analytics', icon: BarChart2, title: 'Phân tích Lượt đọc', subtitle: '(Analytics)' },
    { id: 'comics', path: '/comics', icon: Book, title: 'Truyện', subtitle: '(Truyện tranh)' },
    { id: 'book-files', path: '/book-files', icon: Database, title: 'File sách', subtitle: '(Lưu trữ)' },
    { id: 'topics', path: '/topics', icon: Tag, title: 'Chủ đề', subtitle: '(Topics)' },
    { id: 'categories', path: '/categories', icon: List, title: 'Thể loại', subtitle: '(Categories)' },
    { id: 'authors', path: '/authors', icon: Users, title: 'Tác giả', subtitle: '(Authors)' }
  ],
  users: [
    { id: 'users', path: '/users', icon: Users, title: 'User', subtitle: '(Người dùng)' }
  ],
  transactions: [
    { id: 'transactions', path: '/transactions', icon: Tag, title: 'Giao dịch', subtitle: '(Nạp xu)' },
    { id: 'coin-packages', path: '/coin-packages', icon: Tag, title: 'Gói Xu', subtitle: '(Nạp tiền)' }
  ],
  notifications: [
    { id: 'notifications', path: '/notifications', icon: Bell, title: 'Thông báo', subtitle: '(Notifications)' },
    { id: 'reviews', path: '/reviews', icon: MessageSquare, title: 'Đánh giá', subtitle: '(Reviews)' },
    { id: 'reports', path: '/reports', icon: ShieldAlert, title: 'Báo cáo vi phạm', subtitle: '(Reports)' }
  ],
  marketing: [
    { id: 'promotions', path: '/promotions', icon: Ticket, title: 'Khuyến mãi', subtitle: '(Promotions)' },
    { id: 'banners', path: '/banners', icon: LayoutDashboard, title: 'Quản lý Banner' },
    { id: 'home-sections', path: '/home-sections', icon: LayoutDashboard, title: 'Trang chủ (Home CMS)' },
    { id: 'email-templates', path: '/email-templates', icon: FileText, title: 'Mẫu Email', subtitle: '(Templates)' },
    { id: 'help-articles', path: '/help-articles', icon: HelpCircle, title: 'Trợ giúp', subtitle: '(Help Center)' },
    { id: 'static-pages', path: '/static-pages', icon: FileText, title: 'Trang Tĩnh', subtitle: '(CMS)' },
    { id: 'faq-management', path: '/faq-management', icon: HelpCircle, title: 'FAQ', subtitle: '(Hỏi đáp)' }
  ],
  automation: [
    { id: 'import', path: '/import', icon: Database, title: 'Import Dữ Liệu', subtitle: '(CSV/JSON)' },
    { id: 'crawlers', path: '/crawlers', icon: Bot, title: 'Crawler Pipeline', subtitle: '(Bot)' },
    { id: 'translation', path: '/translation', icon: Languages, title: 'Dashboard Dịch thuật' },
    { id: 'translation-upload', path: '/translation/upload', icon: Languages, title: 'Upload RAW' },
    { id: 'translation-glossary', path: '/translation/glossary', icon: BookOpen, title: 'Từ điển (Glossary)' }
  ]
};

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false }) => {
  const location = useLocation();
  const path = location.pathname;

  const [activeMenu, setActiveMenu] = useState('dashboard');
  // Load saved order from localStorage
  const [menuOrders, setMenuOrders] = useState(() => {
    const saved = localStorage.getItem('sidebarMenuOrders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const restoredData: any = { ...DEFAULT_MENU_DATA };
        Object.keys(parsed).forEach(key => {
          if (Array.isArray(parsed[key]) && (DEFAULT_MENU_DATA as any)[key]) {
             const defaultArray = (DEFAULT_MENU_DATA as any)[key];
             const restoredArray = parsed[key].map((item: any) => defaultArray.find((d: any) => d.id === item.id)).filter(Boolean);
             const missingItems = defaultArray.filter((d: any) => !parsed[key].find((item: any) => item.id === d.id));
             restoredData[key] = [...restoredArray, ...missingItems];
          }
        });
        return restoredData;
      } catch (e) {}
    }
    return DEFAULT_MENU_DATA;
  });

  useEffect(() => {
    localStorage.setItem('sidebarMenuOrders', JSON.stringify(menuOrders));
  }, [menuOrders]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id && over) {
      setMenuOrders((prev: any) => {
        const activeItems = prev[activeMenu];
        if (!activeItems) return prev;
        
        const oldIndex = activeItems.findIndex((item: any) => item.id === active.id);
        const newIndex = activeItems.findIndex((item: any) => item.id === over.id);
        
        return {
          ...prev,
          [activeMenu]: arrayMove(activeItems, oldIndex, newIndex)
        };
      });
    }
  };

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
    } else if (path.startsWith('/test-cases')) {
      setActiveMenu('test-cases');
    } else if (path.startsWith('/build-process')) {
      setActiveMenu('build-process');
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
        <div 
          className={`icon-nav-item ${activeMenu === 'test-cases' ? 'active' : ''}`} 
          onClick={() => setActiveMenu('test-cases')}
          style={{ cursor: 'pointer' }}
          title="Test Case & Bug Log"
        >
          <ClipboardCheck />
        </div>
        <div
          className={`icon-nav-item ${activeMenu === 'build-process' ? 'active' : ''}`}
          onClick={() => setActiveMenu('build-process')}
          style={{ cursor: 'pointer' }}
          title="Build Process & CI/CD"
        >
          <GitBranch />
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
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <div className="menu-heading">Quản lý Sách</div>
              <SortableContext items={menuOrders.books.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
                {menuOrders.books.map((item: any) => (
                  <SortableMenuItem key={item.id} {...item} isActive={item.path === activeBookSubMenu} />
                ))}
              </SortableContext>
            </DndContext>
          )}

          {activeMenu === 'users' && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <div className="menu-heading">Quản lý User</div>
              <SortableContext items={menuOrders.users.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
                {menuOrders.users.map((item: any) => (
                  <SortableMenuItem key={item.id} {...item} end={true} />
                ))}
              </SortableContext>
            </DndContext>
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
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <div className="menu-heading">Tài chính</div>
              <SortableContext items={menuOrders.transactions.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
                {menuOrders.transactions.map((item: any) => (
                  <SortableMenuItem key={item.id} {...item} end={true} />
                ))}
              </SortableContext>
            </DndContext>
          )}

          {activeMenu === 'notifications' && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <div className="menu-heading">Tương tác</div>
              <SortableContext items={menuOrders.notifications.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
                {menuOrders.notifications.map((item: any) => (
                  <SortableMenuItem key={item.id} {...item} end={true} />
                ))}
              </SortableContext>
            </DndContext>
          )}

          {activeMenu === 'marketing' && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <div className="menu-heading">Trang chủ & Marketing</div>
              <SortableContext items={menuOrders.marketing.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
                {menuOrders.marketing.map((item: any) => (
                  <SortableMenuItem key={item.id} {...item} end={true} />
                ))}
              </SortableContext>
            </DndContext>
          )}

          {activeMenu === 'automation' && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <div className="menu-heading">Tự động hóa (Phase 1)</div>
              <SortableContext items={menuOrders.automation.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
                {menuOrders.automation.map((item: any) => (
                  <SortableMenuItem key={item.id} {...item} end={true} />
                ))}
              </SortableContext>
              
              <div className="menu-heading mt-3">Dàn Trang & In Ấn (Phase 5)</div>
              <NavLink to="/print-pipeline" className="menu-link" end>
                <BookOpen />
                <span>Xuất bản PDF / CMYK</span>
              </NavLink>
            </DndContext>
          )}

          {activeMenu === 'test-cases' && (
            <>
              <div className="menu-heading">Test Case Center</div>
              <NavLink to="/test-cases" className="menu-link" end>
                <ClipboardCheck />
                <span>Test Cases <span className="text-secondary small" style={{ fontSize: '12px' }}>(QA & Bug Log)</span></span>
              </NavLink>
            </>
          )}

          {activeMenu === 'build-process' && (
            <>
              <div className="menu-heading">Build Process</div>
              <NavLink to="/build-process" className="menu-link" end>
                <GitBranch />
                <span>Build Process <span className="text-secondary small" style={{ fontSize: '12px' }}>(CI/CD)</span></span>
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
