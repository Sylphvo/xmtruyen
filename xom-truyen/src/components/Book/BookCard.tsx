import BookCover from "./BookCover"; // Đảm bảo import đúng đường dẫn
import type { Book } from "../../types";

import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { Heart, Star } from "lucide-react";

export default function BookCard({
  book,
  size = "normal",
}: {
  book: Book;
  size?: "normal" | "large";
}) {
  const navigate = useNavigate();
  // Không sử dụng kích thước cố định, thẻ truyện sẽ tự co giãn vừa 100% cột SwiperSlide

  const [isHovered, setIsHovered] = useState(false);
  const pointerStart = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (e: React.MouseEvent) => {
    const dx = Math.abs(e.clientX - pointerStart.current.x);
    const dy = Math.abs(e.clientY - pointerStart.current.y);
    // Nếu chuột di chuyển quá 5px, tức là đang kéo slider -> bỏ qua click
    if (dx > 5 || dy > 5) {
      e.preventDefault();
      return;
    }
    navigate(`/book/${book.id}`);
  };

  return (
    <div
      style={{
        width: "100%",
        flexShrink: 0,
        backgroundColor: "transparent",
        cursor: "pointer",
        position: "relative",
      }}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "3 / 4",
        borderRadius: "6px",
        overflow: "hidden", // Cắt các overlay khi chưa hover
        boxShadow: isHovered ? "0 4px 16px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0, 0, 0, 0.08)",
        transition: "box-shadow 0.3s ease",
      }}>
        <BookCover book={book} width="100%" height="100%" />

      {/* OVERLAY TRÊN (Đi từ trên xuống) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          transform: isHovered ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.3s ease-in-out",
          zIndex: 10,
        }}
      >
        <div style={{ 
          backgroundColor: "#8a5cf6", 
          color: "#fff", 
          padding: "4px 8px", 
          borderRadius: "12px", 
          fontSize: "11px", 
          fontWeight: 700, 
          display: "flex", 
          alignItems: "center", 
          gap: "4px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
        }}>
          <Star size={10} fill="#fbbf24" color="#fbbf24" /> {book.averageRating?.toFixed(1) || 4.5}
        </div>
        <button style={{ 
          backgroundColor: "#8a5cf6", 
          color: "#fff", 
          border: "none", 
          width: "26px", 
          height: "26px", 
          borderRadius: "50%", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
        }}>
          <Heart size={14} />
        </button>
      </div>

      {/* OVERLAY DƯỚI (Đi từ dưới lên) */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#a78bfa",
          padding: "8px 10px",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          transform: isHovered ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s ease-in-out",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: "2px",
          height: "22%",
          justifyContent: "space-between"
        }}
      >
        <h3 style={{ 
          color: "#fff", 
          margin: 0, 
          fontSize: "13px", 
          fontWeight: 700,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}>
          {book.title}
        </h3>
        <p style={{ color: "rgba(255,255,255,0.9)", margin: 0, fontSize: "11px", fontWeight: 500 }}>
          {book.genres && book.genres.length > 0 ? book.genres[0] : (book.formatType === 1 ? "Truyện Chữ" : "Truyện Tranh")}
        </p>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
          <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700 }}>Chap {book.currentChapter || 1}</span>
          <button style={{ 
            backgroundColor: "#fff", 
            color: "#8a5cf6", 
            border: "none", 
            padding: "4px 10px", 
            borderRadius: "16px", 
            fontSize: "11px", 
            fontWeight: 700, 
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            Đọc sách
          </button>
        </div>
      </div>

      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "30%",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)",
        opacity: isHovered ? 1 : 0,
        transition: "opacity 0.3s ease-in-out",
        zIndex: 5,
        pointerEvents: "none"
      }} />
      </div>

      <div style={{ marginTop: 12 }}>
        <h3 style={{ 
          fontSize: 15, 
          fontWeight: 700, 
          margin: "0 0 4px 0",
          color: "var(--text-primary)",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          lineHeight: 1.4
        }}>
          {book.title}
        </h3>
        <p style={{ fontSize: 13, color: "var(--text-muted, #777)", margin: 0, fontWeight: 500 }}>
          Chương {book.currentChapter || 1}
        </p>
      </div>
    </div>
  );
}
