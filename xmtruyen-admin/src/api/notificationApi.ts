import { apiClient } from './userApi';

export interface Notification {
  id: string;
  userId: string | null;
  title: string;
  message: string;
  type: string;
  referenceId: string | null;
  referenceType: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface SaveNotificationRequest {
  title: string;
  message: string;
  type: string;
  userId?: string | null;
  referenceId?: string | null;
  referenceType?: string | null;
}

export const getNotifications = async (type?: string, page = 1, pageSize = 20): Promise<PaginatedResponse<Notification>> => {
  return apiClient.get<any, PaginatedResponse<Notification>>('/admin/notifications', {
    params: { type, page, pageSize }
  });
};

export const createNotification = async (data: SaveNotificationRequest): Promise<Notification> => {
  return apiClient.post<any, Notification>('/admin/notifications', data);
};

export const deleteNotification = async (id: string): Promise<any> => {
  return apiClient.delete<any, any>(`/admin/notifications/${id}`);
};
