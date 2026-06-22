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
        // breakpoints để responsive (Mobile: 3, Tablet: 5, Desktop: 6.5 giống hình)
        breakpoints={{
          0: { slidesPerView: 3.2, spaceBetween: 16 },
          768: { slidesPerView: 4.5, spaceBetween: 20 },
          1024: { slidesPerView: 6.5, spaceBetween: 28 },
        }}
        freeMode={true}
        grabCursor={true} // Vẫn giữ icon bàn tay để user biết có thể nắm kéo
        className="comic-swiper"
        style={{ paddingBottom: "16px", overflow: "visible" }}
      >
        {books.map((book) => (
          <SwiperSlide key={book.id}>
            <BookCard book={book} size={size} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
