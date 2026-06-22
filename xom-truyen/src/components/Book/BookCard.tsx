import BookCover from "./BookCover"; // Đảm bảo import đúng đường dẫn
import type { Book } from "../../types";

import { useNavigate } from "react-router-dom";

export default function BookCard({
  book,
  size = "normal",
}: {
  book: Book;
  size?: "normal" | "large";
}) {
  const navigate = useNavigate();
  // Kích thước chuẩn theo thiết kế
  const coverWidth = size === "large" ? 180 : 130;
  const coverHeight = (coverWidth * 4) / 3; // Tỉ lệ 3:4 cho bìa truyện

  return (
    <div
      style={{
        width: coverWidth + 16, // Mở rộng thêm 16px để chứa padding 2 bên (mỗi bên 8px)
        flexShrink: 0,
        backgroundColor: "rgb(245, 241, 235)", // Thêm nền trắng cho card
        padding: "8px", // Khoảng cách lề bên trong
        borderRadius: "8px", // Bo góc card
        // Hiệu ứng đổ bóng mờ siêu nhẹ
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease", // Chuyển động mượt mà
      }}
      onClick={() => navigate(`/book/${book.id}`)}
      // Xử lý hiệu ứng khi rê chuột vào (Hover)
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgb(245, 241, 235)";
      }}
      // Xử lý khi chuột rời đi
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 4px 10px rgb(245, 241, 235), 0 1px 3px rgb(245, 241, 235)";
      }}
    >
      {/* Gọi component BookCover đã làm */}
      <BookCover book={book} width={coverWidth} height={coverHeight} />

      <div style={{ marginTop: 12 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
          {book.title}
        </h3>
        <p style={{ fontSize: 11, color: "#666", margin: "4px 0" }}>
          {book.author}
        </p>
        <div
          style={{
            fontSize: "12px",
            color: "#9CA3AF",
            marginTop: "2px",
            display: "flex",
            justifyContent: "space-between", // Đẩy 2 thông tin ra 2 bên góc
          }}
        >
          <span>Chương {book.currentChapter}</span>
        </div>
      </div>
    </div>
  );
}
