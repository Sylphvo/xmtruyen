import React, { useState, useRef, useEffect, useCallback } from "react";
import BookCover from "./BookCover";
import type { Book } from "../../types";

import { useNavigate, useLocation } from "react-router-dom";
import { BookOpen, Heart, Crown } from "lucide-react";

const BookCard = React.memo(function BookCard({
  book,
  size: _size = "normal",
}: {
  book: Book;
  size?: "normal" | "large";
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isHovered, setIsHovered] = useState(false);
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

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const dx = Math.abs(e.clientX - pointerStart.current.x);
    const dy = Math.abs(e.clientY - pointerStart.current.y);
    // Nếu chuột di chuyển quá 5px, tức là đang kéo slider -> bỏ qua click
    if (dx > 5 || dy > 5) {
      e.preventDefault();
      return;
    }
    navigate(`/book/${book.id}`, { state: { from: location.pathname } });
  }, [navigate, book.id, location.pathname]);

  const handleMouseEnter = useCallback(() => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }

    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      if (rect.left + 510 > window.innerWidth - 20) {
        setPopupSide("right");
      } else {
        setPopupSide("left");
      }
    }

    hoverTimerRef.current = window.setTimeout(() => {
      setIsHovered(true);
    }, 70);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }

    leaveTimerRef.current = window.setTimeout(() => {
      setIsHovered(false);
    }, 100);
  }, []);

  const handlePopoverMouseEnter = useCallback(() => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setIsHovered(true);
  }, []);

  const defaultDescription =
    book.description ||
    "Ăn uống là việc thiết yếu hằng ngày nhưng do nhịp sống hiện đại quá tất bật nên việc ăn uống đôi khi trở nên tốn quá nhiều thời gian, vì vậy lĩnh vực kinh doanh thức ăn nhanh trở nên phát đạt. Tuy nhiên, cách ăn uống như vậy không chỉ không có lợi cho s...";

  return (
    <div
      ref={cardRef}
      className="book-card-item"
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Khung bìa mặc định & Container neo Popover */}
      <div className="book-card-cover-container">
        <div className="book-card-cover-wrapper">
          <BookCover book={book} width="100%" height="100%" />

          {/* Badge Hội Viên góc trên bên phải (như hình 1) */}
          {book.isMember !== false && (
            <div className="book-member-badge">
              <span>HỘI VIÊN</span>
              <Crown size={11} color="#ffffff" fill="#ffffff" />
            </div>
          )}
        </div>

        {/* Popover mở rộng khi Hover - Chiều cao khớp hoàn toàn với ảnh bìa */}
        <div
          className={`book-card-popover align-${popupSide} ${
            isHovered ? "popover-visible" : ""
          }`}
          onMouseEnter={handlePopoverMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cột trái: Ảnh bìa (100% chiều cao popover) */}
          <div
            className="popover-cover"
            onClick={() =>
              navigate(`/book/${book.id}`, {
                state: { from: location.pathname },
              })
            }
          >
            <BookCover book={book} width="100%" height="100%" />
          </div>

          {/* Cột phải: Chi tiết & Nút hành động */}
          <div className="popover-content">
            <div>
              {/* Tiêu đề */}
              <h3
                className="popover-title"
                onClick={() =>
                  navigate(`/book/${book.id}`, {
                    state: { from: location.pathname },
                  })
                }
                title={book.title}
              >
                {book.title}
              </h3>

              {/* Tác giả */}
              <div className="popover-author">
                {book.author || "Lisa Hark Ph.D - Dr. Darwin Deen"}
              </div>

              {/* Dòng Hội Viên & Nút Đọc Sách + Tim */}
              <div className="popover-actions-row">
                <span className="popover-tag">
                  {book.isMember !== false
                    ? "Hội viên"
                    : book.genres?.[0] || "Hội viên"}
                </span>

                <div className="popover-btn-group">
                  <button
                    className="popover-btn-read"
                    onClick={() =>
                      navigate(`/book/${book.id}/read`, {
                        state: {
                          isComic:
                            book.genres?.includes("Truyện tranh") ||
                            book.formatType === 2,
                        },
                      })
                    }
                  >
                    <BookOpen size={14} color="#ffffff" />
                    Đọc sách
                  </button>

                  <button
                    className="popover-btn-fav"
                    onClick={() => setIsFavorite(!isFavorite)}
                    title={isFavorite ? "Bỏ yêu thích" : "Yêu thích"}
                    style={{
                      backgroundColor: isFavorite
                        ? "rgba(239, 68, 68, 0.2)"
                        : undefined,
                    }}
                  >
                    <Heart
                      size={16}
                      color={isFavorite ? "#ef4444" : "currentColor"}
                      fill={isFavorite ? "#ef4444" : "none"}
                    />
                  </button>
                </div>
              </div>

              {/* Tóm tắt nội dung */}
              <p className="popover-desc">{defaultDescription}</p>
            </div>

            {/* Link Chi tiết */}
            <div
              className="popover-detail-link"
              onClick={() =>
                navigate(`/book/${book.id}`, {
                  state: { from: location.pathname },
                })
              }
            >
              Chi tiết
            </div>
          </div>
        </div>
      </div>

      {/* Tiêu đề & Thông tin tác giả phía dưới thẻ */}
      <div>
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-author">
          {book.author || `Chương ${book.currentChapter || 1}`}
        </p>
      </div>
    </div>
  );
});

export default BookCard;
