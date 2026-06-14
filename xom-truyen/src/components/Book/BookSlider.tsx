import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// 1. Đã bỏ Scrollbar, chỉ giữ lại FreeMode
import { FreeMode } from "swiper/modules";

// Import CSS của Swiper
import "swiper/css";
// 2. Đã bỏ import "swiper/css/scrollbar"
import "swiper/css/free-mode";

import BookCard from "./BookCard";
import type { Book } from "../../types";

import "../../styles/BookSlider.css"; // Import CSS tùy chỉnh cho BookSlider

interface BookSliderProps {
  books: Book[];
  size?: "normal" | "large";
}

export default function BookSlider({
  books,
  size = "normal",
}: BookSliderProps) {
  return (
    <div className="py-4">
      <Swiper
        // 3. Đã bỏ Scrollbar khỏi modules
        modules={[FreeMode]}
        spaceBetween={20}
        slidesPerView="auto"
        freeMode={true}
        // 4. Đã xóa toàn bộ đoạn code cấu hình scrollbar={{...}}
        grabCursor={true} // Vẫn giữ icon bàn tay để user biết có thể nắm kéo
        className="comic-swiper"
        style={{ paddingBottom: "16px" }}
      >
        {books.map((book) => (
          <SwiperSlide key={book.id} style={{ width: "auto" }}>
            <BookCard book={book} size={size} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
