import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getPathName = (path: string) => {
    const map: Record<string, string> = {
      'books': 'Quản lý Sách',
      'comics': 'Quản lý Truyện tranh',
      'all-books': 'Tất cả sách',
      'users': 'Quản lý Người dùng',
      'database': 'Quản lý Database',
      'book-chapters': 'Quản lý Chương',
      'topics': 'Chủ đề',
      'categories': 'Thể loại',
      'authors': 'Tác giả',
      'reading-analytics': 'Phân tích Lượt đọc',
      'book-files': 'File sách',
      'transactions': 'Giao dịch',
      'plans': 'Gói đăng ký',
      'coin-packages': 'Gói Xu',
      'notifications': 'Thông báo',
      'promotions': 'Khuyến mãi',
      'banners': 'Banners',
      'reports': 'Báo cáo',
      'system-configs': 'Cấu hình hệ thống',
      'email-templates': 'Mẫu Email',
      'help-articles': 'Trợ giúp',
    };
    return map[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  if (location.pathname === '/') {
    return (
      <div className="d-flex align-items-center mb-4 px-4 pt-4" style={{ color: '#b5b5c3', fontSize: '14px', fontWeight: 500 }}>
        <FontAwesomeIcon icon={faHome} className="me-2" style={{ fontSize: '14px' }} />
        <span>Home</span>
        <FontAwesomeIcon icon={faChevronRight} className="mx-2" style={{ fontSize: '10px', color: '#b5b5c3' }} />
        <span style={{ color: '#b5b5c3' }}>Dashboard</span>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center mb-4 px-4 pt-4" style={{ color: '#b5b5c3', fontSize: '14px', fontWeight: 500 }}>
      <Link to="/" className="text-decoration-none d-flex align-items-center" style={{ color: '#b5b5c3' }}>
        <FontAwesomeIcon icon={faHome} className="me-2" style={{ fontSize: '14px' }} />
        Home
      </Link>
      {pathnames.map((value, index) => {
        const isLast = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        return (
          <React.Fragment key={to}>
            <FontAwesomeIcon icon={faChevronRight} className="mx-2" style={{ fontSize: '10px', color: '#b5b5c3' }} />
            {isLast ? (
              <span style={{ color: '#b5b5c3' }}>{getPathName(value)}</span>
            ) : (
              <Link to={to} className="text-decoration-none" style={{ color: '#b5b5c3' }}>
                {getPathName(value)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
