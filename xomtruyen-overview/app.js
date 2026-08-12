/**
 * XÓM TRUYỆN - SYSTEM ARCHITECTURE, WORKFLOW PIPELINES & SOURCE CODE EXPLORER
 * 100% Genuine Workspace Structure, Business Data Workflows & Authentic Code Snippets
 */

// ==========================================================
// 1. DATA DEFINITIONS, WORKFLOWS & CODE SNIPPETS
// ==========================================================

const APP_DATA = {
  // All Node Definitions (Tier 0 Root, Tier 1 Apps, Tier 2 Sub-systems)
  nodes: {
    // Tier 0: Root Ecosystem Hub
    "xomtruyen-hub": {
      id: "xomtruyen-hub",
      title: "HỆ THỐNG XÓM TRUYỆN",
      subtitle: "xomtruyen workspace",
      type: "root",
      color: "cyan",
      category: "Ecosystem Core",
      path: "c:\\Users\\Cilse\\source\\xomtruyen\\XomTruyen_Workspace",
      desc: "Trung tâm điều phối toàn bộ không gian làm việc (Workspace) hệ sinh thái Xóm Truyện: Nền tảng đọc truyện đa nền tảng kết hợp Web Client, Mobile App, Admin Portal, Backend RESTful API và Cơ sở dữ liệu PostgreSQL.",
      stack: ["React 19", ".NET 9", "Ionic 8 / Capacitor", "PostgreSQL", "AG-Grid", "Vite"],
      runCommand: "start-overview.bat",
      ports: "5173 (Web), 5174 (Admin), 8100 (Mobile), 5000 (API)",
      files: [
        "xom-truyen (Web Client / Reader)",
        "xomtruyen-admin (Admin Dashboard)",
        "xomtruyen-app (Mobile App)",
        "xomtruyen.API (ASP.NET Core 9 Web API)",
        "PostgreSQL DB (Database Container)"
      ],
      code: {
        filename: "workspace-structure.json",
        lang: "json",
        expl: "Cấu trúc tổng thể liên kết giữa 4 ứng dụng và tầng lưu trữ PostgreSQL trong Workspace Xóm Truyện.",
        raw: `{
  "workspace": "XomTruyen_Workspace",
  "ecosystem": {
    "webClient": "xom-truyen (React 19 + TypeScript + Vite 8)",
    "adminPortal": "xomtruyen-admin (React 19 + AG-Grid + ApexCharts)",
    "mobileApp": "xomtruyen-app (Ionic 8 + Capacitor 8 + React)",
    "backendApi": "xomtruyen.API (ASP.NET Core 9 + EF Core)",
    "database": "PostgreSQL 16 (18 DbSets Relational Schema)"
  }
}`
      }
    },

    // ----------------------------------------------------
    // Tier 1: Core Apps & Infrastructure
    // ----------------------------------------------------
    "xom-truyen": {
      id: "xom-truyen",
      title: "XOM-TRUYEN",
      subtitle: "web client & reader",
      type: "client",
      color: "cyan",
      category: "Web Client",
      path: "c:\\Users\\Cilse\\source\\xomtruyen\\XomTruyen_Workspace\\xom-truyen",
      desc: "Ứng dụng web đọc truyện cho độc giả cuối viết bằng React 19 + TypeScript + Vite. Cung cấp trải nghiệm đọc truyện chữ & tranh, quản lý dấu trang, lịch sử đọc và thư viện cá nhân.",
      stack: ["React 19.2", "TypeScript", "Vite 8", "React Router 7", "Axios", "Lucide React", "Swiper", "React Hot Toast"],
      runCommand: "npm run dev",
      ports: "http://localhost:5173",
      files: ["src/App.tsx", "src/pages/index.tsx", "src/pages/ReadingPage.tsx", "src/pages/BookDetailPage.tsx"],
      code: {
        filename: "src/App.tsx",
        lang: "tsx",
        expl: "Routing và bố cục chính của Web Client Xóm Truyện bao gồm Trình đọc, Chi tiết sách và Tủ sách.",
        raw: `import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/index";
import ReadingPage from "./pages/ReadingPage";
import BookDetailPage from "./pages/BookDetailPage";
import LibraryPage from "./pages/LibraryPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book/:id" element={<BookDetailPage />} />
        <Route path="/read/:chapterId" element={<ReadingPage />} />
        <Route path="/library" element={<LibraryPage />} />
      </Routes>
    </BrowserRouter>
  );
}`
      }
    },

    "xomtruyen-app": {
      id: "xomtruyen-app",
      title: "XOMTRUYEN-APP",
      subtitle: "ionic & capacitor app",
      type: "mobile",
      color: "green",
      category: "Mobile Client",
      path: "c:\\Users\\Cilse\\source\\xomtruyen\\XomTruyen_Workspace\\xomtruyen-app",
      desc: "Ứng dụng di động đa nền tảng (iOS & Android) xây dựng trên Ionic 8 + Capacitor 8 + React 19. Tối ưu trải nghiệm đọc vuốt chạm, thông báo đẩy, đơn mua và tài khoản cá nhân.",
      stack: ["Ionic 8.5", "Capacitor 8.4", "React 19", "Capacitor Haptics/Status-Bar", "Swiper", "Cypress", "Vitest"],
      runCommand: "npm run dev / npx cap run android",
      ports: "http://localhost:8100",
      files: ["src/App.tsx", "src/pages/Home.tsx", "src/pages/ReadBook.tsx", "capacitor.config.ts"],
      code: {
        filename: "capacitor.config.ts",
        lang: "typescript",
        expl: "Cấu hình Capacitor cho ứng dụng di động Xóm Truyện hỗ trợ iOS & Android.",
        raw: `import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.xomtruyen.app',
  appName: 'Xóm Truyện',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    StatusBar: { style: 'DARK' },
    SplashScreen: { launchAutoHide: true }
  }
};

export default config;`
      }
    },

    "xomtruyen.API": {
      id: "xomtruyen.API",
      title: "XOMTRUYEN.API",
      subtitle: "asp.net core 9 api",
      type: "backend",
      color: "purple",
      category: "Backend API",
      path: "c:\\Users\\Cilse\\source\\xomtruyen\\XomTruyen_Workspace\\xomtruyen.API",
      desc: "Hệ thống backend trung tâm viết bằng C# (.NET 9 Web API), Entity Framework Core với PostgreSQL, xác thực bảo mật JWT Bearer, Upload file 500MB và Background Worker Queue.",
      stack: [".NET 9 (C#)", "ASP.NET Core Web API", "Entity Framework Core", "Npgsql (PostgreSQL)", "JWT Bearer Token", "Scalar / OpenAPI", "BackgroundQueue"],
      runCommand: "dotnet run",
      ports: "http://localhost:5000 / https://localhost:5001 / scalar/v1",
      files: ["Program.cs", "Controllers/AdminPublicationController.cs", "Controllers/ReadingController.cs", "Data/ApplicationDbContext.cs"],
      code: {
        filename: "Program.cs",
        lang: "csharp",
        expl: "Khởi tạo ASP.NET Core 9 Web API, kết nối PostgreSQL, JWT Authentication và Đăng ký BackgroundQueue.",
        raw: `var builder = WebApplication.CreateBuilder(args);

// 1. PostgreSQL Database & EF Core
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. JWT Bearer Token Security
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

// 3. Background Task Processing Queue
builder.Services.AddSingleton<IBackgroundTaskQueue>(new BackgroundTaskQueue(100));
builder.Services.AddHostedService<BookProcessingWorker>();

var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();`
      }
    },

    "xomtruyen-admin": {
      id: "xomtruyen-admin",
      title: "XOMTRUYEN-ADMIN",
      subtitle: "management portal",
      type: "admin",
      color: "amber",
      category: "Admin Portal",
      path: "c:\\Users\\Cilse\\source\\xomtruyen\\XomTruyen_Workspace\\xomtruyen-admin",
      desc: "Trang quản trị toàn diện hệ thống: Quản lý xuất bản phẩm (Sách/Truyện), Tải lên tệp nội dung (Zip/PDF), Quản lý người dùng, Danh mục, Chủ đề, Thống kê biểu đồ và CSDL trực tiếp.",
      stack: ["React 19.2", "Vite 5", "AG-Grid Enterprise 36", "ApexCharts 5", "Chart.js", "Bootstrap 5.3", "React Select", "SCSS"],
      runCommand: "npm run dev",
      ports: "http://localhost:5174",
      files: ["src/pages/Dashboard.tsx", "src/pages/Books.tsx", "src/pages/BookFiles.tsx", "src/pages/Users.tsx"],
      code: {
        filename: "src/pages/Dashboard.tsx",
        lang: "tsx",
        expl: "Trang Dashboard thống kê số liệu và biểu đồ ApexCharts cho ban quản trị.",
        raw: `import React from 'react';
import Chart from 'react-apexcharts';

export const Dashboard: React.FC = () => {
  const chartOptions = {
    chart: { type: 'area', toolbar: { show: false } },
    colors: ['#00e5ff', '#a855f7'],
    stroke: { curve: 'smooth', width: 2 }
  };
  const series = [{ name: 'Lượt đọc', data: [310, 400, 280, 510, 420, 1090, 1200] }];

  return (
    <div className="dashboard-container">
      <h2>Tổng Quan Hệ Thống Xóm Truyện</h2>
      <Chart options={chartOptions} series={series} type="area" height={320} />
    </div>
  );
};`
      }
    },

    "postgres-db": {
      id: "postgres-db",
      title: "POSTGRESQL DATABASE",
      subtitle: "relational db (port 5432)",
      type: "database",
      color: "blue",
      category: "Database & Storage",
      path: "Host=127.0.0.1;Port=5432;Database=xomtruyen",
      desc: "Cơ sở dữ liệu PostgreSQL lưu trữ 18 bảng thực thể (DbSets): Người dùng, Xuất bản phẩm, Chương truyện chữ, Chương truyện tranh, Trang truyện, Lịch sử đọc, Dấu trang, Đánh giá, Giao dịch...",
      stack: ["PostgreSQL 16+", "EF Core Migrations", "18 DbSets Entity Schema", "Npgsql Driver"],
      runCommand: "psql -U postgres -d xomtruyen",
      ports: "5432",
      files: ["DbSets: Users, Publications, BookChapters, ComicChapters", "DbSets: ComicPages, Bookmarks, ReadingHistories, Notes, Reviews"],
      code: {
        filename: "Data/ApplicationDbContext.cs",
        lang: "csharp",
        expl: "Khai báo 18 DbSets trong Entity Framework Core kết nối trực tiếp PostgreSQL.",
        raw: `public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) {}

    public DbSet<SubscriptionPlan> SubscriptionPlans { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Topic> Topics { get; set; }
    public DbSet<Publication> Publications { get; set; }
    public DbSet<PublicationCategory> PublicationCategories { get; set; }
    public DbSet<PublicationTopic> PublicationTopics { get; set; }
    public DbSet<BookChapter> BookChapters { get; set; }
    public DbSet<ComicChapter> ComicChapters { get; set; }
    public DbSet<ComicPage> ComicPages { get; set; }
    public DbSet<Bookmark> Bookmarks { get; set; }
    public DbSet<UserPurchasedChapter> UserPurchasedChapters { get; set; }
    public DbSet<ReadingHistory> ReadingHistories { get; set; }
    public DbSet<UserFavorite> UserFavorites { get; set; }
    public DbSet<UserPublication> UserPublications { get; set; }
    public DbSet<Note> Notes { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<UserToken> UserTokens { get; set; }
}`
      }
    },

    // ----------------------------------------------------
    // Tier 2: Sub-systems attached underneath xom-truyen
    // ----------------------------------------------------
    "web-sub-home": {
      id: "web-sub-home",
      title: "TRANG CHỦ & KHÁM PHÁ",
      subtitle: "index.tsx, BookCard.tsx",
      type: "sub",
      color: "cyan",
      category: "Phân hệ Web",
      path: "xom-truyen\\src\\pages\\index.tsx",
      desc: "Duyệt danh sách sách mới nhất (Latests), sách đề xuất, sách độc quyền và bộ lọc danh mục.",
      stack: ["React 19", "Swiper Slider", "BookCard Component"],
      runCommand: "N/A",
      ports: "Route: /",
      files: ["src/pages/index.tsx", "src/components/Book/BookCard.tsx"],
      code: {
        filename: "src/pages/index.tsx",
        lang: "tsx",
        expl: "Render danh sách truyện mới nhất dạng lưới Responsive sử dụng BookCard Component.",
        raw: `import React, { useEffect, useState } from 'react';
import { BookCard } from '../components/Book/BookCard';
import { getLatestBooks } from '../api/bookApi';

export default function HomePage() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    getLatestBooks().then(res => setBooks(res.data));
  }, []);

  return (
    <div className="home-grid">
      {books.map(book => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}`
      }
    },

    "web-sub-detail": {
      id: "web-sub-detail",
      title: "CHI TIẾT SÁCH",
      subtitle: "BookDetailPage.tsx",
      type: "sub",
      color: "cyan",
      category: "Phân hệ Web",
      path: "xom-truyen\\src\\pages\\BookDetailPage.tsx",
      desc: "Hiển thị thông tin tác giả, danh mục, mô tả, danh sách các chương và điểm đánh giá trung bình.",
      stack: ["BookDetailPage.tsx", "Rating Component", "Chapter List"],
      runCommand: "N/A",
      ports: "Route: /book/:id",
      files: ["src/pages/BookDetailPage.tsx"],
      code: {
        filename: "src/pages/BookDetailPage.tsx",
        lang: "tsx",
        expl: "Tải thông tin chi tiết đầu sách, danh sách chương và nút bấm chuyển nhanh vào Trình đọc.",
        raw: `import { useParams, useNavigate } from 'react-router-dom';

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleStartReading = (firstChapterId: string) => {
    navigate(\`/read/\${firstChapterId}\`);
  };

  return (
    <div className="book-detail">
      <button onClick={() => handleStartReading('chap-1')}>Bắt đầu đọc</button>
    </div>
  );
}`
      }
    },

    "web-sub-reader": {
      id: "web-sub-reader",
      title: "TRÌNH ĐỌC CHỮ & TRANH",
      subtitle: "ReadingPage, ComicPage",
      type: "sub",
      color: "cyan",
      category: "Phân hệ Web",
      path: "xom-truyen\\src\\pages\\ReadingPage.tsx",
      desc: "Trình đọc chuyên dụng cho truyện chữ (ReadingPage) và truyện tranh (ComicPage) với điều hướng chương mượt mà.",
      stack: ["ReadingPage.tsx", "ComicPage.tsx", "Virtual Pagination"],
      runCommand: "N/A",
      ports: "Route: /read/:id, /comic/:id",
      files: ["src/pages/ReadingPage.tsx", "src/pages/ComicPage.tsx"],
      code: {
        filename: "src/pages/ReadingPage.tsx",
        lang: "tsx",
        expl: "Trình đọc truyện tranh & truyện chữ tự động lưu tiến trình và lật trang.",
        raw: `import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ComicReadingContent from "../components/Reading/ComicReadingContent";
import ReadingContent from "../components/Reading/ReadingContent";

export default function ReadingPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;
  const location = useLocation();
  const isComic = location.state?.isComic ?? true;

  const handlePrevPage = () => setCurrentPage(Math.max(1, currentPage - 1));
  const handleNextPage = () => setCurrentPage(Math.min(totalPages, currentPage + 1));

  return (
    <main className="reading-viewport">
      {isComic ? (
        <ComicReadingContent
          chapterNumber={1}
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />
      ) : (
        <ReadingContent chapterNumber={1} currentPage={currentPage} />
      )}
    </main>
  );
}`
      }
    },

    "web-sub-library": {
      id: "web-sub-library",
      title: "TỦ SÁCH & DẤU TRANG",
      subtitle: "Library, Bookmark, History",
      type: "sub",
      color: "cyan",
      category: "Phân hệ Web",
      path: "xom-truyen\\src\\pages\\LibraryPage.tsx",
      desc: "Quản lý sách đã lưu trong thư viện cá nhân, danh sách các dấu trang đã lưu và lịch sử đọc từng chương.",
      stack: ["LibraryPage.tsx", "BookmarkPage.tsx", "HistoryPage.tsx"],
      runCommand: "N/A",
      ports: "Route: /library, /bookmarks, /history",
      files: ["src/pages/LibraryPage.tsx", "src/pages/BookmarkPage.tsx", "src/pages/HistoryPage.tsx"],
      code: {
        filename: "src/pages/LibraryPage.tsx",
        lang: "tsx",
        expl: "Hiển thị danh sách tủ sách yêu thích và lịch sử đọc của người dùng.",
        raw: `export default function LibraryPage() {
  return <div className="library-tabs">Tủ Sách & Dấu Trang Yêu Thích</div>;
}`
      }
    },

    "web-sub-auth": {
      id: "web-sub-auth",
      title: "XÁC THỰC & HỒ SƠ",
      subtitle: "Login, Register, Profile",
      type: "sub",
      color: "cyan",
      category: "Phân hệ Web",
      path: "xom-truyen\\src\\pages\\LoginPage.tsx",
      desc: "Đăng nhập, đăng ký tài khoản mới, quên mật khẩu và quản lý thông tin hồ sơ cá nhân.",
      stack: ["LoginPage.tsx", "RegisterPage.tsx", "ProfilePage.tsx"],
      runCommand: "N/A",
      ports: "Route: /login, /register, /profile",
      files: ["src/pages/LoginPage.tsx", "src/pages/RegisterPage.tsx", "src/pages/ProfilePage.tsx"],
      code: {
        filename: "src/pages/LoginPage.tsx",
        lang: "tsx",
        expl: "Đăng nhập người dùng qua API và lưu JWT Token vào LocalStorage.",
        raw: `import React, { useState } from 'react';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    if (res.data.success) {
      localStorage.setItem('auth_token', res.data.data.token);
      window.location.href = '/';
    }
  };

  return <form onSubmit={handleLogin}><button type="submit">Đăng nhập</button></form>;
}`
      }
    },

    // ----------------------------------------------------
    // Tier 2: Sub-systems attached underneath xomtruyen-app
    // ----------------------------------------------------
    "app-sub-read": {
      id: "app-sub-read",
      title: "TRANG CHỦ & ĐỌC MOBILE",
      subtitle: "Home.tsx, ReadBook.tsx",
      type: "sub",
      color: "green",
      category: "Phân hệ Mobile",
      path: "xomtruyen-app\\src\\pages\\Home.tsx",
      desc: "Màn hình chính trên di động tối ưu cử chỉ vuốt chạm, xem chi tiết sách và đọc nội dung sách.",
      stack: ["Ionic React", "ReadBook.tsx", "BookDetail.tsx", "Swiper"],
      runCommand: "N/A",
      ports: "Route: /home, /read-book/:id",
      files: ["src/pages/Home.tsx", "src/pages/ReadBook.tsx", "src/pages/BookDetail.tsx"],
      code: {
        filename: "src/pages/ReadBook.tsx",
        lang: "tsx",
        expl: "Trình đọc truyện tối ưu cử chỉ vuốt chạm trên Ionic React di động.",
        raw: `import { IonContent, IonPage } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function ReadBook() {
  return (
    <IonPage>
      <IonContent fullscreen>
        <Swiper direction="horizontal" zoom={true}>
          <SwiperSlide><img src="/page-1.jpg" alt="Trang 1" /></SwiperSlide>
          <SwiperSlide><img src="/page-2.jpg" alt="Trang 2" /></SwiperSlide>
        </Swiper>
      </IonContent>
    </IonPage>
  );
}`
      }
    },

    "app-sub-fav-notif": {
      id: "app-sub-fav-notif",
      title: "YÊU THÍCH & THÔNG BÁO",
      subtitle: "Favorites, Notifications",
      type: "sub",
      color: "green",
      category: "Phân hệ Mobile",
      path: "xomtruyen-app\\src\\pages\\Favorites.tsx",
      desc: "Danh sách sách yêu thích và trung tâm thông báo đẩy sự kiện cập nhật chương mới.",
      stack: ["Favorites.tsx", "Notifications.tsx", "Offers.tsx"],
      runCommand: "N/A",
      ports: "Route: /favorites, /notifications",
      files: ["src/pages/Favorites.tsx", "src/pages/Notifications.tsx"],
      code: {
        filename: "src/pages/Notifications.tsx",
        lang: "tsx",
        expl: "Nhận thông báo cập nhật chương truyện mới cho thiết bị di động.",
        raw: `export default function Notifications() {
  return <div>Trung tâm thông báo chương mới</div>;
}`
      }
    },

    "app-sub-order": {
      id: "app-sub-order",
      title: "ĐƠN MUA & LỊCH SỬ",
      subtitle: "OrderHistory, ConfirmOrder",
      type: "sub",
      color: "green",
      category: "Phân hệ Mobile",
      path: "xomtruyen-app\\src\\pages\\OrderHistory.tsx",
      desc: "Theo dõi đơn mua sách, chương truyện đã mua, giỏ hàng và trạng thái xác nhận đơn hàng.",
      stack: ["OrderHistory.tsx", "ConfirmOrder.tsx", "Cart.tsx"],
      runCommand: "N/A",
      ports: "Route: /order-history, /confirm-order",
      files: ["src/pages/OrderHistory.tsx", "src/pages/ConfirmOrder.tsx", "src/pages/Cart.tsx"],
      code: {
        filename: "src/pages/OrderHistory.tsx",
        lang: "tsx",
        expl: "Quản lý đơn hàng mua chương VIP và gói đọc truyện trên ứng dụng di động.",
        raw: `export default function OrderHistory() {
  return <div>Lịch sử giao dịch mua gói & chương VIP</div>;
}`
      }
    },

    "app-sub-auth": {
      id: "app-sub-auth",
      title: "XÁC THỰC DI ĐỘNG & OTP",
      subtitle: "SignIn, SignUp, Verify",
      type: "sub",
      color: "green",
      category: "Phân hệ Mobile",
      path: "xomtruyen-app\\src\\pages\\SignIn.tsx",
      desc: "Đăng nhập, đăng ký bằng email/số điện thoại, xác thực mã OTP, màn hình Onboarding mở đầu.",
      stack: ["SignIn.tsx", "SignUp.tsx", "Verification.tsx", "Onboarding.tsx"],
      runCommand: "N/A",
      ports: "Route: /signin, /signup, /verification",
      files: ["src/pages/SignIn.tsx", "src/pages/SignUp.tsx", "src/pages/Onboarding.tsx"],
      code: {
        filename: "src/pages/SignIn.tsx",
        lang: "tsx",
        expl: "Màn hình đăng nhập di động với OTP và lưu Token vào Capacitor Preferences.",
        raw: `export default function SignIn() {
  return <div>Đăng nhập tài khoản di động</div>;
}`
      }
    },

    // ----------------------------------------------------
    // Tier 2: Sub-systems attached underneath xomtruyen.API
    // ----------------------------------------------------
    "api-sub-pub": {
      id: "api-sub-pub",
      title: "XUẤT BẢN & TẢI TỆP (500MB)",
      subtitle: "AdminPublication, Upload",
      type: "sub",
      color: "purple",
      category: "Phân hệ API",
      path: "xomtruyen.API\\Controllers\\AdminPublicationController.cs",
      desc: "API quản lý sách/truyện tranh, chương và Upload tệp nén Zip/Cbz/Pdf dung lượng tới 500MB đưa vào hàng đợi.",
      stack: ["AdminPublicationController", "AdminComicChapterController", "UploadController"],
      runCommand: "dotnet run",
      ports: "api/admin/publications, api/upload",
      files: ["Controllers/AdminPublicationController.cs", "Controllers/UploadController.cs"],
      code: {
        filename: "Controllers/UploadController.cs",
        lang: "csharp",
        expl: "Tiếp nhận tải lên file nén 500MB và đẩy tác vụ vào BackgroundTaskQueue không gây đơ web.",
        raw: `[Route("api/[controller]")]
[ApiController]
public class UploadController : ControllerBase
{
    private readonly IFileService _fileService;
    private readonly IBackgroundTaskQueue _taskQueue;

    public UploadController(IFileService fileService, IBackgroundTaskQueue taskQueue)
    {
        _fileService = fileService;
        _taskQueue = taskQueue;
    }

    [HttpPost("Publication-file")]
    [RequestSizeLimit(524288000)] // 500 MB limit
    [RequestFormLimits(MultipartBodyLengthLimit = 524288000)]
    public async Task<IActionResult> UploadBookFile(IFormFile file, [FromForm] string PublicationId)
    {
        if (file == null || file.Length == 0) return BadRequest("File không hợp lệ");

        // 1. Lưu file tạm vào thư mục Publication
        var fileUrl = await _fileService.UploadBookFileAsync(file, PublicationId);
        
        // 2. Đẩy vào hàng đợi xử lý nền
        var task = new BookProcessingTask {
            TaskId = Guid.NewGuid().ToString(),
            PublicationId = PublicationId,
            FileName = file.FileName,
            SourceUrl = fileUrl
        };
        await _taskQueue.QueueBackgroundWorkItemAsync(task);

        return Accepted(new { message = "Đã nhận tệp và đang xử lý ngầm", taskId = task.TaskId });
    }
}`
      }
    },

    "api-sub-reading": {
      id: "api-sub-reading",
      title: "DỊCH VỤ ĐỌC SÁCH",
      subtitle: "ReadingController, ReadingService",
      type: "sub",
      color: "purple",
      category: "Phân hệ API",
      path: "xomtruyen.API\\Controllers\\ReadingController.cs",
      desc: "Cung cấp dữ liệu nội dung chương, trang truyện, lưu lại vị trí dấu trang (Bookmark), ghi chú (Note) và lịch sử đọc.",
      stack: ["ReadingController", "IReadingService", "ReadingHistory"],
      runCommand: "dotnet run",
      ports: "api/reading",
      files: ["Controllers/ReadingController.cs", "Services/Implementations/ReadingService.cs"],
      code: {
        filename: "Controllers/ReadingController.cs",
        lang: "csharp",
        expl: "Endpoint cung cấp dữ liệu chương, kiểm tra quyền VIP và lưu vết lịch sử đọc.",
        raw: `[AllowAnonymous]
[HttpGet("chapter/{chapterId}")]
public async Task<ActionResult<ApiResponse<ChapterContentResponse>>> GetChapterContent(Guid chapterId)
{
    try
    {
        Guid? userId = null;
        if (User.Identity != null && User.Identity.IsAuthenticated)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (Guid.TryParse(userIdClaim, out var parsedId))
                userId = parsedId;
        }

        // Tự động kiểm tra quyền đọc VIP/Free và cập nhật ReadingHistories
        var result = await _readingService.GetChapterContentAsync(chapterId, userId);
        return Ok(ApiResponse<ChapterContentResponse>.Ok(result));
    }
    catch (Exception ex)
    {
        return BadRequest(ApiResponse<ChapterContentResponse>.Error(ex.Message));
    }
}`
      }
    },

    "api-sub-auth": {
      id: "api-sub-auth",
      title: "XÁC THỰC JWT & NGƯỜI DÙNG",
      subtitle: "AuthController, AdminUser",
      type: "sub",
      color: "purple",
      category: "Phân hệ API",
      path: "xomtruyen.API\\Controllers\\AuthController.cs",
      desc: "Xác thực đăng nhập, mã hóa mật khẩu BCrypt, cấp phát JWT Bearer Token (1440 phút) và phân quyền quản trị.",
      stack: ["AuthController", "AdminUserController", "IAuthService", "JWT Token"],
      runCommand: "dotnet run",
      ports: "api/auth, api/admin/users",
      files: ["Controllers/AuthController.cs", "Controllers/AdminUserController.cs"],
      code: {
        filename: "Controllers/AuthController.cs",
        lang: "csharp",
        expl: "Kiểm tra mật khẩu băm BCrypt và phát hành JWT Bearer Token có thời hạn 1440 phút.",
        raw: `[HttpPost("login")]
public async Task<ActionResult<ApiResponse<AuthResponse>>> Login([FromBody] LoginRequest request)
{
    try
    {
        var result = await _authService.LoginAsync(request);
        return Ok(ApiResponse<AuthResponse>.Ok(result));
    }
    catch (Exception ex)
    {
        return Unauthorized(ApiResponse<AuthResponse>.Error(ex.Message));
    }
}`
      }
    },

    "api-sub-tax": {
      id: "api-sub-tax",
      title: "DANH MỤC & CHỦ ĐỀ",
      subtitle: "AdminCategory, AdminTopic",
      type: "sub",
      color: "purple",
      category: "Phân hệ API",
      path: "xomtruyen.API\\Controllers\\AdminCategoryController.cs",
      desc: "Quản lý danh mục (Categories), chủ đề (Topics) và API kiểm tra trạng thái sức khỏe hệ thống (SystemController).",
      stack: ["AdminCategoryController", "AdminTopicController", "SystemController"],
      runCommand: "dotnet run",
      ports: "api/admin/categories, api/admin/topics",
      files: ["Controllers/AdminCategoryController.cs", "Controllers/AdminTopicController.cs"],
      code: {
        filename: "Controllers/AdminCategoryController.cs",
        lang: "csharp",
        expl: "Quản lý tạo mới và cập nhật phân loại truyện theo thể loại.",
        raw: `[HttpGet]
public async Task<IActionResult> GetCategories()
{
    var categories = await _context.Categories.AsNoTracking().ToListAsync();
    return Ok(categories);
}`
      }
    },

    "api-sub-db-manager": {
      id: "api-sub-db-manager",
      title: "QUẢN TRỊ CSDL & TRUY VẤN",
      subtitle: "ManagerDBController.cs",
      type: "sub",
      color: "purple",
      category: "Phân hệ API",
      path: "xomtruyen.API\\Controllers\\ManagerDBController.cs",
      desc: "API quản trị CSDL chuyên sâu: Kiểm tra danh sách 18 bảng, cấu trúc cột, số lượng bản ghi và thực thi truy vấn trực tiếp.",
      stack: ["ManagerDBController", "Raw SQL Safe Runner", "Schema Inspector"],
      runCommand: "dotnet run",
      ports: "api/manager-db",
      files: ["Controllers/ManagerDBController.cs"],
      code: {
        filename: "Controllers/ManagerDBController.cs",
        lang: "csharp",
        expl: "Tra cứu thông tin danh sách 18 DbSets và thực thi truy vấn SQL an toàn cho Admin.",
        raw: `[HttpGet("tables")]
public async Task<IActionResult> GetTables()
{
    var sql = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';";
    var tables = await _context.Database.SqlQueryRaw<string>(sql).ToListAsync();
    return Ok(tables);
}`
      }
    },

    "api-sub-worker": {
      id: "api-sub-worker",
      title: "TIẾN TRÌNH XỬ LÝ NGẦM",
      subtitle: "BackgroundTaskQueue, Processors",
      type: "sub",
      color: "purple",
      category: "Phân hệ API",
      path: "xomtruyen.API\\Services\\Background",
      desc: "Hàng đợi xử lý tiến trình ngầm (IBackgroundTaskQueue Channel sức chứa 100 tác vụ) tự động giải nén file Zip/Rar/Cbz và trích xuất PDF.",
      stack: ["BackgroundTaskQueue", "BookProcessingWorker", "PdfBookProcessor", "ArchiveBookProcessor"],
      runCommand: "Integrated Background Service",
      ports: "In-process Background Worker",
      files: ["Services/Background/BackgroundTaskQueue.cs", "Services/Background/BookProcessingWorker.cs"],
      code: {
        filename: "Services/Background/BookProcessingWorker.cs",
        lang: "csharp",
        expl: "Background Worker chạy ngầm giải nén file sách 500MB, cắt trang ảnh và lưu DbSets.",
        raw: `public class BookProcessingWorker : BackgroundService
{
    private readonly IBackgroundTaskQueue _taskQueue;
    private readonly IServiceScopeFactory _scopeFactory;

    public BookProcessingWorker(IBackgroundTaskQueue taskQueue, IServiceScopeFactory scopeFactory)
    {
        _taskQueue = taskQueue;
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var task = await _taskQueue.DequeueAsync(stoppingToken);
            using var scope = _scopeFactory.CreateScope();
            var processor = scope.ServiceProvider.GetRequiredService<IBookProcessor>();
            
            // Giải nén Zip/PDF & trích xuất từng trang ảnh tự động
            await processor.ProcessBookArchiveAsync(task);
        }
    }
}`
      }
    },

    // ----------------------------------------------------
    // Tier 2: Sub-systems attached underneath xomtruyen-admin
    // ----------------------------------------------------
    "admin-sub-books": {
      id: "admin-sub-books",
      title: "QUẢN LÝ SÁCH & TỆP",
      subtitle: "Books.tsx, BookFiles.tsx",
      type: "sub",
      color: "amber",
      category: "Phân hệ Admin",
      path: "xomtruyen-admin\\src\\pages\\Books.tsx",
      desc: "Bảng quản lý xuất bản phẩm trên AG-Grid Enterprise, tải lên tệp zip/pdf, chỉnh sửa chi tiết và quản lý chương.",
      stack: ["Books.tsx", "BookFiles.tsx", "BookDetails.tsx", "AG-Grid Enterprise"],
      runCommand: "N/A",
      ports: "Route: /books, /books/files, /books/:id",
      files: ["src/pages/Books.tsx", "src/pages/BookFiles.tsx", "src/pages/BookDetails.tsx"],
      code: {
        filename: "src/pages/Books.tsx",
        lang: "tsx",
        expl: "Quản lý sách và upload file sách 500MB lên hệ thống qua Admin Portal.",
        raw: `export const Books: React.FC = () => {
  const [data, setData] = useState<IBook[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleUploadBookFile = async (file: File, bookId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('PublicationId', bookId);

    await uploadBookFile(formData, (progress) => {
      setUploadProgress(progress);
    });
    toast.success("Tải tệp 500MB lên hàng đợi ngầm thành công!");
  };

  return <div className="admin-books">Quản lý sách và tệp tin</div>;
};`
      }
    },

    "admin-sub-tax": {
      id: "admin-sub-tax",
      title: "DANH MỤC & CHỦ ĐỀ",
      subtitle: "Categories.tsx, Topics.tsx",
      type: "sub",
      color: "amber",
      category: "Phân hệ Admin",
      path: "xomtruyen-admin\\src\\pages\\Categories.tsx",
      desc: "Quản lý hệ thống phân loại truyện: Danh mục (Categories) và Chủ đề (Topics) với tạo slug tự động.",
      stack: ["Categories.tsx", "Topics.tsx"],
      runCommand: "N/A",
      ports: "Route: /categories, /topics",
      files: ["src/pages/Categories.tsx", "src/pages/Topics.tsx"],
      code: {
        filename: "src/pages/Categories.tsx",
        lang: "tsx",
        expl: "Quản lý thể loại và phân nhóm xuất bản phẩm.",
        raw: `export const Categories = () => <div>Quản lý Thể loại & Chủ đề</div>;`
      }
    },

    "admin-sub-users": {
      id: "admin-sub-users",
      title: "QUẢN TRỊ NGƯỜI DÙNG",
      subtitle: "Users.tsx (AG-Grid)",
      type: "sub",
      color: "amber",
      category: "Phân hệ Admin",
      path: "xomtruyen-admin\\src\\pages\\Users.tsx",
      desc: "Quản lý danh sách tài khoản người dùng, phân quyền quản trị, khóa/mở tài khoản và thông tin gói.",
      stack: ["Users.tsx", "AG-Grid Enterprise"],
      runCommand: "N/A",
      ports: "Route: /users",
      files: ["src/pages/Users.tsx"],
      code: {
        filename: "src/pages/Users.tsx",
        lang: "tsx",
        expl: "Bảng quản lý tài khoản người dùng trên AG-Grid Enterprise.",
        raw: `export const Users = () => <div>Quản lý phân quyền & thành viên</div>;`
      }
    },

    "admin-sub-dashboard": {
      id: "admin-sub-dashboard",
      title: "THỐNG KÊ BIỂU ĐỒ",
      subtitle: "Dashboard.tsx (ApexCharts)",
      type: "sub",
      color: "amber",
      category: "Phân hệ Admin",
      path: "xomtruyen-admin\\src\\pages\\Dashboard.tsx",
      desc: "Bảng tổng quan thống kê số liệu người dùng, đầu sách, chương truyện và biểu đồ tăng trưởng ApexCharts.",
      stack: ["Dashboard.tsx", "ApexCharts", "Chart.js"],
      runCommand: "N/A",
      ports: "Route: /dashboard",
      files: ["src/pages/Dashboard.tsx"],
      code: {
        filename: "src/pages/Dashboard.tsx",
        lang: "tsx",
        expl: "Trực quan hóa biểu đồ doanh thu và lượt đọc trực tiếp từ API.",
        raw: `export const Dashboard = () => <div>Biểu đồ phân tích tăng trưởng</div>;`
      }
    },

    "admin-sub-db-viewer": {
      id: "admin-sub-db-viewer",
      title: "TRÌNH XEM & QUẢN LÝ CSDL",
      subtitle: "Database, TableViewer",
      type: "sub",
      color: "amber",
      category: "Phân hệ Admin",
      path: "xomtruyen-admin\\src\\pages\\Database.tsx",
      desc: "Công cụ trực quan hóa cấu trúc bảng CSDL và xem/sửa dữ liệu trực tiếp trong giao diện quản trị.",
      stack: ["Database.tsx", "DatabaseTableViewer.tsx"],
      runCommand: "N/A",
      ports: "Route: /database, /database/:tableName",
      files: ["src/pages/Database.tsx", "src/pages/DatabaseTableViewer.tsx"],
      code: {
        filename: "src/pages/DatabaseTableViewer.tsx",
        lang: "tsx",
        expl: "Trình duyệt dữ liệu 18 bảng CSDL PostgreSQL trực tiếp trên giao diện Admin.",
        raw: `export const DatabaseTableViewer = () => <div>Trình duyệt dữ liệu bảng trực tiếp</div>;`
      }
    },

    // ----------------------------------------------------
    // Tier 2: Sub-systems attached underneath PostgreSQL DB
    // ----------------------------------------------------
    "db-sub-books": {
      id: "db-sub-books",
      title: "BẢNG SÁCH & CHƯƠNG",
      subtitle: "Publications, Chapters, Pages",
      type: "sub",
      color: "blue",
      category: "Nhóm Bảng CSDL",
      path: "xomtruyen.API\\Data\\ApplicationDbContext.cs",
      desc: "Lưu trữ Publications, PublicationCategories, PublicationTopics, BookChapters, ComicChapters, ComicPages.",
      stack: ["EF Core DbSet", "One-to-Many", "Many-to-Many"],
      runCommand: "N/A",
      ports: "Table Schema",
      files: ["Models/Publication.cs", "Models/BookChapter.cs", "Models/ComicChapter.cs", "Models/ComicPage.cs"],
      code: {
        filename: "Models/ComicPage.cs",
        lang: "csharp",
        expl: "Cấu trúc thực thể lưu trữ từng trang truyện tranh và thứ tự trang.",
        raw: `public class ComicPage
{
    public Guid Id { get; set; }
    public Guid ComicChapterId { get; set; }
    public int PageNumber { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}`
      }
    },

    "db-sub-users": {
      id: "db-sub-users",
      title: "BẢNG NGƯỜI DÙNG & AUTH",
      subtitle: "Users, UserTokens, Plans",
      type: "sub",
      color: "blue",
      category: "Nhóm Bảng CSDL",
      path: "xomtruyen.API\\Data\\ApplicationDbContext.cs",
      desc: "Lưu trữ Users (Email, PasswordHash, FullName, Provider), UserTokens, SubscriptionPlans.",
      stack: ["EF Core DbSet", "JWT Claims Storage"],
      runCommand: "N/A",
      ports: "Table Schema",
      files: ["Models/User.cs", "Models/UserToken.cs", "Models/SubscriptionPlan.cs"],
      code: {
        filename: "Models/User.cs",
        lang: "csharp",
        expl: "Thực thể Người dùng lưu mật khẩu băm BCrypt và thông tin gói tài khoản.",
        raw: `public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public Guid? CurrentPlanId { get; set; }
    public SubscriptionPlan? CurrentPlan { get; set; }
}`
      }
    },

    "db-sub-activity": {
      id: "db-sub-activity",
      title: "BẢNG TƯƠNG TÁC & LỊCH SỬ",
      subtitle: "Histories, Bookmarks, Notes",
      type: "sub",
      color: "blue",
      category: "Nhóm Bảng CSDL",
      path: "xomtruyen.API\\Data\\ApplicationDbContext.cs",
      desc: "Lưu vết hoạt động của người đọc: ReadingHistories, Bookmarks, Notes, Reviews, UserFavorites, UserPublications.",
      stack: ["EF Core DbSet", "Composite Primary Keys"],
      runCommand: "N/A",
      ports: "Table Schema",
      files: ["Models/ReadingHistory.cs", "Models/Bookmark.cs", "Models/Note.cs", "Models/Review.cs"],
      code: {
        filename: "Models/ReadingHistory.cs",
        lang: "csharp",
        expl: "Lưu vết lịch sử đọc và tiến trình trang của độc giả.",
        raw: `public class ReadingHistory
{
    public Guid UserId { get; set; }
    public Guid PublicationId { get; set; }
    public Guid ChapterId { get; set; }
    public int LastReadPage { get; set; }
    public DateTime LastReadAt { get; set; } = DateTime.UtcNow;
}`
      }
    },

    "db-sub-trans": {
      id: "db-sub-trans",
      title: "BẢNG GIAO DỊCH & PHÂN LOẠI",
      subtitle: "Transactions, Categories",
      type: "sub",
      color: "blue",
      category: "Nhóm Bảng CSDL",
      path: "xomtruyen.API\\Data\\ApplicationDbContext.cs",
      desc: "Lưu trữ Transactions, UserPurchasedChapters, Categories, Topics.",
      stack: ["EF Core DbSet", "Financial Ledger"],
      runCommand: "N/A",
      ports: "Table Schema",
      files: ["Models/Transaction.cs", "Models/UserPurchasedChapter.cs", "Models/Category.cs", "Models/Topic.cs"],
      code: {
        filename: "Models/Transaction.cs",
        lang: "csharp",
        expl: "Bảng kế toán lưu vết giao dịch mua chương VIP và nạp tiền.",
        raw: `public class Transaction
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public decimal Amount { get; set; }
    public string TransactionType { get; set; } = string.Empty;
    public string Status { get; set; } = "Completed";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}`
      }
    }
  },

  // Hierarchical Multi-Tier Ecosystem Column Structure
  hierarchy: [
    {
      appId: "xom-truyen",
      subIds: ["web-sub-home", "web-sub-detail", "web-sub-reader", "web-sub-library", "web-sub-auth"]
    },
    {
      appId: "xomtruyen-app",
      subIds: ["app-sub-read", "app-sub-fav-notif", "app-sub-order", "app-sub-auth"]
    },
    {
      appId: "xomtruyen.API",
      subIds: ["api-sub-pub", "api-sub-reading", "api-sub-auth", "api-sub-tax", "api-sub-db-manager", "api-sub-worker"]
    },
    {
      appId: "xomtruyen-admin",
      subIds: ["admin-sub-books", "admin-sub-tax", "admin-sub-users", "admin-sub-dashboard", "admin-sub-db-viewer"]
    },
    {
      appId: "postgres-db",
      subIds: ["db-sub-books", "db-sub-users", "db-sub-activity", "db-sub-trans"]
    }
  ],

  // Concrete Workflow Pipelines & Directory Registry
  flows: {
    "flow-reading": {
      id: "flow-reading",
      stt: "01",
      name: "Luồng Đọc Truyện & Tự Động Lưu Tiến Trình",
      icon: "📖",
      category: "Độc Giả & Dữ Liệu",
      badgeClass: "reader",
      stepsCount: "5 Bước",
      pipelineChips: ["Web / Mobile Reader", "ReadingController", "ReadingService", "PostgreSQL DB", "Render Trình Đọc"],
      desc: "Độc giả mở đọc chương truyện trên Web/Mobile ➔ API ReadingController tiếp nhận và xác thực Token ➔ ReadingService kiểm tra quyền (Free/VIP) ➔ Query BookChapters/ComicPages ➔ Tự động cập nhật ReadingHistories & Bookmarks trong CSDL ➔ Trả JSON hiển thị trình đọc.",
      mode: "pipeline",
      steps: [
        {
          stepNumber: "1",
          stepBadge: "BƯỚC 1: CLIENT YÊU CẦU",
          nodeId: "web-sub-reader",
          color: "cyan",
          lineLabel: "1. GET /api/reading/... (Kèm JWT Token)"
        },
        {
          stepNumber: "2",
          stepBadge: "BƯỚC 2: API CONTROLLER",
          nodeId: "api-sub-reading",
          color: "purple",
          lineLabel: "2. Check Quyền & Gọi ReadingService"
        },
        {
          stepNumber: "3",
          stepBadge: "BƯỚC 3: DATABASE QUERY",
          nodeId: "db-sub-books",
          color: "blue",
          lineLabel: "3. Query BookChapters, ComicPages"
        },
        {
          stepNumber: "4",
          stepBadge: "BƯỚC 4: LƯU LỊCH SỬ & DẤU TRANG",
          nodeId: "db-sub-activity",
          color: "blue",
          lineLabel: "4. Update ReadingHistories & Bookmarks"
        },
        {
          stepNumber: "5",
          stepBadge: "BƯỚC 5: PHẢN HỒI CLIENT",
          nodeId: "app-sub-read",
          color: "green",
          lineLabel: "5. Trả JSON dữ liệu chương/ảnh ➔ Render"
        }
      ],
      codeFiles: [
        {
          name: "ReadingController.cs",
          badge: "Backend Controller (C#)",
          expl: "Tiếp nhận yêu cầu đọc, giải mã JWT Claims lấy UserId và gọi ReadingService.",
          raw: `[AllowAnonymous]
[HttpGet("chapter/{chapterId}")]
public async Task<ActionResult<ApiResponse<ChapterContentResponse>>> GetChapterContent(Guid chapterId)
{
    Guid? userId = null;
    if (User.Identity != null && User.Identity.IsAuthenticated)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (Guid.TryParse(userIdClaim, out var parsedId)) userId = parsedId;
    }

    var result = await _readingService.GetChapterContentAsync(chapterId, userId);
    return Ok(ApiResponse<ChapterContentResponse>.Ok(result));
}`
        },
        {
          name: "ReadingPage.tsx",
          badge: "Web Client (React 19)",
          expl: "Trình đọc truyện tranh & chữ lật trang tự động và đồng bộ tiến trình.",
          raw: `export default function ReadingPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;
  const isComic = true;

  const handleNext = () => setCurrentPage(p => Math.min(totalPages, p + 1));
  const handlePrev = () => setCurrentPage(p => Math.max(1, p - 1));

  return (
    <ComicReadingContent
      chapterNumber={1}
      currentPage={currentPage}
      totalPages={totalPages}
      onPrevPage={handlePrev}
      onNextPage={handleNext}
    />
  );
}`
        },
        {
          name: "ApplicationDbContext.cs",
          badge: "PostgreSQL Entity Schema",
          expl: "Schema lưu vết lịch sử đọc và cấu trúc trang truyện trong CSDL.",
          raw: `public DbSet<ComicChapter> ComicChapters { get; set; }
public DbSet<ComicPage> ComicPages { get; set; }
public DbSet<ReadingHistory> ReadingHistories { get; set; }
public DbSet<Bookmark> Bookmarks { get; set; }`
        }
      ]
    },

    "flow-upload": {
      id: "flow-upload",
      stt: "02",
      name: "Luồng Xuất Bản & Xử Lý Sách Ngầm 500MB",
      icon: "📤",
      category: "Admin & Worker",
      badgeClass: "admin",
      stepsCount: "4 Bước",
      pipelineChips: ["Admin Books Portal", "UploadController (Chunk)", "BackgroundQueue (100)", "BookProcessingWorker", "PostgreSQL DbSets"],
      desc: "Admin tải lên file Zip/PDF 500MB ➔ API UploadController nhận file và đẩy vào hàng đợi IBackgroundTaskQueue ➔ Trả ngay mã HTTP 202 Accepted không gây đơ web ➔ BookProcessingWorker nền giải nén, cắt ảnh từng trang ➔ Tự động lưu vào ComicPages & Publications trong CSDL.",
      mode: "pipeline",
      steps: [
        {
          stepNumber: "1",
          stepBadge: "BƯỚC 1: ADMIN TẢI LÊN",
          nodeId: "admin-sub-books",
          color: "amber",
          lineLabel: "1. POST /api/upload (File Zip/PDF 500MB)"
        },
        {
          stepNumber: "2",
          stepBadge: "BƯỚC 2: API UPLOAD",
          nodeId: "api-sub-pub",
          color: "purple",
          lineLabel: "2. Nhận file tạm & Đẩy vào BackgroundQueue"
        },
        {
          stepNumber: "3",
          stepBadge: "BƯỚC 3: TIẾN TRÌNH XỬ LÝ NGẦM",
          nodeId: "api-sub-worker",
          color: "purple",
          lineLabel: "3. PdfBookProcessor / ArchiveProcessor giải nén"
        },
        {
          stepNumber: "4",
          stepBadge: "BƯỚC 4: LƯU BẢNG SÁCH & TRANG",
          nodeId: "db-sub-books",
          color: "blue",
          lineLabel: "4. Tự động tạo ComicChapters & ComicPages"
        }
      ],
      codeFiles: [
        {
          name: "UploadController.cs",
          badge: "Upload API (500MB Limit)",
          expl: "Tiếp nhận Multipart upload tới 500MB và chuyển tác vụ cho Background Task Queue.",
          raw: `[HttpPost("Publication-file")]
[RequestSizeLimit(524288000)] // 500 MB
[RequestFormLimits(MultipartBodyLengthLimit = 524288000)]
public async Task<IActionResult> UploadBookFile(IFormFile file, [FromForm] string PublicationId)
{
    var fileUrl = await _fileService.UploadBookFileAsync(file, PublicationId);
    var task = new BookProcessingTask {
        TaskId = Guid.NewGuid().ToString(),
        PublicationId = PublicationId,
        SourceUrl = fileUrl
    };
    await _taskQueue.QueueBackgroundWorkItemAsync(task);
    return Accepted(new { message = "Đang xử lý nền...", taskId = task.TaskId });
}`
        },
        {
          name: "BookProcessingWorker.cs",
          badge: "Background Worker Service",
          expl: "Xử lý tiến trình chạy ngầm giải nén file sách và trích xuất từng trang ảnh.",
          raw: `public class BookProcessingWorker : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var task = await _taskQueue.DequeueAsync(stoppingToken);
            await _processor.ProcessBookArchiveAsync(task);
        }
    }
}`
        }
      ]
    },

    "flow-auth": {
      id: "flow-auth",
      stt: "03",
      name: "Luồng Xác Thực & Cấp Quyền JWT Bearer (1440m)",
      icon: "🔐",
      category: "Bảo Mật & Auth",
      badgeClass: "auth",
      stepsCount: "4 Bước",
      pipelineChips: ["Giao Diện Đăng Nhập", "AuthController.cs", "BCrypt & JWT Issuer", "PostgreSQL Users/Tokens", "Client Storage"],
      desc: "Người dùng/Admin nhập email & mật khẩu ➔ AuthController kiểm tra bảng Users ➔ Đối soát hash BCrypt.Verify() ➔ Ký sinh Bearer Token chứa Claims UserId, Role (Admin/User), thời hạn 1440 phút ➔ Ghi nhận UserTokens ➔ Client lưu token và tự gắn Authorization header.",
      mode: "pipeline",
      steps: [
        {
          stepNumber: "1",
          stepBadge: "BƯỚC 1: CLIENT GỬI LOGIN",
          nodeId: "web-sub-auth",
          color: "cyan",
          lineLabel: "1. POST /api/auth/login (Email & Mật khẩu)"
        },
        {
          stepNumber: "2",
          stepBadge: "BƯỚC 2: AUTH CONTROLLER",
          nodeId: "api-sub-auth",
          color: "purple",
          lineLabel: "2. BCrypt.Verify() & Ký JWT Bearer Token"
        },
        {
          stepNumber: "3",
          stepBadge: "BƯỚC 3: DATABASE USERS & TOKENS",
          nodeId: "db-sub-users",
          color: "blue",
          lineLabel: "3. Ghi nhận UserTokens & Lấy thông tin Role"
        },
        {
          stepNumber: "4",
          stepBadge: "BƯỚC 4: CLIENT LƯU TOKEN",
          nodeId: "app-sub-auth",
          color: "green",
          lineLabel: "4. Lưu Bearer Token vào Storage ➔ Ủy quyền API"
        }
      ],
      codeFiles: [
        {
          name: "AuthController.cs",
          badge: "Auth & Security (C#)",
          expl: "Xác thực mật khẩu băm BCrypt và phát hành JWT Token 24h.",
          raw: `[HttpPost("login")]
public async Task<ActionResult<ApiResponse<AuthResponse>>> Login([FromBody] LoginRequest request)
{
    var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
    if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        return Unauthorized(ApiResponse<AuthResponse>.Error("Sai tài khoản hoặc mật khẩu"));

    var token = _jwtService.GenerateToken(user, expireMinutes: 1440);
    return Ok(ApiResponse<AuthResponse>.Ok(new AuthResponse { Token = token }));
}`
        }
      ]
    },

    "flow-transaction": {
      id: "flow-transaction",
      stt: "04",
      name: "Luồng Mua Chương VIP & Giao Dịch Tài Chính",
      icon: "💳",
      category: "Thương Mại & Tiền Tệ",
      badgeClass: "trans",
      stepsCount: "4 Bước",
      pipelineChips: ["Mobile/Web Order", "ReadingController", "PostgreSQL Transactions", "UserPurchasedChapters", "Mở Khóa Chương VIP"],
      desc: "Độc giả click 'Mua chương VIP' hoặc nâng cấp gói ➔ API kiểm tra số dư / gói tài khoản ➔ Tạo bản ghi kế toán vào bảng Transactions ➔ Cấp quyền mở khóa vào bảng UserPurchasedChapters ➔ Trình đọc lập tức cho phép đọc chương VIP ngay lập tức.",
      mode: "pipeline",
      steps: [
        {
          stepNumber: "1",
          stepBadge: "BƯỚC 1: ĐẶT MUA CHƯƠNG VIP",
          nodeId: "app-sub-order",
          color: "green",
          lineLabel: "1. POST /api/reading/purchase-chapter"
        },
        {
          stepNumber: "2",
          stepBadge: "BƯỚC 2: API CHECK & TRỪ TIỀN",
          nodeId: "api-sub-reading",
          color: "purple",
          lineLabel: "2. Kiểm tra Subscription & Trừ số dư"
        },
        {
          stepNumber: "3",
          stepBadge: "BƯỚC 3: GHI SỔ GIAO DỊCH",
          nodeId: "db-sub-trans",
          color: "blue",
          lineLabel: "3. Lưu Transactions & UserPurchasedChapters"
        },
        {
          stepNumber: "4",
          stepBadge: "BƯỚC 4: MỞ KHÓA NỘI DUNG",
          nodeId: "web-sub-reader",
          color: "cyan",
          lineLabel: "4. Mở khóa chương truyện cho độc giả đọc ngay"
        }
      ],
      codeFiles: [
        {
          name: "Transaction.cs",
          badge: "EF Core Transaction Model",
          expl: "Thực thể kế toán ghi nhận giao dịch mua chương VIP và nạp tiền.",
          raw: `public class Transaction
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public decimal Amount { get; set; }
    public string TransactionType { get; set; } = "PurchaseChapter";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}`
        }
      ]
    },

    "flow-admin-db": {
      id: "flow-admin-db",
      stt: "05",
      name: "Luồng Quản Trị CSDL & Bảng Dữ Liệu Trực Tiếp",
      icon: "🛡️",
      category: "Quản Trị & Database",
      badgeClass: "admin",
      stepsCount: "4 Bước",
      pipelineChips: ["DatabaseTableViewer", "ManagerDBController", "PostgreSQL 18 DbSets", "AG-Grid Enterprise"],
      desc: "Admin mở Database Table Viewer ➔ ManagerDBController truy vấn trực tiếp metadata và dữ liệu từ 18 DbSets của EF Core ➔ Trả dữ liệu JSON về Admin ➔ Render lên AG-Grid Enterprise cho phép lọc, tìm kiếm và sửa đổi trực tiếp.",
      mode: "pipeline",
      steps: [
        {
          stepNumber: "1",
          stepBadge: "BƯỚC 1: TRÌNH QUẢN TRỊ ADMIN",
          nodeId: "admin-sub-db-viewer",
          color: "amber",
          lineLabel: "1. GET /api/manager-db/tables, GET data"
        },
        {
          stepNumber: "2",
          stepBadge: "BƯỚC 2: API QUẢN TRỊ CSDL",
          nodeId: "api-sub-db-manager",
          color: "purple",
          lineLabel: "2. Truy vấn Schema & Thực thi Raw SQL an toàn"
        },
        {
          stepNumber: "3",
          stepBadge: "BƯỚC 3: DATABASE 18 DBSETS",
          nodeId: "postgres-db",
          color: "blue",
          lineLabel: "3. EF Core ApplicationDbContext Data"
        },
        {
          stepNumber: "4",
          stepBadge: "BƯỚC 4: AG-GRID ENTERPRISE",
          nodeId: "admin-sub-users",
          color: "amber",
          lineLabel: "4. Render dữ liệu dạng bảng tương tác cao cấp"
        }
      ],
      codeFiles: [
        {
          name: "ManagerDBController.cs",
          badge: "Database Inspector API",
          expl: "Tra cứu danh sách bảng và thực thi truy vấn SQL an toàn cho admin.",
          raw: `[HttpGet("tables")]
public async Task<IActionResult> GetTables()
{
    var sql = "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';";
    var tables = await _context.Database.SqlQueryRaw<string>(sql).ToListAsync();
    return Ok(tables);
}`
        }
      ]
    },

    "multi-tier": {
      id: "multi-tier",
      stt: "00",
      name: "Sơ Đồ Cấu Trúc Toàn Cảnh (Ecosystem Overview)",
      icon: "🌳",
      category: "Toàn Workspace",
      badgeClass: "hub",
      stepsCount: "5 Nhánh Core",
      pipelineChips: ["XomTruyen Hub", "xom-truyen (Web)", "xomtruyen-app (Mobile)", "xomtruyen.API (Backend)", "xomtruyen-admin (Admin)", "PostgreSQL DB"],
      desc: "Bản đồ phân tầng toàn diện toàn bộ không gian làm việc: Gốc Hệ Thống -> 4 Ứng Dụng & CSDL -> Toàn bộ 22 Phân hệ con gắn nối trực tiếp ngay phía dưới.",
      mode: "multi-tier",
      codeFiles: [
        {
          name: "ApplicationDbContext.cs",
          badge: "EF Core 18 DbSets",
          expl: "Toàn bộ 18 DbSets quản lý dữ liệu trong hệ thống Xóm Truyện.",
          raw: `public DbSet<User> Users { get; set; }
public DbSet<Publication> Publications { get; set; }
public DbSet<BookChapter> BookChapters { get; set; }
public DbSet<ComicChapter> ComicChapters { get; set; }
public DbSet<ComicPage> ComicPages { get; set; }
public DbSet<Bookmark> Bookmarks { get; set; }
public DbSet<ReadingHistory> ReadingHistories { get; set; }
public DbSet<Transaction> Transactions { get; set; }`
        }
      ]
    }
  },

  // ----------------------------------------------------
  // SYSTEM EVOLUTION HISTORY & FEATURE DOCUMENTATION DATA
  // ----------------------------------------------------
  changelog: [
    {
      id: "v1.3.0",
      version: "v1.3.0",
      commit: "HEAD",
      date: "05/08/2026 23:45",
      apps: ["Overview Visualizer", "Full Ecosystem"],
      category: "all web api admin mobile db",
      type: "feature",
      typeName: "✨ Tính Năng Mới",
      title: "Bảng Danh Sách Luồng, Lịch Sử Phát Triển & Trình Khám Phá Mã Nguồn",
      summary: "Tích hợp Bảng Danh Sách Luồng Cyber Dark Dashboard, Bảng Lịch Sử Phát Triển Changelog, Cửa sổ Tài liệu Kỹ thuật Chi tiết và Trình xem code thực tế đa tệp.",
      doc: {
        purpose: "Cung cấp cái nhìn toàn cảnh về kiến trúc hệ thống Xóm Truyện, lưu trữ lịch sử nâng cấp mã nguồn của toàn bộ Workspace, hỗ trợ đọc tài liệu đặc tả và kiểm tra code trực tiếp.",
        mechanism: "Hệ thống chuyển đổi giữa Bảng Danh Sách Luồng, Bảng Nhật Ký Phát Triển và Sơ Đồ Trực Quan Pipeline. Tích hợp bộ Highlight Cú Pháp mã nguồn C#/TSX/JSON trực tiếp trên trình duyệt mà không cần cài thêm thư viện ngoài.",
        endpoints: [
          { method: "GET", path: "start-overview.bat", desc: "Khởi chạy ứng dụng tổng quan kiến trúc hệ thống trên trình duyệt mặc định." },
          { method: "GET", path: "xomtruyen-overview/index.html", desc: "Trang chủ Dashboard trực quan hóa kiến trúc và tài liệu." }
        ],
        files: [
          { path: "xomtruyen-overview/index.html", role: "Giao diện chính chứa Bảng Luồng, Nhật ký Changelog, Sơ đồ SVG và các Dialog mã nguồn." },
          { path: "xomtruyen-overview/style.css", role: "Hệ thống CSS Cyberpunk Dark Theme, Custom Neon Glow, Flex/Grid Layout và Syntax Highlighting." },
          { path: "xomtruyen-overview/app.js", role: "Toàn bộ dữ liệu kiến trúc hệ thống, kho mã nguồn thực tế và logic tương tác canvas / modal." }
        ],
        code: {
          filename: "xomtruyen-overview/app.js",
          lang: "javascript",
          expl: "Cấu trúc định nghĩa dữ liệu kiến trúc và bộ phân tích highlight cú pháp.",
          raw: `class ArchitectureVisualizer {
  constructor() {
    this.currentViewMode = "table";
    this.initElements();
    this.bindEvents();
    this.renderTable();
    this.renderChangelogTable("all");
  }

  renderChangelogTable(filter = "all") {
    // Tự động render lịch sử nâng cấp và gắn sự kiện đọc tài liệu chi tiết
  }
}`
        },
        testing: [
          { title: "Bước 1: Mở giao diện tổng quan", detail: "Nhấp đúp chuột vào file start-overview.bat hoặc mở file index.html trên trình duyệt Chrome / Edge." },
          { title: "Bước 2: Chuyển đổi giữa các tab", detail: "Nhấp vào tab 'Lịch Sử Phát Triển & Nhật Ký Thay Đổi' trên thanh điều hướng để xem toàn bộ 08 bản cập nhật." },
          { title: "Bước 3: Xem chi tiết tài liệu", detail: "Nhấp nút [ 📖 Xem Tài Liệu ] tại bất kỳ bản cập nhật nào để mở tài liệu đặc tả, danh sách file và code mẫu." }
        ]
      }
    },
    {
      id: "v1.2.5",
      version: "v1.2.5",
      commit: "5578825",
      date: "05/08/2026 22:15",
      apps: ["xom-truyen (Web Client)"],
      category: "all web",
      type: "feature",
      typeName: "✨ Tính Năng Mới",
      title: "Hover Preview Popover cho Thẻ Truyện (Book Cards)",
      summary: "Thêm Popover hiển thị tóm tắt, tên tác giả, danh mục, số chương và nút đọc nhanh khi rê chuột vào thẻ truyện trên trang chủ Web Client.",
      doc: {
        purpose: "Tăng trải nghiệm người dùng trên Web Client (xom-truyen), cho phép độc giả xem lướt thông tin chi tiết của truyện tranh/tiểu thuyết ngay khi hover chuột mà không cần mở sang trang mới.",
        mechanism: "Sử dụng React Popover với cơ chế debounce hover 150ms để tối ưu hiệu năng render. Popover tự động tính toán vị trí hiển thị (top/bottom/left/right) không bị tràn màn hình.",
        endpoints: [
          { method: "GET", path: "/api/reading/book/{id}/summary", desc: "Lấy thông tin tóm tắt nhanh và các chương mới nhất của sách." }
        ],
        files: [
          { path: "xom-truyen/src/components/BookCard.tsx", role: "Component thẻ truyện tích hợp sự kiện Hover Popover Preview." },
          { path: "xom-truyen/src/pages/index.tsx", role: "Trang chủ hiển thị danh sách lưới sách mới và thịnh hành." }
        ],
        code: {
          filename: "xom-truyen/src/components/BookCard.tsx",
          lang: "typescript",
          expl: "Component xử lý hiển thị popover thông tin sách khi rê chuột.",
          raw: `export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => setIsHovered(true), 150);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsHovered(false);
  };

  return (
    <div className="book-card-container" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <img src={book.coverUrl} alt={book.title} className="book-cover" />
      {isHovered && (
        <div className="book-preview-popover animate-fade-in">
          <h4>{book.title}</h4>
          <p className="author">Tác giả: {book.author}</p>
          <p className="summary">{book.summary}</p>
          <button className="quick-read-btn">Đọc Ngay Chương 1</button>
        </div>
      )}
    </div>
  );
};`
        },
        testing: [
          { title: "Bước 1: Khởi động Web Client", detail: "Mở terminal chạy lệnh 'npm run dev' trong thư mục xom-truyen." },
          { title: "Bước 2: Mở trình duyệt", detail: "Truy cập http://localhost:5173 và rê chuột vào bất kỳ bìa truyện nào." },
          { title: "Bước 3: Kiểm tra hiển thị", detail: "Xác nhận popup hiển thị đầy đủ thông tin tóm tắt và nút Đọc Ngay." }
        ]
      }
    },
    {
      id: "v1.2.0",
      version: "v1.2.0",
      commit: "112d6eb",
      date: "04/08/2026 18:30",
      apps: ["xomtruyen-app (Mobile)"],
      category: "all mobile",
      type: "optimization",
      typeName: "⚡ Tối Ưu Mobile",
      title: "Hoàn Thiện Giao Diện Di Động Ionic 8 & Capacitor 8",
      summary: "Cập nhật cấu hình Capacitor và hoàn thiện các màn hình di động: Home, Đọc Truyện (ReadBook), Yêu Thích (Favorites), Đơn Hàng (OrderHistory) và Rung Haptics.",
      doc: {
        purpose: "Đồng bộ trải nghiệm đọc truyện trên thiết bị di động iOS và Android thông qua Capacitor 8 Native Bridge và Ionic Framework React 19.",
        mechanism: "Trang bị thanh trạng thái trong suốt (StatusBar Overlay), cử chỉ vuốt lật trang mượt mà (Touch Swiper) và phản hồi xúc giác (Haptics Impact) khi đổi chương.",
        endpoints: [
          { method: "GET", path: "/api/reading/mobile/sync", desc: "Đồng bộ tiến trình đọc và danh sách yêu thích giữa Mobile và Server." }
        ],
        files: [
          { path: "xomtruyen-app/capacitor.config.ts", role: "Cấu hình Native App ID, Plugins SplashScreen, StatusBar, Haptics." },
          { path: "xomtruyen-app/src/pages/ReadBook.tsx", role: "Giao diện đọc truyện di động tối ưu cảm ứng và chế độ ban đêm." }
        ],
        code: {
          filename: "xomtruyen-app/src/pages/ReadBook.tsx",
          lang: "typescript",
          expl: "Khai báo phản hồi xúc giác Haptics và điều khiển vuốt chương trên thiết bị di động.",
          raw: `import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/react';

export const ReadBookPage: React.FC = () => {
  const triggerNextChapter = async () => {
    // Rung nhẹ khi chuyển chương
    await Haptics.impact({ style: ImpactStyle.Light });
    loadNextChapter();
  };

  return (
    <IonPage>
      <IonContent fullscreen className="dark-reader-content">
        <div className="comic-page-viewer" onSwipeLeft={triggerNextChapter}>
          {/* Mobile Reading Container */}
        </div>
      </IonContent>
    </IonPage>
  );
};`
        },
        testing: [
          { title: "Bước 1: Chạy môi trường Mobile", detail: "Chạy 'npm run dev' trong thư mục xomtruyen-app." },
          { title: "Bước 2: Mở trình duyệt giả lập Mobile", detail: "Mở DevTools F12 trên Chrome, bật chế độ Toggle Device Toolbar (iPhone 14 / Pixel 7)." },
          { title: "Bước 3: Kiểm thử trang đọc", detail: "Kiểm tra thao tác vuốt trang và điều khiển menu đọc." }
        ]
      }
    },
    {
      id: "v1.1.5",
      version: "v1.1.5",
      commit: "e49756f",
      date: "03/08/2026 14:10",
      apps: ["xomtruyen.API", "xomtruyen-admin", "xom-truyen"],
      category: "all api admin web db",
      type: "feature",
      typeName: "✨ Tính Năng Mới",
      title: "Phân Hệ Quản Lý & Đọc Chương Truyện Tranh (Comic Chapter & Pages)",
      summary: "Xây dựng module quản trị chương truyện tranh, bảng lưu trữ ComicChapters & ComicPages trong PostgreSQL và API trả dữ liệu ảnh trang truyện tốc độ cao.",
      doc: {
        purpose: "Hỗ trợ đọc truyện tranh nhiều trang ảnh chất lượng cao kèm theo các công cụ quản lý thứ tự trang, đánh số chương linh hoạt cho ban quản trị.",
        mechanism: "API phân trang ảnh theo từng chương, kết hợp CDN caching header giúp tải ảnh trang truyện nhanh chóng không gián đoạn.",
        endpoints: [
          { method: "GET", path: "/api/reading/chapter/{id}", desc: "Lấy danh sách các trang ảnh của chương truyện tranh." },
          { method: "POST", path: "/api/admin/comic-chapters", desc: "Thêm mới chương và cập nhật danh sách ảnh." }
        ],
        files: [
          { path: "xomtruyen.API/Controllers/ReadingController.cs", role: "Controller xử lý lấy dữ liệu chương và lưu lịch sử đọc." },
          { path: "xomtruyen.API/Models/ComicChapter.cs", role: "Entity định nghĩa bảng ComicChapters trong PostgreSQL." },
          { path: "xomtruyen.API/Models/ComicPage.cs", role: "Entity định nghĩa bảng ComicPages chứa URL ảnh từng trang." }
        ],
        code: {
          filename: "xomtruyen.API/Controllers/ReadingController.cs",
          lang: "csharp",
          expl: "Xử lý trả về danh sách trang ảnh truyện tranh và lưu vị trí đọc hiện tại.",
          raw: `[HttpGet("chapter/{chapterId}")]
public async Task<IActionResult> GetComicChapter(Guid chapterId)
{
    var chapter = await _context.ComicChapters
        .Include(c => c.ComicPages.OrderBy(p => p.PageNumber))
        .FirstOrDefaultAsync(c => c.Id == chapterId);

    if (chapter == null) return NotFound("Chương truyện không tồn tại.");

    // Tự động ghi nhận lịch sử đọc nếu đã đăng nhập
    if (User.Identity?.IsAuthenticated == true) {
        var userId = GetCurrentUserId();
        await _readingService.UpdateProgressAsync(userId, chapter.PublicationId, chapter.Id);
    }

    return Ok(chapter);
}`
        },
        testing: [
          { title: "Bước 1: Gọi API kiểm tra", detail: "Gửi GET request đến https://localhost:5001/api/reading/chapter/{valid_guid}." },
          { title: "Bước 2: Kiểm tra cấu trúc JSON", detail: "Xác nhận mảng ComicPages được sắp xếp đúng theo PageNumber." }
        ]
      }
    },
    {
      id: "v1.1.0",
      version: "v1.1.0",
      commit: "47eef38",
      date: "02/08/2026 11:20",
      apps: ["xomtruyen.API", "xomtruyen-admin"],
      category: "all api admin",
      type: "optimization",
      typeName: "⚡ Tối Ưu & Nền Tảng",
      title: "Tải Lên Tệp Sách 500MB & Hàng Đợi Xử Lý Ngầm (Background Queue)",
      summary: "Hỗ trợ tải lên file Zip/PDF dung lượng lớn đến 500MB, đưa vào Channel IBackgroundTaskQueue sức chứa 100 tác vụ, Worker tự động giải nén và cắt trang ảnh.",
      doc: {
        purpose: "Giải quyết tình trạng nghẽn server và treo trình duyệt khi Admin tải lên các tệp truyện tranh dung lượng cực lớn.",
        mechanism: "Áp dụng RequestSizeLimit(524288000), trả về HTTP 202 Accepted ngay lập tức. BookProcessingWorker chạy ngầm kiểu HostedService đọc tác vụ từ Channel để giải nén không block Web API.",
        endpoints: [
          { method: "POST", path: "/api/upload/book-archive", desc: "Tải lên tệp zip/pdf và nhận JobId xử lý ngầm." },
          { method: "GET", path: "/api/upload/status/{jobId}", desc: "Kiểm tra tiến độ giải nén và xử lý trang ảnh." }
        ],
        files: [
          { path: "xomtruyen.API/Controllers/UploadController.cs", role: "Tiếp nhận file chunk 500MB và đẩy vào Queue." },
          { path: "xomtruyen.API/Services/Background/BackgroundTaskQueue.cs", role: "Channel Queue bounded 100 items." },
          { path: "xomtruyen.API/Services/Background/BookProcessingWorker.cs", role: "Background Service tự động giải nén và ghi CSDL." }
        ],
        code: {
          filename: "xomtruyen.API/Controllers/UploadController.cs",
          lang: "csharp",
          expl: "Tiếp nhận tệp 500MB và đẩy vào hàng đợi IBackgroundTaskQueue.",
          raw: `[HttpPost("book-archive")]
[RequestSizeLimit(524288000)] // 500 MB limit
public async Task<IActionResult> UploadBookArchive([FromForm] IFormFile file)
{
    var jobId = Guid.NewGuid();
    var tempPath = Path.Combine(Path.GetTempPath(), $"{jobId}_{file.FileName}");
    
    using (var stream = new FileStream(tempPath, FileMode.Create)) {
        await file.CopyToAsync(stream);
    }

    await _queue.QueueBackgroundWorkItemAsync(async (sp, ct) => {
        var worker = sp.GetRequiredService<IBookArchiveProcessor>();
        await worker.ExtractAndProcessAsync(jobId, tempPath, ct);
    });

    return Accepted(new { JobId = jobId, Message = "Tệp đã được đưa vào hàng đợi xử lý ngầm." });
}`
        },
        testing: [
          { title: "Bước 1: Mở trang Upload Admin", detail: "Truy cập http://localhost:5174/upload." },
          { title: "Bước 2: Tải lên file dung lượng lớn", detail: "Chọn 1 file zip truyện tranh > 50MB và bấm Upload." },
          { title: "Bước 3: Quan sát console API", detail: "Xác nhận Worker bắt đầu giải nén ngầm mà Web UI vẫn mượt mà." }
        ]
      }
    },
    {
      id: "v1.0.5",
      version: "v1.0.5",
      commit: "e4e2a2e",
      date: "01/08/2026 16:45",
      apps: ["xomtruyen-admin"],
      category: "all admin",
      type: "optimization",
      typeName: "⚡ Tối Ưu Giao Diện",
      title: "Tạo Nhanh Dòng Trực Tiếp Sách, Thể Loại & Chủ Đề (Inline Quick Create)",
      summary: "Cho phép thêm mới sách, thể loại (Categories) và chủ đề (Topics) trực tiếp trên dòng bảng AG-Grid mà không cần mở modal dài dòng.",
      doc: {
        purpose: "Tăng tốc độ nhập liệu cho người quản trị danh mục truyện tranh và tiểu thuyết.",
        mechanism: "Khai thác khả năng Single Click Row Editing của AG-Grid Enterprise, tự động tạo slug chuẩn SEO ngay khi nhập tên tiếng Việt.",
        endpoints: [
          { method: "POST", path: "/api/admin/categories/quick-create", desc: "Tạo nhanh thể loại sách." }
        ],
        files: [
          { path: "xomtruyen-admin/src/pages/Categories.tsx", role: "Trang quản lý thể loại với bảng AG-Grid Inline Creation." },
          { path: "xomtruyen-admin/src/pages/Books.tsx", role: "Trang quản lý danh sách truyện tranh." }
        ],
        code: {
          filename: "xomtruyen-admin/src/pages/Categories.tsx",
          lang: "typescript",
          expl: "Xử lý sự kiện lưu dòng trực tiếp trên AG-Grid.",
          raw: `const onCellValueChanged = async (event: CellValueChangedEvent) => {
  const updatedRow = event.data;
  if (!updatedRow.id) {
    // Tạo mới dòng dữ liệu
    const res = await api.post('/admin/categories', updatedRow);
    showToast('Đã thêm mới thể loại thành công!');
  } else {
    // Cập nhật dòng dữ liệu
    await api.put(\`/admin/categories/\${updatedRow.id}\`, updatedRow);
    showToast('Đã cập nhật thể loại!');
  }
};`
        },
        testing: [
          { title: "Bước 1: Mở trang Categories", detail: "Mở http://localhost:5174/categories." },
          { title: "Bước 2: Bấm Thêm Dòng", detail: "Nhấp nút 'Thêm Mới Thể Loại' và gõ trực tiếp trên bảng." }
        ]
      }
    },
    {
      id: "v1.0.2",
      version: "v1.0.2",
      commit: "93d365d",
      date: "31/07/2026 09:30",
      apps: ["xomtruyen-admin", "xomtruyen.API"],
      category: "all admin api",
      type: "security",
      typeName: "🛡️ Quản Trị & Bảo Mật",
      title: "Bảng Quản Trị Người Dùng & Phân Quyền AG-Grid Enterprise",
      summary: "Quản lý danh sách thành viên, khóa/mở tài khoản, phân quyền Role (Admin/User), tìm kiếm, sắp xếp và phân trang tốc độ cao.",
      doc: {
        purpose: "Kiểm soát quyền truy cập của người dùng và bảo vệ an toàn cho hệ thống dữ liệu.",
        mechanism: "Xác thực JWT Token với Claims Role: Admin, kiểm tra phân quyền tại các Endpoint nhạy cảm với thuộc tính [Authorize(Roles = 'Admin')].",
        endpoints: [
          { method: "GET", path: "/api/admin/users", desc: "Lấy danh sách người dùng có phân trang và lọc trạng thái." },
          { method: "PUT", path: "/api/admin/users/{id}/status", desc: "Cập nhật trạng thái Active/Suspended." }
        ],
        files: [
          { path: "xomtruyen-admin/src/pages/Users.tsx", role: "Giao diện quản lý danh sách thành viên." },
          { path: "xomtruyen.API/Controllers/AdminUserController.cs", role: "API quản trị tài khoản và phân quyền." }
        ],
        code: {
          filename: "xomtruyen.API/Controllers/AdminUserController.cs",
          lang: "csharp",
          expl: "Xử lý phân quyền Admin truy xuất và điều chỉnh trạng thái tài khoản.",
          raw: `[Authorize(Roles = "Admin")]
[Route("api/admin/users")]
public class AdminUserController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetUsersList([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var query = _context.Users.AsNoTracking();
        var total = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        return Ok(new { Total = total, Items = items });
    }
}`
        },
        testing: [
          { title: "Bước 1: Đăng nhập quyền Admin", detail: "Đăng nhập vào Admin Portal với tài khoản admin@xomtruyen.com." },
          { title: "Bước 2: Mở bảng Users", detail: "Kiểm tra tính năng sắp xếp, tìm kiếm tên người dùng và phân trang." }
        ]
      }
    },
    {
      id: "v1.0.0",
      version: "v1.0.0",
      commit: "ef8726a",
      date: "30/07/2026 08:00",
      apps: ["Toàn Bộ Hệ Thống", "PostgreSQL DB"],
      category: "all db api",
      type: "database",
      typeName: "🗄️ CSDL & Khởi Tạo",
      title: "Khởi Tạo Cấu Trúc Hệ Thống & CSDL PostgreSQL 18 DbSets",
      summary: "Thiết lập CSDL PostgreSQL 18 bảng, kiến trúc Service-Repository Pattern trong .NET 9, xác thực bảo mật JWT Bearer Token.",
      doc: {
        purpose: "Đặt nền móng kiến trúc vững chắc, chuẩn hóa mô hình dữ liệu và cơ chế xác thực cho toàn bộ dự án Xóm Truyện.",
        mechanism: "Entity Framework Core 9 Code-First kết hợp PostgreSQL 16. Mật khẩu người dùng được mã hóa BCrypt an toàn.",
        endpoints: [
          { method: "POST", path: "/api/auth/login", desc: "Đăng nhập xác thực và cấp Bearer JWT Token thời hạn 1440 phút." }
        ],
        files: [
          { path: "xomtruyen.API/Data/ApplicationDbContext.cs", role: "DbContext quản lý 18 DbSets." },
          { path: "xomtruyen.API/Program.cs", role: "Khởi tạo Dependency Injection, Middleware, JWT Auth." }
        ],
        code: {
          filename: "xomtruyen.API/Program.cs",
          lang: "csharp",
          expl: "Cấu hình kết nối PostgreSQL và JWT Authentication trong .NET 9.",
          raw: `builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });`
        },
        testing: [
          { title: "Bước 1: Chạy API", detail: "Mở terminal chạy 'dotnet run' trong thư mục xomtruyen.API." },
          { title: "Bước 2: Mở Swagger", detail: "Truy cập https://localhost:5001/swagger để kiểm tra các endpoints." }
        ]
      }
    }
  ]
};

