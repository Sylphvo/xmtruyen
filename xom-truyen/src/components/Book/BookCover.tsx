import type { Book } from "../../types";

export default function BookCover({ book, width, height }: { book: Book; width: number | string; height: number | string }) {
  // Đảm bảo đường dẫn này khớp với tên file bạn đã lưu trong public/images/books/
  // Ví dụ: book-1.jpg, book-2.jpg
  const imageUrl = `/src/assets/images/${book.images}.jpg`;

  return (
    <div
      style={{
        width: width,
        height: height,
        borderRadius: "6px",
        overflow: "hidden",
        backgroundColor: "var(--bg-secondary, #e5e7eb)",
        position: "relative",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
        transition: "box-shadow 0.3s ease",
      }}
      className="book-cover-hover"
    >
      <img
        src={imageUrl}
        alt={`Bìa truyện ${book.title}`}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover", // Ép ảnh khít khung mà không lo méo hình
          display: "block",
        }}
        onError={(e) => {
          // Nếu cuốn truyện này chưa có ảnh sẵn, tự động ẩn ảnh lỗi và giữ khung xám tinh tế
          e.currentTarget.style.display = "none";
          e.currentTarget.parentElement!.style.backgroundColor = "#d1d5db";
        }}
      />
    </div>
  );
}