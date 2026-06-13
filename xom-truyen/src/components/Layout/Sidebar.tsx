import { useState } from "react";
import { Home, Bookmark, AlignJustify, BookOpen, LayoutGrid } from "lucide-react";
import { ACCENT } from "../../constants";

export default function Sidebar() {
  const [active, setActive] = useState(0);
 
  const navItems = [
    { icon: <Home size={18} />,          label: "Trang chủ" },
    { icon: <Bookmark size={18} />,      label: "Đánh dấu" },
    { icon: <AlignJustify size={18} />,  label: "Danh sách" },
    { icon: <LayoutGrid size={18} />,    label: "Thể loại" },
  ];
 
  return (
    <aside
      style={{
        width: 58,
        backgroundColor: "#f5f1eb",
        borderRight: "1px solid #ebebeb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px 0",
        gap: 6,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 9,
          backgroundColor: ACCENT,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 14,
        }}
      >
        <BookOpen size={18} color="#fff" />
      </div>
 
      {navItems.map((item, i) => (
        <button
          key={i}
          title={item.label}
          onClick={() => setActive(i)}
          style={{
            width: 38,
            height: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 9,
            border: "none",
            cursor: "pointer",
            backgroundColor: i === active ? "#fff0ee" : "transparent",
            color: i === active ? ACCENT : "#c0c0c0",
            transition: "background-color 0.15s, color 0.15s",
          }}
        >
          {item.icon}
        </button>
      ))}
    </aside>
  );
}