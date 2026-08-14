import { useState, useEffect } from "react";
import type { Book } from "../../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5172";

export function resolveCoverImageUrl(coverImageUrl?: string, images?: string): string {
  if (!coverImageUrl) {
    return images ? `/src/assets/images/${images}.jpg` : "";
  }
  if (
    coverImageUrl.startsWith("http://") ||
    coverImageUrl.startsWith("https://") ||
    coverImageUrl.startsWith("data:") ||
    coverImageUrl.startsWith("/src/")
  ) {
    return coverImageUrl;
  }
  const cleanPath = coverImageUrl.startsWith("/") ? coverImageUrl.slice(1) : coverImageUrl;
  return `${API_BASE_URL}/${cleanPath}`;
}

export default function BookCover({
  book,
  width = "100%",
  height = "100%",
}: {
  book: Book;
  width?: number | string;
  height?: number | string;
}) {
  const imageUrl = resolveCoverImageUrl(book?.coverImageUrl, book?.images);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [imageUrl]);

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
      {imageUrl && !hasError ? (
        <img
          key={imageUrl}
          src={imageUrl}
          alt={`Bìa truyện ${book?.title || ""}`}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
          onError={() => setHasError(true)}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#d1d5db",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6b7280",
            fontSize: "13px",
            fontWeight: 500,
            textAlign: "center",
            padding: "12px",
          }}
        >
          {book?.title || "Không có ảnh"}
        </div>
      )}
    </div>
  );
}