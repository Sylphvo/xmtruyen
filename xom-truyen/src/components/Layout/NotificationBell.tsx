import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  startSignalRConnection, 
  stopSignalRConnection, 
  getMyNotifications, 
  markAsRead, 
  markAllAsRead 
} from "../../services/notificationService";
import { useAuth } from "../../hooks/useAuth";

export default function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      // Fetch initial notifications
      fetchNotifications();

      // Start SignalR
      startSignalRConnection((newNotif) => {
        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((prev) => prev + 1);
        // Play sound or show toast here if desired
      });
    } else {
      stopSignalRConnection();
      setNotifications([]);
      setUnreadCount(0);
    }

    return () => {
      stopSignalRConnection();
    };
  }, [user]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await getMyNotifications(1, 20);
      if (res.success) {
        setNotifications(res.data);
        setUnreadCount(res.unreadCount);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = () => setIsOpen(!isOpen);

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (notif: any) => {
    if (!notif.isRead) {
      try {
        await markAsRead(notif.id);
        setNotifications(notifications.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        console.error(err);
      }
    }

    setIsOpen(false);

    // Navigate logic based on Type or ReferenceId
    if (notif.referenceId && notif.referenceType === "PUBLICATION") {
      navigate(`/book/${notif.referenceId}`);
    }
  };

  if (!user) return null;

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <button 
        onClick={handleToggle}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          position: "relative",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-h, #1f2937)"
        }}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span style={{
            position: "absolute",
            top: "2px",
            right: "2px",
            backgroundColor: "#ef4444",
            color: "white",
            fontSize: "10px",
            fontWeight: "bold",
            borderRadius: "10px",
            padding: "2px 6px",
            border: "2px solid var(--bg-primary, white)"
          }}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: "absolute",
          top: "100%",
          right: 0,
          width: "350px",
          backgroundColor: "var(--bg-primary, white)",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
          marginTop: "12px",
          zIndex: 50,
          border: "1px solid var(--border-color, #e5e7eb)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column"
        }}>
          {/* Header */}
          <div style={{
            padding: "16px",
            borderBottom: "1px solid var(--border-color, #e5e7eb)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "var(--bg-secondary, #f9fafb)"
          }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "var(--text-h, #111827)" }}>Thông báo</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                style={{
                  background: "none",
                  border: "none",
                  color: "#3b82f6",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <Check size={14} /> Đánh dấu đã đọc
              </button>
            )}
          </div>

          {/* List */}
          <div style={{
            maxHeight: "400px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column"
          }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--text-p, #6b7280)", fontSize: "14px" }}>
                Chưa có thông báo nào.
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  style={{
                    padding: "16px",
                    borderBottom: "1px solid var(--border-color, #f3f4f6)",
                    cursor: "pointer",
                    backgroundColor: notif.isRead ? "transparent" : "rgba(59, 130, 246, 0.05)",
                    display: "flex",
                    gap: "12px",
                    transition: "background-color 0.2s"
                  }}
                >
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: notif.type === "NEW_CHAPTER" ? "#dbeafe" : "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: notif.type === "NEW_CHAPTER" ? "#3b82f6" : "#6b7280"
                  }}>
                    <BookOpen size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: notif.isRead ? 500 : 600, color: "var(--text-h, #111827)", marginBottom: "4px" }}>
                      {notif.title}
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--text-p, #4b5563)", marginBottom: "6px", lineHeight: 1.4 }}>
                      {notif.message}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-p, #9ca3af)" }}>
                      {new Date(notif.createdAt).toLocaleString("vi-VN")}
                    </div>
                  </div>
                  {!notif.isRead && (
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#3b82f6", alignSelf: "center" }} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
