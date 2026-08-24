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

export const getReviews = async (
  publicationId?: string,
  page: number = 1,
  pageSize: number = 50,
  minRating?: number,
  maxRating?: number
): Promise<PaginatedResponse<Review>> => {
  let url = `/admin/reviews?page=${page}&pageSize=${pageSize}`;
  if (publicationId) url += `&publicationId=${publicationId}`;
  if (minRating !== undefined) url += `&minRating=${minRating}`;
  if (maxRating !== undefined) url += `&maxRating=${maxRating}`;
  return apiClient.get<any, PaginatedResponse<Review>>(url);
};

export const deleteReview = async (id: string): Promise<any> => {
  return apiClient.delete<any, any>(`/admin/reviews/${id}`);
};

export const getReviewStats = async (): Promise<{ totalReviews: number; averageRating: number; reviewsToday: number }> => {
  return apiClient.get<any, { totalReviews: number; averageRating: number; reviewsToday: number }>('/admin/reviews/stats');
};
