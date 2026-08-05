import BookSection from "../components/Book/BookSection";
import Footer from "../components/Layout/Footer";
import { useBooks } from "../hooks/useBooks";

export default function ComicPage() {
  const { sections, comicBooks } = useBooks();

  // If comic books are returned from API, prioritize comic section
  const displaySections = comicBooks.length > 0
    ? [
        {
          id: "comics",
          title: "Truyện Tranh Mới Cập Nhật",
          subtitle: "(Xem Thêm)",
          books: comicBooks,
          size: "large" as const,
        },
        ...sections.filter((s) => s.id !== "new"),
      ]
    : sections;

  return (
    <main style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ padding: "22px 28px" }}>
        <h2 style={{ marginBottom: "24px", color: "var(--text-h)", fontSize: "28px", fontWeight: 700 }}>
          Truyện Tranh
        </h2>
        {displaySections.map((section) => (
          <BookSection key={section.id} {...section} />
        ))}
      </div>
      <Footer />
    </main>
  );
}