// ==========================================================
// 2. SYNTAX HIGHLIGHTING ENGINE
// ==========================================================

function highlightSyntax(code) {
  if (!code) return "";
  
  // Escape HTML characters first
  let text = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Single-pass tokenizer to avoid nested HTML replacement bugs
  const tokenRegex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(\[[A-Za-z0-9_]+(?:\([^\]]*\))?\])|\b(public|private|protected|class|interface|async|await|return|import|export|default|function|const|let|var|if|else|try|catch|new|using|namespace|get|set|type|from)\b|\b(Task|IActionResult|ActionResult|Guid|string|int|bool|decimal|DateTime|DbSet|DbContext|React|FC|Promise|ApiResponse|User|Publication|ComicPage)\b|\b(\d+)\b/g;

  return text.replace(tokenRegex, (match, comment, str, attr, kw, type, num) => {
    if (comment) return `<span class="tok-comment">${comment}</span>`;
    if (str) return `<span class="tok-str">${str}</span>`;
    if (attr) return `<span class="tok-attr">${attr}</span>`;
    if (kw) return `<span class="tok-kw">${kw}</span>`;
    if (type) return `<span class="tok-type">${type}</span>`;
    if (num) return `<span class="tok-num">${num}</span>`;
    return match;
  });
}

// ==========================================================
// 3. MAIN ARCHITECTURE & WORKFLOW ENGINE CLASS
// ==========================================================

