import React, { useState } from "react";
import HistoryItem from "../components/History/HistoryItem";
import type { HistoryRecord } from "../components/History/HistoryItem";
import Footer from "../components/Layout/Footer";

// Mock Data
const MOCK_HISTORY: HistoryRecord[] = [
  {
    id: 1,
    actionType: "Đã đọc",
    readAt: "8/16/23 06:15 PM",
    book: {
      id: 1,
      title: "101 cách cua đổ đại lão hàng xóm",
      author: "Đồng Vũ",
      genres: ["Ngôn tình"],
      images: "mock-book-1",
      coverIndex: 0,
      currentChapter: 25,
      lastUpdated: "Đang cập nhật"
    }
  },
  {
    id: 2,
    actionType: "Đã lưu",
    readAt: "8/16/23 06:13 PM",
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
    id: 3,
    actionType: "Đã thích",
    readAt: "8/16/23 06:13 PM",
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

export default function HistoryPage() {
  const [historyList, setHistoryList] = useState<HistoryRecord[]>(MOCK_HISTORY);

  const handleRemove = (id: number) => {
    setHistoryList(historyList.filter(item => item.id !== id));
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
          {historyList.length > 0 ? (
            historyList.map(record => (
              <HistoryItem 
                key={record.id} 
                record={record} 
                onRemove={handleRemove} 
              />
            ))
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
