import axios from 'axios';
import { errorService } from '../services/errorService';
// 1. TYPES & INTERFACES
// ==========================================

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  provider: string;
  coinBalance: number;
  currentPlanId: number | null;
  currentPlanName: string | null;
  planExpiredAt: string | null;
  totalGuestReads: number;
  dailyReadCount: number;
  createdAt: string;
  isActive: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface GetUsersParams {
  searchKeyword?: string;
  provider?: string;
  isActive?: boolean;
  minCoinBalance?: number;
  maxCoinBalance?: number;
  currentPlanId?: number;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  isDescending?: boolean;
}

export interface SaveUserRequest {
  email: string;
  password?: string;
  fullName?: string;
  avatarUrl?: string;
  coinBalance?: number;
  currentPlanId?: number;
  planExpiredAt?: string;
  isActive?: boolean;
}

// ==========================================
// 2. AXIOS CONFIGURATION
// ==========================================

const BASE_URL = 'http://localhost:5172/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data; 
  },
  (error) => {
    errorService.captureApiError(error, error.config?.url);
    if (error.response?.status === 401) {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    const message = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi gọi API.';
    return Promise.reject(new Error(message));
  }
);

// ==========================================
// 3. USER API ENDPOINTS
// ==========================================

/**
 * 1. Lấy danh sách Users (có phân trang & filter)
 */
export const getUsers = async (params?: GetUsersParams): Promise<PaginatedResponse<User>> => {
  return apiClient.get<any, PaginatedResponse<User>>('/users', { params });
};

/**
 * 2. Lấy chi tiết 1 User theo ID
 */
export const getUserById = async (id: string): Promise<User> => {
  return apiClient.get<any, User>(`/users/${id}`);
};

/**
 * 3. Tạo mới User
 */
export const createUser = async (data: SaveUserRequest): Promise<User> => {
  return apiClient.post<any, User>('/users', data);
};

/**
 * 4. Cập nhật User
 */
export const updateUser = async (id: string, data: SaveUserRequest): Promise<User> => {
  return apiClient.put<any, User>(`/users/${id}`, data);
};

/**
 * 5. Cập nhật Trạng thái User (Bật/Tắt khóa tài khoản)
 */
export const updateUserStatus = async (id: string, isActive: boolean): Promise<void> => {
  return apiClient.patch<any, void>(`/users/${id}/status`, isActive, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

/**
 * 6. Xóa User
 */
export const deleteUser = async (id: string): Promise<void> => {
  return apiClient.delete<any, void>(`/users/${id}`);
};
