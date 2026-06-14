import React, { useState } from "react";
import LeftPanel from "../Auth/LeftPanel";
import { ChevronDown, LogIn, UserPlus, LogOut, User } from "lucide-react";

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function AuthLayout({ title, children }: AuthLayoutProps) {
  // ──────────────────────────────────────────────────────────
  // STATE MÔ PHỎNG ĐĂNG NHẬP (Sau này thay bằng Context/Redux)
  // Đổi giá trị thành `true` để test trạng thái đã đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userName = "Sylphvo";
  // ──────────────────────────────────────────────────────────

  // State quản lý việc mở/đóng Dropdown
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#3a3a3a",
        fontFamily: "'Be Vietnam Pro', 'Segoe UI', Arial, sans-serif",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          background: "#3a3a3a",
          padding: "6px 20px",
          fontSize: 12,
          color: "#ccc",
        }}
      >
        {title}
      </div>

      {/* Main card */}
      <div
        style={{
          flex: 1,
          background: "#fff",
          margin: "0 16px 16px",
          borderRadius: 12,
          display: "flex",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Top nav inside card */}
        <div
          style={{
            position: "absolute",
            top: 36,
            left: 16,
            right: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 24px",
            zIndex: 50, // Nâng zIndex lên để menu sổ xuống không bị che
            pointerEvents: "none",
          }}
        >
          {/* Logo bên trái */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 16,
              fontWeight: 800,
              color: "#222",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                border: "2.5px solid #222",
                borderRadius: 7,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#222"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            BookOnline
          </div>

          {/* Góc phải: Ngôn ngữ & Dropdown User */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              pointerEvents: "auto",
            }}
          >
            {/* Nút đổi ngôn ngữ */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 12,
                fontWeight: 700,
                color: "#222",
                border: "1.5px solid #555",
                borderRadius: 20,
                padding: "4px 10px",
                cursor: "pointer",
              }}
            >
              VN 🇻🇳
            </div>

            {/* Khối User Dropdown */}
            <div style={{ position: "relative" }}>
              {/* Nút bấm hiển thị tên/Khách */}
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#f9f9f9",
                  border: "1.5px solid #ccc",
                  borderRadius: 20,
                  padding: "4px 12px",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#222",
                  fontFamily: "inherit",
                  outline: "none",
                }}
              >
                <User size={14} />
                {isLoggedIn ? userName : "Khách"}
                <ChevronDown
                  size={14}
                  style={{
                    transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "0.2s",
                  }}
                />
              </button>

              {/* Menu Sổ Xuống */}
              {showDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    background: "#fff",
                    border: "1px solid #eaeaea",
                    borderRadius: 8,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    minWidth: 160,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {!isLoggedIn ? (
                    <>
                      <a
                        href="/login"
                        style={{
                          padding: "12px 16px",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          fontSize: 13,
                          color: "#333",
                          borderBottom: "1px solid #f0f0f0",
                          fontWeight: 600,
                        }}
                      >
                        <LogIn size={15} color="#2196f3" /> Đăng nhập
                      </a>
                      <a
                        href="/register"
                        style={{
                          padding: "12px 16px",
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          fontSize: 13,
                          color: "#333",
                          fontWeight: 600,
                        }}
                      >
                        <UserPlus size={15} color="#27ae60" /> Đăng ký
                      </a>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setIsLoggedIn(false);
                        setShowDropdown(false);
                        // Thực hiện logic xóa token ở đây sau này
                      }}
                      style={{
                        padding: "12px 16px",
                        background: "none",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 13,
                        color: "#e74c3c",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        textAlign: "left",
                      }}
                    >
                      <LogOut size={15} /> Đăng xuất
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Nửa bên trái cố định */}
        <LeftPanel />

        {/* Nửa bên phải hiển thị Form */}
        {children}
      </div>
    </div>
  );
}
