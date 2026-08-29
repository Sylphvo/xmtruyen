import React from 'react';
import { Link } from 'react-router-dom';

const FOOTER_LINKS = {
    about: {
        title: 'Về Chúng Tôi',
        links: [
            { label: 'Giới thiệu', path: '/about' },
            { label: 'Liên hệ', path: '/contact' },
            { label: 'Tuyển dụng', path: '/careers' },
            { label: 'Cơ hội đầu tư', path: '/about/invest' },
        ]
    },
    info: {
        title: 'Thông Tin Hữu Ích',
        links: [
            { label: 'Thỏa thuận sử dụng', path: '/terms' },
            { label: 'Quyền lợi hội viên', path: '/benefits' },
            { label: 'Quy định riêng tư', path: '/privacy' },
            { label: 'Câu hỏi thường gặp', path: '/faq' },
            { label: 'Quy chế hoạt động', path: '/marketplace-rules' },
        ]
    },
    support: {
        title: 'Hỗ Trợ Khách Hàng',
        links: [
            { label: 'Chính sách đổi trả', path: '/refund-policy' },
            { label: 'Chính sách thanh toán', path: '/payment-policy' },
            { label: 'Giải quyết khiếu nại', path: '/complaints' },
            { label: 'Bảo mật thông tin', path: '/security-policy' },
        ]
    },
    news: {
        title: 'Tin Tức',
        links: [
            { label: 'Tin dịch vụ', path: '/news' },
            { label: 'Review sách', path: '/blog/reviews' },
            { label: 'Lịch phát hành', path: '/schedule' },
        ]
    }
};

export default function Footer() {
    return (
        <footer style={{
            backgroundColor: '#111827',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '60px 0 40px',
            marginTop: 'auto'
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 30px' }}>
                {/* 4 Columns */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
                    {/* Column 1: Brand */}
                    <div>
                        <h3 style={{ fontSize: 20, fontWeight: 800, color: '#00d4ff', marginBottom: 12 }}>
                            XÓM TRUYỆN
                        </h3>
                        <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 20, lineHeight: 1.6 }}>
                            Nền tảng đọc truyện trực tuyến hàng đầu Việt Nam. Sách nói, ebook, truyện tranh với hàng ngàn đầu sách chất lượng.
                        </p>
                        <div style={{ fontSize: 13, color: '#9ca3af', display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div>📞 Hotline: <strong style={{ color: '#e5e7eb' }}>0877.736.289</strong></div>
                            <div>📧 Email: <strong style={{ color: '#e5e7eb' }}>support@xmtruyen.com</strong></div>
                        </div>
                        {/* App download badges */}
                        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                            <img src="/badges/appstore.svg" alt="App Store" style={{ height: 36 }} />
                            <img src="/badges/googleplay.svg" alt="Google Play" style={{ height: 36 }} />
                        </div>
                    </div>

                    {/* Columns 2-4: Link groups */}
                    {Object.values(FOOTER_LINKS).map(group => (
                        <div key={group.title}>
                            <h4 style={{ fontSize: 14, fontWeight: 700, color: '#e5e7eb', marginBottom: 16 }}>
                                {group.title}
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {group.links.map(link => (
                                    <li key={link.path} style={{ marginBottom: 10 }}>
                                        <Link to={link.path} style={{
                                            fontSize: 13, color: '#9ca3af', textDecoration: 'none',
                                            transition: 'color 200ms'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#00d4ff'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, textAlign: 'center' }}>
                    <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.8 }}>
                        © 2026 Xóm Truyện. Nền tảng đọc truyện trực tuyến.<br/>
                        Giấy xác nhận đăng ký hoạt động TMĐT số XXXXXXXX.<br/>
                        Địa chỉ: Thành phố Hồ Chí Minh, Việt Nam.
                    </p>
                    {/* Trust badges */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16 }}>
                        <img src="/badges/bocongthuong.png" alt="Đã đăng ký Bộ Công Thương" style={{ height: 40 }} />
                        <img src="/badges/dmca.png" alt="DMCA Protected" style={{ height: 40 }} />
                    </div>
                </div>
            </div>
        </footer>
    );
}