class ArchitectureVisualizer {
  constructor() {
    this.currentViewMode = "table"; // "table" or "diagram"
    this.currentSubnavTab = "flows"; // "flows" or "changelog"
    this.currentFlowId = "flow-reading";
    this.selectedNodeId = null;
    this.searchQuery = "";
    this.currentChangelogFilter = "all";

    // Zoom & Pan state
    this.scale = 0.65;
    this.panX = 0;
    this.panY = 25;
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;

    // Audio synthesizer for tech clicks
    this.audioEnabled = true;
    // Theme Engine: slate (default modern dark) | light (paper white) | cyber (neon matrix)
    this.currentTheme = localStorage.getItem("xomtruyen_overview_theme") || "slate";

    this.initElements();
    this.initTheme();
    this.bindEvents();
    this.renderTable();
    this.renderChangelogTable("all");
  }

  initElements() {
    this.tableViewContainer = document.getElementById("table-view-container");
    this.viewport = document.getElementById("canvas-viewport");
    this.canvas = document.getElementById("diagram-canvas");
    this.svgLayer = document.getElementById("connections-layer");
    this.nodesLayer = document.getElementById("nodes-layer");
    this.drawer = document.getElementById("inspector-drawer");
    this.tableBody = document.getElementById("flows-table-body");
    this.searchInput = document.getElementById("search-input");
    this.soundBtn = document.getElementById("sound-btn");
    this.toast = document.getElementById("toast-notice");

    this.btnModeTable = document.getElementById("btn-mode-table");
    this.btnModeDiagram = document.getElementById("btn-mode-diagram");
    this.btnBackToTable = document.getElementById("btn-back-to-table");

    // Sub-Navigation Elements
    this.subnavBtnFlows = document.getElementById("subnav-btn-flows");
    this.subnavBtnChangelog = document.getElementById("subnav-btn-changelog");
    this.subnavBtnDocs = document.getElementById("subnav-btn-docs");
    this.subnavBtnSettings = document.getElementById("subnav-btn-settings");
    this.subnavBtnHistory = document.getElementById("subnav-btn-history");
    this.paneFlows = document.getElementById("pane-flows");
    this.paneChangelog = document.getElementById("pane-changelog");
    this.paneDocs = document.getElementById("pane-docs");
    this.paneSettings = document.getElementById("pane-settings");
    this.paneHistory = document.getElementById("pane-history");

    // User Manual Navigation Elements
    this.docsNavItems = document.querySelectorAll("#docs-nav-menu .docs-nav-item");
    this.docsSections = document.querySelectorAll(".docs-content-section");

    // Changelog Elements
    this.changelogTableBody = document.getElementById("changelog-table-body");
    this.changelogFilterPills = document.querySelectorAll("#changelog-filter-pills .filter-pill");

    // Drawer Code Elements
    this.drawerCodeFilename = document.getElementById("drawer-code-filename");
    this.drawerCodeContent = document.getElementById("drawer-code-content");
    this.drawerCodeExpl = document.getElementById("drawer-code-expl");
    this.drawerCodeCopyBtn = document.getElementById("drawer-code-copy-btn");

    // Modal Code Elements
    this.codeModal = document.getElementById("code-modal");
    this.modalCodeTitle = document.getElementById("modal-code-title");
    this.modalCodeSubtitle = document.getElementById("modal-code-subtitle");
    this.modalCodeTabs = document.getElementById("modal-code-tabs");
    this.modalCodeContent = document.getElementById("modal-code-content");
    this.modalCodeExpl = document.getElementById("modal-code-expl");
    this.modalCodeCopyBtn = document.getElementById("modal-code-copy-btn");
    this.modalCodeCloseBtn = document.getElementById("modal-code-close-btn");

    // Feature Documentation Modal Elements
    this.docModal = document.getElementById("doc-modal");
    this.docModalTitle = document.getElementById("doc-modal-title");
    this.docModalVersion = document.getElementById("doc-modal-version");
    this.docModalType = document.getElementById("doc-modal-type");
    this.docModalSubtitle = document.getElementById("doc-modal-subtitle");
    this.docSpecFlowChips = document.getElementById("doc-spec-flow-chips");
    this.docSpecPurpose = document.getElementById("doc-spec-purpose");
    this.docSpecMechanism = document.getElementById("doc-spec-mechanism");
    this.docSpecEndpoints = document.getElementById("doc-spec-endpoints");
    this.docFilesList = document.getElementById("doc-files-list");
    this.docCodeFilename = document.getElementById("doc-code-filename");
    this.docCodeContent = document.getElementById("doc-code-content");
    this.docCodeExpl = document.getElementById("doc-code-expl");
    this.docCodeCopyBtn = document.getElementById("doc-code-copy-btn");
    this.docTestSteps = document.getElementById("doc-test-steps");
    this.docFooterMeta = document.getElementById("doc-footer-meta");
    this.docModalCloseBtn = document.getElementById("doc-modal-close-btn");
    this.docModalTabs = document.querySelectorAll("#doc-modal-tabs .code-tab-btn");

    // Workflow info elements
    this.workflowInfoBar = document.getElementById("workflow-info-bar");
    this.workflowIcon = document.getElementById("workflow-icon");
    this.workflowTitle = document.getElementById("workflow-title");
    this.workflowDesc = document.getElementById("workflow-desc");

    this.updateCanvasTransform();
  }

