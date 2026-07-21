import React from "react";
import { Heart, Bookmark as BookmarkIcon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import BookCover from "../Book/BookCover";
import type { Book } from "../../types";

export interface BookmarkRecord {
  id: number;
  book: Book;
  type: "favorite" | "saved"; // favorite = red heart, saved = yellow ribbon
}

interface BookmarkItemProps {
  record: BookmarkRecord;
}

export default function BookmarkItem({ record }: BookmarkItemProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { book, type } = record;

  return (
    <div 
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        width: "100%", 
        cursor: "pointer",
        position: "relative"
      }}
      onClick={() => navigate(`/book/${book.id}`, { state: { from: location.pathname } })}
    >
      {/* Cover with Overlay */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "3 / 4", marginBottom: "12px", borderRadius: "6px", overflow: "hidden" }}>
        <BookCover book={book} width="100%" height="100%" />
        
        {/* Overlay Icon */}
        <div style={{
          position: "absolute",
          top: "-4px",
          right: "8px",
          zIndex: 10
        }}>
          {type === "favorite" ? (
            <div style={{ color: "#ef4444" }}>
              <Heart size={28} fill="#ef4444" strokeWidth={0} />
            </div>
          ) : (
            <div style={{ color: "#facc15" }}>
              <BookmarkIcon size={32} fill="#facc15" strokeWidth={0} />
            </div>
          )}
        </div>
      </div>

      {/* Book Info */}
      <h3 style={{ 
        fontSize: "14px", 
        fontWeight: 700, 
        color: "#1a1a1a", 
        margin: "0 0 4px 0",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden"
      }}>
        {book.title}
      </h3>
      <p style={{ 
        fontSize: "13px", 
        color: "#6b7280", 
        margin: 0 
      }}>
        {book.author}
      </p>
    </div>
  );
}
