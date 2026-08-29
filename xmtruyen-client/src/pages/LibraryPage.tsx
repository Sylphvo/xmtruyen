import BookSection from "../components/Book/BookSection";
import Footer from "../components/Layout/Footer";
import { useBooks } from "../hooks/useBooks";

export default function LibraryPage() {
  const { sections } = useBooks();

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
