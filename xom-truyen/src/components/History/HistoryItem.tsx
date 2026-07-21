import React from "react";
import { Star, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import BookCover from "../Book/BookCover";
import type { Book } from "../../types";

export interface HistoryRecord {
  id: number;
  book: Book;
  readAt: string;
  actionType: "Đã đọc" | "Đã lưu" | "Đã thích";
}

interface HistoryItemProps {
  record: HistoryRecord;
  onRemove: (id: number) => void;
}

export default function HistoryItem({ record, onRemove }: HistoryItemProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { book, actionType, readAt } = record;

  return (
    <div style={{ 
      display: "flex", 
      gap: "24px", 
      paddingBottom: "32px",
      marginBottom: "32px",
      borderBottom: "1px solid #e5e7eb",
      position: "relative"
    }}>
      {/* Book Cover */}
      <div style={{ flexShrink: 0, cursor: "pointer", width: 190 }} onClick={() => navigate(`/book/${book.id}`, { state: { from: location.pathname } })}>
        <div style={{ width: "100%", aspectRatio: "3 / 4", position: "relative", borderRadius: "6px", overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
          <BookCover book={book} width="100%" height="100%" />
        </div>
      </div>

      {/* Book Details */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingRight: "60px" }}>
        
        {/* Title and Rating */}
        <div style={{ marginBottom: "24px" }}>
          <h2 
            onClick={() => navigate(`/book/${book.id}`, { state: { from: location.pathname } })}
            style={{ 
              fontSize: "20px", 
              fontWeight: 700, 
              color: "var(--text-primary, #1a1a1a)", 
              margin: "0 0 10px 0",
              cursor: "pointer"
            }}
          >
            {book.title}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary, #1a1a1a)" }}>4</span>
            <div style={{ display: "flex", gap: "2px" }}>
              {[...Array(4)].map((_, i) => (
                <Star key={i} size={16} fill="#facc15" color="#facc15" />
              ))}
              <Star size={16} color="#d1d5db" />
            </div>
            <span style={{ fontSize: "14px", color: "var(--text-muted, #6b7280)", fontWeight: 500 }}>• 1 đánh giá</span>
          </div>
        </div>

        {/* Info Grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr 1.5fr 1fr", 
          gap: "16px", 
          flex: 1
        }}>
          <div>
            <div style={{ fontSize: "12px", color: "var(--text-primary, #1a1a1a)", marginBottom: "6px", fontWeight: 700 }}>Tác giả</div>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-muted, #4b5563)", marginBottom: "24px" }}>{book.author}</div>
            <button 
              onClick={() => navigate(`/book/${book.id}/read`)}
              style={{
                backgroundColor: "#0ea5e9", // Bright blue
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "8px 24px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(14, 165, 233, 0.3)"
              }}
            >
              Đọc sách
            </button>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "var(--text-primary, #1a1a1a)", marginBottom: "6px", fontWeight: 700 }}>Thể loại</div>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-muted, #4b5563)" }}>{book.genres?.join(", ") || "Ngôn tình"}</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "var(--text-primary, #1a1a1a)", marginBottom: "6px", fontWeight: 700 }}>Nhà xuất bản</div>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-muted, #4b5563)" }}>Đang cập nhật</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "var(--text-primary, #1a1a1a)", marginBottom: "6px", fontWeight: 700 }}>Tình trạng ra</div>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-muted, #4b5563)" }}>25/50</div>
          </div>
        </div>

        {/* Action Time */}
        <div style={{ marginTop: "24px", fontSize: "13px", color: "var(--text-muted, #6b7280)", fontWeight: 500 }}>
          <span style={{ color: "var(--text-primary, #1a1a1a)", fontWeight: 700 }}>{actionType}:</span> {readAt}
        </div>
      </div>

      {/* Remove Button */}
      <button 
        onClick={() => onRemove(record.id)}
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          right: "16px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--text-primary, #1a1a1a)",
          padding: "8px"
        }}
      >
        <X size={28} strokeWidth={2.5} />
      </button>

    </div>
  );
}
