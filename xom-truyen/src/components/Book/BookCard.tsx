import BookCover from "./BookCover";
import type { Book } from "../../types";

import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { BookOpen, Heart } from "lucide-react";

export default function BookCard({
  book,
  size: _size = "normal",
}: {
  book: Book;
  size?: "normal" | "large";
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isHovered, setIsHovered] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupSide, setPopupSide] = useState<"left" | "right">("left");
  const [isFavorite, setIsFavorite] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<number | null>(null);
  const leaveTimerRef = useRef<number | null>(null);
  const pointerStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleClick = (e: React.MouseEvent) => {
    const dx = Math.abs(e.clientX - pointerStart.current.x);
    const dy = Math.abs(e.clientY - pointerStart.current.y);
    // Nếu chuột di chuyển quá 5px, tức là đang kéo slider -> bỏ qua click
    if (dx > 5 || dy > 5) {
      e.preventDefault();
      return;
    }
    navigate(`/book/${book.id}`, { state: { from: location.pathname } });
  };

  const handleMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }

    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      if (rect.left + 420 > window.innerWidth - 20) {
        setPopupSide("right");
      } else {
        setPopupSide("left");
      }
    }

    hoverTimerRef.current = window.setTimeout(() => {
      setShowPopup(true);
      setIsHovered(true);
    }, 180);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }

    leaveTimerRef.current = window.setTimeout(() => {
      setShowPopup(false);
      setIsHovered(false);
    }, 150);
  };

  const handlePopupMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  };

  const handlePopupMouseLeave = () => {
    leaveTimerRef.current = window.setTimeout(() => {
      setShowPopup(false);
      setIsHovered(false);
    }, 150);
  };

  const defaultDescription =
    book.description ||
    "Ăn uống là việc thiết yếu hằng ngày nhưng do nhịp sống hiện đại quá tất bật nên việc ăn uống đôi khi trở nên tốn quá nhiều thời gian, vì vậy lĩnh vực kinh doanh thức ăn nhanh trở nên phát đạt. Tuy nhiên, cách ăn uống như vậy không chỉ không có lợi cho s...";

  return (
    <div
      ref={cardRef}
      style={{
        width: "100%",
        flexShrink: 0,
        backgroundColor: "transparent",
        cursor: "pointer",
        position: "relative",
      }}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thẻ cơ bản mặc định */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "3 / 4",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: isHovered
            ? "0 6px 18px rgba(0,0,0,0.18)"
            : "0 2px 8px rgba(0, 0, 0, 0.08)",
          transition: "box-shadow 0.3s ease, transform 0.3s ease",
        }}
      >
        <BookCover book={book} width="100%" height="100%" />
      </div>

      <div style={{ marginTop: 10 }}>
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            margin: "0 0 4px 0",
            color: "var(--text-primary)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            lineHeight: 1.4,
          }}
        >
          {book.title}
        </h3>
        <p
          style={{
            fontSize: 13,
            color: "var(--text-muted, #777)",
            margin: 0,
            fontWeight: 500,
          }}
        >
          {book.author || `Chương ${book.currentChapter || 1}`}
        </p>
      </div>

      {/* Popover mở rộng khi Hover giống Hình 2 */}
      {showPopup && (
        <div
          onMouseEnter={handlePopupMouseEnter}
          onMouseLeave={handlePopupMouseLeave}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: "-10px",
            left: popupSide === "left" ? "-8px" : "auto",
            right: popupSide === "right" ? "-8px" : "auto",
            width: "410px",
            maxWidth: "92vw",
            backgroundColor: "#20232a",
            borderRadius: "14px",
            padding: "14px 16px",
            display: "flex",
            flexDirection: "row",
            gap: "14px",
            boxShadow:
              "0 20px 40px -4px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.12)",
            zIndex: 10000,
            cursor: "default",
            animation: "bookCardPopIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
            color: "#ffffff",
          }}
        >
          {/* Cột trái: Ảnh bìa */}
          <div
            style={{
              width: "135px",
              flexShrink: 0,
              aspectRatio: "3 / 4",
              borderRadius: "8px",
              overflow: "hidden",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
            }}
            onClick={() =>
              navigate(`/book/${book.id}`, {
                state: { from: location.pathname },
              })
            }
          >
            <BookCover book={book} width="100%" height="100%" />
          </div>

          {/* Cột phải: Thông tin chi tiết + Nút hành động */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minWidth: 0,
            }}
          >
            <div>
              {/* Tiêu đề truyện */}
              <h3
                onClick={() =>
                  navigate(`/book/${book.id}`, {
                    state: { from: location.pathname },
                  })
                }
                style={{
                  color: "#ffffff",
                  margin: "0 0 4px 0",
                  fontSize: "16px",
                  fontWeight: 700,
                  lineHeight: 1.3,
                  cursor: "pointer",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={book.title}
              >
                {book.title}
              </h3>

              {/* Tác giả */}
              <div
                style={{
                  color: "#9ca3af",
                  fontSize: "13px",
                  fontWeight: 500,
                  marginBottom: "8px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {book.author || "Lisa Hark Ph.D - Dr. Darwin Deen"}
              </div>

              {/* Dòng Thể loại / Hội viên & Nút Đọc Sách + Tim */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    color: "#00b96b",
                    fontSize: "13px",
                    fontWeight: 600,
                  }}
                >
                  {book.isMember !== false ? "Hội viên" : (book.genres?.[0] || "Hội viên")}
                </span>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    onClick={() =>
                      navigate(`/book/${book.id}/read`, {
                        state: {
                          isComic:
                            book.genres?.includes("Truyện tranh") ||
                            book.formatType === 2,
                        },
                      })
                    }
                    style={{
                      backgroundColor: "#00b96b",
                      color: "#ffffff",
                      border: "none",
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(0, 185, 107, 0.35)",
                      transition: "background-color 0.2s, transform 0.1s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#00a35c")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#00b96b")
                    }
                  >
                    <BookOpen size={14} color="#ffffff" />
                    Đọc sách
                  </button>

                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    style={{
                      backgroundColor: isFavorite
                        ? "rgba(239, 68, 68, 0.2)"
                        : "rgba(255, 255, 255, 0.12)",
                      border: "none",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                    title={isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
                    onMouseEnter={(e) => {
                      if (!isFavorite)
                        e.currentTarget.style.backgroundColor =
                          "rgba(255, 255, 255, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isFavorite)
                        e.currentTarget.style.backgroundColor =
                          "rgba(255, 255, 255, 0.12)";
                    }}
                  >
                    <Heart
                      size={16}
                      color={isFavorite ? "#ef4444" : "#ffffff"}
                      fill={isFavorite ? "#ef4444" : "none"}
                    />
                  </button>
                </div>
              </div>

              {/* Tóm tắt nội dung */}
              <p
                style={{
                  color: "#d1d5db",
                  fontSize: "12px",
                  lineHeight: 1.5,
                  margin: "0 0 6px 0",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {defaultDescription}
              </p>
            </div>

            {/* Link Chi tiết */}
            <div
              onClick={() =>
                navigate(`/book/${book.id}`, {
                  state: { from: location.pathname },
                })
              }
              style={{
                color: "#00b96b",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                width: "fit-content",
                marginTop: "2px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.textDecoration = "underline")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.textDecoration = "none")
              }
            >
              Chi tiết
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
