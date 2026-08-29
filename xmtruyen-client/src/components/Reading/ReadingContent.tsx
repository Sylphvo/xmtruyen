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
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  themeStyles: any;
}

export default function ReadingContent({
  chapterNumber,
  chapterTitle,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
  textContent,
  fontSize,
  fontFamily,
  lineHeight,
  themeStyles
}: ReadingContentProps) {
  const contentToRender = textContent || "Đang cập nhật nội dung chương...";
  const isHtml = contentToRender.includes('<p>') || contentToRender.includes('<div>') || contentToRender.includes('<br>');

  return (
    <div style={{ 
      flex: 1, 
      display: "flex", 
      flexDirection: "column", 
      padding: "0 80px",
      position: "relative",
      maxWidth: "1000px",
      margin: "0 auto",
      width: "100%",
      fontFamily: fontFamily
    }}>
      
      {/* Navigation Arrows */}
      <button 
        onClick={onPrevPage}
        style={{
          position: "fixed",
          left: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: themeStyles.text,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          opacity: 0.3,
          transition: "opacity 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
        onMouseLeave={(e) => e.currentTarget.style.opacity = "0.3"}
      >
        <ChevronLeft size={48} strokeWidth={2.5} />
      </button>

      <button 
        onClick={onNextPage}
        style={{
          position: "fixed",
          right: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: themeStyles.text,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          opacity: 0.3,
          transition: "opacity 0.2s"
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = "1"}
        onMouseLeave={(e) => e.currentTarget.style.opacity = "0.3"}
      >
        <ChevronRight size={48} strokeWidth={2.5} />
      </button>

      {/* Chapter Header */}
      <div style={{ textAlign: "center", marginBottom: "40px", marginTop: "20px" }}>
        <h2 style={{ fontSize: `${fontSize * 1.2}px`, fontWeight: 700, margin: "0 0 8px 0" }}>
          Chương {chapterNumber}
        </h2>
        <h1 style={{ fontSize: `${fontSize * 1.5}px`, fontWeight: 700, margin: 0 }}>
          {chapterTitle}
        </h1>
      </div>

      {/* Text Content */}
      <div style={{ 
        fontSize: `${fontSize}px`,
        lineHeight: lineHeight,
        whiteSpace: isHtml ? "normal" : "pre-wrap",
        minHeight: "50vh",
        textAlign: "justify"
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
        padding: "40px 0", 
        fontSize: "14px", 
        fontWeight: 500,
        opacity: 0.6,
        marginTop: "auto"
      }}>
        {currentPage}/{totalPages}
      </div>
    </div>
  );
}
