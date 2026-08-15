import { apiClient, type PaginatedResponse } from './userApi';

export interface Review {
  id: string;
  publicationId: string;
  publicationTitle: string;
  userId: string;
  userName: string;
  rating: number;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getReviews = async (publicationId?: string, page: number = 1, pageSize: number = 50): Promise<PaginatedResponse<Review>> => {
  let url = `/admin/reviews?page=${page}&pageSize=${pageSize}`;
  if (publicationId) url += `&publicationId=${publicationId}`;
  return apiClient.get<any, PaginatedResponse<Review>>(url);
};

export const deleteReview = async (id: string): Promise<any> => {
  return apiClient.delete<any, any>(`/admin/reviews/${id}`);
};
