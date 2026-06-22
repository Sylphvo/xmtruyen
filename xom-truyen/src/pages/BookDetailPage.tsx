import React from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import BookInfo from "../components/BookDetail/BookInfo";
import BookComments from "../components/BookDetail/BookComments";
import Footer from "../components/Layout/Footer";
import type { Book } from "../types";

export default function BookDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data for the book based on the design
  const mockBook: Book = {
    id: Number(id) || 1,
    title: "101 cách cua đổ đại lão hàng xóm",
    author: "Đồng Vũ",
    genres: ["Ngôn tình"],
    images: "mock-book-cover", // We will let the BookCover handle this, or it will fallback to grey
    coverIndex: 0,
    currentChapter: 25,
    lastUpdated: "Đang cập nhật"
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
            color: "#1f2937",
            cursor: "pointer",
            marginBottom: "32px",
            padding: 0
          }}
        >
          <ChevronLeft size={20} /> Trở lại
        </button>

        {/* Book Details */}
        <BookInfo book={mockBook} />

        {/* Comments */}
        <BookComments />
      </div>
      
      <Footer />
    </main>
  );
}
