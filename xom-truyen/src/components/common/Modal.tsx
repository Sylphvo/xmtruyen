import React, { useEffect } from "react";
import { X } from "lucide-react";
import "../../styles/Modal.css"; // Import CSS tùy chỉnh cho Modal

interface ModalProps {
  isOpen: boolean; // Trạng thái Bật/Tắt
  onClose: () => void; // Hàm gọi khi bấm đóng
  title?: string; // Tiêu đề popup
  children: React.ReactNode; // Nội dung nhét vào giữa
  maxWidth?: "sm" | "md" | "lg"; // Kích thước (mặc định là vừa: md)

  // ─── PHẦN CHÂN POPUP (Tùy chọn) ───
  footer?: React.ReactNode; // Tự truyền custom footer nếu muốn
  showActions?: boolean; // Bật 2 nút "Xác nhận / Hủy" có sẵn
  onConfirm?: () => void; // Hàm khi bấm nút Xác nhận
  confirmText?: string; // Chữ của nút xác nhận
  cancelText?: string; // Chữ của nút hủy
  isLoading?: boolean; // Hiệu ứng xoay khi đang gọi API
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "md",
  footer,
  showActions = false,
  onConfirm,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  isLoading = false,
}: ModalProps) {
  // Xử lý: Bấm phím ESC để đóng & Khóa cuộn trang web nền
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Khóa cuộn chuột
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset"; // Nhả cuộn chuột
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    /* Bấm vào vùng tối ngoài này sẽ kích hoạt onClose */
    <div className="modal-overlay" onClick={onClose}>
      {/* Bấm vào khối trắng bên trong sẽ bị chặn lại nhờ stopPropagation */}
      <div
        className={`modal-container modal-${maxWidth}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: "1px solid #edf2f7",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 17,
              fontWeight: 700,
              color: "#1a202c",
            }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#a0aec0",
              display: "flex",
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div style={{ padding: "20px 24px", overflowY: "auto" }}>
          {children}
        </div>

        {/* FOOTER */}
        {(footer || showActions) && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              padding: "14px 24px",
              backgroundColor: "#f8fafc",
              borderTop: "1px solid #edf2f7",
            }}
          >
            {footer ? (
              footer
            ) : (
              <>
                <button
                  onClick={onClose}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e0",
                    background: "#fff",
                    color: "#4a5568",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 13,
                  }}
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 8,
                    border: "none",
                    background: "#c75b9b",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: 13,
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  {isLoading ? "Đang xử lý..." : confirmText}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
