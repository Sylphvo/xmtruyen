import type { Book, SectionData } from "../types";

export const ACCENT = "#e84c3d";
export const BG = "#f5f1eb";

export const COVER_PALETTES = [
  { bg: "#1c2340", spine: "#2a3a6e", text: "#9bbce8", sub: "#6889b5" },
  { bg: "#2e1835", spine: "#4a2558", text: "#c8a0d8", sub: "#9470a8" },
  { bg: "#0d2e1c", spine: "#154830", text: "#7fd4a0", sub: "#4a9e70" },
  { bg: "#3a1414", spine: "#5e2020", text: "#f09090", sub: "#c06060" },
  { bg: "#14293e", spine: "#1e3e60", text: "#82c2e8", sub: "#5292b8" },
  { bg: "#38280e", spine: "#5a3e15", text: "#e8c870", sub: "#b89840" },
  { bg: "#201040", spine: "#341a62", text: "#b098e8", sub: "#8068b8" },
  { bg: "#0c2e28", spine: "#1a5c50", text: "#88e0d0", sub: "#50b0a0" },
  // BẢNG MÀU MỚI TỪ THIẾT KẾ
  { bg: "#362f26", spine: "#4e4233", text: "#e8e0d4", sub: "#c8b8a8" }, 
];

// Cập nhật mảng Sách Mới
export const NEW_BOOKS: Book[] = [
  { id: 1, title: "Đấu Phá Thương Khung", images:"Thuan-Tuy-Bat-Luong", author: "Thiên Tằm Thổ Đậu", coverIndex: 8, genres: ["Tiên Hiệp", "Huyền Huyễn"], currentChapter: 1642, lastUpdated: "1 giờ trước" },
  { id: 2, title: "Phàm Nhân Tu Tiên", images:"Truyen-Tranh-Bia-64-Hinh-07", author: "Vong Ngữ", coverIndex: 1, genres: ["Tiên Hiệp", "Tu Chân"], currentChapter: 2446, lastUpdated: "2 giờ trước" },
  { id: 3, title: "Thế Giới Hoàn Mỹ", images:"Truyen-Tranh-Bia-59-Hinh-02", author: "Thần Đông", coverIndex: 2, genres: ["Huyền Huyễn"], currentChapter: 2014, lastUpdated: "Hôm qua" },
  { id: 4, title: "Đại Chúa Tể", images:"Truyen-Tranh-Bia-69-Hinh-10", author: "Thiên Tằm Thổ Đậu", coverIndex: 3, genres: ["Tiên Hiệp", "Dị Giới"], currentChapter: 1560, lastUpdated: "Hôm qua" },
  { id: 5, title: "Vũ Động Càn Khôn", images:"Truyen-Tranh-Hanh-Dong-TruyenQQ", author: "Thiên Tằm Thổ Đậu", coverIndex: 4, genres: ["Huyền Huyễn", "Dị Giới"], currentChapter: 1308, lastUpdated: "3 ngày trước" },
  { id: 15, title: "Vũ Động Càn Khôn", images:"Truyen-Tranh-Hanh-Dong-TruyenQQ", author: "Thiên Tằm Thổ Đậu", coverIndex: 4, genres: ["Huyền Huyễn", "Dị Giới"], currentChapter: 1308, lastUpdated: "3 ngày trước" },
  { id: 16, title: "Vũ Động Càn Khôn", images:"Truyen-Tranh-Hanh-Dong-TruyenQQ", author: "Thiên Tằm Thổ Đậu", coverIndex: 4, genres: ["Huyền Huyễn", "Dị Giới"], currentChapter: 1308, lastUpdated: "3 ngày trước" },
  { id: 17, title: "Vũ Động Càn Khôn", images:"Truyen-Tranh-Hanh-Dong-TruyenQQ", author: "Thiên Tằm Thổ Đậu", coverIndex: 4, genres: ["Huyền Huyễn", "Dị Giới"], currentChapter: 1308, lastUpdated: "3 ngày trước" },
  { id: 18, title: "Vũ Động Càn Khôn", images:"Truyen-Tranh-Hanh-Dong-TruyenQQ", author: "Thiên Tằm Thổ Đậu", coverIndex: 4, genres: ["Huyền Huyễn", "Dị Giới"], currentChapter: 1308, lastUpdated: "3 ngày trước" },
  { id: 19, title: "Vũ Động Càn Khôn", images:"Truyen-Tranh-Hanh-Dong-TruyenQQ", author: "Thiên Tằm Thổ Đậu", coverIndex: 4, genres: ["Huyền Huyễn", "Dị Giới"], currentChapter: 1308, lastUpdated: "3 ngày trước" },
];

