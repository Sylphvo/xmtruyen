import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ComicReadingContentProps {
  chapterNumber: number;
  chapterTitle: string;
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  imageUrls?: string[];
}

export default function ComicReadingContent({
  chapterNumber,
  chapterTitle,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  imageUrls = []
}: ComicReadingContentProps) {

  return (
    <div style={{ 
      flex: 1, 
      display: "flex", 
      flexDirection: "column", 
      padding: "0 20px",
      position: "relative",
      maxWidth: "1000px",
      margin: "0 auto",
      width: "100%"
    }}>
      
      {/* Chapter Header */}
      <div style={{ textAlign: "center", marginBottom: "40px", marginTop: "20px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px 0" }}>
          Chương {chapterNumber}
        </h2>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
          {chapterTitle}
        </h1>
      </div>

      {/* Vertical Image List */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0px", // Images usually touch each other in webtoons
        width: "100%"
      }}>
        {imageUrls.length > 0 ? (
          imageUrls.map((img, index) => (
            <img 
              key={index} 
              src={img} 
              alt={`Page ${index + 1}`} 
              style={{ 
                width: "100%", 
                height: "auto", 
                maxWidth: "800px",
                display: "block" 
              }} 
              loading="lazy"
            />
          ))
        ) : (
          <div style={{ padding: "40px", color: "#6b7280" }}>Chưa có nội dung cho chương này</div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "40px 0",
        marginTop: "20px",
        borderTop: "1px solid #e5e7eb"
      }}>
        <button 
          onClick={onPrevPage}
          disabled={currentPage === 1}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "none",
            border: "none",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
            color: currentPage === 1 ? "#9ca3af" : "#1a1a1a",
            fontSize: "16px",
            fontWeight: 600
          }}
        >
          <ChevronLeft size={24} /> Chương trước
        </button>
        
        <div style={{ fontSize: "16px", fontWeight: 500, color: "#4b5563" }}>
          Chương {chapterNumber}/{totalPages}
        </div>

        <button 
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "none",
            border: "none",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            color: currentPage === totalPages ? "#9ca3af" : "#1a1a1a",
            fontSize: "16px",
            fontWeight: 600
          }}
        >
          Chương sau <ChevronRight size={24} />
        </button>
      </div>

    </div>
  );
}
