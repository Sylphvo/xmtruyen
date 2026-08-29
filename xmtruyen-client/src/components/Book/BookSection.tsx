import SectionHeader from "../../components/Book/SectionHeader";
import BookSlider from "../../components/Book/BookSlider"; // Import BookSlider thay cho BookCard
import type { SectionData } from "../../types";

export default function BookSection({
  id,
  title,
  subtitle,
  books,
  size = "normal",
  isLoading,
}: SectionData & { isLoading?: boolean }) {
  return (
    <section key={id} style={{ marginBottom: 30 }}>
      <SectionHeader title={title} subtitle={subtitle} />

      <div style={{ marginTop: "16px" }}>
        {books.length > 0 ? (
          <BookSlider books={books} size={size} isLoading={isLoading} />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#888', fontStyle: 'italic' }}>
            hiện tại chưa có sách nào
          </div>
        )}
      </div>
    </section>
  );
}
