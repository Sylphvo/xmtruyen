import { useState, useEffect } from "react";
import axios from "axios";
import type { Book } from "../types";

export function useBooks() {
  const [latestBooks, setLatestBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5172";

  useEffect(() => {
    const fetchLatestBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/api/books?pageSize=10`);
        const data = response.data?.data || [];
        
        const books: Book[] = data.map((item: any, index: number) => ({
          id: item.id,
          title: item.title,
          author: item.author,
          coverImageUrl: item.coverImageUrl,
          viewCount: item.viewCount,
          averageRating: item.averageRating,
          slug: item.slug,
          formatType: item.formatType,
          accessLevel: item.accessLevel,
          coverIndex: index % 10,
          genres: [], 
          currentChapter: item.chapters?.length || 1, 
          lastUpdated: "Mới nhất",
        }));
        
        setLatestBooks(books);
      } catch (err: any) {
        setError(err.message || "Lỗi tải sách");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBooks();
  }, [baseUrl]);

  return { latestBooks, loading, error };
}
