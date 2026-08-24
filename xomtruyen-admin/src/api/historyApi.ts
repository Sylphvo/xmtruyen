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

export interface ReadingHistory {
  id: string;
  userId: string;
  publicationId: string;
  publicationTitle: string;
  lastChapterId: string;
  lastChapterTitle: string;
  coverImageUrl?: string;
  lastReadAt: string;
  createdAt: string;
}

export interface HistoryRequest {
  publicationId: string;
  lastChapterId: string;
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

export const getHistory = async (page: number = 1, pageSize: number = 20): Promise<PaginatedResponse<ReadingHistory>> => {
  const response = await apiClient.get<PaginatedResponse<ReadingHistory>>('/history', {
    params: { page, pageSize }
  });
  return response.data;
};

export const saveHistory = async (request: HistoryRequest): Promise<ReadingHistory> => {
  const response = await apiClient.post<{ success: boolean; data: ReadingHistory }>('/history', request);
  return response.data.data;
};

export const deleteHistory = async (publicationId: string): Promise<void> => {
  await apiClient.delete(`/history/${publicationId}`);
};

export const clearHistory = async (): Promise<void> => {
  await apiClient.delete('/history/clear');
};
