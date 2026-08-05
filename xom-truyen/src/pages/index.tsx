import BookSection from "../components/Book/BookSection";
import Footer from "../components/Layout/Footer";
import { useBooks } from "../hooks/useBooks";

export default function HomePage() {
  const { sections } = useBooks();

  return (
    <main style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ padding: "22px 28px" }}>
        {sections.map((section) => (
          <BookSection key={section.id} {...section} />
        ))}
      </div>
      <Footer />
    </main>
  );
}
