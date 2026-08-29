import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import BookInfo from "../components/BookDetail/BookInfo";
import AnimatedBookComments from "../components/BookDetail/AnimatedBookComments";
import { AnimatedChapterList } from "../components/BookDetail/AnimatedChapterList";
import BookCover from "../components/Book/BookCover";
import Footer from "../components/Layout/Footer";
import { useBookDetail } from "../hooks/useBooks";
import { getSimilarBooks, getComicChapters, getTextChapters } from "../services/bookService";
import { useScrollReveal } from "../hooks/useScrollReveal";
import type { Book } from "../types";

export default function BookDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { book, loading } = useBookDetail(id);
  const [similarBooks, setSimilarBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"info" | "chapters" | "reviews">("info");

  // Reveal hooks
  const infoReveal = useScrollReveal({ delay: 0 });
  const chaptersReveal = useScrollReveal({ delay: 100 });
  const similarReveal = useScrollReveal({ delay: 200 });
  const commentsReveal = useScrollReveal({ delay: 300 });

  // Fetch similar books and chapters
  useEffect(() => {
    if (id) {
      getSimilarBooks(id, 6).then(books => setSimilarBooks(books));
    }
  }, [id]);

  useEffect(() => {
    if (id && book) {
      const fetcher = (book.formatType === 2 || book.genres?.includes("Truyện tranh")) ? getComicChapters : getTextChapters;
      fetcher(id).then(data => setChapters(data));
    }
  }, [id, book]);

  // Update SEO meta tags
  useEffect(() => {
    if (book) {
      document.title = `${book.title} - Xmtruyen`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", book.description || `Đọc truyện ${book.title} trên Xmtruyen`);
      } else {
        const meta = document.createElement('meta');
        meta.name = "description";
        meta.content = book.description || `Đọc truyện ${book.title} trên Xmtruyen`;
        document.head.appendChild(meta);
      }
    }
    
    // Cleanup title on unmount
    return () => {
      document.title = "Xmtruyen - Nền tảng đọc truyện";
    };
  }, [book]);

  // Fallback book if not found
  const displayBook: Book = book || {
    id: id || 1,
    title: loading ? "Đang tải dữ liệu..." : "Chưa có tiêu đề",
    author: loading ? "..." : "Đang cập nhật",
    genres: [],
    images: loading ? undefined : "mock-book-cover",
    coverIndex: 0,
    currentChapter: 0,
    lastUpdated: "Đang cập nhật",
  };

  return (
    <main style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "32px 60px", flex: 1 }}>
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="hover-lift"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "none",
            border: "none",
            fontSize: "16px",
            fontWeight: 600,
            color: "var(--text-h, #1f2937)",
            cursor: "pointer",
            marginBottom: "32px",
            padding: 0
          }}
        >
          <ChevronLeft size={20} /> Trở lại
        </button>

        {/* Book Details */}
        <div ref={infoReveal.ref} style={infoReveal.style}>
          <BookInfo book={displayBook} isLoading={loading} />
        </div>

        {/* Tabs Container */}
        <div style={{
          position: "sticky",
          top: "60px",
          backgroundColor: "var(--bg-primary, #0f0f1a)",
          zIndex: 10,
          borderBottom: "1px solid var(--border-color, #333)",
          display: "flex",
          gap: "32px",
          paddingBottom: "12px",
          marginBottom: "24px"
        }}>
          {["info", "chapters", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              style={{
                background: "none",
                border: "none",
                fontSize: "16px",
                fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? "#2196f3" : "var(--text-muted, #9ca3af)",
                cursor: "pointer",
                padding: "8px 0",
                position: "relative"
              }}
            >
              {tab === "info" ? "📝 Giới thiệu" : tab === "chapters" ? `📋 Mục lục (${chapters.length})` : "⭐ Đánh giá"}
              {activeTab === tab && (
                <div style={{
                  position: "absolute",
                  bottom: "-13px",
                  left: 0,
                  right: 0,
                  height: "3px",
                  backgroundColor: "#2196f3",
                  borderRadius: "3px 3px 0 0"
                }} />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ minHeight: "400px" }}>
          {activeTab === "info" && (
            <div ref={infoReveal.ref} style={infoReveal.style}>
              <div style={{ fontSize: "15px", color: "var(--text-p, #d1d5db)", lineHeight: 1.8, maxWidth: "800px" }}>
                {book?.description ? (
                  <p>{book.description}</p>
                ) : (
                  <>
                    <p>Tống Thiên Thị luôn cảm thấy hàng xóm mới là một người không dễ sống chung, bởi hắn không chỉ lạnh lùng mà lời nói ra cũng chẳng dễ lọt tai. Mãi cho đến một ngày cô bị hàng xóm chặn trên hành lang.</p>
                    <p>Đôi mắt của luật sư Ôn sáng quắc: "Trộm nhìn ít có quả, tôi chính là quả của em."</p>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === "chapters" && (
            <div ref={chaptersReveal.ref} style={chaptersReveal.style}>
              {chapters.length > 0 ? (
                <AnimatedChapterList 
                  chapters={chapters.map((ch, idx) => ({ ...ch, publicationId: id }))} 
                  isComic={book?.formatType === 2 || book?.genres?.includes("Truyện tranh")}
                />
              ) : (
                <p>Chưa có chương nào.</p>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div ref={commentsReveal.ref} style={commentsReveal.style}>
              <AnimatedBookComments publicationId={displayBook.id.toString()} />
            </div>
          )}
        </div>

        {/* Similar Books Section */}
        {similarBooks.length > 0 && (
          <div ref={similarReveal.ref} style={{ ...similarReveal.style, marginTop: "60px", marginBottom: "40px", paddingTop: "20px", borderTop: "1px solid var(--border-color, #333)" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "var(--text-h, #e0e0e0)", marginBottom: "20px" }}>
              Sách Tương Tự
            </h3>
            <div style={{ display: "flex", gap: "20px", overflowX: "auto", paddingBottom: "10px" }}>
              {similarBooks.map(simBook => (
                <div key={simBook.id} style={{ minWidth: "150px", maxWidth: "150px" }} className="hover-lift">
                  <Link to={`/book/${simBook.id}`} style={{ textDecoration: 'none' }}>
                    <BookCover book={simBook} width="100%" height="220px" />
                    <div style={{ marginTop: "8px", fontWeight: "600", fontSize: "14px", color: "var(--text-h, #e0e0e0)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {simBook.title}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  );
}
