import { useState, useEffect } from "react";
import { SECTIONS } from "../constants";
import BookSection from "../components/Book/BookSection";
import Footer from "../components/Layout/Footer";
import { useBooks } from "../hooks/useBooks";
import type { SectionData } from "../types";

export default function ComicPage() {
  const { latestBooks, loading } = useBooks();
  const [sections, setSections] = useState<SectionData[]>(SECTIONS);

  useEffect(() => {
    if (latestBooks.length > 0) {
      setSections((prev) =>
        prev.map((sec) =>
          sec.id === "new" ? { ...sec, books: latestBooks } : sec
        )
      );
    }
  }, [latestBooks]);

  return (
    <main style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ padding: "22px 28px" }}>
        <h2 style={{ marginBottom: "24px", color: "var(--text-h)", fontSize: "28px", fontWeight: 700 }}>
          Truyện Tranh
        </h2>
        {sections.map((section) => (
          <BookSection key={section.id} {...section} />
        ))}
      </div>
      <Footer />
    </main>
  );
}
