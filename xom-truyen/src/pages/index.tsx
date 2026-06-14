import { SECTIONS } from "../constants";
import BookSection from "../components/Book/BookSection";
import Footer from "../components/Layout/Footer";

export default function HomePage() {
  return (
    <main style={{ flex: 1, overflowY: "auto" }}>
      <div style={{ padding: "22px 28px" }}>
        {SECTIONS.map((section) => (
          <BookSection key={section.id} {...section} />
        ))}
      </div>
      <Footer />
    </main>
  );
}
