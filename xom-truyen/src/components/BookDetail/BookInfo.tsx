import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, Bookmark, Heart, Share2, BookOpen } from "lucide-react";
import BookCover from "../Book/BookCover";
import type { Book } from "../../types";

interface BookInfoProps {
  book: Book;
}

export default function BookInfo({ book }: BookInfoProps) {
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", gap: "40px", marginBottom: "40px" }}>
      {/* Book Cover */}
      <div style={{ flexShrink: 0 }}>
        {/* Reusing BookCover component, using a larger size */}
        <BookCover book={book} width={240} height={340} />
      </div>

      {/* Book Details */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: "10px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1a1a1a", marginBottom: "8px" }}>
          {book.title}
        </h1>
        
        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
          <span style={{ fontSize: "16px", fontWeight: 600 }}>4</span>
          <div style={{ display: "flex", gap: "4px" }}>
            {[...Array(4)].map((_, i) => (
              <Star key={i} size={16} fill="#facc15" color="#facc15" />
            ))}
            <Star size={16} color="#d1d5db" />
          </div>
          <span style={{ fontSize: "14px", color: "#6b7280" }}>• 1 đánh giá</span>
        </div>

        {/* Info Grid */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(4, 1fr)", 
          gap: "20px", 
          paddingBottom: "24px",
          borderBottom: "1px solid #e5e7eb",
          marginBottom: "24px"
        }}>
          <div>
            <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>Tác giả</div>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>{book.author}</div>
          </div>
          <div>
            <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>Thể loại</div>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>{book.genres?.join(", ") || "Ngôn tình"}</div>
          </div>
          <div>
            <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>Nhà xuất bản</div>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>Đang cập nhật</div>
          </div>
          <div>
            <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>Tình trạng ra</div>
            <div style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>25/50</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
          <button 
            onClick={() => navigate(`/book/${book.id}/read`, { state: { isComic: book.genres?.includes("Truyện tranh") || book.genres?.includes("Ngôn tình") } })}
            style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "10px 24px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(33, 150, 243, 0.3)"
          }}>
            <BookOpen size={18} /> Đọc sách
          </button>
          
          <button style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            backgroundColor: "transparent",
            border: "none",
            color: "#4b5563",
            cursor: "pointer"
          }}>
            <Bookmark size={22} />
          </button>
          
          <button style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            backgroundColor: "transparent",
            border: "none",
            color: "#4b5563",
            cursor: "pointer"
          }}>
            <Heart size={22} />
          </button>
          
          <button style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            backgroundColor: "transparent",
            border: "none",
            color: "#4b5563",
            cursor: "pointer"
          }}>
            <Share2 size={22} />
          </button>
        </div>

        {/* Description */}
        <div style={{ fontSize: "14px", color: "#4b5563", lineHeight: 1.6 }}>
          <p style={{ margin: 0 }}>
            Tống Thiên Thị luôn cảm thấy hàng xóm mới là một người không dễ sống chung, bởi hắn không chỉ lạnh lùng mà lời nói ra cũng chẳng dễ lọt tai. Mãi cho đến một ngày cô bị hàng xóm chặn trên hành lang.
          </p>
          <p style={{ margin: "4px 0 0 0" }}>
            Đôi mắt của luật sư Ôn sáng quắc: "Trộm nhìn ít có quả, tôi chính là quả của em."
          </p>
          <p style={{ margin: "4px 0 0 0" }}>
            Tống Thiên Thị nhìn người đàn ông ăn mặc chỉnh tề trước mặt, đột nhiên thay đổi quan điểm về anh.
          </p>
          <p style={{ margin: "4px 0 0 0" }}>
            ...
          </p>
          <p style={{ margin: "4px 0 0 0" }}>
            Cô cho rằng... <span style={{ color: "#2196f3", cursor: "pointer", fontWeight: 500 }}>Xem thêm</span>
          </p>
        </div>
      </div>
    </div>
  );
}
