import { useState, useEffect } from "react";
import { SECTIONS } from "../constants";
import BookSection from "../components/Book/BookSection";
import Footer from "../components/Layout/Footer";
import { useBooks } from "../hooks/useBooks";
import type { SectionData } from "../types";

export default function LibraryPage() {
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
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px", color: "var(--text-h)" }}>Thư viện sách</h1>
        {sections.map((section) => (
          <BookSection key={section.id} {...section} />
        ))}
      </div>
      <Footer />
    </main>
  );
}
