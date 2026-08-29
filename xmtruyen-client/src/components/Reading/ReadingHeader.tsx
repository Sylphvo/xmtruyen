import React from "react";
import { ChevronLeft, SlidersHorizontal, Bookmark, List, Maximize } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ReadingHeaderProps {
  title: string;
  themeStyles: any;
  onToggleList: () => void;
  onToggleSettings: () => void;
  onToggleFullscreen: () => void;
  onToggleBookmark: () => void;
  isBookmarked: boolean;
}

export default function ReadingHeader({ 
  title, 
  themeStyles,
  onToggleList,
  onToggleSettings,
  onToggleFullscreen,
  onToggleBookmark,
  isBookmarked
}: ReadingHeaderProps) {
  const navigate = useNavigate();

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      padding: "16px 20px",
    }}>
      {/* Left Side: Back & Title */}
      <button 
        onClick={() => navigate(-1)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "none",
          border: "none",
          fontSize: "15px",
          fontWeight: 700,
          color: themeStyles.text,
          cursor: "pointer",
          padding: 0
        }}
      >
        <ChevronLeft size={20} strokeWidth={2.5} /> {title}
      </button>

      {/* Right Side: Actions */}
      <div style={{ display: "flex", gap: "10px", marginLeft: "20px" }}>
        <button 
          onClick={onToggleBookmark}
          title="Đánh dấu trang (B)"
          style={{ 
            background: isBookmarked ? "#f59e0b" : "none", 
            border: `1px solid ${isBookmarked ? "#f59e0b" : themeStyles.border}`, 
            borderRadius: "8px", 
            width: "36px", 
            height: "36px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            cursor: "pointer",
            color: isBookmarked ? "white" : themeStyles.text 
          }}
        >
          <Bookmark size={18} fill={isBookmarked ? "white" : "none"} />
        </button>
        <button 
          onClick={onToggleList}
          title="Danh sách chương (C)"
          style={{ 
            background: "none", 
            border: `1px solid ${themeStyles.border}`, 
            borderRadius: "8px", 
            width: "36px", 
            height: "36px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            cursor: "pointer",
            color: themeStyles.text 
          }}
        >
          <List size={18} />
        </button>
        <button 
          onClick={onToggleSettings}
          title="Cài đặt (S)"
          style={{ 
            background: "none", 
            border: `1px solid ${themeStyles.border}`, 
            borderRadius: "8px", 
            width: "36px", 
            height: "36px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            cursor: "pointer",
            color: themeStyles.text 
          }}
        >
          <SlidersHorizontal size={18} />
        </button>
        <button 
          onClick={onToggleFullscreen}
          title="Toàn màn hình (F)"
          style={{ 
            background: "none", 
            border: `1px solid ${themeStyles.border}`, 
            borderRadius: "8px", 
            width: "36px", 
            height: "36px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            cursor: "pointer",
            color: themeStyles.text 
          }}
        >
          <Maximize size={18} />
        </button>
      </div>
    </div>
  );
}
