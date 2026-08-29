import React, { useState, useEffect } from "react";
import LeftPanel from "../Auth/LeftPanel";
import { ChevronDown, LogIn, UserPlus, LogOut, User, BookOpen } from "lucide-react";
import { ACCENT } from "../../constants";

interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function AuthLayout({ title, children }: AuthLayoutProps) {
  // ──────────────────────────────────────────────────────────
  // Force light theme in Auth layout
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#3a3a3a",
        fontFamily: "'Be Vietnam Pro', 'Segoe UI', Arial, sans-serif",
        colorScheme: "light",
      }}
    >
      {/* Top bar */}

      {/* Main card */}
      <div
        style={{
          flex: 1,
          background: "#fff",
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
              gap: 12,
              fontSize: 20,
              fontWeight: 800,
              color: "#222",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: ACCENT,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BookOpen size={22} color="#fff" />
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
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 16px",
                borderRadius: "9999px",
                border: "2.5px solid #3B9EFF",
                backgroundColor: "#FFFFFF",
                fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "#111111",
                letterSpacing: "0.04em",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <span>VN</span>
              <svg width="20" height="14" viewBox="0 0 24 16" style={{ borderRadius: 2, display: "block" }}>
                <rect width="24" height="16" fill="#DA251D" />
                <polygon points="12,2.5 13.1,5.9 16.7,5.9 13.8,7.9 14.9,11.3 12,9.3 9.1,11.3 10.2,7.9 7.3,5.9 10.9,5.9" fill="#FFFF00" />
              </svg>
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
