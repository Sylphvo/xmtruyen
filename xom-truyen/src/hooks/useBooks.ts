import { useState, useEffect, useCallback } from "react";
import type { Book, SectionData } from "../types";
import { SECTIONS, NEW_BOOKS, RECOMMENDED_BOOKS, EXCLUSIVE_BOOKS, RATED_BOOKS } from "../constants";
import { getPublications, getBookById } from "../services/bookService";

export function useBooks() {
  const [latestBooks, setLatestBooks] = useState<Book[]>(NEW_BOOKS);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>(RECOMMENDED_BOOKS);
  const [exclusiveBooks, setExclusiveBooks] = useState<Book[]>(EXCLUSIVE_BOOKS);
  const [ratedBooks, setRatedBooks] = useState<Book[]>(RATED_BOOKS);
  const [comicBooks, setComicBooks] = useState<Book[]>([]);
  const [sections, setSections] = useState<SectionData[]>(SECTIONS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllBooks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Lấy danh sách truyện mới nhất
      const latestRes = await getPublications({ pageSize: 15 });
      if (latestRes.books.length > 0) {
        setLatestBooks(latestRes.books);
      }

      // 2. Lấy danh sách truyện tranh
      const comicRes = await getPublications({ formatType: 2, pageSize: 15 });
      if (comicRes.books.length > 0) {
        setComicBooks(comicRes.books);
      }

      // 3. Lấy danh sách truyện đề xuất
      const recRes = await getPublications({ isRecommended: true, pageSize: 15 });
      if (recRes.books.length > 0) {
        setRecommendedBooks(recRes.books);
      }

      // 4. Lấy danh sách truyện độc quyền
      const excRes = await getPublications({ isExclusive: true, pageSize: 15 });
      if (excRes.books.length > 0) {
        setExclusiveBooks(excRes.books);
      }

      const highRated = latestRes.books.length > 0
        ? [...latestRes.books].sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0))
        : RATED_BOOKS;
      setRatedBooks(highRated);

      // Cập nhật Sections tổng thể
      setSections([
        {
          id: "new",
          title: "Mới Nhất",
          subtitle: "(Sách Mới)",
          books: latestRes.books.length > 0 ? latestRes.books : NEW_BOOKS,
          size: "large",
        },
        {
          id: "recommend",
          title: "Sách Được Đề Xuất",
          subtitle: "(Xem Thêm)",
          books: recRes.books.length > 0 ? recRes.books : RECOMMENDED_BOOKS,
          size: "large",
        },
        {
          id: "exclusive",
          title: "Sách Độc Quyền",
          subtitle: "(Đọc Thêm)",
          books: excRes.books.length > 0 ? excRes.books : EXCLUSIVE_BOOKS,
          size: "large",
        },
        {
          id: "rated",
          title: "Sách Được Đánh Giá Cao",
          subtitle: "(Phổ Biến)",
          books: highRated,
          size: "large",
        },
      ]);
    } catch (err: any) {
      setError(err.message || "Lỗi tải danh sách truyện");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllBooks();
  }, [fetchAllBooks]);

  return {
    latestBooks,
    recommendedBooks,
    exclusiveBooks,
    ratedBooks,
    comicBooks,
    sections,
    loading,
    error,
    refetch: fetchAllBooks,
  };
}

export function useBookDetail(id: string | number | undefined) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBookById(id);
        if (data) {
          setBook(data);
        } else {
          // Fallback tìm trong constants nếu API chưa có cuốn sách này
          const allLocal = [...NEW_BOOKS, ...RECOMMENDED_BOOKS, ...EXCLUSIVE_BOOKS, ...RATED_BOOKS];
          const found = allLocal.find((b) => String(b.id) === String(id));
          if (found) {
            setBook(found);
          }
        }
      } catch (err: any) {
        setError(err.message || "Lỗi tải chi tiết truyện");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  return { book, loading, error };
}

