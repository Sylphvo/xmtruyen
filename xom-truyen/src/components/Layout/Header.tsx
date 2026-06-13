import { useState } from "react";
import { Search, Bell } from "lucide-react";

export default function Header() {
  const [query, setQuery] = useState("");
 
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 22px",
        backgroundColor: "#f5f1eb",
        borderBottom: "1px solid #ebebeb",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Search */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          backgroundColor: "#f5f1eb",
          borderRadius: 20,
          padding: "7px 14px",
          gap: 8,
        }}
      >
        <Search size={13} color="#bbb" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm sách, tác giả,..."
          style={{
            border: "none",
            background: "none",
            outline: "none",
            fontSize: 12,
            flex: 1,
            color: "#333",
            fontFamily: "inherit",
          }}
        />
      </div>
 
      {/* Language */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: 12,
          fontWeight: 700,
          color: "#333",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <span>🇻🇳</span>
        <span>VN</span>
        <span style={{ fontSize: 8, color: "#aaa" }}>▾</span>
      </div>
 
      {/* Avatar */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          backgroundColor: "#c75b9b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        M
      </div>
 
      {/* Bell */}
      <button
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#888",
          padding: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Bell size={17} />
      </button>
    </header>
  );
}