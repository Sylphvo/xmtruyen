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

export interface Favorite {
  id: string;
  userId: string;
  publicationId: string;
  publicationTitle: string;
  coverImageUrl?: string;
  createdAt: string;
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

export const getFavorites = async (page: number = 1, pageSize: number = 20): Promise<PaginatedResponse<Favorite>> => {
  const response = await apiClient.get<PaginatedResponse<Favorite>>('/favorites', {
    params: { page, pageSize }
  });
  return response.data;
};

export const toggleFavorite = async (publicationId: string): Promise<boolean> => {
  const response = await apiClient.post<{ success: boolean; data: boolean }>(`/favorites/toggle/${publicationId}`);
  return response.data.data;
};

export const checkFavorite = async (publicationId: string): Promise<boolean> => {
  const response = await apiClient.get<{ success: boolean; data: boolean }>(`/favorites/check/${publicationId}`);
  return response.data.data;
};
