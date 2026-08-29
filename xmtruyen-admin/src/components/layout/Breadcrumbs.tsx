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
      <div className="d-flex justify-content-between align-items-start mb-3 px-4">
        <div className="d-flex align-items-start gap-2">
          {/* Project Icon */}
          <div className="d-flex align-items-center justify-content-center text-white rounded" style={{ width: '24px', height: '24px', backgroundColor: '#0C66E4', marginTop: '4px' }}>
            <Hexagon size={16} fill="currentColor" />
          </div>
          
          {/* Project Name & Description */}
          <div className="d-flex flex-column">
            <div className="d-flex align-items-center gap-2">
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
            
            {/* Description Text */}
            {(() => {
              const path = location.pathname;
              let description = null;
              
              if (path === '/' || path === '/dashboard') description = 'Tổng quan hoạt động và thống kê nhanh của hệ thống';
              else if (path.startsWith('/all-books')) description = 'Quản lý kho dữ liệu chứa tất cả các đầu sách và truyện trên hệ thống';
              else if (path.startsWith('/books')) description = 'Quản lý danh sách các đầu truyện chữ và xuất bản nội dung';
              else if (path.startsWith('/book-chapters')) description = 'Quản lý và biên tập nội dung từng chương của truyện chữ';
              else if (path.startsWith('/comics')) description = 'Quản lý danh sách truyện tranh và xuất bản các chapter hình ảnh';
              else if (path.startsWith('/book-files')) description = 'Kho lưu trữ và quản lý các file nguyên bản (RAW, PDF, EPUB)';
              else if (path.startsWith('/topics')) description = 'Quản lý danh sách các nhóm chủ đề (Topics) để phân loại sách';
              else if (path.startsWith('/categories')) description = 'Quản lý danh sách các thể loại (Categories) của tác phẩm';
              else if (path.startsWith('/authors')) description = 'Quản lý thông tin hồ sơ và danh mục tác phẩm của các tác giả';
              else if (path.startsWith('/reading-analytics')) description = 'Phân tích dữ liệu, thống kê xu hướng đọc và tương tác của độc giả';
              else if (path.startsWith('/users')) description = 'Quản lý tài khoản, phân quyền và giám sát hoạt động của người dùng';
              else if (path.startsWith('/database')) description = 'Công cụ quản trị hệ cơ sở dữ liệu và sao lưu hệ thống';
              else if (path.startsWith('/plans')) description = 'Cấu hình các gói dịch vụ (Subscription) và đặc quyền hội viên';
              else if (path.startsWith('/transactions')) description = 'Theo dõi lịch sử thanh toán, giao dịch và đối soát doanh thu';
              else if (path.startsWith('/coin-packages')) description = 'Cấu hình các gói nạp xu và tỉ giá quy đổi trong hệ thống';
              else if (path.startsWith('/notifications')) description = 'Quản lý chiến dịch và gửi thông báo (Push/In-app) đến người dùng';
              else if (path.startsWith('/reviews')) description = 'Kiểm duyệt các bình luận và đánh giá của độc giả về tác phẩm';
              else if (path.startsWith('/reports')) description = 'Xử lý các báo cáo vi phạm, nội dung xấu từ cộng đồng';
              else if (path.startsWith('/promotions')) description = 'Cấu hình các chiến dịch khuyến mãi và mã giảm giá (Vouchers)';
              else if (path.startsWith('/banners')) description = 'Quản lý hình ảnh banner quảng cáo và sự kiện trên trang chủ';
              else if (path.startsWith('/home-sections')) description = 'Cấu hình các danh mục và khu vực hiển thị nội dung trên trang chủ';
              else if (path.startsWith('/email-templates')) description = 'Thiết kế và quản lý các mẫu email thông báo gửi tự động';
              else if (path.startsWith('/help-articles')) description = 'Quản lý trung tâm trợ giúp và các bài viết hướng dẫn (FAQ)';
              else if (path.startsWith('/crawlers')) description = 'Cấu hình hệ thống tự động cào và thu thập dữ liệu từ các nguồn khác';
              else if (path.startsWith('/translation/upload')) description = 'Tải lên dữ liệu thô (RAW) chuẩn bị cho quá trình biên dịch';
              else if (path.startsWith('/translation/glossary')) description = 'Quản lý từ điển thuật ngữ (Glossary) dùng chung trong dịch thuật';
              else if (path.startsWith('/translation')) description = 'Môi trường biên tập và dịch thuật nội dung chuyên dụng dành cho dịch giả';
              else if (path.startsWith('/system-configs')) description = 'Thiết lập các tham số cốt lõi và cấu hình hoạt động của toàn bộ hệ thống';

              if (description) {
                return (
                  <span className="text-muted" style={{ fontSize: '13px', marginTop: '2px' }}>
                    {description}
                  </span>
                );
              }
              return null;
            })()}
          </div>
        </div>

        {/* Right Actions */}
        <div className="d-flex align-items-center gap-2 mt-1">
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
