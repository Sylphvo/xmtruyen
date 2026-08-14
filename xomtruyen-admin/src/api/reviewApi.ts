import { apiClient } from './userApi';

export interface IReview {
  id: string;
  rating: number;
  content: string;
  createdAt: string;
  user: { id: string; email: string; fullName: string };
  publication: { id: string; title: string };
}

export const getReviews = async (page: number = 1, pageSize: number = 20): Promise<{ data: IReview[], totalCount: number }> => {
  return apiClient.get<any, { data: IReview[], totalCount: number }>(`/admin/reviews?page=${page}&pageSize=${pageSize}`);
};

export const deleteReview = async (id: string): Promise<any> => {
  return apiClient.delete<any, any>(`/admin/reviews/${id}`);
};
