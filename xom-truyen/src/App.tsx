import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";
// import Footer from "./components/Layout/Footer";
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import("./pages"));
const LibraryPage = lazy(() => import("./pages/LibraryPage"));
const ComicPage = lazy(() => import("./pages/ComicPage"));
const SearchPage = lazy(() => import("./pages/SearchPage").then(module => ({ default: module.SearchPage })));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const BookDetailPage = lazy(() => import("./pages/BookDetailPage"));
const ReadingPage = lazy(() => import("./pages/ReadingPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const BookmarkPage = lazy(() => import("./pages/BookmarkPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const WalletPage = lazy(() => import("./pages/WalletPage"));
const SubscriptionPage = lazy(() => import("./pages/SubscriptionPage"));
const CourseListPage = lazy(() => import("./pages/CourseListPage"));
const CourseDetailPage = lazy(() => import("./pages/CourseDetailPage"));
const LearningPage = lazy(() => import("./pages/LearningPage"));
const AudioBookPage = lazy(() => import("./pages/AudioBookPage"));
import { BG } from "./constants";
import { AudioPlayerProvider } from "./context/AudioPlayerContext";
import { MiniPlayer } from "./components/AudioPlayer/MiniPlayer";

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
          overflow: "auto",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
}

import { Toaster } from "react-hot-toast";

// ─── TRẠM ĐIỀU HƯỚNG TRUNG TÂM ───────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AudioPlayerProvider>
        <Toaster position="top-right" />
        <MiniPlayer />
        <Suspense fallback={
          <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyItems: 'center', backgroundColor: '#0f0f1a', color: '#00d4ff' }}>
            <div style={{ margin: 'auto' }}>Đang tải...</div>
          </div>
        }>
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

        {/* Tuyến đường Tìm kiếm */}
        <Route
          path="/search"
          element={
            <MainLayout>
              <SearchPage />
            </MainLayout>
          }
        />

        {/* Tuyến đường Khóa học */}
        <Route
          path="/courses"
          element={
            <MainLayout>
              <CourseListPage />
            </MainLayout>
          }
        />
        <Route
          path="/course/:id"
          element={
            <MainLayout>
              <CourseDetailPage />
            </MainLayout>
          }
        />
        <Route
          path="/course/:id/learn"
          element={
            <ReadingLayout>
              <LearningPage />
            </ReadingLayout>
          }
        />

        {/* Tuyến đường Thư viện sách */}
        <Route
          path="/library"
          element={
            <MainLayout>
              <LibraryPage />
            </MainLayout>
          }
        />

        {/* Tuyến đường Truyện Tranh */}
        <Route
          path="/comics"
          element={
            <MainLayout>
              <ComicPage />
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

        {/* Tuyến đường Nạp xu */}
        <Route
          path="/wallet"
          element={
            <MainLayout>
              <WalletPage />
            </MainLayout>
          }
        />

        {/* Tuyến đường Mua gói VIP */}
        <Route
          path="/subscription"
          element={
            <MainLayout>
              <SubscriptionPage />
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

        {/* Tuyến đường Sách nói */}
        <Route
          path="/audiobook/:publicationId"
          element={
            <MainLayout>
              <AudioBookPage />
            </MainLayout>
          }
        />

        {/* 2. Tuyến đường Đăng nhập: Hiển thị Full-screen độc lập */}
        <Route path="/login" element={<LoginPage />} />

        {/* 3. Tuyến đường Đăng ký: Hiển thị Full-screen độc lập */}
        <Route path="/register" element={<RegisterPage />} />

        {/* 4. Tuyến đường Quên mật khẩu: Hiển thị Full-screen độc lập */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
      </Suspense>
      </AudioPlayerProvider>
    </BrowserRouter>
  );
}
