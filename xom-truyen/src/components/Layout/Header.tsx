import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Check,
  MoreHorizontal,
  Users,
  MessageCircle,
  Smile,
  Grip,
  Settings,
  HelpCircle,
  AlertCircle,
  Moon,
  ChevronRight,
} from "lucide-react";
import Modal from "../common/Modal"; // <-- Nhớ trỏ đúng đường dẫn file Modal.tsx của bạn

import { useNavigate } from "react-router-dom"; // <-- Thêm dòng này

import "../../styles/Header.css"; // Bắt buộc phải import file CSS vào đây

export default function Header() {
  const [query, setQuery] = useState("");
  // Khởi tạo hàm chuyển trang
  const navigate = useNavigate(); // <-- Thêm dòng này

  // ─── STATE QUẢN LÝ ĐĂNG NHẬP ───
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const fullName = user?.fullName || "Guest";
  const isLoggedIn = !!user;

  // Wallet state
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.getItem("token");
      if (token) {
        fetch("http://localhost:5172/api/payment/wallet", {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data) setWallet(data);
        })
        .catch(console.error);
      }
    }
  }, [isLoggedIn]);

  // State quản lý việc mở/đóng Menu sổ xuống
  const [showDropdown, setShowDropdown] = useState(false);
  // ─── 1. STATE CHO POPUP NGÔN NGỮ ──────────────────────────────────────────
  const [showLangModal, setShowLangModal] = useState(false);
  const [currentLang, setCurrentLang] = useState({
    code: "VN",
    flag: "🇻🇳",
    name: "Tiếng Việt",
  });

  const LANGUAGES = [
    { code: "VN", flag: "🇻🇳", name: "Tiếng Việt" },
    { code: "EN", flag: "🇺🇸", name: "English" },
    { code: "JP", flag: "🇯🇵", name: "日本語 (Nhật)" },
    { code: "KR", flag: "🇰🇷", name: "한국어 (Hàn)" },
  ];
  const VietnamFlag: React.FC = () => (
    <svg
      width="24"
      height="16"
      viewBox="0 0 24 16"
      xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: 2, display: "block" }}
    >
      {/* Red background */}
      <rect width="24" height="16" fill="#DA251D" />
      {/* Yellow star */}
      <polygon
        points="12,2.5 13.1,5.9 16.7,5.9 13.8,7.9 14.9,11.3 12,9.3 9.1,11.3 10.2,7.9 7.3,5.9 10.9,5.9"
        fill="#FFFF00"
      />
    </svg>
  );
  // ─── 2. STATE CHO POPUP THÔNG BÁO ─────────────────────────────────────────
  const [showNotifModal, setShowNotifModal] = useState(false);

  // ─── 3. STATE THEME ───────────────────────────────────────────────────────
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [isDarkMode]);

  // Toggle functions ensuring only one popup is open
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) setShowNotifModal(false);
  };

  const toggleNotif = () => {
    setShowNotifModal(!showNotifModal);
    if (!showNotifModal) setShowDropdown(false);
  };

  const theme = {
    bg: isDarkMode ? "#242526" : "#ffffff",
    text: isDarkMode ? "#e4e6eb" : "#050505",
    textMuted: isDarkMode ? "#b0b3b8" : "#65676b",
    border: isDarkMode ? "#3e4042" : "#ced0d4",
    hover: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    btnBg: isDarkMode ? "#3a3b3c" : "#e4e6eb",
    btnText: isDarkMode ? "#e4e6eb" : "#050505",
    activeTabBg: isDarkMode ? "#263951" : "#e7f3ff",
    activeTabText: isDarkMode ? "#4599ff" : "#1877f2",
    shadow: isDarkMode ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.2)",
  };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "16px 30px",
        backgroundColor: "var(--bg-primary)",
        borderBottom: "1px solid var(--border-color, #ebebeb)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Search */}
      <div
        className="header-search"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          backgroundColor: "var(--bg-secondary, #fff)",
          borderRadius: 30,
          padding: "10px 20px",
          gap: 12,
          border: "1px solid var(--border-color, #ddd)",
        }}
      >
        <Search size={18} color="var(--text-muted, #bbb)" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim()) {
              navigate(`/search?q=${encodeURIComponent(query.trim())}`);
            }
          }}
          placeholder="Tìm kiếm sách, tác giả,..."
          style={{
            border: "none",
            background: "none",
            outline: "none",
            fontSize: 14,
            flex: 1,
            color: "var(--text-primary)",
            fontFamily: "inherit",
          }}
        />
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* NÚT KÍCH HOẠT 1: CHỌN NGÔN NGỮ */}
      <div
        onClick={() => setShowLangModal(true)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 20px",
          borderRadius: "9999px",
          border: "2.5px solid #3B9EFF",
          backgroundColor: "#FFFFFF",
          fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
          fontSize: "15px",
          fontWeight: 600,
          color: "#111111",
          letterSpacing: "0.04em",
          cursor: "default",
          userSelect: "none",
        }}
      >
        <span>{currentLang.code}</span>
        <VietnamFlag />
      </div>

      {/* 4 CIRCULAR BUTTONS (Grid, Messenger, Bell, Profile) */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

        {/* Grid (Menu) */}
        <div style={{ position: "relative" }}>
          <button
            className="mobile-menu-btn"
            onClick={() => {
              navigate('/'); // Quick navigate home on mobile for now
            }}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              backgroundColor: theme.btnBg,
              color: theme.btnText,
              border: "none",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Grip size={22} />
          </button>
        </div>

        {/* Messenger */}
        <button
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            backgroundColor: theme.btnBg,
            color: theme.btnText,
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <MessageCircle size={22} />
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={`Chuyển sang chế độ ${isDarkMode ? "sáng" : "tối"}`}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            backgroundColor: theme.btnBg,
            color: theme.btnText,
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Moon size={22} />
        </button>

        {/* Bell (Thông báo) */}
        <div style={{ position: "relative" }}>
          <button
            onClick={toggleNotif}
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              backgroundColor: showNotifModal ? theme.activeTabBg : theme.btnBg,
              color: showNotifModal ? theme.activeTabText : theme.btnText,
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Bell size={22} />
            {/* Chấm đỏ báo có tin mới */}
            <span
              style={{
                position: "absolute",
                top: -2,
                right: -2,
                backgroundColor: "#e41e3f",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 5px",
                borderRadius: 10,
                border: `2px solid ${theme.bg}`,
              }}
            >
              3
            </span>
          </button>
          {showNotifModal && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 14px)",
                right: "-10px",
                width: "360px",
                backgroundColor: theme.bg,
                borderRadius: "8px",
                boxShadow: `0 4px 20px ${theme.shadow}`,
                border: `1px solid ${theme.border}`,
                zIndex: 100,
                display: "flex",
                flexDirection: "column",
                color: theme.text,
                maxHeight: "80vh",
                overflowY: "auto",
              }}
            >
              {/* Header section */}
              <div style={{ padding: "16px 16px 8px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <h3 style={{ margin: 0, fontSize: "24px", fontWeight: 700, color: theme.text }}>
                    Thông báo
                  </h3>
                  <button style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer", display: "flex" }}>
                    <MoreHorizontal size={20} />
                  </button>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button style={{
                    backgroundColor: theme.activeTabBg,
                    color: theme.activeTabText,
                    padding: "6px 12px",
                    borderRadius: "16px",
                    fontSize: "15px",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer"
                  }}>
                    Tất cả
                  </button>
                  <button style={{
                    backgroundColor: "transparent",
                    color: theme.text,
                    padding: "6px 12px",
                    borderRadius: "16px",
                    fontSize: "15px",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    transition: "background 0.2s"
                  }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    Chưa đọc
                  </button>
                </div>
              </div>

              {/* Content List */}
              <div style={{ display: "flex", flexDirection: "column", padding: "0 8px 8px 8px" }}>

                {/* Mới */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 8px 4px 8px" }}>
                  <span style={{ fontSize: "17px", fontWeight: 600, color: theme.text }}>Mới</span>
                  <a href="#" style={{ fontSize: "15px", color: theme.activeTabText, textDecoration: "none" }}>Xem tất cả</a>
                </div>

                {/* Item 1 */}
                <div style={{ display: "flex", padding: "8px", gap: "12px", borderRadius: "8px", cursor: "pointer", position: "relative", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.hover} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                  <div style={{ position: "relative", width: "56px", height: "56px", flexShrink: 0 }}>
                    <img src="/src/assets/images/Truyen-Tranh-Ngon-Tinh-01.jpg" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: -4, right: -4, width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#1877f2", borderRadius: "50%", border: `2px solid ${theme.bg}` }}>
                      <Users size={12} color="#fff" />
                    </div>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ fontSize: "15px", lineHeight: "1.3", color: theme.text, marginBottom: "4px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      <strong>JOBVUI ĐÂY:</strong> "# 7 nguyên tắc để đi làm dễ thở hơn nè!!! Nếu bạn mới đi làm, hoặc đang cảm thấy..."
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: theme.activeTabText }}>23 phút</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingRight: "8px" }}>
                    <div style={{ width: "12px", height: "12px", backgroundColor: "#1877f2", borderRadius: "50%" }} />
                  </div>
                </div>

                {/* Item 2 */}
                <div style={{ display: "flex", padding: "8px", gap: "12px", borderRadius: "8px", cursor: "pointer", position: "relative", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.hover} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                  <div style={{ position: "relative", width: "56px", height: "56px", flexShrink: 0 }}>
                    <img src="/src/assets/images/Truyen-Tranh-Ngon-Tinh-02.jpg" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: -4, right: -4, width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#1877f2", borderRadius: "50%", border: `2px solid ${theme.bg}` }}>
                      <Users size={12} color="#fff" />
                    </div>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ fontSize: "15px", lineHeight: "1.3", color: theme.text, marginBottom: "4px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      Bây giờ trong <strong>Cộng đồng NARAKA: BLADEPOINT VIỆT...:</strong> Em lần đầu chơi nên muốn tìm...
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: theme.activeTabText }}>1 giờ · 5 cảm xúc · 11 bình luận</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingRight: "8px" }}>
                    <div style={{ width: "12px", height: "12px", backgroundColor: "#1877f2", borderRadius: "50%" }} />
                  </div>
                </div>

                {/* Hôm nay */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 8px 4px 8px" }}>
                  <span style={{ fontSize: "17px", fontWeight: 600, color: theme.text }}>Hôm nay</span>
                </div>

                {/* Item 3 */}
                <div style={{ display: "flex", padding: "8px", gap: "12px", borderRadius: "8px", cursor: "pointer", position: "relative", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.hover} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                  <div style={{ position: "relative", width: "56px", height: "56px", flexShrink: 0 }}>
                    <div style={{ width: "100%", height: "100%", borderRadius: "50%", backgroundColor: "#0b2545", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700 }}>
                      ASP.NET
                    </div>
                    <div style={{ position: "absolute", bottom: -4, right: -4, width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#1877f2", borderRadius: "50%", border: `2px solid ${theme.bg}` }}>
                      <Users size={12} color="#fff" />
                    </div>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ fontSize: "15px", lineHeight: "1.3", color: theme.text, marginBottom: "4px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      <strong>ASP.NET Core Việt Nam:</strong> "** [Paracel Tech is hiring] Software Developer (.NET / C# / Oracle..."
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: theme.activeTabText }}>4 giờ</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingRight: "8px" }}>
                    <div style={{ width: "12px", height: "12px", backgroundColor: "#1877f2", borderRadius: "50%" }} />
                  </div>
                </div>

                {/* Trước đó */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 8px 4px 8px" }}>
                  <span style={{ fontSize: "17px", fontWeight: 600, color: theme.text }}>Trước đó</span>
                </div>

                {/* Item 4 */}
                <div style={{ display: "flex", padding: "8px", gap: "12px", borderRadius: "8px", cursor: "pointer", position: "relative", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.hover} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                  <div style={{ position: "relative", width: "56px", height: "56px", flexShrink: 0 }}>
                    <img src="/src/assets/images/Truyen-Tranh-Ngon-Tinh-Hien-Dai.jpg" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: -4, right: -4, width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#23d160", borderRadius: "50%", border: `2px solid ${theme.bg}` }}>
                      <MessageCircle size={12} color="#fff" />
                    </div>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ fontSize: "15px", lineHeight: "1.3", color: theme.text, marginBottom: "4px" }}>
                      <strong>Tống Thúy Duy</strong> đã bình luận về bài viết bạn chia sẻ.
                    </div>
                    <span style={{ fontSize: "13px", color: theme.textMuted }}>12 giờ</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingRight: "8px" }}>
                    {/* Read item, no blue dot */}
                  </div>
                </div>

                {/* Item 5 - Hover effect */}
                <div style={{ display: "flex", padding: "8px", gap: "12px", borderRadius: "8px", cursor: "pointer", position: "relative", transition: "background 0.2s", backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.hover} onMouseOut={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)"}>
                  <div style={{ position: "relative", width: "56px", height: "56px", flexShrink: 0 }}>
                    <img src="/src/assets/images/Truyen-Tranh-Ngon-Tinh-Hien-Dai.jpg" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", bottom: -4, right: -4, width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f7b125", borderRadius: "50%", border: `2px solid ${theme.bg}` }}>
                      <Smile size={12} color="#fff" />
                    </div>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ fontSize: "15px", lineHeight: "1.3", color: theme.text, marginBottom: "4px" }}>
                      <strong>Tống Thúy Duy</strong> đã bày tỏ cảm xúc về một ảnh.
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: theme.activeTabText }}>12 giờ</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingRight: "8px", gap: "8px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: theme.bg }}>
                      <MoreHorizontal size={16} color={theme.textMuted} />
                    </div>
                    <div style={{ width: "12px", height: "12px", backgroundColor: "#1877f2", borderRadius: "50%" }} />
                  </div>
                </div>

              </div>

              {/* Footer button */}
              <div style={{ padding: "0 16px 16px 16px", marginTop: "8px" }}>
                <button
                  onClick={() => setShowNotifModal(false)}
                  style={{
                    width: "100%",
                    backgroundColor: theme.btnBg,
                    border: "none",
                    color: theme.text,
                    fontSize: "15px",
                    fontWeight: 600,
                    padding: "8px 0",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "background 0.2s"
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.hover}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = theme.btnBg}
                >
                  Xem thông báo trước đó
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Profile / User */}
        <div style={{ position: "relative" }}>
          <button
            onClick={toggleDropdown}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", border: `1px solid var(--border-color, #ddd)`, padding: "4px 14px 4px 4px", borderRadius: "30px", backgroundColor: "var(--bg-secondary, #fff)" }}>
              <img src="/src/assets/images/Truyen-Tranh-Ngon-Tinh-01.jpg" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>{fullName}</span>
                {wallet && (
                  <span style={{ fontSize: "12px", color: "#f7b125", fontWeight: "bold" }}>
                    {wallet.coinBalance} Xu 
                    {wallet.planName && <span style={{ marginLeft: 5, padding: "2px 6px", background: "#ff6b9d", color: "white", borderRadius: "4px", fontSize: "10px" }}>{wallet.planName}</span>}
                  </span>
                )}
              </div>
            </div>
          </button>

          {showDropdown && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 14px)",
                right: 0,
                width: "360px",
                backgroundColor: theme.bg,
                borderRadius: "8px",
                boxShadow: `0 4px 20px ${theme.shadow}`,
                border: `1px solid ${theme.border}`,
                zIndex: 100,
                display: "flex",
                flexDirection: "column",
                color: theme.text,
                padding: "16px",
              }}
            >
              {/* Account Selector Area */}
              <div style={{ backgroundColor: theme.bg, borderRadius: "8px", boxShadow: `0 2px 12px ${theme.shadow}`, border: `1px solid ${theme.border}`, padding: "12px", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingBottom: "12px" }}>
                  <img src="/src/assets/images/Truyen-Tranh-Ngon-Tinh-01.jpg" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                  <span style={{ fontSize: "17px", fontWeight: 600, color: theme.text }}>{fullName}</span>
                </div>
              </div>

              {/* Action Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>

                <div style={{ display: "flex", alignItems: "center", padding: "8px", gap: "12px", borderRadius: "8px", cursor: "pointer", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.hover} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: theme.btnBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Settings size={20} color={theme.text} />
                  </div>
                  <span style={{ flex: 1, fontSize: "15px", fontWeight: 600 }}>Cài đặt và quyền riêng tư</span>
                  <ChevronRight size={24} color={theme.textMuted} />
                </div>

                <div style={{ display: "flex", alignItems: "center", padding: "8px", gap: "12px", borderRadius: "8px", cursor: "pointer", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.hover} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: theme.btnBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <HelpCircle size={20} color={theme.text} />
                  </div>
                  <span style={{ flex: 1, fontSize: "15px", fontWeight: 600 }}>Trợ giúp và hỗ trợ</span>
                  <ChevronRight size={24} color={theme.textMuted} />
                </div>

                <div style={{ display: "flex", alignItems: "center", padding: "8px", gap: "12px", borderRadius: "8px", cursor: "pointer", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.hover} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: theme.btnBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <AlertCircle size={20} color={theme.text} />
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "15px", fontWeight: 600 }}>Báo cáo sự cố</span>
                    <span style={{ fontSize: "12px", color: theme.textMuted }}>CTRL B</span>
                  </div>
                </div>

                {/* The moon toggle was moved out to the main header row */}

                <div onClick={() => { localStorage.removeItem("user"); navigate("/login"); }} style={{ display: "flex", alignItems: "center", padding: "8px", gap: "12px", borderRadius: "8px", cursor: "pointer", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.hover} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: theme.btnBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <LogOut size={20} color={theme.text} />
                  </div>
                  <span style={{ flex: 1, fontSize: "15px", fontWeight: 600 }}>Đăng xuất</span>
                </div>

              </div>

              <div style={{ marginTop: "16px", fontSize: "12px", color: theme.textMuted, lineHeight: "1.5" }}>
                Quyền riêng tư · Điều khoản · Quảng cáo · Lựa chọn quảng cáo · Cookie · Xem thêm
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: HIỂN THỊ CHỌN NGÔN NGỮ */}
      <Modal
        isOpen={showLangModal}
        onClose={() => setShowLangModal(false)}
        title="Chọn ngôn ngữ giao diện"
        maxWidth="sm"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {LANGUAGES.map((lang) => {
            const isSelected = currentLang.code === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  setCurrentLang(lang);
                  setShowLangModal(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "none",
                  backgroundColor: isSelected ? "#fef3c7" : "transparent",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 12,
                  color: "#334155",
                  textAlign: "left",
                  fontFamily: "inherit",
                }}
              >
                <span
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <span style={{ fontSize: 16 }}>{lang.flag}</span>
                  {lang.name}
                </span>
                {isSelected && <Check size={16} color="#d97706" />}
              </button>
            );
          })}
        </div>
      </Modal>

    </header>
  );
}
