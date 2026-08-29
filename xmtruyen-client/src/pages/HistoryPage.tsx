import React, { useState, useEffect } from "react";
import HistoryItem from "../components/History/HistoryItem";
import type { HistoryRecord } from "../components/History/HistoryItem";
import { HistoryList } from "../components/History/HistoryList";
import Footer from "../components/Layout/Footer";
import { getHistory, deleteHistory } from "../services/engagementService";

export default function HistoryPage() {
  const [historyList, setHistoryList] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHistory();
        const mapped = (res.data || []).map((h: any) => ({
          id: h.publicationId,
          actionType: "Đã đọc",
          readAt: new Date(h.updatedAt).toLocaleString("vi-VN"),
          book: {
            id: h.publication.id,
            title: h.publication.title,
            author: "Tác giả",
            genres: [h.publication.formatType === 2 ? "Truyện Tranh" : "Truyện Chữ"],
            images: h.publication.coverImageUrl,
            coverIndex: 0,
            currentChapter: h.chapterTitle,
            lastUpdated: new Date(h.updatedAt).toLocaleDateString("vi-VN")
          }
        }));
        setHistoryList(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleRemove = async (id: number) => {
    try {
      await deleteHistory(id.toString());
      setHistoryList(historyList.filter(item => item.id !== id));
    } catch (err) {
      alert("Không thể xóa lịch sử");
    }
  };

  return (
    <main style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "40px 60px", flex: 1, width: "100%" }}>
        
        <h1 style={{ 
          fontSize: "20px", 
          fontWeight: 700, 
          color: "#374151", 
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "40px" 
        }}>
          Lịch sử
        </h1>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {loading ? (
             <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
              Đang tải lịch sử...
            </div>
          ) : historyList.length > 0 ? (
            <HistoryList 
                items={historyList} 
                onRemoveItem={handleRemove} 
            />
          ) : (
            <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
              Chưa có lịch sử đọc truyện.
            </div>
          )}
        </div>

      </div>
      
      <Footer />
    </main>
  );
}
