import React from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { Share2, Zap, MessageSquare, Maximize2, Users, MoreHorizontal, LayoutList, FileText, LayoutGrid, LayoutTemplate, Clock, File, FormInput, Archive, Calendar, Plus, Hexagon } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  if (location.pathname === '/' || location.pathname === '/dashboard') {
    return null;
  }

  const activeTab = searchParams.get('view') === 'docs' ? 'Docs' : 'List';

  const handleTabClick = (tabName: string) => {
    if (tabName === 'Docs') {
      searchParams.set('view', 'docs');
    } else {
      searchParams.delete('view');
    }
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  return (
    <div className="pt-3 pb-0" style={{ backgroundColor: 'transparent', marginBottom: '16px', marginLeft: '-1.5rem', marginRight: '-1.5rem' }}>
      {/* Top Breadcrumb Text */}
      <div className="d-flex align-items-center mb-2 px-4" style={{ color: 'var(--jira-text-muted)', fontSize: '12px' }}>
        <span style={{ cursor: 'pointer' }} className="hover-underline">Spaces</span>
      </div>

      {/* Main Title Row */}
      <div className="d-flex justify-content-between align-items-center mb-3 px-4">
        <div className="d-flex align-items-center gap-2">
          {/* Project Icon */}
          <div className="d-flex align-items-center justify-content-center text-white rounded" style={{ width: '24px', height: '24px', backgroundColor: '#0C66E4' }}>
            <Hexagon size={16} fill="currentColor" />
          </div>
          
          {/* Project Name */}
          <h1 className="m-0 fw-bold" style={{ fontSize: '20px', color: 'var(--jira-text)', letterSpacing: '-0.01em' }}>
            {(() => {
              const path = location.pathname;
              if (path === '/' || path === '/dashboard') return 'Dashboard';
              if (path.startsWith('/all-books')) return 'Tất cả Sách';
              if (path.startsWith('/books')) return 'Sách (Books)';
              if (path.startsWith('/book-chapters')) return 'QL Chương (Chapters)';
              if (path.startsWith('/comics')) return 'Truyện tranh (Comics)';
              if (path.startsWith('/book-files')) return 'File Sách (Lưu trữ)';
              if (path.startsWith('/topics')) return 'Chủ đề (Topics)';
              if (path.startsWith('/categories')) return 'Thể loại (Categories)';
              if (path.startsWith('/authors')) return 'Tác giả (Authors)';
              if (path.startsWith('/reading-analytics')) return 'Phân tích Lượt đọc (Analytics)';
              if (path.startsWith('/users')) return 'Quản lý Người dùng (Users)';
              if (path.startsWith('/database')) return 'Database (System)';
              if (path.startsWith('/plans')) return 'Subscription Plans';
              if (path.startsWith('/transactions')) return 'Giao dịch (Transactions)';
              if (path.startsWith('/coin-packages')) return 'Coin Packages';
              if (path.startsWith('/notifications')) return 'Thông báo (Notifications)';
              if (path.startsWith('/reviews')) return 'Đánh giá (Reviews)';
              if (path.startsWith('/reports')) return 'Báo cáo vi phạm (Reports)';
              if (path.startsWith('/promotions')) return 'Khuyến mãi (Promotions)';
              if (path.startsWith('/banners')) return 'Banners (Home)';
              if (path.startsWith('/home-sections')) return 'Home Sections';
              if (path.startsWith('/email-templates')) return 'Email Templates';
              if (path.startsWith('/help-articles')) return 'Help Articles';
              if (path.startsWith('/crawlers')) return 'Crawlers (Auto)';
              if (path.startsWith('/translation/upload')) return 'Translation Upload';
              if (path.startsWith('/translation/glossary')) return 'Glossary (Dịch thuật)';
              if (path.startsWith('/translation')) return 'Dịch thuật (Translation)';
              if (path.startsWith('/system-configs')) return 'Cấu hình hệ thống (Settings)';
              return 'Tất cả Sách (All Books)';
            })()}
          </h1>
          
          {/* Team/Users button */}
          <button className="btn btn-sm d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', padding: 0, backgroundColor: 'var(--jira-table-bg)', border: '1px solid var(--jira-border)', color: 'var(--jira-text-muted)', borderRadius: '3px' }}>
            <Users size={14} />
          </button>
          
          {/* More button */}
          <button className="btn btn-sm d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px', padding: 0, backgroundColor: 'transparent', border: 'none', color: 'var(--jira-text-muted)' }}>
            <MoreHorizontal size={16} />
          </button>
        </div>

        {/* Right Actions */}
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-sm d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', padding: 0, backgroundColor: 'var(--jira-table-bg)', border: '1px solid var(--jira-border)', color: 'var(--jira-text-muted)', borderRadius: '3px' }}>
            <Share2 size={14} />
          </button>
          <button className="btn btn-sm d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', padding: 0, backgroundColor: 'var(--jira-table-bg)', border: '1px solid var(--jira-border)', color: 'var(--jira-text-muted)', borderRadius: '3px' }}>
            <Zap size={14} />
          </button>
          <button className="btn btn-sm d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', padding: 0, backgroundColor: 'var(--jira-table-bg)', border: '1px solid var(--jira-border)', color: 'var(--jira-text-muted)', borderRadius: '3px' }}>
            <MessageSquare size={14} />
          </button>
          <button className="btn btn-sm d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', padding: 0, backgroundColor: 'var(--jira-table-bg)', border: '1px solid var(--jira-border)', color: 'var(--jira-text-muted)', borderRadius: '3px' }}>
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="d-flex align-items-center gap-4 px-4" style={{ borderBottom: '2px solid var(--jira-border)', paddingBottom: '0', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {[
          { name: 'List', icon: LayoutList },
          { name: 'Docs', icon: File },
        ].map((tab) => (
          <div 
            key={tab.name}
            onClick={() => handleTabClick(tab.name)}
            className="d-flex align-items-center gap-2 pb-2 position-relative"
            style={{ 
              cursor: 'pointer',
              color: activeTab === tab.name ? '#0C66E4' : 'var(--jira-text-muted)',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            <tab.icon size={16} />
            {tab.name}
            {activeTab === tab.name && (
              <div 
                className="position-absolute bottom-0 start-0 w-100" 
                style={{ height: '2px', backgroundColor: '#0C66E4', bottom: '-2px' }}
              />
            )}
          </div>
        ))}
        <div className="d-flex align-items-center pb-2" style={{ cursor: 'pointer', color: 'var(--jira-text-muted)' }}>
          <Plus size={16} />
        </div>
      </div>
      
      <style>{`
        .hover-underline:hover {
          text-decoration: underline;
        }
        /* Hide scrollbar for tabs */
        .d-flex::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
