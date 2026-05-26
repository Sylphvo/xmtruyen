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
        backgroundColor: "#e5e7eb", // Nền xám dự phòng khi đang tải ảnh
        position: "relative",
        boxShadow: "-7px 4px 15px 2px rgb(161 161 161)"
      }}
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
      
      {/* Hiệu ứng dải bóng mờ dọc gáy sách bên trái tạo độ sâu 3D chân thực */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: "4px",
          background: "linear-gradient(to right, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.06) 100%)",
        }}
      />
    </div>
  );
}