// Cập nhật mảng Sách Đề Xuất
export const RECOMMENDED_BOOKS: Book[] = [
  { id: 6, title: "Ngã Dục Phong Thiên", author: "Nhĩ Căn", coverIndex: 5, genres: ["Tiên Hiệp", "Tu Chân"], currentChapter: 1614, lastUpdated: "1 tuần trước" },
  { id: 7, title: "Cầu Ma", author: "Nhĩ Căn", coverIndex: 6, genres: ["Tiên Hiệp", "Tu Chân"], currentChapter: 1484, lastUpdated: "2 tuần trước" },
  { id: 8, title: "Tiên Nghịch", author: "Nhĩ Căn", coverIndex: 7, genres: ["Tiên Hiệp", "Tu Chân"], currentChapter: 2088, lastUpdated: "1 tháng trước" },
  { id: 9, title: "Mãng Hoang Kỷ", author: "Ngã Cật Tây Hồng Thị", coverIndex: 8, genres: ["Tiên Hiệp", "Kiếm Hiệp"], currentChapter: 1145, lastUpdated: "1 tháng trước" },
  { id: 10, title: "Tinh Thần Biến", author: "Ngã Cật Tây Hồng Thị", coverIndex: 9, genres: ["Tiên Hiệp", "Kỳ Huyễn"], currentChapter: 681, lastUpdated: "2 tháng trước" },
];

// Cập nhật các mảng khác (Ví dụ thêm vài cuốn)
export const EXCLUSIVE_BOOKS: Book[] = [
  { id: 11, title: "Thần Đạo Đan Tôn", author: "Cô Đơn Địa Phi", coverIndex: 0, genres: ["Huyền Huyễn", "Trọng Sinh"], currentChapter: 5044, lastUpdated: "Mới đây" },
  { id: 12, title: "Đế Bá", author: "Yếm Bút Tiêu Sinh", coverIndex: 1, genres: ["Huyền Huyễn"], currentChapter: 5320, lastUpdated: "5 phút trước" },
];

export const RATED_BOOKS: Book[] = [
  { id: 13, title: "Toàn Chức Pháp Sư", author: "Loạn", coverIndex: 2, genres: ["Đô Thị", "Ma Pháp"], currentChapter: 3233, lastUpdated: "Hôm qua" },
  { id: 14, title: "Tu Chân Liêu Thiên Quần", author: "Truyền Thuyết Chi Lão Hổ", coverIndex: 3, genres: ["Đô Thị", "Hài Hước"], currentChapter: 3172, lastUpdated: "Hôm kia" },
];

// Lắp ráp lại thành SECTIONS
export const SECTIONS: SectionData[] = [
  { id: "new",        title: "Mới Nhất",              subtitle: "(Sách Mới)",     books: NEW_BOOKS, size: "large" },
  { id: "recommend",  title: "Sách Được Đề Xuất",     subtitle: "(Xem Thêm)",     books: RECOMMENDED_BOOKS },
  { id: "exclusive",  title: "Sách Độc Quyền",        subtitle: "(Đọc Thêm)",     books: EXCLUSIVE_BOOKS },
  { id: "rated",      title: "Sách Được Đánh Giá Cao",subtitle: "(Phổ Biến)",     books: RATED_BOOKS },
];  