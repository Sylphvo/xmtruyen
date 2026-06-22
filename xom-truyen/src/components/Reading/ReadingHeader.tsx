import React from "react";
import { ChevronLeft, SlidersHorizontal, Bookmark, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ReadingHeaderProps {
  title: string;
}

export default function ReadingHeader({ title }: ReadingHeaderProps) {
  const navigate = useNavigate();

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center", 
      padding: "24px 40px",
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
          color: "#1a1a1a",
          cursor: "pointer",
          padding: 0
        }}
      >
        <ChevronLeft size={20} strokeWidth={2.5} /> {title}
      </button>

      {/* Right Side: Actions */}
      <div style={{ display: "flex", gap: "16px" }}>
        <button style={{ background: "none", border: "1px solid #1a1a1a", borderRadius: "8px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <SlidersHorizontal size={18} color="#1a1a1a" />
        </button>
        <button style={{ background: "none", border: "1px solid #1a1a1a", borderRadius: "8px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Bookmark size={18} color="#1a1a1a" />
        </button>
        <button style={{ background: "none", border: "1px solid #1a1a1a", borderRadius: "8px", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Edit size={18} color="#1a1a1a" />
        </button>
      </div>
    </div>
  );
}
