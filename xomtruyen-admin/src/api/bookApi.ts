import { apiClient, type PaginatedResponse } from './userApi';
import type { IBook } from '../types/book';

export interface GetBooksParams {
  keyword?: string;
  categoryId?: string;
  formatType?: number;
  accessLevel?: number;
  page?: number;
  pageSize?: number;
}

export interface SaveBookRequest {
  id?: string;
  title: string;
  formatType: number;
  accessLevel: number;
  author: string;
  description?: string;
  coverImageUrl?: string;
  categoryIds?: number[];
  topicIds?: number[];
}

export const getBooks = async (params?: GetBooksParams): Promise<PaginatedResponse<IBook>> => {
  return apiClient.get<any, PaginatedResponse<IBook>>('/Publications', { params });
};

export const getBookById = async (id: string): Promise<IBook> => {
  return apiClient.get<any, IBook>(`/Publications/${id}`);
};

export const createBook = async (data: SaveBookRequest): Promise<IBook> => {
  return apiClient.post<any, IBook>('/Publications', data);
};

export const updateBook = async (id: string, data: SaveBookRequest): Promise<void> => {
  return apiClient.put<any, void>(`/Publications/${id}`, data);
};

export const deleteBook = async (id: string): Promise<void> => {
  return apiClient.delete<any, void>(`/Publications/${id}`);
};

export const toggleRecommended = async (id: string, isRecommended: boolean): Promise<void> => {
  return apiClient.patch<any, void>(`/Publications/${id}/recommended`, isRecommended, {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const toggleExclusive = async (id: string, isExclusive: boolean): Promise<void> => {
  return apiClient.patch<any, void>(`/Publications/${id}/exclusive`, isExclusive, {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const toggleStatus = async (id: string, status: string): Promise<void> => {
  return apiClient.patch<any, void>(`/Publications/${id}/status`, `"${status}"`, {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const uploadBookFile = async (file: File, bookId?: string): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  if (bookId) formData.append('PublicationId', bookId);

  return apiClient.post<any, any>('/Upload/Publication-file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const uploadCoverImage = async (file: File, publicationId?: string): Promise<{ success: boolean; url: string; publicationId?: string; message: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  if (publicationId) formData.append('publicationId', publicationId);

  return apiClient.post<any, { success: boolean; url: string; publicationId?: string; message: string }>('/Upload/cover-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
