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
      // 1. Sách mới mỗi ngày - Free
      const freeRes = await getPublications({ displayLabel: 'Sách mới mỗi ngày - Free', pageSize: 15 });
      // 2. Sách mới mỗi ngày - Dành cho Hội viên!
      const memberRes = await getPublications({ displayLabel: 'Sách mới mỗi ngày - Dành cho Hội viên!', pageSize: 15 });
      // 3. Truyện Tranh
      const comicRes = await getPublications({ displayLabel: 'Truyện Tranh', pageSize: 15 });

      setLatestBooks(freeRes.books);
      setRecommendedBooks(memberRes.books);
      setComicBooks(comicRes.books);
      
      const allBooks = [...freeRes.books, ...memberRes.books, ...comicRes.books];
      const highRated = allBooks.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0)).slice(0, 15);
      setRatedBooks(highRated);

      // Cập nhật Sections tổng thể
      setSections([
        {
          id: "free",
          title: "Sách mới mỗi ngày - Free",
          subtitle: "(Miễn phí)",
          books: freeRes.books,
          size: "large",
        },
        {
          id: "member",
          title: "Sách mới mỗi ngày - Dành cho Hội viên!",
          subtitle: "(Dành cho Hội viên)",
          books: memberRes.books,
          size: "large",
        },
        {
          id: "comic",
          title: "Truyện Tranh",
          subtitle: "(Hấp dẫn)",
          books: comicRes.books,
          size: "large",
        }
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

