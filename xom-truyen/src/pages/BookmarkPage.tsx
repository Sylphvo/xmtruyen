import React, { useState, useEffect } from "react";
import BookmarkItem from "../components/Bookmark/BookmarkItem";
import type { BookmarkRecord } from "../components/Bookmark/BookmarkItem";
import Footer from "../components/Layout/Footer";
import { getBookmarks, getFavorites } from "../services/engagementService";

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookmarksData, favoritesData] = await Promise.all([
          getBookmarks().catch(() => ({ data: [] })),
          getFavorites().catch(() => ({ data: [] }))
        ]);

        const mappedBookmarks: BookmarkRecord[] = (bookmarksData.data || []).map((b: any) => ({
          id: b.id,
          type: "saved",
          book: {
            id: b.publicationId,
            title: b.publicationTitle || "Đang tải",
            author: "Tác giả",
            genres: ["Truyện"],
            images: "",
            coverIndex: 0,
            currentChapter: b.chapterTitle || "Chưa có thông tin",
            lastUpdated: new Date(b.createdAt).toLocaleDateString("vi-VN")
          }
        }));

        const mappedFavorites: BookmarkRecord[] = (favoritesData.data || []).map((f: any) => ({
          id: f.publicationId,
          type: "favorite",
          book: {
            id: f.publication.id,
            title: f.publication.title,
            author: f.publication.author,
            genres: [f.publication.formatType === 2 ? "Truyện Tranh" : "Truyện Chữ"],
            images: f.publication.coverImageUrl,
            coverIndex: 0,
            currentChapter: 1,
            lastUpdated: new Date(f.createdAt).toLocaleDateString("vi-VN")
          }
        }));

        // Sort by date descending
        const combined = [...mappedBookmarks, ...mappedFavorites].sort((a, b) => {
          return new Date(b.book.lastUpdated).getTime() - new Date(a.book.lastUpdated).getTime();
        });

        setBookmarks(combined);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

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

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280", width: "100%" }}>
            Đang tải dữ liệu...
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(6, 1fr)", 
            gap: "28px" 
          }}>
            {bookmarks.length > 0 ? (
              bookmarks.map(record => (
                <BookmarkItem 
                  key={`${record.type}-${record.id}`} 
                  record={record} 
                />
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "40px", color: "#6b7280", width: "100%" }}>
                Chưa có truyện nào được lưu trữ.
              </div>
            )}
          </div>
        )}

      </div>
      
      <Footer />
    </main>
  );
}
