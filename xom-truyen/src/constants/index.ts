import type { Book, SectionData } from "../types";

export const ACCENT = "#e84c3d";
export const BG = "var(--bg-primary)";

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
  { id: 1, title: "Đấu Phá Thương Khung", images: "Thuan-Tuy-Bat-Luong", author: "Thiên Tằm Thổ Đậu", coverIndex: 8, genres: ["Tiên Hiệp", "Huyền Huyễn"], currentChapter: 1642, lastUpdated: "1 giờ trước" },
  { id: 2, title: "Phàm Nhân Tu Tiên", images: "Truyen-Tranh-Bia-64-Hinh-07", author: "Vong Ngữ", coverIndex: 1, genres: ["Tiên Hiệp", "Tu Chân"], currentChapter: 2446, lastUpdated: "2 giờ trước" },
  { id: 3, title: "Thế Giới Hoàn Mỹ", images: "Truyen-Tranh-Bia-59-Hinh-02", author: "Thần Đông", coverIndex: 2, genres: ["Huyền Huyễn"], currentChapter: 2014, lastUpdated: "Hôm qua" },
  { id: 4, title: "Đại Chúa Tể", images: "Truyen-Tranh-Bia-69-Hinh-10", author: "Thiên Tằm Thổ Đậu", coverIndex: 3, genres: ["Tiên Hiệp", "Dị Giới"], currentChapter: 1560, lastUpdated: "Hôm qua" },
  { id: 5, title: "Vũ Động Càn Khôn", images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", author: "Thiên Tằm Thổ Đậu", coverIndex: 4, genres: ["Huyền Huyễn", "Dị Giới"], currentChapter: 1308, lastUpdated: "3 ngày trước" },
  { id: 15, title: "Vũ Động Càn Khôn", images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", author: "Thiên Tằm Thổ Đậu", coverIndex: 4, genres: ["Huyền Huyễn", "Dị Giới"], currentChapter: 1308, lastUpdated: "3 ngày trước" },
  { id: 16, title: "Vũ Động Càn Khôn", images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", author: "Thiên Tằm Thổ Đậu", coverIndex: 4, genres: ["Huyền Huyễn", "Dị Giới"], currentChapter: 1308, lastUpdated: "3 ngày trước" },
  { id: 17, title: "Vũ Động Càn Khôn", images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", author: "Thiên Tằm Thổ Đậu", coverIndex: 4, genres: ["Huyền Huyễn", "Dị Giới"], currentChapter: 1308, lastUpdated: "3 ngày trước" },
  { id: 18, title: "Vũ Động Càn Khôn", images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", author: "Thiên Tằm Thổ Đậu", coverIndex: 4, genres: ["Huyền Huyễn", "Dị Giới"], currentChapter: 1308, lastUpdated: "3 ngày trước" },
  { id: 19, title: "Vũ Động Càn Khôn", images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", author: "Thiên Tằm Thổ Đậu", coverIndex: 4, genres: ["Huyền Huyễn", "Dị Giới"], currentChapter: 1308, lastUpdated: "3 ngày trước" },
];
// Mảng Sách Đề Xuất (ID 20 - 39)
export const RECOMMENDED_BOOKS: Book[] = [
  { id: 20, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Phàm Nhân Tu Tiên", author: "Vong Ngữ", coverIndex: 0, genres: ["Tiên Hiệp", "Tu Chân"], currentChapter: 2446, lastUpdated: "2 giờ trước" },
  { id: 21, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Đấu Phá Thương Khung", author: "Thiên Tàm Thổ Đậu", coverIndex: 1, genres: ["Huyền Huyễn", "Dị Giới"], currentChapter: 1641, lastUpdated: "1 tuần trước" },
  { id: 22, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Thế Giới Hoàn Mỹ", author: "Thần Đông", coverIndex: 2, genres: ["Huyền Huyễn", "Thái Cổ"], currentChapter: 2014, lastUpdated: "Hôm qua" },
  { id: 23, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Nhất Niệm Vĩnh Hằng", author: "Nhĩ Căn", coverIndex: 3, genres: ["Tiên Hiệp", "Hài Hước"], currentChapter: 1314, lastUpdated: "Mới đây" },
  { id: 24, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Già Thiên", author: "Thần Đông", coverIndex: 4, genres: ["Tiên Hiệp", "Kỳ Huyễn"], currentChapter: 1822, lastUpdated: "1 tháng trước" },
  { id: 25, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Đấu La Đại Lục", author: "Đường Gia Tam Thiếu", coverIndex: 5, genres: ["Huyền Huyễn", "Trùng Sinh"], currentChapter: 336, lastUpdated: "3 tuần trước" },
  { id: 26, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Vũ Động Càn Khôn", author: "Thiên Tàm Thổ Đậu", coverIndex: 6, genres: ["Huyền Huyễn", "Tu Luyện"], currentChapter: 1309, lastUpdated: "2 tháng trước" },
  { id: 27, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Thôn Phệ Tinh Không", author: "Ngã Cật Tây Hồng Thị", coverIndex: 7, genres: ["Khoa Huyễn", "Tu Chân"], currentChapter: 1486, lastUpdated: "Hôm kia" },
  { id: 28, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Kiếm Lai", author: "Phong Hỏa Hí Chư Hầu", coverIndex: 8, genres: ["Tiên Hiệp", "Kiếm Hiệp"], currentChapter: 1125, lastUpdated: "12 giờ trước" },
  { id: 29, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Bàn Long", author: "Ngã Cật Tây Hồng Thị", coverIndex: 9, genres: ["Huyền Huyễn", "Kỳ Huyễn"], currentChapter: 806, lastUpdated: "3 tháng trước" },
  { id: 30, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Tuyệt Thế Đường Môn", author: "Đường Gia Tam Thiếu", coverIndex: 0, genres: ["Huyền Huyễn", "Dị Giới"], currentChapter: 622, lastUpdated: "4 ngày trước" },
  { id: 31, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Tương Dạ", author: "Miêu Nhị", coverIndex: 1, genres: ["Tiên Hiệp", "Lịch Sử"], currentChapter: 1140, lastUpdated: "2 tuần trước" },
  { id: 32, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Thần Mộ", author: "Thần Đông", coverIndex: 2, genres: ["Huyền Huyễn", "Thần Thoại"], currentChapter: 742, lastUpdated: "5 tháng trước" },
  { id: 33, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Cửu Tinh Bá Thể Quyết", author: "Bình Phàm Ma Thuật Sư", coverIndex: 3, genres: ["Huyền Huyễn", "Xuyên Không"], currentChapter: 5678, lastUpdated: "Vừa xong" },
  { id: 34, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Đại Chúa Tể", author: "Thiên Tàm Thổ Đậu", coverIndex: 4, genres: ["Huyền Huyễn", "Dị Giới"], currentChapter: 1560, lastUpdated: "1 tuần trước" },
  { id: 35, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Tuyết Trung Hãn Đao Hành", author: "Phong Hỏa Hí Chư Hầu", coverIndex: 5, genres: ["Kiếm Hiệp", "Lịch Sử"], currentChapter: 1002, lastUpdated: "2 tháng trước" },
  { id: 36, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Thiên Đạo Thư Viện", author: "Hoành Tảo Thiên Nhai", coverIndex: 6, genres: ["Huyền Huyễn", "Hài Hước"], currentChapter: 2364, lastUpdated: "Hôm qua" },
  { id: 37, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Ma Thiên Ký", author: "Vong Ngữ", coverIndex: 7, genres: ["Tiên Hiệp", "Tu Chân"], currentChapter: 1541, lastUpdated: "3 tuần trước" },
  { id: 38, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Mục Thần Ký", author: "Trạch Trư", coverIndex: 8, genres: ["Huyền Huyễn", "Thần Thoại"], currentChapter: 1836, lastUpdated: "5 ngày trước" },
  { id: 39, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Trọng Sinh Tiêu Dao Đạo", author: "Hắc Huyền", coverIndex: 9, genres: ["Tiên Hiệp", "Trọng Sinh"], currentChapter: 945, lastUpdated: "1 ngày trước" },
];

// Mảng Sách Độc Quyền (ID 40 - 59)
export const EXCLUSIVE_BOOKS: Book[] = [
  { id: 40, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Võ Luyện Điên Phong", author: "Mạc Mặc", coverIndex: 2, genres: ["Huyền Huyễn", "Võ Võng"], currentChapter: 6009, lastUpdated: "1 phút trước" },
  { id: 41, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Nguyên Tôn", author: "Thiên Tàm Thổ Đậu", coverIndex: 3, genres: ["Huyền Huyễn", "Nhiệt Huyết"], currentChapter: 1499, lastUpdated: "Hôm qua" },
  { id: 42, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Linh Vũ Thiên Hạ", author: "Vũ Phong", coverIndex: 4, genres: ["Huyền Huyễn", "Dị Giới"], currentChapter: 5024, lastUpdated: "1 tháng trước" },
  { id: 43, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Võ Thần Chúa Tể", author: "Ám Ma Sư", coverIndex: 5, genres: ["Huyền Huyễn", "Trọng Sinh"], currentChapter: 5410, lastUpdated: "Mới đây" },
  { id: 44, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Thánh Khư", author: "Thần Đông", coverIndex: 6, genres: ["Huyền Huyễn", "Mạt Thế"], currentChapter: 1673, lastUpdated: "Hôm kia" },
  { id: 45, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Bách Luyện Thành Thần", author: "Ân Tứ Giải Thoát", coverIndex: 7, genres: ["Huyền Huyễn", "Tu Luyện"], currentChapter: 3951, lastUpdated: "2 giờ trước" },
  { id: 46, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Yêu Thần Ký", author: "Phát Tiêu Đích Oa Ngưu", coverIndex: 8, genres: ["Huyền Huyễn", "Trùng Sinh"], currentChapter: 496, lastUpdated: "5 tháng trước" },
  { id: 47, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Tuyệt Thế Vũ Thần", author: "Tịnh Vô Ngân", coverIndex: 9, genres: ["Huyền Huyễn", "Dị Thế"], currentChapter: 2500, lastUpdated: "1 tuần trước" },
  { id: 48, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Vạn Cổ Thần Đế", author: "Phi Thiên Ngư", coverIndex: 0, genres: ["Huyền Huyễn", "Thần Đạo"], currentChapter: 4005, lastUpdated: "Hôm nay" },
  { id: 49, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Phi Thiên", author: "Dược Thiên Sầu", coverIndex: 1, genres: ["Tiên Hiệp", "Huyền Ảo"], currentChapter: 2167, lastUpdated: "2 tuần trước" },
  { id: 50, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Đạo Quân", author: "Dược Thiên Sầu", coverIndex: 2, genres: ["Tiên Hiệp", "Mưu Lược"], currentChapter: 1530, lastUpdated: "1 tháng trước" },
  { id: 51, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Sử Thượng Tối Cường Tông Chủ", author: "Yểm Tôn", coverIndex: 3, genres: ["Huyền Huyễn", "Hệ Thống"], currentChapter: 888, lastUpdated: "3 ngày trước" },
  { id: 52, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Siêu Cấp Thần Cơ Dữ", author: "Thập Nhị Dực Ám Thiên Sứ", coverIndex: 4, genres: ["Khoa Huyễn", "Tu Luyện"], currentChapter: 3462, lastUpdated: "4 tuần trước" },
  { id: 53, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Toàn Chức Nghệ Thuật Gia", author: "Ngã Tối Bạch", coverIndex: 5, genres: ["Đô Thị", "Hệ Thống"], currentChapter: 1120, lastUpdated: "Hôm qua" },
  { id: 54, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Chúa Tể Chi Vương", author: "Khoái Can Tiêu Tiêu", coverIndex: 6, genres: ["Huyền Huyễn", "Xuyên Không"], currentChapter: 1585, lastUpdated: "6 tháng trước" },
  { id: 55, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Tinh Môn", author: "Lão Ưng Cật Tiểu Kê", coverIndex: 7, genres: ["Đô Thị", "Dị Năng"], currentChapter: 940, lastUpdated: "5 ngày trước" },
  { id: 56, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Vạn Tướng Chi Vương", author: "Thiên Tàm Thổ Đậu", coverIndex: 8, genres: ["Huyền Huyễn", "Nhiệt Huyết"], currentChapter: 850, lastUpdated: "Hôm nay" },
  { id: 57, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Cửu Đỉnh Ký", author: "Ngã Cật Tây Hồng Thị", coverIndex: 9, genres: ["Tiên Hiệp", "Kiếm Hiệp"], currentChapter: 585, lastUpdated: "1 năm trước" },
  { id: 58, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Chân Linh Cửu Biến", author: "Thụy Thu", coverIndex: 0, genres: ["Tiên Hiệp", "Tu Chân"], currentChapter: 1640, lastUpdated: "2 tháng trước" },
  { id: 59, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Kiếm Động Cửu Thiên", author: "Cô Đơn Địa Phi", coverIndex: 1, genres: ["Huyền Huyễn", "Kiếm Đạo"], currentChapter: 1102, lastUpdated: "3 tháng trước" },
];

// Mảng Sách Đánh Giá Cao (ID 60 - 79)
export const RATED_BOOKS: Book[] = [
  { id: 60, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Toàn Chức Pháp Sư", author: "Loạn", coverIndex: 5, genres: ["Đô Thị", "Ma Pháp"], currentChapter: 3233, lastUpdated: "Hôm qua" },
  { id: 61, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Tu Chân Liêu Thiên Quần", author: "Truyền Thuyết Chi Lão Hổ", coverIndex: 6, genres: ["Đô Thị", "Hài Hước"], currentChapter: 3172, lastUpdated: "Hôm kia" },
  { id: 62, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Ta Bị Nhốt Cùng Một Ngày Mười Vạn Năm", author: "Khuyết Danh", coverIndex: 7, genres: ["Đô Thị", "Hệ Thống"], currentChapter: 504, lastUpdated: "1 tuần trước" },
  { id: 63, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Người Tìm Xác", author: "Lạc Lâm Lang", coverIndex: 8, genres: ["Linh Dị", "Trinh Thám"], currentChapter: 1205, lastUpdated: "2 tháng trước" },
  { id: 64, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Thần Y Đích Nữ", author: "Dương Thập Lục", coverIndex: 9, genres: ["Ngôn Tình", "Xuyên Không"], currentChapter: 1300, lastUpdated: "3 tuần trước" },
  { id: 65, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Quỷ Bí Chi Chủ", author: "Mực Thích Lặn Nước", coverIndex: 0, genres: ["Kỳ Huyễn", "Bí Ẩn"], currentChapter: 1432, lastUpdated: "1 năm trước" },
  { id: 66, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Tối Cường Phản Phái Hệ Thống", author: "Phong Thất Nguyệt", coverIndex: 1, genres: ["Huyền Huyễn", "Hệ Thống"], currentChapter: 1600, lastUpdated: "4 tháng trước" },
  { id: 67, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Vạn Cổ Đệ Nhất Thần", author: "Phong Thanh Dương", coverIndex: 2, genres: ["Huyền Huyễn", "Dị Giới"], currentChapter: 2150, lastUpdated: "Mới đây" },
  { id: 68, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Tối Cường Khí Thiếu", author: "Càn Trấn", coverIndex: 3, genres: ["Đô Thị", "Tu Tiên"], currentChapter: 2420, lastUpdated: "5 tháng trước" },
  { id: 69, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Bắt Đầu Đánh Dấu Hoang Cổ Thánh Thể", author: "J Cửu Thiên Tuế", coverIndex: 4, genres: ["Huyền Huyễn", "Hệ Thống"], currentChapter: 1200, lastUpdated: "12 giờ trước" },
  { id: 70, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Đỉnh Cấp Khí Vận, Lặng Lẽ Tu Luyện", author: "Nhâm Ngã Tiếu", coverIndex: 5, genres: ["Tiên Hiệp", "Cẩu Đạo"], currentChapter: 1192, lastUpdated: "Hôm nay" },
  { id: 71, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Chọc Tức Vợ Yêu Mua Một Tặng Một", author: "Quẫn Quẫn Hữu Yêu", coverIndex: 6, genres: ["Ngôn Tình", "Đô Thị"], currentChapter: 2165, lastUpdated: "1 tuần trước" },
  { id: 72, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Cô Vợ Tổng Giám Đốc Xinh Đẹp Của Tôi", author: "Mai Can Thái Thiếu Bính", coverIndex: 7, genres: ["Đô Thị", "Tình Cảm"], currentChapter: 1665, lastUpdated: "1 năm trước" },
  { id: 73, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Đại Phụng Đả Canh Nhân", author: "Mại Báo Tiểu Lang Quân", coverIndex: 8, genres: ["Tiên Hiệp", "Xuyên Không"], currentChapter: 1000, lastUpdated: "3 tháng trước" },
  { id: 74, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Trần Trai Hàng Tập", author: "Minh Nguyệt Thính Phong", coverIndex: 9, genres: ["Kỳ Huyễn", "Linh Dị"], currentChapter: 450, lastUpdated: "4 ngày trước" },
  { id: 75, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Đấu Đấu Sứ", author: "Thâm Tầm", coverIndex: 0, genres: ["Huyền Huyễn", "Hài Hước"], currentChapter: 300, lastUpdated: "Vừa xong" },
  { id: 76, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Siêu Thần Sủng Thú Điếm", author: "Cổ Hi", coverIndex: 1, genres: ["Kỳ Huyễn", "Sủng Thú"], currentChapter: 1605, lastUpdated: "Hôm qua" },
  { id: 77, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Toàn Cầu Cao Võ", author: "Lão Ưng Cật Tiểu Kê", coverIndex: 2, genres: ["Đô Thị", "Nhiệt Huyết"], currentChapter: 1439, lastUpdated: "6 tháng trước" },
  { id: 78, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Khủng Bố Sống Lại", author: "Phật Tiền Hiến Hoa", coverIndex: 3, genres: ["Linh Dị", "Đô Thị"], currentChapter: 1533, lastUpdated: "Mới đây" },
  { id: 79, images: "Truyen-Tranh-Hanh-Dong-TruyenQQ", title: "Sử Thượng Đệ Nhất Tổ Sư Gia", author: "Bát Nguyệt Phi Ưng", coverIndex: 4, genres: ["Tiên Hiệp", "Hệ Thống"], currentChapter: 1248, lastUpdated: "1 tuần trước" },
];

// Lắp ráp lại thành SECTIONS
export const SECTIONS: SectionData[] = [
  { id: "new", title: "Mới Nhất", subtitle: "(Sách Mới)", books: NEW_BOOKS, size: "large" },
  { id: "recommend", title: "Sách Được Đề Xuất", subtitle: "(Xem Thêm)", books: RECOMMENDED_BOOKS, size: "large" },
  { id: "exclusive", title: "Sách Độc Quyền", subtitle: "(Đọc Thêm)", books: EXCLUSIVE_BOOKS, size: "large" },
  { id: "rated", title: "Sách Được Đánh Giá Cao", subtitle: "(Phổ Biến)", books: RATED_BOOKS, size: "large" },
];  