  // Theme Management Engine
  initTheme() {
    this.themeToggleBtn = document.getElementById("theme-toggle-btn");
    this.themeSwitchIcon = document.getElementById("theme-switch-icon");
    this.themeSwitchLabel = document.getElementById("theme-switch-label");
    this.applyTheme(this.currentTheme);
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("xomtruyen_overview_theme", theme);

    if (this.themeSwitchIcon && this.themeSwitchLabel) {
      if (theme === "light") {
        this.themeSwitchIcon.textContent = "☀️";
        this.themeSwitchLabel.textContent = "Giao diện Sáng";
      } else if (theme === "cyber") {
        this.themeSwitchIcon.textContent = "🌌";
        this.themeSwitchLabel.textContent = "Cyber Matrix";
      } else {
        this.themeSwitchIcon.textContent = "🌙";
        this.themeSwitchLabel.textContent = "Giao diện Tối";
      }
    }
  }

  cycleTheme() {
    const themeOrder = ["slate", "light", "cyber"];
    const currentIndex = themeOrder.indexOf(this.currentTheme);
    const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length];
    this.applyTheme(nextTheme);

    const themeTitles = {
      slate: "Giao diện Tối (Slate) - Êm mắt, độ tương phản cao",
      light: "Giao diện Sáng (Paper Light) - Siêu dễ đọc, chuẩn tài liệu",
      cyber: "Giao diện Cyberpunk Neon"
    };
    this.showToast(`Đã đổi sang: ${themeTitles[nextTheme]}`);
  }

  // Sub-Navigation Switcher (Flows vs Changelog vs Docs)
  switchSubnavTab(tab) {
    this.currentSubnavTab = tab;
    
    this.subnavBtnFlows?.classList.toggle("active", tab === "flows");
    this.subnavBtnChangelog?.classList.toggle("active", tab === "changelog");
    this.subnavBtnDocs?.classList.toggle("active", tab === "docs");
    this.subnavBtnSettings?.classList.toggle("active", tab === "settings");
    this.subnavBtnHistory?.classList.toggle("active", tab === "history");

    if (this.paneFlows) this.paneFlows.style.display = tab === "flows" ? "flex" : "none";
    if (this.paneChangelog) this.paneChangelog.style.display = tab === "changelog" ? "flex" : "none";
    if (this.paneDocs) this.paneDocs.style.display = tab === "docs" ? "block" : "none";
    if (this.paneSettings) this.paneSettings.style.display = tab === "settings" ? "flex" : "none";
    if (this.paneHistory) this.paneHistory.style.display = tab === "history" ? "flex" : "none";

    if (tab === "changelog") {
      this.renderChangelogTable(this.currentChangelogFilter);
    }
  }

  // Switch Active Section in User Manual
  switchDocsSection(sectionId) {
    if (!sectionId) return;

    this.docsNavItems?.forEach(item => {
      item.classList.toggle("active", item.getAttribute("data-doc-target") === sectionId);
    });

    this.docsSections?.forEach(sec => {
      sec.style.display = (sec.id === sectionId) ? "flex" : "none";
    });
  }

  // Render Table / List Directory View
  renderTable() {
    if (!this.tableBody) return;
    this.tableBody.innerHTML = "";

    const flows = Object.values(APP_DATA.flows);

    flows.forEach(flow => {
      const tr = document.createElement("tr");
      tr.id = `flow-row-${flow.id}`;

      // Pipeline preview chips HTML
      const chipsHtml = (flow.pipelineChips || []).map((chip, idx, arr) => `
        <span class="pipeline-step-chip">${chip}</span>
        ${idx < arr.length - 1 ? '<span class="pipeline-arrow">➔</span>' : ''}
      `).join("");

      tr.innerHTML = `
        <td style="text-align: center;">
          <div class="flow-num-badge">
            <span>${flow.icon}</span>
            <span>${flow.stt}</span>
          </div>
        </td>
        <td>
          <div class="flow-title-cell">
            <div class="flow-row-name">${flow.name}</div>
            <div class="flow-row-desc">${flow.desc}</div>
          </div>
        </td>
        <td>
          <div class="pipeline-flow-preview">
            ${chipsHtml}
          </div>
        </td>
        <td style="text-align: center;">
          <span class="flow-category-badge ${flow.badgeClass || ''}">${flow.category}</span>
        </td>
        <td style="text-align: center;">
          <span class="steps-count-badge">${flow.stepsCount}</span>
        </td>
        <td style="text-align: right;">
          <div class="table-actions-cell">
            <button class="btn-open-code" data-flow="${flow.id}" title="Xem mã nguồn thực tế">
              <span>💻 Xem Code</span>
            </button>
            <button class="btn-open-diagram" data-flow="${flow.id}" title="Mở sơ đồ luồng trực quan">
              <span>👁️ Xem Sơ Đồ</span>
            </button>
          </div>
        </td>
      `;

      // Event: Click on [Xem Code] button
      const codeBtn = tr.querySelector(".btn-open-code");
      codeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.playSound(480, 0.05);
        this.openCodeModal(flow);
      });

      // Event: Click on [Xem Sơ Đồ] button or anywhere on row
      const diagramBtn = tr.querySelector(".btn-open-diagram");
      diagramBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.playSound(500, 0.06);
        this.openFlowDiagram(flow.id);
      });

      tr.addEventListener("click", () => {
        this.playSound(500, 0.06);
        this.openFlowDiagram(flow.id);
      });

      this.tableBody.appendChild(tr);
    });
  }

  // Render Changelog Table View
  renderChangelogTable(filter = "all") {
    if (!this.changelogTableBody) return;
    this.changelogTableBody.innerHTML = "";

    const items = (APP_DATA.changelog || []).filter(item => {
      if (filter === "all") return true;
      return item.category.includes(filter);
    });

    items.forEach(item => {
      const tr = document.createElement("tr");
      tr.id = `changelog-row-${item.id}`;

      const appsChips = (item.apps || []).map(app => `
        <span class="app-tag-chip">${app}</span>
      `).join("");

      tr.innerHTML = `
        <td style="text-align: center;">
          <span class="commit-tag-badge">${item.version}</span>
        </td>
        <td style="font-family: var(--font-mono); font-size: 12px; color: var(--text-muted); text-align: center; white-space: nowrap;">
          ${item.date}
        </td>
        <td>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div style="font-weight: 700; color: var(--text-primary); font-size: 15px;">${item.title}</div>
            <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">${item.summary}</div>
          </div>
        </td>
        <td>
          <div>${appsChips}</div>
        </td>
        <td style="text-align: center;">
          <span class="change-type-badge ${item.type}">${item.typeName}</span>
        </td>
        <td style="text-align: right; white-space: nowrap;">
          <button class="btn-view-doc" data-id="${item.id}" title="Xem tài liệu đặc tả và mã nguồn của chức năng này">
            <span>📖 Xem Tài Liệu</span>
          </button>
        </td>
      `;

      const btnDoc = tr.querySelector(".btn-view-doc");
      btnDoc.addEventListener("click", (e) => {
        e.stopPropagation();
        this.playSound(480, 0.05);
        this.openDocModal(item);
      });

      tr.addEventListener("click", () => {
        this.playSound(480, 0.05);
        this.openDocModal(item);
      });

      this.changelogTableBody.appendChild(tr);
    });
  }

  // Open Feature Documentation Modal
  openDocModal(item) {
    if (!this.docModal || !item) return;
    this.currentDocItem = item;

    // Header info
    this.docModalTitle.textContent = item.title;
    this.docModalVersion.textContent = item.version;
    this.docModalType.textContent = item.typeName;
    this.docModalType.className = `change-type-badge ${item.type}`;
    this.docModalSubtitle.textContent = `${item.date} • Hệ thống: ${item.apps.join(", ")} • Commit: ${item.commit}`;

    const doc = item.doc || {};

    // 0. Render Visual Pipeline Flow Chips
    if (this.docSpecFlowChips) {
      const apps = item.apps || [];
      const chips = [
        ...apps.map(a => `<span class="pipeline-step-chip" style="background: rgba(0,229,255,0.12); color: var(--cyan-glow); border-color: rgba(0,229,255,0.3); font-weight: 600;">💻 ${a}</span>`),
        `<span class="pipeline-step-chip" style="background: rgba(168,85,247,0.12); color: var(--purple-glow); border-color: rgba(168,85,247,0.3); font-weight: 600;">📦 ${item.commit}</span>`,
        `<span class="pipeline-step-chip" style="background: rgba(0,255,136,0.12); color: var(--green-glow); border-color: rgba(0,255,136,0.3); font-weight: 600;">✅ ${item.typeName}</span>`
      ];
      this.docSpecFlowChips.innerHTML = chips.join('<span class="pipeline-arrow" style="color: var(--text-muted); font-size: 13px;">➔</span>');
    }

    // 1. Tab Đặc Tả (Spec)
    if (this.docSpecPurpose) this.docSpecPurpose.textContent = doc.purpose || "Chưa có mục đích tài liệu.";
    if (this.docSpecMechanism) this.docSpecMechanism.textContent = doc.mechanism || "Chưa có cơ chế hoạt động.";
    
    if (this.docSpecEndpoints) {
      this.docSpecEndpoints.innerHTML = "";
      if (doc.endpoints && doc.endpoints.length > 0) {
        doc.endpoints.forEach(ep => {
          const epEl = document.createElement("div");
          epEl.className = "endpoint-card";
          epEl.innerHTML = `
            <div class="endpoint-left">
              <span class="http-method ${ep.method.toLowerCase()}">${ep.method}</span>
              <span class="endpoint-path">${ep.path}</span>
            </div>
            <span class="endpoint-desc">${ep.desc}</span>
          `;
          this.docSpecEndpoints.appendChild(epEl);
        });
      } else {
        this.docSpecEndpoints.innerHTML = '<div style="font-size: 12px; color: var(--text-muted);">Không có Endpoint HTTP trực tiếp.</div>';
      }
    }

    // 2. Tab Tệp Tin (Files)
    if (this.docFilesList) {
      this.docFilesList.innerHTML = "";
      if (doc.files && doc.files.length > 0) {
        doc.files.forEach(f => {
          const fEl = document.createElement("li");
          fEl.className = "doc-file-card";
          fEl.innerHTML = `
            <div class="doc-file-path">
              <span>📄</span>
              <span>${f.path}</span>
            </div>
            <div class="doc-file-role">${f.role}</div>
          `;
          this.docFilesList.appendChild(fEl);
        });
      }
    }

    // 3. Tab Mã Nguồn (Code)
    if (doc.code) {
      this.currentDocRawCode = doc.code.raw || "";
      if (this.docCodeFilename) this.docCodeFilename.textContent = doc.code.filename || "source-code";
      if (this.docCodeContent) this.docCodeContent.innerHTML = highlightSyntax(doc.code.raw || "");
      if (this.docCodeExpl) this.docCodeExpl.textContent = doc.code.expl || "Đoạn mã tiêu biểu thực thi chức năng này.";
    }

    // 4. Tab Kiểm Thử (Testing)
    if (this.docTestSteps) {
      this.docTestSteps.innerHTML = "";
      if (doc.testing && doc.testing.length > 0) {
        doc.testing.forEach((step, idx) => {
          const sEl = document.createElement("div");
          sEl.className = "test-step-card";
          sEl.innerHTML = `
            <div class="test-step-num">${idx + 1}</div>
            <div class="test-step-content">
              <div class="test-step-title">${step.title}</div>
              <div class="test-step-detail">${step.detail}</div>
            </div>
          `;
          this.docTestSteps.appendChild(sEl);
        });
      }
    }

    // Footer
    if (this.docFooterMeta) {
      this.docFooterMeta.innerHTML = `Bản ghi cập nhật <strong>${item.version}</strong> • Trạng thái: <strong>Hoàn Thành & Đã Kiểm Thử</strong>`;
    }

    // Default to 'spec' tab
    this.switchDocTab("spec");
    this.docModal.style.display = "flex";
  }

  switchDocTab(tabName) {
    if (!tabName) tabName = "spec";

    // Update active state on tab buttons
    document.querySelectorAll("#doc-modal-tabs .code-tab-btn").forEach(btn => {
      const bTab = btn.getAttribute("data-tab") || btn.getAttribute("data-doc-tab");
      btn.classList.toggle("active", bTab === tabName);
    });

    // Hide all tab panes
    document.querySelectorAll("#doc-modal .doc-tab-pane").forEach(pane => {
      pane.style.display = "none";
    });

    // Display the matching active pane
    const activePane = document.getElementById(`doc-pane-${tabName}`) || document.getElementById(`doc-tab-${tabName}`);
    if (activePane) {
      activePane.style.display = "flex";
    }
  }

  closeDocModal() {
    if (this.docModal) this.docModal.style.display = "none";
  }

  // Open Global Code Modal with files
  openCodeModal(flowOrNode) {
    if (!this.codeModal) return;

    let files = [];
    let title = "";
    let sub = "";

    if (flowOrNode.codeFiles) {
      files = flowOrNode.codeFiles;
      title = `${flowOrNode.icon || '⚡'} Mã Nguồn Luồng: ${flowOrNode.name}`;
      sub = `${files.length} Tệp tin thực thi trong quy trình xử lý dữ liệu`;
    } else if (flowOrNode.code) {
      files = [{
        name: flowOrNode.code.filename,
        badge: flowOrNode.category,
        expl: flowOrNode.code.expl,
        raw: flowOrNode.code.raw
      }];
      title = `💻 Mã Nguồn Phân Hệ: ${flowOrNode.title}`;
      sub = flowOrNode.path;
    }

    if (files.length === 0) return;

    this.modalCodeTitle.textContent = title;
    this.modalCodeSubtitle.textContent = sub;

    // Render file tabs
    this.modalCodeTabs.innerHTML = "";
    files.forEach((file, index) => {
      const tabBtn = document.createElement("button");
      tabBtn.className = `code-tab-btn ${index === 0 ? "active" : ""}`;
      tabBtn.innerHTML = `<span>📄</span> <span>${file.name}</span>`;
      
      tabBtn.addEventListener("click", () => {
        this.playSound(450, 0.04);
        document.querySelectorAll(".code-tab-btn").forEach(b => b.classList.remove("active"));
        tabBtn.classList.add("active");
        this.displayModalFile(file);
      });

      this.modalCodeTabs.appendChild(tabBtn);
    });

    // Display first file
    this.displayModalFile(files[0]);
    this.codeModal.style.display = "flex";
  }

  displayModalFile(file) {
    this.currentModalRawCode = file.raw || "";
    this.modalCodeContent.innerHTML = highlightSyntax(file.raw || "");
    this.modalCodeExpl.innerHTML = `<strong>${file.badge || 'Mô Tả'}:</strong> ${file.expl || ''}`;
  }

  closeCodeModal() {
    if (this.codeModal) this.codeModal.style.display = "none";
  }

  // Switch View Mode: "table" or "diagram"
  switchViewMode(mode) {
    this.currentViewMode = mode;

    if (mode === "table") {
      this.tableViewContainer.style.display = "flex";
      this.viewport.style.display = "none";
      this.btnModeTable.classList.add("active");
      this.btnModeDiagram.classList.remove("active");
      this.closeInspector();
    } else {
      this.tableViewContainer.style.display = "none";
      this.viewport.style.display = "block";
      this.btnModeTable.classList.remove("active");
      this.btnModeDiagram.classList.add("active");
      this.renderGraph();
    }
  }

  // Open specific workflow in Diagram Mode
  openFlowDiagram(flowId) {
    this.currentFlowId = flowId;
    this.switchViewMode("diagram");
    this.setFlow(flowId);
  }

  setFlow(flowId) {
    this.currentFlowId = flowId;
    const flow = APP_DATA.flows[flowId];
    if (flow) {
      if (this.workflowInfoBar) {
        this.workflowInfoBar.style.display = "flex";
        if (this.workflowIcon) this.workflowIcon.textContent = flow.icon || "⚡";
        if (this.workflowTitle) this.workflowTitle.textContent = `${flow.icon} ${flow.name}`;
        if (this.workflowDesc) this.workflowDesc.textContent = flow.desc;
      }

      // Auto-fit scale & position based on mode
      if (flow.mode === "pipeline") {
        this.scale = 0.65;
        this.panX = 0;
        this.panY = 25;
      } else {
        this.scale = 0.72;
        this.panX = 0;
        this.panY = 15;
      }
      this.updateCanvasTransform();
    }

    this.renderGraph();
  }

  renderGraph() {
    const flow = APP_DATA.flows[this.currentFlowId];
    if (!flow) return;

    // Clear layers
    this.nodesLayer.innerHTML = "";
    this.svgLayer.innerHTML = "";

    const rect = this.viewport.getBoundingClientRect();
    const width = rect.width || window.innerWidth;
    const height = rect.height || window.innerHeight;
    const centerX = width / 2;

    this.currentLinksPositions = [];

    if (flow.mode === "multi-tier") {
      this.renderMultiTierTree(centerX, height);
    } else if (flow.mode === "pipeline") {
      this.renderPipelineWorkflow(centerX, height, flow);
    }

    // Draw clean glowing SVG Lines with Action Arrows & Direction Text
    this.drawConnections();
  }

  // Render Workflow Pipeline (Step 1 ➔ Step 2 ➔ Step 3 ➔ Step 4 ➔ Step 5)
  renderPipelineWorkflow(centerX, height, flow) {
    const steps = flow.steps || [];
    const stepCount = steps.length;
    if (stepCount === 0) return;

    const stepSpacingX = 520; // 520px gap gives > 260px pure clearance between cards
    const totalWidth = (stepCount - 1) * stepSpacingX;
    const startX = centerX - totalWidth / 2;
    const baseY = 320;

    const stepCoordinates = [];

    steps.forEach((step, idx) => {
      const nodeData = APP_DATA.nodes[step.nodeId];
      if (!nodeData) return;

      const posX = startX + idx * stepSpacingX;
      const posY = baseY + (idx % 2 === 1 ? 40 : -40);
      stepCoordinates.push({ x: posX, y: posY, step, nodeData });

      // Create Step Element with Badge
      const el = document.createElement("div");
      el.className = `node-card pipeline-step color-${step.color || nodeData.color}`;
      el.id = `node-${nodeData.id}`;
      el.style.left = `${posX}px`;
      el.style.top = `${posY}px`;

      el.innerHTML = `
        <div class="node-step-badge">${step.stepBadge || `BƯỚC ${idx + 1}`}</div>
        <div class="node-title">${nodeData.title}</div>
        <div class="node-subtitle">${nodeData.subtitle}</div>
        <div class="node-badge-tag">${nodeData.category}</div>
      `;

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        this.selectNode(nodeData.id);
      });

      this.nodesLayer.appendChild(el);
    });

    // Create Action Links between consecutive steps
    for (let i = 0; i < stepCoordinates.length - 1; i++) {
      const curr = stepCoordinates[i];
      const next = stepCoordinates[i + 1];

      this.currentLinksPositions.push({
        source: { x: curr.x + 135, y: curr.y },
        target: { x: next.x - 135, y: next.y },
        color: this.getNodeColorHex(curr.step.color || curr.nodeData.color),
        label: curr.step.lineLabel || `Bước ${i + 1} ➔ Bước ${i + 2}`,
        style: "solid"
      });
    }
  }

  // Render Full Multi-Tier Tree: Root -> 5 Columns -> Sub-Systems Underneath
  renderMultiTierTree(centerX, height) {
    // 1. Root Node (Tier 0)
    const rootY = 90;
    const rootData = APP_DATA.nodes["xomtruyen-hub"];
    const rootEl = this.createNodeElement(rootData, centerX, rootY, "root");
    this.nodesLayer.appendChild(rootEl);

    // 2. Tier 1 Apps & Tier 2 Sub-systems in Columns
    const columns = APP_DATA.hierarchy;
    const colCount = columns.length;
    const colSpacing = 330;
    const totalSpan = (colCount - 1) * colSpacing;
    const startX = centerX - totalSpan / 2;

    const appY = 270;

    columns.forEach((col, colIdx) => {
      const colX = startX + colIdx * colSpacing;
      const appData = APP_DATA.nodes[col.appId];
      if (!appData) return;

      const appEl = this.createNodeElement(appData, colX, appY, "app");
      this.nodesLayer.appendChild(appEl);

      // Link: Root -> Tier 1 App
      this.currentLinksPositions.push({
        source: { x: centerX, y: rootY + 45 },
        target: { x: colX, y: appY - 42 },
        color: this.getNodeColorHex(appData.color),
        label: `Điều phối: ${appData.title}`,
        style: "solid"
      });

      // Tier 2 Sub-system Nodes Underneath
      const subStartY = appY + 140;
      const subSpacingY = 112;

      col.subIds.forEach((subId, subIdx) => {
        const subData = APP_DATA.nodes[subId];
        if (!subData) return;

        const currentSubY = subStartY + subIdx * subSpacingY;
        const subEl = this.createNodeElement(subData, colX, currentSubY, "sub");
        this.nodesLayer.appendChild(subEl);

        const parentY = subIdx === 0 ? appY + 42 : currentSubY - subSpacingY + 36;
        this.currentLinksPositions.push({
          source: { x: colX, y: parentY },
          target: { x: colX, y: currentSubY - 36 },
          color: this.getNodeColorHex(appData.color),
          label: subData.title,
          style: "solid"
        });
      });
    });
  }

  createNodeElement(data, x, y, tierType) {
    const el = document.createElement("div");
    const isRoot = tierType === "root";
    const isSub = tierType === "sub";

    el.className = `node-card ${isRoot ? "root-node" : ""} ${isSub ? "sub-node" : ""} color-${data.color}`;
    el.id = `node-${data.id}`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    el.innerHTML = `
      <div class="node-title">${data.title}</div>
      <div class="node-subtitle">${data.subtitle}</div>
      <div class="node-badge-tag">${data.category}</div>
    `;

    el.addEventListener("click", (e) => {
      e.stopPropagation();
      this.selectNode(data.id);
    });

    return el;
  }

  getNodeColorHex(colorName) {
    const map = {
      cyan: "#00e5ff",
      green: "#00ff88",
      purple: "#a855f7",
      amber: "#ffb703",
      red: "#ff007a",
      blue: "#38bdf8"
    };
    return map[colorName] || "#00e5ff";
  }

  drawConnections() {
    this.svgLayer.innerHTML = `
      <defs>
        <filter id="line-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <marker id="arrow-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#00e5ff" />
        </marker>
      </defs>
    `;

    this.currentLinksPositions.forEach((item, index) => {
      const { source, target, color, style, label } = item;

      const pathEl = document.createElementNS("http://www.w3.org/2000/svg", "path");
      
      const dx = target.x - source.x;
      const dy = target.y - source.y;

      let d = "";
      if (Math.abs(dx) < 8) {
        d = `M ${source.x} ${source.y} L ${target.x} ${target.y}`;
      } else if (Math.abs(dy) < 30) {
        d = `M ${source.x} ${source.y} C ${source.x + dx * 0.5} ${source.y}, ${source.x + dx * 0.5} ${target.y}, ${target.x} ${target.y}`;
      } else {
        d = `M ${source.x} ${source.y} C ${source.x + dx * 0.15} ${source.y + dy * 0.45}, ${target.x - dx * 0.15} ${target.y - dy * 0.45}, ${target.x} ${target.y}`;
      }

      pathEl.setAttribute("d", d);
      pathEl.setAttribute("class", `connection-line ${style === "dashed" ? "dashed" : ""}`);
      pathEl.setAttribute("stroke", color);
      pathEl.setAttribute("stroke-width", "2.4");
      pathEl.setAttribute("stroke-opacity", "0.9");
      pathEl.setAttribute("filter", "url(#line-glow)");
      pathEl.id = `path-${index}`;

      this.svgLayer.appendChild(pathEl);

      // In Pipeline Mode: Add descriptive action label along the connection line
      if (this.currentFlowId.startsWith("flow-") && label) {
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;

        const foreign = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        foreign.setAttribute("x", midX - 130);
        foreign.setAttribute("y", midY - 26);
        foreign.setAttribute("width", "260");
        foreign.setAttribute("height", "60");

        foreign.innerHTML = `
          <div xmlns="http://www.w3.org/1999/xhtml" class="line-label-box" style="border-color:${color}aa; color:${color}">
            ${label}
          </div>
        `;

        this.svgLayer.appendChild(foreign);
      }
    });
  }

  selectNode(nodeId) {
    this.selectedNodeId = nodeId;
    const nodeData = APP_DATA.nodes[nodeId];
    if (!nodeData) return;

    this.playSound(600, 0.08);

    document.querySelectorAll(".node-card").forEach(el => el.classList.remove("selected"));
    const targetEl = document.getElementById(`node-${nodeId}`);
    if (targetEl) targetEl.classList.add("selected");

    this.openInspector(nodeData);
  }

  openInspector(data) {
    document.getElementById("drawer-title").textContent = data.title;
    document.getElementById("drawer-subtitle").textContent = data.subtitle;
    document.getElementById("drawer-desc").textContent = data.desc;
    document.getElementById("drawer-category").textContent = data.category;
    document.getElementById("drawer-path").textContent = data.path;
    document.getElementById("drawer-run-cmd").textContent = data.runCommand;
    document.getElementById("drawer-ports").textContent = data.ports;

    // Real Source Code Snippet
    if (data.code) {
      this.currentDrawerRawCode = data.code.raw;
      this.drawerCodeFilename.textContent = data.code.filename;
      this.drawerCodeContent.innerHTML = highlightSyntax(data.code.raw);
      this.drawerCodeExpl.textContent = data.code.expl || "Mã nguồn thực thi tương ứng trong phân hệ này.";
    } else {
      this.currentDrawerRawCode = "// Code snippet not available";
      this.drawerCodeFilename.textContent = "Source";
      this.drawerCodeContent.textContent = "// Đang chuẩn bị mã nguồn";
      this.drawerCodeExpl.textContent = "Chi tiết mã nguồn sẽ hiển thị khi kết nối.";
    }

    // Tech Tags
    const tagsContainer = document.getElementById("drawer-tech-tags");
    tagsContainer.innerHTML = "";
    (data.stack || []).forEach((t, i) => {
      const span = document.createElement("span");
      span.className = `tech-tag ${i === 0 ? "primary" : ""}`;
      span.textContent = t;
      tagsContainer.appendChild(span);
    });

    // Key Files List
    const filesContainer = document.getElementById("drawer-files-list");
    filesContainer.innerHTML = "";
    (data.files || []).forEach(f => {
      const li = document.createElement("li");
      li.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
        <span>${f}</span>
      `;
      filesContainer.appendChild(li);
    });

    this.drawer.classList.add("open");
  }

  closeInspector() {
    this.drawer.classList.remove("open");
    document.querySelectorAll(".node-card").forEach(el => el.classList.remove("selected"));
  }

  handleSearch(query) {
    this.searchQuery = (query || "").trim().toLowerCase();

    // 1. If in Table Mode: Filter table rows
    if (this.currentViewMode === "table") {
      const rows = document.querySelectorAll("#flows-table-body tr");
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(this.searchQuery) ? "" : "none";
      });
      return;
    }

    // 2. If in Diagram Mode: Dim non-matching nodes
    const allCards = document.querySelectorAll(".node-card");
    const allLines = document.querySelectorAll(".connection-line");

    if (!this.searchQuery) {
      allCards.forEach(c => c.classList.remove("dimmed"));
      allLines.forEach(l => l.classList.remove("dimmed"));
      return;
    }

    allCards.forEach(card => {
      const id = card.id.replace("node-", "");
      const data = APP_DATA.nodes[id];
      const match = data && (
        data.title.toLowerCase().includes(this.searchQuery) ||
        data.subtitle.toLowerCase().includes(this.searchQuery) ||
        data.desc.toLowerCase().includes(this.searchQuery) ||
        (data.stack && data.stack.some(s => s.toLowerCase().includes(this.searchQuery))) ||
        (data.files && data.files.some(f => f.toLowerCase().includes(this.searchQuery)))
      );

      card.classList.toggle("dimmed", !match);
    });

    allLines.forEach(line => {
      line.classList.toggle("dimmed", true);
    });
  }

  showToast(message) {
    this.toast.textContent = message;
    this.toast.classList.add("show");
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toast.classList.remove("show");
    }, 2800);
  }

  playSound(freq = 440, duration = 0.05) {
    if (!this.audioEnabled) return;
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // Audio context policy
    }
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      if (this.currentViewMode === "diagram") {
        this.renderGraph();
      }
    });

    document.getElementById("drawer-close-btn")?.addEventListener("click", () => {
      this.closeInspector();
    });

    // Theme Switcher Button Event
    this.themeToggleBtn?.addEventListener("click", () => {
      this.playSound(520, 0.05);
      this.cycleTheme();
    });

    // Copy Code from Drawer
    this.drawerCodeCopyBtn?.addEventListener("click", () => {
      if (this.currentDrawerRawCode) {
        navigator.clipboard.writeText(this.currentDrawerRawCode);
        this.showToast("Đã sao chép mã nguồn!");
      }
    });

    // Copy Code from Modal
    this.modalCodeCopyBtn?.addEventListener("click", () => {
      if (this.currentModalRawCode) {
        navigator.clipboard.writeText(this.currentModalRawCode);
        this.showToast("Đã sao chép mã nguồn!");
      }
    });

    // Close Modal
    this.modalCodeCloseBtn?.addEventListener("click", () => {
      this.closeCodeModal();
    });

    // Close modal on click overlay
    this.codeModal?.addEventListener("click", (e) => {
      if (e.target === this.codeModal) this.closeCodeModal();
    });

    // Subnav Tabs Switcher (Flows vs Changelog vs Docs)
    this.subnavBtnFlows?.addEventListener("click", () => {
      this.playSound(400, 0.04);
      this.switchSubnavTab("flows");
    });

    this.subnavBtnChangelog?.addEventListener("click", () => {
      this.playSound(400, 0.04);
      this.switchSubnavTab("changelog");
    });

    this.subnavBtnDocs?.addEventListener("click", () => {
      this.playSound(400, 0.04);
      this.switchSubnavTab("docs");
    });

    this.subnavBtnSettings?.addEventListener("click", () => {
      this.playSound(400, 0.04);
      this.switchSubnavTab("settings");
    });

    this.subnavBtnHistory?.addEventListener("click", () => {
      this.playSound(400, 0.04);
      this.switchSubnavTab("history");
    });

    // User Manual Sidebar Navigation
    this.docsNavItems?.forEach(item => {
      item.addEventListener("click", (e) => {
        const targetId = e.currentTarget.getAttribute("data-doc-target");
        this.playSound(450, 0.04);
        this.switchDocsSection(targetId);
      });
    });

    // Changelog Filter Pills
    this.changelogFilterPills?.forEach(pill => {
      pill.addEventListener("click", (e) => {
        const filter = e.currentTarget.getAttribute("data-filter");
        this.playSound(450, 0.04);
        this.changelogFilterPills.forEach(p => p.classList.remove("active"));
        e.currentTarget.classList.add("active");
        this.currentChangelogFilter = filter;
        this.renderChangelogTable(filter);
      });
    });

    // Feature Documentation Modal Events
    this.docModalTabs?.forEach(tabBtn => {
      tabBtn.addEventListener("click", (e) => {
        const tab = e.currentTarget.getAttribute("data-tab") || e.currentTarget.getAttribute("data-doc-tab");
        this.playSound(450, 0.04);
        this.switchDocTab(tab);
      });
    });

    this.docModalCloseBtn?.addEventListener("click", () => {
      this.closeDocModal();
    });

    this.docModal?.addEventListener("click", (e) => {
      if (e.target === this.docModal) this.closeDocModal();
    });

    this.docCodeCopyBtn?.addEventListener("click", () => {
      if (this.currentDocRawCode) {
        navigator.clipboard.writeText(this.currentDocRawCode);
        this.showToast("Đã sao chép mã nguồn tài liệu!");
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeCodeModal();
        this.closeDocModal();
        this.closeInspector();
      }
    });

    this.searchInput?.addEventListener("input", (e) => {
      this.handleSearch(e.target.value);
    });

    // View Mode Switcher
    this.btnModeTable?.addEventListener("click", () => {
      this.playSound(400, 0.05);
      this.switchViewMode("table");
    });

    this.btnModeDiagram?.addEventListener("click", () => {
      this.playSound(400, 0.05);
      this.switchViewMode("diagram");
    });

    this.btnBackToTable?.addEventListener("click", () => {
      this.playSound(400, 0.05);
      this.switchViewMode("table");
    });

    this.soundBtn?.addEventListener("click", () => {
      this.audioEnabled = !this.audioEnabled;
      this.soundBtn.classList.toggle("active", this.audioEnabled);
      this.showToast(this.audioEnabled ? "Đã bật hiệu ứng âm thanh" : "Đã tắt âm thanh");
    });

    document.querySelectorAll(".copy-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const targetId = e.currentTarget.getAttribute("data-target");
        const text = document.getElementById(targetId)?.textContent || "";
        navigator.clipboard.writeText(text);
        this.showToast(`Đã sao chép: ${text}`);
      });
    });

    // Zoom & Pan on Canvas Viewport
    this.viewport?.addEventListener("wheel", (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      this.scale = Math.min(2.0, Math.max(0.35, this.scale * zoomFactor));
      this.updateCanvasTransform();
    });

    this.viewport?.addEventListener("mousedown", (e) => {
      if (e.target.closest(".node-card")) return;
      this.isDragging = true;
      this.dragStartX = e.clientX - this.panX;
      this.dragStartY = e.clientY - this.panY;
    });

    window.addEventListener("mousemove", (e) => {
      if (!this.isDragging) return;
      this.panX = e.clientX - this.dragStartX;
      this.panY = e.clientY - this.dragStartY;
      this.updateCanvasTransform();
    });

    window.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    // Reset View Button
    document.getElementById("reset-view-btn")?.addEventListener("click", () => {
      this.scale = this.currentFlowId === "multi-tier" ? 0.72 : 0.65;
      this.panX = 0;
      this.panY = this.currentFlowId === "multi-tier" ? 15 : 25;
      this.updateCanvasTransform();
      this.showToast("Đã căn giữa lại sơ đồ");
    });

    // Fullscreen Button
    document.getElementById("fullscreen-btn")?.addEventListener("click", () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });
  }

  updateCanvasTransform() {
    if (this.canvas) {
      this.canvas.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.scale})`;
    }
  }
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.visualizer = new ArchitectureVisualizer();
});
