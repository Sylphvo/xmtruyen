import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5172/api',
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor for auth
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==========================================
// TYPES
// ==========================================

export interface Bookmark {
  id: string;
  userId: string;
  chapterId: string;
  chapterType: number;
  chapterTitle: string;
  publicationTitle: string;
  createdAt: string;
}

export interface BookmarkRequest {
  chapterId: string;
  chapterType: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

// ==========================================
// API METHODS
// ==========================================

export const getBookmarks = async (page: number = 1, pageSize: number = 20): Promise<PaginatedResponse<Bookmark>> => {
  const response = await apiClient.get<PaginatedResponse<Bookmark>>('/bookmarks', {
    params: { page, pageSize }
  });
  return response.data;
};

export const toggleBookmark = async (request: BookmarkRequest): Promise<Bookmark> => {
  const response = await apiClient.post<{ success: boolean; data: Bookmark }>('/bookmarks', request);
  return response.data.data;
};

export const deleteBookmark = async (id: string): Promise<void> => {
  await apiClient.delete(`/bookmarks/${id}`);
};
