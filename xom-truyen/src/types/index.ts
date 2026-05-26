export interface Book {
  id: number;
  title: string;
  author: string;
  images?: string;
  coverIndex: number;
  // Các trường dữ liệu mới được bổ sung
  genres: string[]; // ví dụ: ["Thám hiểm", "Hài hước"]
  currentChapter: number; // ví dụ: 121
  lastUpdated: string; // ví dụ: "2 giờ trước"
}

export interface SectionData {
  id: string;
  title: string;
  subtitle: string;
  books: Book[];
  size?: "normal" | "large";
}