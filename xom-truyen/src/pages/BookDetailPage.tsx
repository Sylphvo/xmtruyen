import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import BookInfo from "../components/BookDetail/BookInfo";
import BookComments from "../components/BookDetail/BookComments";
import BookCover from "../components/Book/BookCover";
import Footer from "../components/Layout/Footer";
import { useBookDetail } from "../hooks/useBooks";
import { getSimilarBooks } from "../services/bookService";
import type { Book } from "../types";

export default function BookDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { book, loading } = useBookDetail(id);
  const [similarBooks, setSimilarBooks] = useState<Book[]>([]);

  // Fetch similar books
  useEffect(() => {
    if (id) {
      getSimilarBooks(id, 6).then(books => setSimilarBooks(books));
    }
  }, [id]);

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
        <BookInfo book={displayBook} />

        {/* Similar Books Section */}
        {similarBooks.length > 0 && (
          <div style={{ marginTop: "40px", marginBottom: "40px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "var(--text-h, #e0e0e0)", marginBottom: "20px" }}>
              Sách Tương Tự
            </h3>
            <div style={{ display: "flex", gap: "20px", overflowX: "auto", paddingBottom: "10px" }}>
              {similarBooks.map(simBook => (
                <div key={simBook.id} style={{ minWidth: "150px", maxWidth: "150px" }}>
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
        <BookComments publicationId={displayBook.id.toString()} />
      </div>
      
      <Footer />
    </main>
  );
}
