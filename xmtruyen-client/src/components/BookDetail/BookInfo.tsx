import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Bookmark, Heart, Share2, BookOpen } from "lucide-react";
import BookCover from "../Book/BookCover";
import Skeleton from "../common/Skeleton";
import type { Book } from "../../types";
import { checkFavorite, toggleFavorite } from "../../services/engagementService";

interface BookInfoProps {
  isLoading?: boolean;
  book: Book;
}

export default function BookInfo({ book, isLoading }: BookInfoProps) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (book.id) {
      checkFavorite(book.id.toString())
        .then(res => setIsFavorite(res.data))
        .catch(() => {});
    }
  }, [book.id]);

  const handleToggleFavorite = async () => {
    const prevStatus = isFavorite;
    setIsFavorite(!prevStatus); // Optimistic Update

    try {
      const res = await toggleFavorite(book.id.toString());
      if (res.message === "Added to favorites") {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    } catch (err) {
      setIsFavorite(prevStatus); // Rollback
      alert("Vui lòng đăng nhập để thêm vào yêu thích!");
    }
  };

  return (
    <div style={{ display: "flex", gap: "40px", marginBottom: "40px" }}>
      {/* Book Cover */}
      <div style={{ flexShrink: 0 }}>
        {/* Reusing BookCover component, using a larger size */}
        {isLoading ? <Skeleton type="rectangular" width={240} height={340} borderRadius="12px" /> : <BookCover book={book} width={240} height={340} />}
      </div>

      {/* Book Details */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingTop: "10px" }}>
        {isLoading ? <Skeleton type="text" width="60%" height="34px" /> : <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-h, #1a1a1a)", marginBottom: "8px" }}>{book.title}</h1>}
        
        {/* Rating */}
        {isLoading ? <Skeleton type="text" width="200px" height="20px" /> : (
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
        )}

        {/* Info Grid */}
        {isLoading ? <Skeleton type="rectangular" width="100%" height="80px" /> : <div style={{ 
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
        </div>}

        {/* Action Buttons */}
        {isLoading ? <Skeleton type="rectangular" width="300px" height="40px" /> : <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
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
          
          <button 
            onClick={handleToggleFavorite}
            style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            backgroundColor: "transparent",
            border: "none",
            color: isFavorite ? "#ef4444" : "#4b5563",
            cursor: "pointer"
          }}>
            <Heart size={22} fill={isFavorite ? "#ef4444" : "none"} />
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
        </div>}

        {/* Removed Description to move to Tabs */}
      </div>
    </div>
  );
}
