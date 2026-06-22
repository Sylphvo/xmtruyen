import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
// import Footer from "./components/Layout/Footer";
import HomePage from "./pages";
import LoginPage from "./pages/LoginPage"; // <-- Nhớ import trang Login vào đây
import RegisterPage from "./pages/RegisterPage"; // <-- Import thêm trang Register (nếu có)
import BookDetailPage from "./pages/BookDetailPage";
import ReadingPage from "./pages/ReadingPage";
import HistoryPage from "./pages/HistoryPage";
import BookmarkPage from "./pages/BookmarkPage";
import ProfilePage from "./pages/ProfilePage";
import { BG } from "./constants";

// ─── COMPONENT LAYOUT CHÍNH ──────────────────────────────────────────────────
// Gom Sidebar và Header cũ thành một Layout dùng chung cho Trang chủ, Chi tiết truyện,...
function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: BG,
        fontFamily: "'Be Vietnam Pro', 'Segoe UI', Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          position: "relative",
        }}
      >
        <Header />
        {children}
        {/* <Footer /> */}
      </div>
    </div>
  );
}

// ─── COMPONENT LAYOUT ĐỌC SÁCH ───────────────────────────────────────────────
// Dùng riêng cho trang đọc, chỉ có Sidebar, không có Header chính
function ReadingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: BG,
        fontFamily: "'Be Vietnam Pro', 'Segoe UI', Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── TRẠM ĐIỀU HƯỚNG TRUNG TÂM ───────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Tuyến đường trang chủ: Cần có Sidebar + Header bao quanh */}
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />

        {/* Tuyến đường Lịch sử */}
        <Route
          path="/history"
          element={
            <MainLayout>
              <HistoryPage />
            </MainLayout>
          }
        />

        {/* Tuyến đường Lưu trữ / Đánh dấu */}
        <Route
          path="/bookmarks"
          element={
            <MainLayout>
              <BookmarkPage />
            </MainLayout>
          }
        />

        {/* Tuyến đường Cài đặt Profile */}
        <Route
          path="/profile"
          element={
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          }
        />

        {/* Tuyến đường Chi tiết truyện */}
        <Route
          path="/book/:id"
          element={
            <MainLayout>
              <BookDetailPage />
            </MainLayout>
          }
        />

        {/* Tuyến đường Đọc truyện */}
        <Route
          path="/book/:id/read"
          element={
            <ReadingLayout>
              <ReadingPage />
            </ReadingLayout>
          }
        />

        {/* 2. Tuyến đường Đăng nhập: Hiển thị Full-screen độc lập */}
        <Route path="/login" element={<LoginPage />} />

        {/* 3. Tuyến đường Đăng ký: Hiển thị Full-screen độc lập */}
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}
