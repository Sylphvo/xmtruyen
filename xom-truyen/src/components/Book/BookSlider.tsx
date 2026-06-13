import React from 'react';

// Import thư viện React của Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
// Import module FreeMode để tạo cảm giác vuốt tự do không bị khựng
import { FreeMode } from 'swiper/modules';

// Import CSS mặc định của Swiper (Bắt buộc)
import 'swiper/css';
import 'swiper/css/free-mode';

import BookCard from './BookCard';
import type { Book } from '../../types';

interface BookSliderProps {
  books: Book[];
}

export default function BookSlider({ books }: BookSliderProps) {
  return (
    <div className="py-4">
      <Swiper
        // Bật chế độ vuốt tự do giống hệt trên điện thoại
        modules={[FreeMode]}
        freeMode={true}
        // Khoảng cách giữa các card (16px tương đương với gap-4 của Tailwind)
        spaceBetween={16}
        // Cho phép chiều rộng của slide tự động co giãn theo nội dung thẻ BookCard
        slidesPerView="auto"
        // Cursor báo hiệu cho người dùng biết có thể nắm kéo
        grabCursor={true}
        className="w-full"
      >
        {books.map((book, index) => (
          // SwiperSlide mặc định chiếm 100% chiều rộng, ta phải set width='auto' 
          // để nó ôm sát kích thước của BookCard
          <SwiperSlide key={index} style={{ width: 'auto' }}>
            <BookCard book={book} size="normal" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}