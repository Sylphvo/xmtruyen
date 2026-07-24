import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ReadingHeader from "../components/Reading/ReadingHeader";
import ReadingContent from "../components/Reading/ReadingContent";
import ComicReadingContent from "../components/Reading/ComicReadingContent";

export default function ReadingPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;
  const location = useLocation();
  const isComic = location.state?.isComic ?? true; // Defaulting to true for demo if navigated directly

  const handlePrevPage = () => {
    setCurrentPage(Math.max(1, currentPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(Math.min(totalPages, currentPage + 1));
  };

  return (
    <main style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      backgroundColor: "var(--bg-primary)",
      height: "100%",
      position: "relative"
    }}>

      <ReadingHeader title="101 cách cua đổ đại lão hàng xóm" />

      {isComic ? (
        <ComicReadingContent
          chapterNumber={1}
          chapterTitle="Anh cho em uống thuốc?"
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />
      ) : (
        <ReadingContent
          chapterNumber={1}
          chapterTitle="Anh cho em uống thuốc?"
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />
      )}

    </main>
  );
}
