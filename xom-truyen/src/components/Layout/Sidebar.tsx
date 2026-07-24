import { useState, useEffect } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { Home, Bookmark, History, BookOpen, User, Library, Image } from "lucide-react";
import { ACCENT } from "../../constants";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const state = location.state as { from?: string } | null;
  const fromPath = state?.from;

  const [activeMenu, setActiveMenu] = useState('home');
  const [isHovered, setIsHovered] = useState(false);
  const isReadingPage = path.match(/\/book\/.*\/read/);

  useEffect(() => {
    const checkPath = path.startsWith('/book/') && fromPath ? fromPath : path;

    if (checkPath.startsWith('/history') || checkPath.startsWith('/bookmarks')) {
      setActiveMenu('library');
    } else if (checkPath.startsWith('/profile')) {
      setActiveMenu('profile');
    } else {
      setActiveMenu('home');
    }
  }, [path, fromPath]);

  const iconItemStyle = (isActive: boolean) => ({
    width: 50,
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    border: "none",
    cursor: "pointer",
    backgroundColor: isActive ? "var(--sidebar-active, #fff0ee)" : "transparent",
    color: isActive ? ACCENT : "var(--text, #6b6375)",
    transition: "background-color 0.15s, color 0.15s",
    marginBottom: 16,
  });

  const menuLinkStyle = (isActive: boolean) => ({
    display: "flex",
    alignItems: "center",
    padding: "12px 20px",
    color: isActive ? ACCENT : "var(--text-primary, #333333)",
    textDecoration: "none",
    transition: "all 0.2s",
    background: isActive ? `linear-gradient(90deg, ${ACCENT}20 0%, transparent 100%)` : "transparent",
    borderLeft: isActive ? `3px solid ${ACCENT}` : "3px solid transparent",
    fontWeight: isActive ? 600 : 500,
    fontSize: 14,
  });

  return (
    <div 
      style={{ display: "flex", height: "100vh", zIndex: 1000, position: "relative" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon Sidebar */}
      <aside
        style={{
          width: 90,
          backgroundColor: "var(--bg-primary)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "30px 0",
          flexShrink: 0,
        }}
      >
        <div
          onClick={() => navigate("/")}
          style={{
            width: 50,
            height: 50,
            borderRadius: 14,
            backgroundColor: ACCENT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 30,
            cursor: "pointer",
          }}
        >
          <BookOpen size={26} color="#fff" />
        </div>

        <button
          title="Trang chủ"
          onClick={() => setActiveMenu('home')}
          style={iconItemStyle(activeMenu === 'home')}
        >
          <Home size={24} />
        </button>

        <button
          title="Tủ sách"
          onClick={() => setActiveMenu('library')}
          style={iconItemStyle(activeMenu === 'library')}
        >
          <Library size={24} />
        </button>

        <button
          title="Tài khoản"
          onClick={() => setActiveMenu('profile')}
          style={iconItemStyle(activeMenu === 'profile')}
        >
          <User size={24} />
        </button>
      </aside>

      {/* Menu Sidebar */}
      <aside
        style={{
          width: (!isReadingPage || isHovered) ? 240 : 0,
          opacity: (!isReadingPage || isHovered) ? 1 : 0,
          overflow: "hidden",
          backgroundColor: "var(--bg-primary)",
          borderRight: (!isReadingPage || isHovered) ? "1px solid var(--border)" : "none",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          transition: "width 0.3s ease, opacity 0.3s ease",
          ...(isReadingPage ? {
            position: "absolute",
            left: 90,
            height: "100vh",
            zIndex: 999,
            boxShadow: (!isReadingPage || isHovered) ? "4px 0 10px rgba(0,0,0,0.05)" : "none"
          } : {})
        }}
      >
        <div style={{
          height: 70,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          color: "var(--text-h)",
          fontSize: "1.2rem",
          fontWeight: 700,
          borderBottom: "1px solid var(--border)",
          marginTop: 10
        }}>
          Xóm Truyện
        </div>

        <div style={{ overflowY: "auto", flex: 1, padding: "20px 0" }}>
          {activeMenu === 'home' && (
            <>
              <div style={{ padding: "0 20px 10px", fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase" }}>
                Khám phá
              </div>
              <NavLink to="/" style={() => menuLinkStyle(path === '/' || (path.startsWith('/book/') && (!fromPath || fromPath === '/')))} end>
                <Home size={18} style={{ marginRight: 12 }} />
                <span>Trang chủ</span>
              </NavLink>
              <NavLink to="/comics" style={() => menuLinkStyle(path === '/comics' || (path.startsWith('/book/') && fromPath === '/comics'))}>
                <Image size={18} style={{ marginRight: 12 }} />
                <span>Truyện tranh</span>
              </NavLink>
              <NavLink to="/library" style={() => menuLinkStyle(path === '/library' || (path.startsWith('/book/') && fromPath === '/library'))}>
                <BookOpen size={18} style={{ marginRight: 12 }} />
                <span>Thư viện sách</span>
              </NavLink>
            </>
          )}

          {activeMenu === 'library' && (
            <>
              <div style={{ padding: "0 20px 10px", fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase" }}>
                Tủ sách của bạn
              </div>
              <NavLink to="/history" style={() => menuLinkStyle(path === '/history' || (path.startsWith('/book/') && fromPath === '/history'))}>
                <History size={18} style={{ marginRight: 12 }} />
                <span>Lịch sử đọc</span>
              </NavLink>
              <NavLink to="/bookmarks" style={() => menuLinkStyle(path === '/bookmarks' || (path.startsWith('/book/') && fromPath === '/bookmarks'))}>
                <Bookmark size={18} style={{ marginRight: 12 }} />
                <span>Truyện đánh dấu</span>
              </NavLink>
            </>
          )}

          {activeMenu === 'profile' && (
            <>
              <div style={{ padding: "0 20px 10px", fontSize: 12, fontWeight: 700, color: ACCENT, textTransform: "uppercase" }}>
                Cá nhân
              </div>
              <NavLink to="/profile" style={({ isActive }) => menuLinkStyle(isActive)}>
                <User size={18} style={{ marginRight: 12 }} />
                <span>Cài đặt tài khoản</span>
              </NavLink>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}