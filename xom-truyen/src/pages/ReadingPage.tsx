import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import ReadingHeader from "../components/Reading/ReadingHeader";
import ReadingContent from "../components/Reading/ReadingContent";
import ComicReadingContent from "../components/Reading/ComicReadingContent";
import { useBookDetail } from "../hooks/useBooks";
import { getComicChapters, getChapterContent } from "../services/bookService";

export default function ReadingPage() {
  const { id } = useParams<{ id: string }>();
  const { book, loading: bookLoading } = useBookDetail(id);
  const location = useLocation();
  
  // States for chapters and contents
  const [chapters, setChapters] = useState<any[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [contentLoading, setContentLoading] = useState(false);

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
      getComicChapters(id).then(data => {
        setChapters(data);
        setCurrentChapterIndex(0); // Reset to first chapter
      });
    }
  }, [id]);

  // Fetch chapter content when chapter changes
  useEffect(() => {
    if (chapters.length > 0 && chapters[currentChapterIndex]) {
      const chapterId = chapters[currentChapterIndex].id;
      setContentLoading(true);
      getChapterContent(chapterId).then(data => {
        if (data && data.imageUrls) {
          setImageUrls(data.imageUrls);
        } else {
          setImageUrls([]);
        }
        setContentLoading(false);
      });
    } else {
      setImageUrls([]);
    }
  }, [chapters, currentChapterIndex]);

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
        />
      )}

    </main>
  );
}
