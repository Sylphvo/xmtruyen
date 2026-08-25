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
  content: [
    { id: 'all-books', path: '/all-books', icon: Database, title: 'Tất cả sách', subtitle: '(All Books)' },
    { id: 'books', path: '/books', icon: Book, title: 'Sách chữ', subtitle: '(Books)' },
    { id: 'comics', path: '/comics', icon: Book, title: 'Truyện tranh', subtitle: '(Comics)' },
    { id: 'book-chapters', path: '/book-chapters', icon: Book, title: 'QL Chương', subtitle: '(Chapters)' },
    { id: 'book-files', path: '/book-files', icon: Database, title: 'File sách', subtitle: '(Lưu trữ)' },
    { id: 'authors', path: '/authors', icon: Users, title: 'Tác giả', subtitle: '(Authors)' },
    { id: 'categories', path: '/categories', icon: List, title: 'Thể loại', subtitle: '(Categories)' },
    { id: 'topics', path: '/topics', icon: Tag, title: 'Chủ đề', subtitle: '(Topics)' },
    { id: 'import', path: '/import', icon: Database, title: 'Import Dữ Liệu', subtitle: '(CSV/JSON)' },
    { id: 'crawlers', path: '/crawlers', icon: Bot, title: 'Crawler Pipeline', subtitle: '(Bot)' }
  ],
  translation: [
    { id: 'translation', path: '/translation', icon: Languages, title: 'Dashboard Dịch thuật' },
    { id: 'translation-upload', path: '/translation/upload', icon: Languages, title: 'Upload RAW' },
    { id: 'translation-glossary', path: '/translation/glossary', icon: BookOpen, title: 'Từ điển (Glossary)' }
  ],
  media: [
    { id: 'audio', path: '/audio', icon: LayoutDashboard, title: 'Tổng quan Audio' },
    { id: 'audio-voices', path: '/audio/voices', icon: Users, title: 'Quản lý Giọng đọc' },
    { id: 'book-video', path: '/book-video', icon: LayoutDashboard, title: 'Video Truyện Chữ' },
    { id: 'comic-video', path: '/comic-video', icon: LayoutDashboard, title: 'Video Truyện Tranh' },
    { id: 'print-pipeline', path: '/print-pipeline', icon: BookOpen, title: 'Xuất bản PDF / CMYK' }
  ],
  community: [
    { id: 'users', path: '/users', icon: Users, title: 'Người dùng', subtitle: '(Users)' },
    { id: 'reviews', path: '/reviews', icon: MessageSquare, title: 'Đánh giá', subtitle: '(Reviews)' },
    { id: 'reports', path: '/reports', icon: ShieldAlert, title: 'Báo cáo vi phạm', subtitle: '(Reports)' },
    { id: 'notifications', path: '/notifications', icon: Bell, title: 'Thông báo', subtitle: '(Notifications)' }
  ],
  commerce: [
    { id: 'plans', path: '/plans', icon: TableProperties, title: 'Gói VIP', subtitle: '(Subscription)' },
    { id: 'coin-packages', path: '/coin-packages', icon: Tag, title: 'Gói Xu', subtitle: '(Coin Packages)' },
    { id: 'transactions', path: '/transactions', icon: Tag, title: 'Giao dịch', subtitle: '(Transactions)' },
    { id: 'promotions', path: '/promotions', icon: Ticket, title: 'Khuyến mãi', subtitle: '(Promotions)' }
  ],
  cms: [
    { id: 'banners', path: '/banners', icon: LayoutDashboard, title: 'Quản lý Banner' },
    { id: 'home-sections', path: '/home-sections', icon: LayoutDashboard, title: 'Trang chủ (Home CMS)' },
    { id: 'static-pages', path: '/static-pages', icon: FileText, title: 'Trang Tĩnh', subtitle: '(CMS)' },
    { id: 'faq-management', path: '/faq-management', icon: HelpCircle, title: 'FAQ', subtitle: '(Hỏi đáp)' },
    { id: 'help-articles', path: '/help-articles', icon: HelpCircle, title: 'Trợ giúp', subtitle: '(Help Center)' },
    { id: 'email-templates', path: '/email-templates', icon: FileText, title: 'Mẫu Email', subtitle: '(Templates)' }
  ],
  analytics: [
    { id: 'system-reports', path: '/system-reports', icon: BarChart2, title: 'Báo cáo (Reports)' },
    { id: 'reading-analytics', path: '/reading-analytics', icon: BarChart2, title: 'Phân tích Lượt đọc', subtitle: '(Analytics)' },
    { id: 'test-cases', path: '/test-cases', icon: ClipboardCheck, title: 'Test Cases', subtitle: '(QA & Bug Log)' },
    { id: 'build-process', path: '/build-process', icon: GitBranch, title: 'Build Process', subtitle: '(CI/CD)' }
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

    if (path.startsWith('/all-books') || path.startsWith('/books') || path.startsWith('/comics') || path.startsWith('/book-chapters') || path.startsWith('/book-files') || path.startsWith('/authors') || path.startsWith('/categories') || path.startsWith('/topics') || path.startsWith('/import') || path.startsWith('/crawlers')) {
      setActiveMenu('content');
    } else if (path.startsWith('/translation')) {
      setActiveMenu('translation');
    } else if (path.startsWith('/audio') || path.startsWith('/book-video') || path.startsWith('/comic-video') || path.startsWith('/print-pipeline')) {
      setActiveMenu('media');
    } else if (path.startsWith('/users') || path.startsWith('/reviews') || path.startsWith('/reports') || path.startsWith('/notifications')) {
      setActiveMenu('community');
    } else if (path.startsWith('/plans') || path.startsWith('/coin-packages') || path.startsWith('/transactions') || path.startsWith('/promotions')) {
      setActiveMenu('commerce');
    } else if (path.startsWith('/banners') || path.startsWith('/home-sections') || path.startsWith('/static-pages') || path.startsWith('/faq-management') || path.startsWith('/help-articles') || path.startsWith('/email-templates')) {
      setActiveMenu('cms');
    } else if (path.startsWith('/system-reports') || path.startsWith('/reading-analytics') || path.startsWith('/test-cases') || path.startsWith('/build-process')) {
      setActiveMenu('analytics');
    } else if (path.startsWith('/database') || path.startsWith('/system-configs')) {
      setActiveMenu('system');
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
          className={`icon-nav-item ${activeMenu === 'content' ? 'active' : ''}`} 
          onClick={() => setActiveMenu('content')}
          style={{ cursor: 'pointer' }}
          title="Nội dung"
        >
          <Book />
        </div>
        <div 
          className={`icon-nav-item ${activeMenu === 'translation' ? 'active' : ''}`} 
          onClick={() => setActiveMenu('translation')}
          style={{ cursor: 'pointer' }}
          title="Biên tập và dịch thuật"
        >
          <Languages />
        </div>
        <div 
          className={`icon-nav-item ${activeMenu === 'media' ? 'active' : ''}`} 
          onClick={() => setActiveMenu('media')}
          style={{ cursor: 'pointer' }}
          title="Media và xuất bản"
        >
          <Headphones />
        </div>
        <div 
          className={`icon-nav-item ${activeMenu === 'community' ? 'active' : ''}`} 
          onClick={() => setActiveMenu('community')}
          style={{ cursor: 'pointer' }}
          title="Người dùng và cộng đồng"
        >
          <Users />
        </div>
        <div 
          className={`icon-nav-item ${activeMenu === 'commerce' ? 'active' : ''}`} 
          onClick={() => setActiveMenu('commerce')}
          style={{ cursor: 'pointer' }}
          title="Thương mại"
        >
          <Tag />
        </div>
        <div 
          className={`icon-nav-item ${activeMenu === 'cms' ? 'active' : ''}`} 
          onClick={() => setActiveMenu('cms')}
          style={{ cursor: 'pointer' }}
          title="Trang chủ và CMS"
        >
          <FileText />
        </div>
        <div 
          className={`icon-nav-item ${activeMenu === 'analytics' ? 'active' : ''}`} 
          onClick={() => setActiveMenu('analytics')}
          style={{ cursor: 'pointer' }}
          title="Phân tích và vận hành"
        >
          <BarChart2 />
        </div>
        <div 
          className={`icon-nav-item ${activeMenu === 'system' ? 'active' : ''}`} 
          onClick={() => setActiveMenu('system')}
          style={{ cursor: 'pointer' }}
          title="Hệ thống"
        >
          <Database />
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

          {activeMenu === 'content' && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <div className="menu-heading">Nội dung</div>
              <SortableContext items={menuOrders.content.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
                {menuOrders.content.map((item: any) => (
                  <SortableMenuItem key={item.id} {...item} isActive={item.path === activeBookSubMenu} />
                ))}
              </SortableContext>
            </DndContext>
          )}

          {activeMenu === 'translation' && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <div className="menu-heading">Biên tập & Dịch thuật</div>
              <SortableContext items={menuOrders.translation.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
                {menuOrders.translation.map((item: any) => (
                  <SortableMenuItem key={item.id} {...item} end={true} />
                ))}
              </SortableContext>
            </DndContext>
          )}

          {activeMenu === 'media' && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <div className="menu-heading">Media & Xuất bản</div>
              <SortableContext items={menuOrders.media.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
                {menuOrders.media.map((item: any) => (
                  <SortableMenuItem key={item.id} {...item} end={true} />
                ))}
              </SortableContext>
            </DndContext>
          )}

          {activeMenu === 'community' && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <div className="menu-heading">Người dùng & Cộng đồng</div>
              <SortableContext items={menuOrders.community.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
                {menuOrders.community.map((item: any) => (
                  <SortableMenuItem key={item.id} {...item} end={true} />
                ))}
              </SortableContext>
            </DndContext>
          )}

          {activeMenu === 'commerce' && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <div className="menu-heading">Thương mại</div>
              <SortableContext items={menuOrders.commerce.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
                {menuOrders.commerce.map((item: any) => (
                  <SortableMenuItem key={item.id} {...item} end={true} />
                ))}
              </SortableContext>
            </DndContext>
          )}

          {activeMenu === 'cms' && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <div className="menu-heading">Trang chủ & CMS</div>
              <SortableContext items={menuOrders.cms.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
                {menuOrders.cms.map((item: any) => (
                  <SortableMenuItem key={item.id} {...item} end={true} />
                ))}
              </SortableContext>
            </DndContext>
          )}

          {activeMenu === 'analytics' && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <div className="menu-heading">Phân tích & Vận hành</div>
              <SortableContext items={menuOrders.analytics.map((i: any) => i.id)} strategy={verticalListSortingStrategy}>
                {menuOrders.analytics.map((item: any) => (
                  <SortableMenuItem key={item.id} {...item} end={true} />
                ))}
              </SortableContext>
            </DndContext>
          )}

          {activeMenu === 'system' && (
            <>
              <div className="menu-heading">Hệ thống</div>
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
