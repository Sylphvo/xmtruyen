import React, { useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  LogIn,
  UserPlus,
  LogOut,
  User,
} from "lucide-react";

import { useNavigate } from "react-router-dom"; // <-- Thêm dòng này

import "../../styles/Header.css"; // Bắt buộc phải import file CSS vào đây

export default function Header() {
  const [query, setQuery] = useState("");

  // ─── STATE QUẢN LÝ ĐĂNG NHẬP ───
  // Thay đổi isLoggedIn thành 'true' để test giao diện khi đã đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userName = "Sylphvo";

  // State quản lý việc mở/đóng Menu sổ xuống
  const [showDropdown, setShowDropdown] = useState(false);

  // Khởi tạo hàm chuyển trang
  const navigate = useNavigate(); // <-- Thêm dòng này

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "10px 22px",
        backgroundColor: "#f5f1eb",
        borderBottom: "1px solid #ebebeb",
        position: "sticky",
        top: 0,
        zIndex: 50, // Cần zIndex cao để menu dropdown đè lên content bên dưới
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
          border: "1px solid #ddd", // Thêm nhẹ viền cho thanh search
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

      {/* ───────────────────────────────────────────────────────── */}
      {/* Khối User + Dropdown (Đã nâng cấp) */}
      <div style={{ position: "relative" }}>
        {/* Nút bấm hiển thị Avatar & Tên */}
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          {isLoggedIn ? (
            // Hiện Avatar của bạn màu tím
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
                flexShrink: 0,
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
          ) : (
            // Hiện Icon User Xám khi chưa đăng nhập
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "#ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                flexShrink: 0,
              }}
            >
              <User size={16} />
            </div>
          )}

          {/* Hiện Tên hoặc Chữ "Khách" */}
          <span style={{ fontSize: 13, fontWeight: 700, color: "#333" }}>
            {isLoggedIn ? userName : "Khách"}
          </span>

          {/* Mũi tên sổ xuống có hiệu ứng xoay */}
          <ChevronDown
            size={14}
            color="#555"
            style={{
              transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
              transition: "0.2s",
            }}
          />
        </div>

        {/* Menu Sổ Xuống */}
        {showDropdown && (
          <div className="dropdown-menu">
            {!isLoggedIn ? (
              <>
                {/* Đổi thẻ <a> thành <button> và dùng navigate */}
                <button
                  onClick={() => {
                    navigate("/login");
                    setShowDropdown(false); // Bấm xong thì đóng menu lại
                  }}
                  className="dropdown-item"
                >
                  <LogIn size={15} color="#2196f3" /> Đăng nhập
                </button>

                <div className="dropdown-divider"></div>

                <button
                  onClick={() => {
                    navigate("/register");
                    setShowDropdown(false);
                  }}
                  className="dropdown-item"
                >
                  <UserPlus size={15} color="#27ae60" /> Đăng ký
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  setShowDropdown(false);
                }}
                className="dropdown-item"
                style={{ color: "#e74c3c" }}
              >
                <LogOut size={15} /> Đăng xuất
              </button>
            )}
          </div>
        )}
      </div>
      {/* ───────────────────────────────────────────────────────── */}

      {/* Bell */}
      <button
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          display: "flex",
          marginLeft: 4,
        }}
      >
        <Bell size={18} color="#555" />
      </button>
    </header>
  );
}
