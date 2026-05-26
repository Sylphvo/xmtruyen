import SectionHeader from "../../components/Book/SectionHeader";
import BookCard from "../../components/Book/BookCard";
import type { SectionData } from "../../types";

export default function BookSection({ id, title, subtitle, books, size = "normal" }: SectionData) {
  return (
    <section key={id} style={{ marginBottom: 30 }}>
      <SectionHeader title={title} subtitle={subtitle} />
      <div
        style={{
          display: "flex",
          gap: 14,
          overflowX: "auto",
          padding: "30px 10px",
          scrollbarWidth: "thin",
          scrollbarColor: "#ddd transparent",
        }}
      >
        {books.map((book) => (
          <BookCard key={book.id} book={book} size={size} />
        ))}
      </div>
    </section>
  );
}