import React, { useState } from "react";
import BookmarkItem from "../components/Bookmark/BookmarkItem";
import type { BookmarkRecord } from "../components/Bookmark/BookmarkItem";
import Footer from "../components/Layout/Footer";

// Mock Data
const MOCK_BOOKMARKS: BookmarkRecord[] = [
  {
    id: 1,
    type: "favorite", // Red heart
    book: {
      id: 2,
      title: "Tiểu thư thần toán",
      author: "Bạch Thiên",
      genres: ["Cổ đại"],
      images: "mock-book-2",
      coverIndex: 1,
      currentChapter: 12,
      lastUpdated: "Đang ra"
    }
  },
  {
    id: 2,
    type: "saved", // Yellow ribbon
    book: {
      id: 3,
      title: "Cứ yêu cứ chiều",
      author: "Nhất Lộ Phiên Hoa",
      genres: ["Ngôn tình"],
      images: "mock-book-3",
      coverIndex: 2,
      currentChapter: 61,
      lastUpdated: "Hoàn thành"
    }
  }
];

export default function BookmarkPage() {
  const [bookmarks] = useState<BookmarkRecord[]>(MOCK_BOOKMARKS);

  return (
    <main style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "40px 60px", flex: 1 }}>
        
        <h1 style={{ 
          fontSize: "20px", 
          fontWeight: 700, 
          color: "#374151", 
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "40px" 
        }}>
          Lưu trữ
        </h1>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(6, 1fr)", 
          gap: "28px" 
        }}>
          {bookmarks.length > 0 ? (
            bookmarks.map(record => (
              <BookmarkItem 
                key={record.id} 
                record={record} 
              />
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "40px", color: "#6b7280", width: "100%" }}>
              Chưa có truyện nào được lưu trữ.
            </div>
          )}
        </div>

      </div>
      
      <Footer />
    </main>
  );
}
