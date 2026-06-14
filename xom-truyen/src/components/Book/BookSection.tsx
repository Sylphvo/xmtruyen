import SectionHeader from "../../components/Book/SectionHeader";
import BookSlider from "../../components/Book/BookSlider"; // Import BookSlider thay cho BookCard
import type { SectionData } from "../../types";

export default function BookSection({
  id,
  title,
  subtitle,
  books,
  size = "normal",
}: SectionData) {
  return (
    <section key={id} style={{ marginBottom: 30 }}>
      <SectionHeader title={title} subtitle={subtitle} />

      {/* Sử dụng component BookSlider thay cho div overflow-x thông thường */}
      <div style={{ marginTop: "16px" }}>
        <BookSlider books={books} size={size} />
      </div>
    </section>
  );
}
