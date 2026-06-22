import React from "react";
import { Star, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
      <div style={{ flexShrink: 0, cursor: "pointer" }} onClick={() => navigate(`/book/${book.id}`)}>
        <BookCover book={book} width={130} height={173} />
      </div>

      {/* Book Details */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        
        {/* Title and Rating */}
        <div style={{ marginBottom: "16px" }}>
          <h2 
            onClick={() => navigate(`/book/${book.id}`)}
            style={{ 
              fontSize: "18px", 
              fontWeight: 700, 
              color: "#1a1a1a", 
              margin: "0 0 8px 0",
              cursor: "pointer"
            }}
          >
            {book.title}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600 }}>4</span>
            <div style={{ display: "flex", gap: "2px" }}>
              {[...Array(4)].map((_, i) => (
                <Star key={i} size={14} fill="#facc15" color="#facc15" />
              ))}
              <Star size={14} color="#d1d5db" />
            </div>
            <span style={{ fontSize: "13px", color: "#6b7280" }}>• 1 đánh giá</span>
          </div>
        </div>

        {/* Info Grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(4, 1fr)", 
          gap: "16px", 
          marginBottom: "20px"
        }}>
          <div>
            <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Tác giả</div>
            <div style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>{book.author}</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Thể loại</div>
            <div style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>{book.genres?.join(", ") || "Ngôn tình"}</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Nhà xuất bản</div>
            <div style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>Đang cập nhật</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Tình trạng ra</div>
            <div style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>25/50</div>
          </div>
        </div>

        {/* Action Button & Time */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "12px" }}>
          <button 
            onClick={() => navigate(`/book/${book.id}/read`)}
            style={{
              backgroundColor: "#2196f3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "8px 20px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(33, 150, 243, 0.3)"
            }}
          >
            Đọc sách
          </button>
          
          <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: 500 }}>
            <span style={{ color: "#374151" }}>{actionType}:</span> {readAt}
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <button 
        onClick={() => onRemove(record.id)}
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#4b5563",
          padding: "8px"
        }}
      >
        <X size={20} />
      </button>

    </div>
  );
}
