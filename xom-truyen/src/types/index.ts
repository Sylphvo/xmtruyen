export interface Book {
  id: string | number;
  title: string;
  author: string;
  images?: string;
  coverImageUrl?: string;
  coverIndex?: number;

  // Các trường dữ liệu mới được bổ sung
  genres?: string[]; // ví dụ: ["Thám hiểm", "Hài hước"]
  currentChapter?: number; // ví dụ: 121
  lastUpdated?: string; // ví dụ: "2 giờ trước"
  viewCount?: number;
  averageRating?: number;
  slug?: string;
  formatType?: number;
  accessLevel?: number;
  description?: string;
  isMember?: boolean;
}

export interface SectionData {
  id: string;
  title: string;
  subtitle: string;
  books: Book[];
  size?: "normal" | "large";
}

// === AUTH TYPES ===
export interface TLoginRequest {
  email?: string;
  password?: string;
}

export interface TRegisterRequest {
  email?: string;
  password?: string;
  fullName?: string;
}

export interface TUser {
  id?: string;
  email?: string;
  fullName?: string;
  token?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}