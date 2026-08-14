import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import ReadingHeader from "../components/Reading/ReadingHeader";
import ReadingContent from "../components/Reading/ReadingContent";
import ComicReadingContent from "../components/Reading/ComicReadingContent";
import { useBookDetail } from "../hooks/useBooks";
import { getComicChapters, getTextChapters, getChapterContent, incrementViewCount } from "../services/bookService";
import { saveHistory, toggleBookmark } from "../services/engagementService";
import { Bookmark } from "lucide-react";

export default function ReadingPage() {
  const { id } = useParams<{ id: string }>();
  const { book, loading: bookLoading } = useBookDetail(id);
  const location = useLocation();
  
  // States for chapters and contents
  const [chapters, setChapters] = useState<any[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [textContent, setTextContent] = useState<string>("");
  const [contentLoading, setContentLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Mode toggling
  const isComicFromState = location.state?.isComic;
  const defaultIsComic = isComicFromState !== undefined 
    ? isComicFromState 
    : (book ? (book.formatType === 2 || book.genres?.includes("Truyện tranh")) : false);
    
  const [isComicMode, setIsComicMode] = useState<boolean>(defaultIsComic);

  useEffect(() => {
    if (book) {
      setIsComicMode(defaultIsComic);
    }
  }, [book, defaultIsComic]);

  // Fetch chapters list when id is available
  useEffect(() => {
    if (id) {
      const fetcher = isComicMode ? getComicChapters : getTextChapters;
      fetcher(id).then(data => {
        setChapters(data);
        setCurrentChapterIndex(0); // Reset to first chapter
      });
    }
  }, [id, isComicMode]);

  // Fetch chapter content when chapter changes
  useEffect(() => {
    if (chapters.length > 0 && chapters[currentChapterIndex] && id) {
      const chapterId = chapters[currentChapterIndex].id;
      setContentLoading(true);
      getChapterContent(chapterId).then(data => {
        if (data && data.imageUrls) {
          setImageUrls(data.imageUrls);
        } else {
          setImageUrls([]);
        }
        if (data && data.content) {
          setTextContent(data.content);
        } else {
          setTextContent(chapters[currentChapterIndex].content || "");
        }
        setContentLoading(false);
        
        // Save History (1 for Book, 2 for Comic)
        const chapterType = isComicMode ? 2 : 1;
        saveHistory(id, chapterId, chapterType).catch(() => {});
        // Increment View Count
        incrementViewCount(id).catch(() => {});
      });
    } else {
      setImageUrls([]);
      setTextContent("");
    }
  }, [chapters, currentChapterIndex, id, isComicMode]);

  const handleToggleBookmark = async () => {
    if (chapters.length > 0 && chapters[currentChapterIndex]) {
      const chapterId = chapters[currentChapterIndex].id;
      const chapterType = isComicMode ? 2 : 1;
      try {
        const res = await toggleBookmark(chapterId, chapterType);
        if (res.message === "Added bookmark") {
          setIsBookmarked(true);
          alert("Đã thêm đánh dấu trang!");
        } else {
          setIsBookmarked(false);
          alert("Đã bỏ đánh dấu trang!");
        }
      } catch (err) {
        alert("Vui lòng đăng nhập để đánh dấu trang!");
      }
    }
  };

  const handlePrevPage = () => {
    setCurrentChapterIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentChapterIndex(prev => Math.min(chapters.length - 1, prev + 1));
  };

  const toggleMode = () => {
    setIsComicMode(!isComicMode);
  };

  if (bookLoading) {
    return (
      <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "var(--bg-primary)" }}>
        Đang tải thông tin truyện...
      </main>
    );
  }

  const title = book?.title || "Đang tải...";
  const currentChapter = chapters[currentChapterIndex];
  const chapterNumber = currentChapter?.chapterNumber || (currentChapterIndex + 1);
  const chapterTitle = currentChapter?.title || `Chương ${chapterNumber}`;
  const totalPages = chapters.length || 1;

  return (
    <main style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      backgroundColor: "var(--bg-primary)",
      height: "100%",
      position: "relative"
    }}>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: "20px" }}>
        <div style={{ flex: 1 }}>
          <ReadingHeader title={title} />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            onClick={handleToggleBookmark}
            style={{
              padding: "8px 16px",
              backgroundColor: isBookmarked ? "#f59e0b" : "#4b5563",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <Bookmark size={18} fill={isBookmarked ? "white" : "none"} />
            {isBookmarked ? "Đã Đánh Dấu" : "Đánh Dấu"}
          </button>
          <button 
            onClick={toggleMode}
            style={{
              padding: "8px 16px",
              backgroundColor: isComicMode ? "#4f46e5" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
              whiteSpace: "nowrap"
            }}
          >
            {isComicMode ? "Đang đọc: Truyện Tranh" : "Đang đọc: Truyện Chữ"}
          </button>
        </div>
      </div>

      {contentLoading && chapters.length > 0 ? (
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          Đang tải chương...
        </div>
      ) : isComicMode ? (
        <ComicReadingContent
          chapterNumber={chapterNumber}
          chapterTitle={chapterTitle}
          currentPage={currentChapterIndex + 1}
          totalPages={totalPages}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          imageUrls={imageUrls}
        />
      ) : (
        <ReadingContent
          chapterNumber={chapterNumber}
          chapterTitle={chapterTitle}
          currentPage={currentChapterIndex + 1}
          totalPages={totalPages}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
          textContent={textContent}
        />
      )}

    </main>
  );
}
