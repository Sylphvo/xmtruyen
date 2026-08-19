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
      document.title = `${book.title} - XomTruyen`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", book.description || `Đọc truyện ${book.title} trên XomTruyen`);
      } else {
        const meta = document.createElement('meta');
        meta.name = "description";
        meta.content = book.description || `Đọc truyện ${book.title} trên XomTruyen`;
        document.head.appendChild(meta);
      }
    }
    
    // Cleanup title on unmount
    return () => {
      document.title = "XomTruyen - Nền tảng đọc truyện";
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

        {/* Chapter List */}
        {chapters.length > 0 && (
          <div ref={chaptersReveal.ref} style={{ ...chaptersReveal.style, marginTop: "40px" }}>
             <AnimatedChapterList 
                chapters={chapters.map((ch, idx) => ({ ...ch, publicationId: id }))} 
                isComic={book?.formatType === 2 || book?.genres?.includes("Truyện tranh")}
             />
          </div>
        )}

        {/* Similar Books Section */}
        {similarBooks.length > 0 && (
          <div ref={similarReveal.ref} style={{ ...similarReveal.style, marginTop: "40px", marginBottom: "40px" }}>
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

        {/* Comments */}
        <div ref={commentsReveal.ref} style={commentsReveal.style}>
          <AnimatedBookComments publicationId={displayBook.id.toString()} />
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
