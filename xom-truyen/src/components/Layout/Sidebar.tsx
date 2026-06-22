import { useLocation, useNavigate } from "react-router-dom";
import { Home, Bookmark, History, LayoutGrid, BookOpen, User } from "lucide-react";
import { ACCENT } from "../../constants";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
 
  const navItems = [
    { icon: <Home size={24} />,          label: "Trang chủ", path: "/" },
    { icon: <History size={24} />,       label: "Lịch sử", path: "/history" },
    { icon: <Bookmark size={24} />,      label: "Đánh dấu", path: "/bookmarks" },
    { icon: <LayoutGrid size={24} />,    label: "Thể loại", path: "/genres" },
    { icon: <User size={24} />,          label: "Cài đặt tài khoản", path: "/profile" },
  ];
 
  return (
    <aside
      style={{
        width: 90,
        backgroundColor: "var(--bg-primary)",
        borderRight: "1px solid var(--border-color)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px 0",
        gap: 16,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: 14,
          backgroundColor: ACCENT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 30,
        }}
      >
        <BookOpen size={26} color="#fff" />
      </div>
 
      {navItems.map((item, i) => {
        const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
        return (
          <button
            key={i}
            title={item.label}
            onClick={() => navigate(item.path)}
            style={{
              width: 50,
              height: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 14,
              border: "none",
              cursor: "pointer",
              backgroundColor: isActive ? "var(--sidebar-active, #fff0ee)" : "transparent",
              color: isActive ? ACCENT : "var(--text-muted, #c0c0c0)",
              transition: "background-color 0.15s, color 0.15s",
            }}
          >
            {item.icon}
          </button>
        );
      })}
    </aside>
  );
}