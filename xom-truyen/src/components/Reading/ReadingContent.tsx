import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ReadingContentProps {
  chapterNumber: number;
  chapterTitle: string;
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  textContent?: string;
}

export default function ReadingContent({
  chapterNumber,
  chapterTitle,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  textContent
}: ReadingContentProps) {
  // If no textContent, use some placeholder text for now
  const contentToRender = textContent || "Đang cập nhật nội dung chương...";
  const isHtml = contentToRender.includes('<p>') || contentToRender.includes('<div>') || contentToRender.includes('<br>');

  return (
    <div style={{ 
      flex: 1, 
      display: "flex", 
      flexDirection: "column", 
      padding: "0 80px",
      position: "relative",
      maxWidth: "1200px",
      margin: "0 auto",
      width: "100%"
    }}>
      
      {/* Navigation Arrows */}
      <button 
        onClick={onPrevPage}
        style={{
          position: "absolute",
          left: "0",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#1a1a1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}
      >
        <ChevronLeft size={32} strokeWidth={2.5} />
      </button>

      <button 
        onClick={onNextPage}
        style={{
          position: "absolute",
          right: "0",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#1a1a1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}
      >
        <ChevronRight size={32} strokeWidth={2.5} />
      </button>

      {/* Chapter Header */}
      <div style={{ textAlign: "center", marginBottom: "40px", marginTop: "20px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px 0" }}>
          Chương {chapterNumber}
        </h2>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
          {chapterTitle}
        </h1>
      </div>

      {/* Text Content */}
      <div style={{ 
        fontSize: "18px",
        lineHeight: 1.8,
        color: "#374151",
        whiteSpace: isHtml ? "normal" : "pre-wrap",
        minHeight: "50vh"
      }}>
        {isHtml ? (
          <div dangerouslySetInnerHTML={{ __html: contentToRender }} />
        ) : (
          contentToRender
        )}
      </div>

      {/* Pagination Footer */}
      <div style={{ 
        textAlign: "center", 
        padding: "24px 0", 
        fontSize: "14px", 
        fontWeight: 500,
        color: "#4b5563",
        marginTop: "auto"
      }}>
        {currentPage}/{totalPages}
      </div>
    </div>
  );
}
