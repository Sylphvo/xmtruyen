import axios from "axios";
import type { Book, PublicationFilter } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5172";

// Helper function to map API publication item to Book model
export function mapPublicationToBook(item: any, index: number = 0): Book {
  const genres =
    item.categories?.map((c: any) => (typeof c === "string" ? c : c.name || c.Name)) ||
    item.Categories?.map((c: any) => (typeof c === "string" ? c : c.name || c.Name)) ||
    item.genres ||
    [];

  let lastUpdated = "Vừa xong";
  if (item.updatedAt || item.UpdatedAt || item.createdAt || item.CreatedAt) {
    const date = new Date(item.updatedAt || item.UpdatedAt || item.createdAt || item.CreatedAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      lastUpdated = "Vừa xong";
    } else if (diffHours < 24) {
      lastUpdated = `${diffHours} giờ trước`;
    } else if (diffDays < 7) {
      lastUpdated = `${diffDays} ngày trước`;
    } else {
      lastUpdated = date.toLocaleDateString("vi-VN");
    }
  }

  return {
    id: item.id || item.Id || `book-${index + 1}`,
    title: item.title || item.Title || "Chưa có tiêu đề",
    author: item.author || item.Author || "Đang cập nhật",
    coverImageUrl: item.coverImageUrl || item.CoverImageUrl || item.coverUrl || item.CoverUrl || "",
    images: item.images || item.Images || undefined,
    coverIndex: typeof item.coverIndex === "number" ? item.coverIndex : index % 10,
    genres: genres.length > 0 ? genres : ["Tiên Hiệp", "Huyền Huyễn"],
    currentChapter:
      item.totalChapters ||
      item.chapters?.length ||
      item.Chapters?.length ||
      item.currentChapter ||
      1,
    lastUpdated,
    viewCount: item.viewCount ?? item.ViewCount ?? 0,
    averageRating: item.averageRating ?? item.AverageRating ?? 5.0,
    slug: item.slug || item.Slug || "",
    formatType: item.formatType ?? item.FormatType ?? 1,
    accessLevel: item.accessLevel ?? item.AccessLevel ?? 1,
    isMember: (item.accessLevel ?? item.AccessLevel) === 2 || item.isMember === true,
    isRecommended: item.isRecommended ?? item.IsRecommended ?? false,
    isExclusive: item.isExclusive ?? item.IsExclusive ?? false,
    status: item.status || item.Status || "Published",
    description:
      item.description ||
      item.Description ||
      item.summary ||
      item.Summary ||
      "Ăn uống là việc thiết yếu hằng ngày nhưng do nhịp sống hiện đại quá tất bật nên việc ăn uống đôi khi trở nên tốn quá nhiều thời gian, vì vậy lĩnh vực kinh doanh thức ăn nhanh trở nên phát đạt. Tuy nhiên, cách ăn uống như vậy không chỉ không có lợi cho s...",
  };
}

/**
 * Fetch list of books/publications from API
 */
export async function getPublications(filter?: PublicationFilter): Promise<{ books: Book[]; totalCount: number }> {
  const endpoints = [
    `${API_BASE_URL}/api/Publications`,
    `${API_BASE_URL}/api/books`,
    `${API_BASE_URL}/api/ManagerDB/data/Publications`,
  ];

  const params: any = {
    pageSize: filter?.pageSize || 20,
    page: filter?.page || 1,
  };

  if (filter?.keyword) params.keyword = filter.keyword;
  if (filter?.categoryId) params.categoryId = filter.categoryId;
  if (filter?.formatType !== undefined) params.formatType = filter.formatType;
  if (filter?.accessLevel !== undefined) params.accessLevel = filter.accessLevel;
  if (filter?.status) params.status = filter.status;
  if (filter?.isRecommended !== undefined) params.isRecommended = filter.isRecommended;
  if (filter?.isExclusive !== undefined) params.isExclusive = filter.isExclusive;

  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(endpoint, { params, timeout: 4000 });
      const rawData = response.data;

      let list: any[] = [];
      let total = 0;

      if (Array.isArray(rawData)) {
        list = rawData;
        total = rawData.length;
      } else if (Array.isArray(rawData?.data || rawData?.Data)) {
        list = rawData.data || rawData.Data;
        total = rawData.totalCount ?? rawData.TotalCount ?? list.length;
      } else if (Array.isArray(rawData?.items || rawData?.Items)) {
        list = rawData.items || rawData.Items;
        total = rawData.totalCount ?? rawData.TotalCount ?? list.length;
      }

      if (list.length > 0 || response.status === 200) {
        const books = list.map((item, idx) => mapPublicationToBook(item, idx));
        return { books, totalCount: total };
      }
    } catch {
      // Continue to next endpoint if this one failed
    }
  }

  return { books: [], totalCount: 0 };
}

/**
 * Fetch a single book by ID
 */
export async function getBookById(id: string | number): Promise<Book | null> {
  const endpoints = [
    `${API_BASE_URL}/api/Publications/${id}`,
    `${API_BASE_URL}/api/books/${id}`,
    `${API_BASE_URL}/api/ManagerDB/data/Publications/${id}`,
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(endpoint, { timeout: 4000 });
      const raw = response.data?.data || response.data?.Data || response.data;
      if (raw && (raw.id || raw.Id || raw.title || raw.Title)) {
        return mapPublicationToBook(raw);
      }
    } catch {
      // Continue to next endpoint
    }
  }

  return null;
}

/**
 * Fetch chapters for a publication
 */
export async function getComicChapters(publicationId: string | number): Promise<any[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/AdminComicChapter/publication/${publicationId}`);
    const data = response.data?.data || response.data || [];
    // Sort by chapter number ascending
    return data.sort((a: any, b: any) => (a.chapterNumber || 0) - (b.chapterNumber || 0));
  } catch {
    return [];
  }
}

/**
 * Fetch chapter content (images or text)
 */
export async function getChapterContent(chapterId: string | number): Promise<any> {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/Reading/chapter/${chapterId}`);
    const data = response.data?.data || null;
    
    if (data && data.imageUrls && Array.isArray(data.imageUrls)) {
      data.imageUrls = data.imageUrls.map((url: string) => {
        if (url.startsWith("http")) return url;
        return url.startsWith("/") ? `${API_BASE_URL}${url}` : `${API_BASE_URL}/${url}`;
      });
    }
    
    return data;
  } catch {
    return null;
  }
}

