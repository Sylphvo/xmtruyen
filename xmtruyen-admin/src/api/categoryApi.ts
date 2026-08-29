import { apiClient, type PaginatedResponse } from './userApi';
import type { ICategory } from '../types/category';

export interface GetCategoriesParams {
  searchKeyword?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  isDescending?: boolean;
}

export interface SaveCategoryRequest {
  name: string;
}

export const getCategories = async (params?: GetCategoriesParams): Promise<PaginatedResponse<ICategory>> => {
  return apiClient.get<any, PaginatedResponse<ICategory>>('/categories', { params });
};

export const getCategoryById = async (id: number): Promise<ICategory> => {
  return apiClient.get<any, ICategory>(`/categories/${id}`);
};

export const createCategory = async (data: SaveCategoryRequest): Promise<ICategory> => {
  return apiClient.post<any, ICategory>('/categories', data);
};

export const updateCategory = async (id: number, data: SaveCategoryRequest): Promise<void> => {
  return apiClient.put<any, void>(`/categories/${id}`, data);
};

export const deleteCategory = async (id: number): Promise<void> => {
  return apiClient.delete<any, void>(`/categories/${id}`);
};
