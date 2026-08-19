import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import ReadingHeader from "../components/Reading/ReadingHeader";
import { useBookDetail } from "../hooks/useBooks";
import { getComicChapters, getTextChapters, getChapterContent, incrementViewCount, purchaseChapter } from "../services/bookService";
import { saveHistory, toggleBookmark } from "../services/engagementService";
import { Lock, X, CheckCircle2 } from "lucide-react";
import { PageEffectWrapper, type PageEffect } from "../components/Reading/Effects/PageEffectWrapper";
import { PageEffectSelector } from "../components/Reading/Effects/PageEffectSelector";
import { splitTextIntoPages } from "../utils/splitTextIntoPages";
import { ReadingProgressBar } from "../components/Reading/ReadingProgressBar";
import { FloatingActions } from "../components/Reading/FloatingActions";
import { useAutoHideHeader } from "../hooks/useAutoHideHeader";

export default function ReadingPage() {
  const { id } = useParams<{ id: string }>();
  const { book, loading: bookLoading } = useBookDetail(id);
  const location = useLocation();
  const navigate = useNavigate();
  
  // States for chapters and contents
  const [chapters, setChapters] = useState<any[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [textContent, setTextContent] = useState<string>("");
  const [contentLoading, setContentLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [unlockPrice, setUnlockPrice] = useState(0);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Mode toggling
  const isComicFromState = location.state?.isComic;
  const defaultIsComic = isComicFromState !== undefined 
    ? isComicFromState 
    : (book ? (book.formatType === 2 || book.genres?.includes("Truyện tranh")) : false);
    
  const [isComicMode, setIsComicMode] = useState<boolean>(defaultIsComic);

  // New UI states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChapterListOpen, setIsChapterListOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // New Reading Settings states
  const [theme, setTheme] = useState<"light" | "dark" | "sepia">("dark");
  const [fontSize, setFontSize] = useState<number>(18);
  const [fontFamily, setFontFamily] = useState<string>("Roboto");
  const [lineHeight, setLineHeight] = useState<number>(1.8);
  const [imageFit, setImageFit] = useState<"width" | "height">("width");
  const [autoScrollSpeed, setAutoScrollSpeed] = useState<number>(0);

  // Page effect states
  const [pageIndex, setPageIndex] = useState(0);
  const [pageEffect, setPageEffect] = useState<PageEffect>(() => {
      return (localStorage.getItem('xomtruyen_page_effect') as PageEffect) || 'book';
  });

  const handleEffectChange = (effect: PageEffect) => {
      setPageEffect(effect);
      localStorage.setItem('xomtruyen_page_effect', effect);
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const isHeaderVisible = useAutoHideHeader();

  // Theme styling
  const themeStyles = {
    light: { bg: "#ffffff", text: "#374151", panel: "#f9fafb", border: "#e5e7eb", panelText: "#1a1a1a" },
    dark: { bg: "#0f0f1a", text: "#e0e0e0", panel: "#1a1a2e", border: "#2a2a3e", panelText: "#ffffff" },
    sepia: { bg: "#f4ecd8", text: "#5b4636", panel: "#e6d5b8", border: "#d5c4a1", panelText: "#3e2723" }
  };
  const currentTheme = themeStyles[theme];

  useEffect(() => {
    if (book) {
      setIsComicMode(defaultIsComic);
    }
  }, [book, defaultIsComic]);

  // Fetch chapters list when id is available
  useEffect(() => {
    if (id) {
      const fetcher = isComicMode ? getComicChapters : getTextChapters;
      fetcher(id).then(data => {
        setChapters(data);
        setCurrentChapterIndex(0); // Reset to first chapter
      });
    }
  }, [id, isComicMode]);

  // Fetch chapter content when chapter changes
  useEffect(() => {
    if (chapters.length > 0 && chapters[currentChapterIndex] && id) {
      const chapterId = chapters[currentChapterIndex].id;
      setContentLoading(true);
      getChapterContent(chapterId).then(data => {
        if (data?.isLocked) {
          setIsLocked(true);
          setUnlockPrice(data.unlockPrice);
          setImageUrls([]);
          setTextContent("");
        } else {
          setIsLocked(false);
          if (data && data.imageUrls) {
            setImageUrls(data.imageUrls);
          } else {
            setImageUrls([]);
          }
          if (data && data.content) {
            setTextContent(data.content);
          } else {
            setTextContent(chapters[currentChapterIndex].content || "");
          }
        }
        setContentLoading(false);
        setPageIndex(0); // Reset page on chapter change
        
        // Save History (1 for Book, 2 for Comic)
        const chapterType = isComicMode ? 2 : 1;
        saveHistory(id, chapterId, chapterType).catch(() => {});
        // Increment View Count
        incrementViewCount(id).catch(() => {});
      });
    } else {
      setImageUrls([]);
      setTextContent("");
      setPageIndex(0);
    }
  }, [chapters, currentChapterIndex, id, isComicMode]);

  const textPages = React.useMemo(() => {
    if (!textContent) return [];
    return splitTextIntoPages(textContent, 400);
  }, [textContent]);

  const comicPages = React.useMemo(() => {
    if (!imageUrls) return [];
    return imageUrls.map(url => ({ content: url, type: 'image' as const }));
  }, [imageUrls]);

  const maxPages = isComicMode ? comicPages.length : textPages.length;

  const handleToggleBookmark = async () => {
    if (chapters.length > 0 && chapters[currentChapterIndex]) {
      const chapterId = chapters[currentChapterIndex].id;
      const chapterType = isComicMode ? 2 : 1;
      try {
        const res = await toggleBookmark(chapterId, chapterType);
        if (res.message === "Added bookmark") {
          setIsBookmarked(true);
          alert("Đã thêm đánh dấu trang!");
        } else {
          setIsBookmarked(false);
          alert("Đã bỏ đánh dấu trang!");
        }
      } catch (err) {
        alert("Vui lòng đăng nhập để đánh dấu trang!");
      }
    }
  };

  const handlePrevPage = useCallback(() => {
    setCurrentChapterIndex(prev => Math.max(0, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentChapterIndex(prev => Math.min(chapters.length - 1, prev + 1));
  }, [chapters.length]);

  const toggleMode = () => {
    setIsComicMode(!isComicMode);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().then(() => setIsFullscreen(true)).catch(()=>{});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(()=>{});
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
      
      switch (e.key.toLowerCase()) {
        case "arrowleft":
        case "a":
          if (pageIndex > 0) {
              setPageIndex(prev => prev - 1);
          } else {
              handlePrevPage();
          }
          break;
        case "arrowright":
        case "d":
          if (pageIndex < maxPages - 1) {
              setPageIndex(prev => prev + 1);
          } else {
              handleNextPage();
          }
          break;
        case "f":
          handleToggleFullscreen();
          break;
        case "b":
          handleToggleBookmark();
          break;
        case "c":
          setIsChapterListOpen(prev => !prev);
          break;
        case "s":
          setIsSettingsOpen(prev => !prev);
          break;
        case "t":
          setTheme(prev => prev === "light" ? "dark" : prev === "dark" ? "sepia" : "light");
          break;
        case "m":
          toggleMode();
          break;
        case "+":
        case "=":
          setFontSize(prev => Math.min(prev + 2, 32));
          break;
        case "-":
          setFontSize(prev => Math.max(prev - 2, 12));
          break;
        case "escape":
          setIsSettingsOpen(false);
          setIsChapterListOpen(false);
          break;
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNextPage, handlePrevPage, pageIndex, maxPages]);

  // Auto-scroll logic (chỉ áp dụng cho chế độ đọc thông thường nếu trang dài)
  useEffect(() => {
    if (autoScrollSpeed > 0 && !isComicMode && pageEffect === 'onepage') {
      let animationFrameId: number;
      let lastTime = performance.now();
      const scroll = (time: number) => {
        const delta = time - lastTime;
        if (delta > 16) {
           window.scrollBy(0, autoScrollSpeed);
           lastTime = time;
        }
        animationFrameId = requestAnimationFrame(scroll);
      };
      animationFrameId = requestAnimationFrame(scroll);
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [autoScrollSpeed, isComicMode, pageEffect]);

  const handlePurchase = async () => {
    if (chapters.length > 0 && chapters[currentChapterIndex]) {
      const chapterId = chapters[currentChapterIndex].id;
      setIsPurchasing(true);
      const res = await purchaseChapter(chapterId);
      setIsPurchasing(false);
      if (res.success || res === true) {
        alert("Mua chương thành công!");
        setContentLoading(true);
        getChapterContent(chapterId).then(data => {
          if (!data?.isLocked) {
            setIsLocked(false);
            setImageUrls(data?.imageUrls || []);
            setTextContent(data?.content || chapters[currentChapterIndex].content || "");
          }
          setContentLoading(false);
          setPageIndex(0);
        });
      } else {
        if (window.confirm("Tài khoản không đủ xu. Bạn có muốn nạp thêm không?")) {
          navigate("/wallet");
        }
      }
    }
  };

  if (bookLoading) {
    return (
      <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: currentTheme.bg, color: currentTheme.text }}>
        Đang tải thông tin truyện...
      </main>
    );
  }

  const title = book?.title || "Đang tải...";
  const currentChapter = chapters[currentChapterIndex];
  const chapterNumber = currentChapter?.chapterNumber || (currentChapterIndex + 1);
  const chapterTitle = currentChapter?.title || `Chương ${chapterNumber}`;
  const totalChapters = chapters.length || 1;

  return (
    <main ref={containerRef} style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      backgroundColor: currentTheme.bg,
      color: currentTheme.text,
      height: "100%",
      minHeight: "100vh",
      position: "relative",
      transition: "background-color 0.3s, color 0.3s",
      overflowX: "hidden"
    }}>
      <ReadingProgressBar chapterId={chapters[currentChapterIndex]?.id?.toString() || id || "unknown"} />
      <FloatingActions 
          currentTheme={theme} 
          onToggleTheme={() => setTheme(prev => prev === "light" ? "dark" : prev === "dark" ? "sepia" : "light")} 
      />

      {/* Top Header */}
      <div style={{ 
          display: "flex", alignItems: "center", justifyContent: "space-between", 
          paddingRight: "20px", backgroundColor: currentTheme.bg, 
          position: "sticky", top: 0, zIndex: 10,
          transform: isHeaderVisible ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease',
          opacity: isHeaderVisible ? 1 : 0
      }}>
        <div style={{ flex: 1 }}>
          <ReadingHeader 
            title={title} 
            themeStyles={currentTheme}
            onToggleList={() => setIsChapterListOpen(!isChapterListOpen)}
            onToggleSettings={() => setIsSettingsOpen(!isSettingsOpen)}
            onToggleFullscreen={handleToggleFullscreen}
            onToggleBookmark={handleToggleBookmark}
            isBookmarked={isBookmarked}
          />
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            onClick={toggleMode}
            style={{
              padding: "8px 16px",
              backgroundColor: isComicMode ? "#4f46e5" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "14px",
              whiteSpace: "nowrap"
            }}
          >
            {isComicMode ? "Đang đọc: Truyện Tranh" : "Đang đọc: Truyện Chữ"}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, position: "relative" }}>
        {contentLoading && chapters.length > 0 ? (
          <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
            Đang tải chương...
          </div>
        ) : isLocked ? (
          <div style={{ padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
            <Lock size={64} color="#6b7280" style={{ marginBottom: "20px" }} />
            <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>CHƯƠNG NÀY YÊU CẦU MUA</h2>
            <div style={{ 
              background: currentTheme.panel, 
              padding: "30px", 
              borderRadius: "12px", 
              textAlign: "center",
              border: `1px solid ${currentTheme.border}`,
              maxWidth: "400px",
              width: "100%",
              zIndex: 2
            }}>
              <p style={{ fontSize: "18px", marginBottom: "5px" }}>Giá: <strong>{unlockPrice} xu</strong></p>
              <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "20px" }}>Số dư hiện tại: Vui lòng kiểm tra ví</p>
              
              <button 
                onClick={handlePurchase} 
                disabled={isPurchasing}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#f59e0b",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: isPurchasing ? "not-allowed" : "pointer",
                  marginBottom: "10px"
                }}
              >
                {isPurchasing ? "Đang xử lý..." : `🔓 MUA CHƯƠNG (${unlockPrice} xu)`}
              </button>
              <button 
                onClick={() => navigate("/wallet")}
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "transparent",
                  color: currentTheme.text,
                  border: `1px solid ${currentTheme.border}`,
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                💰 NẠP THÊM XU
              </button>
            </div>
            {/* Blurred placeholder */}
            <div style={{ marginTop: "40px", filter: "blur(8px)", opacity: 0.5, userSelect: "none", maxWidth: "800px", textAlign: "justify", lineHeight: 1.8 }}>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>
          </div>
        ) : isComicMode ? (
          <PageEffectWrapper
            effect={pageEffect}
            pages={comicPages}
            currentPage={pageIndex}
            onPageChange={setPageIndex}
            themeStyles={currentTheme}
            imageFit={imageFit}
          />
        ) : (
          <PageEffectWrapper
            effect={pageEffect}
            pages={textPages.map(t => ({ content: t, type: 'text' as const }))}
            currentPage={pageIndex}
            onPageChange={setPageIndex}
            themeStyles={currentTheme}
            fontSize={fontSize}
            fontFamily={fontFamily}
            lineHeight={lineHeight}
          />
        )}
      </div>

      {/* Bottom Bar: Slider */}
      <div style={{
        position: "sticky",
        bottom: 0,
        backgroundColor: currentTheme.panel,
        padding: "15px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderTop: `1px solid ${currentTheme.border}`,
        zIndex: 10
      }}>
        <button onClick={handlePrevPage} disabled={currentChapterIndex === 0} style={{ background: "none", border: "none", color: currentTheme.text, cursor: currentChapterIndex === 0 ? "not-allowed" : "pointer", fontWeight: "bold" }}>← Chương trước</button>
        <div style={{ flex: 1, margin: "0 20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "12px", color: currentTheme.text }}>Chương {currentChapterIndex + 1}</span>
          <input 
            type="range" 
            min={0} 
            max={Math.max(0, chapters.length - 1)} 
            value={currentChapterIndex} 
            onChange={(e) => setCurrentChapterIndex(Number(e.target.value))}
            style={{ flex: 1, cursor: "pointer" }}
          />
          <span style={{ fontSize: "12px", color: currentTheme.text }}>Chương {chapters.length}</span>
        </div>
        <button onClick={handleNextPage} disabled={currentChapterIndex === chapters.length - 1} style={{ background: "none", border: "none", color: currentTheme.text, cursor: currentChapterIndex === chapters.length - 1 ? "not-allowed" : "pointer", fontWeight: "bold" }}>Chương sau →</button>
      </div>

      {/* Chapter List Drawer */}
      {isChapterListOpen && (
        <div style={{
          position: "fixed",
          top: 0, right: 0, bottom: 0,
          width: "300px",
          backgroundColor: currentTheme.panel,
          color: currentTheme.panelText,
          boxShadow: "-2px 0 10px rgba(0,0,0,0.5)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          borderLeft: `1px solid ${currentTheme.border}`
        }}>
          <div style={{ padding: "20px", borderBottom: `1px solid ${currentTheme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>📋 Danh Sách Chương</h3>
            <button onClick={() => setIsChapterListOpen(false)} style={{ background: "none", border: "none", color: currentTheme.panelText, cursor: "pointer" }}><X size={20} /></button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
            {chapters.map((ch, idx) => (
              <div 
                key={ch.id} 
                onClick={() => { setCurrentChapterIndex(idx); setIsChapterListOpen(false); }}
                style={{ 
                  padding: "10px", 
                  cursor: "pointer", 
                  borderRadius: "6px",
                  backgroundColor: currentChapterIndex === idx ? "rgba(0, 212, 255, 0.2)" : "transparent",
                  color: currentTheme.panelText,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                {currentChapterIndex === idx ? <CheckCircle2 size={16} color="#00d4ff" /> : <div style={{width: 16}} />}
                Chương {ch.chapterNumber || (idx + 1)}: {ch.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {isSettingsOpen && (
        <div style={{
          position: "fixed",
          top: "80px", right: "20px",
          width: "350px",
          backgroundColor: currentTheme.panel,
          color: currentTheme.panelText,
          boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
          borderRadius: "12px",
          padding: "20px",
          zIndex: 50,
          border: `1px solid ${currentTheme.border}`,
          maxHeight: "80vh",
          overflowY: "auto"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ margin: 0 }}>⚙️ Cài đặt đọc</h3>
            <button onClick={() => setIsSettingsOpen(false)} style={{ background: "none", border: "none", color: currentTheme.panelText, cursor: "pointer" }}><X size={20} /></button>
          </div>
          
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "10px", fontSize: "14px", fontWeight: "bold" }}>Hiệu Ứng Lật Trang:</label>
            <PageEffectSelector 
               selected={pageEffect} 
               onChange={handleEffectChange} 
               themeStyles={currentTheme} 
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>Nền:</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setTheme("light")} style={{ flex: 1, padding: "8px", border: theme === "light" ? "2px solid #00d4ff" : "1px solid #ccc", background: "#fff", color: "#000", borderRadius: "6px", cursor: "pointer" }}>Sáng</button>
              <button onClick={() => setTheme("dark")} style={{ flex: 1, padding: "8px", border: theme === "dark" ? "2px solid #00d4ff" : "1px solid #333", background: "#0f0f1a", color: "#fff", borderRadius: "6px", cursor: "pointer" }}>Tối</button>
              <button onClick={() => setTheme("sepia")} style={{ flex: 1, padding: "8px", border: theme === "sepia" ? "2px solid #00d4ff" : "1px solid #d5c4a1", background: "#f4ecd8", color: "#5b4636", borderRadius: "6px", cursor: "pointer" }}>Sepia</button>
            </div>
          </div>

          {!isComicMode && (
            <>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>Font chữ:</label>
                <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: "6px", background: currentTheme.bg, color: currentTheme.text, border: `1px solid ${currentTheme.border}` }}>
                  <option value="Roboto">Roboto</option>
                  <option value="Literata">Literata</option>
                  <option value="Merriweather">Merriweather</option>
                  <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
                </select>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>Cỡ chữ ({fontSize}px):</label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button onClick={() => setFontSize(prev => Math.max(12, prev - 2))} style={{ padding: "5px 15px", borderRadius: "6px", cursor: "pointer", background: currentTheme.bg, color: currentTheme.text, border: `1px solid ${currentTheme.border}` }}>A-</button>
                  <input type="range" min="12" max="32" step="2" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} style={{ flex: 1 }} />
                  <button onClick={() => setFontSize(prev => Math.min(32, prev + 2))} style={{ padding: "5px 15px", borderRadius: "6px", cursor: "pointer", background: currentTheme.bg, color: currentTheme.text, border: `1px solid ${currentTheme.border}` }}>A+</button>
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>Khoảng cách dòng ({lineHeight}):</label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button onClick={() => setLineHeight(prev => Math.max(1.0, Number((prev - 0.2).toFixed(1))))} style={{ padding: "5px 15px", borderRadius: "6px", cursor: "pointer", background: currentTheme.bg, color: currentTheme.text, border: `1px solid ${currentTheme.border}` }}>-</button>
                  <input type="range" min="1.0" max="3.0" step="0.2" value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))} style={{ flex: 1 }} />
                  <button onClick={() => setLineHeight(prev => Math.min(3.0, Number((prev + 0.2).toFixed(1))))} style={{ padding: "5px 15px", borderRadius: "6px", cursor: "pointer", background: currentTheme.bg, color: currentTheme.text, border: `1px solid ${currentTheme.border}` }}>+</button>
                </div>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>Cuộn tự động ({autoScrollSpeed > 0 ? "Bật" : "Tắt"}):</label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{fontSize: "12px"}}>Tắt</span>
                  <input type="range" min="0" max="3" step="0.5" value={autoScrollSpeed} onChange={(e) => setAutoScrollSpeed(Number(e.target.value))} style={{ flex: 1 }} />
                  <span style={{fontSize: "12px"}}>Nhanh</span>
                </div>
                <div style={{fontSize: "11px", color: "#888", marginTop: "4px"}}>*Chỉ hoạt động khi hiệu ứng lật là One Page</div>
              </div>
            </>
          )}

          {isComicMode && (
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "bold" }}>Chế độ ảnh:</label>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setImageFit("width")} style={{ flex: 1, padding: "8px", border: imageFit === "width" ? "2px solid #00d4ff" : `1px solid ${currentTheme.border}`, background: currentTheme.bg, color: currentTheme.text, borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>Vừa ngang</button>
                <button onClick={() => setImageFit("height")} style={{ flex: 1, padding: "8px", border: imageFit === "height" ? "2px solid #00d4ff" : `1px solid ${currentTheme.border}`, background: currentTheme.bg, color: currentTheme.text, borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}>Vừa dọc</button>
              </div>
            </div>
          )}
        </div>
      )}

    </main>
  );
}
