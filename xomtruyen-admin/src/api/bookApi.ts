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
  return apiClient.get<any, PaginatedResponse<IBook>>('/books', { params });
};

export const getBookById = async (id: string): Promise<IBook> => {
  return apiClient.get<any, IBook>(`/books/${id}`);
};

export const createBook = async (data: SaveBookRequest): Promise<IBook> => {
  return apiClient.post<any, IBook>('/books', data);
};

export const updateBook = async (id: string, data: SaveBookRequest): Promise<void> => {
  return apiClient.put<any, void>(`/books/${id}`, data);
};

export const deleteBook = async (id: string): Promise<void> => {
  return apiClient.delete<any, void>(`/books/${id}`);
};

export const toggleRecommended = async (id: string, isRecommended: boolean): Promise<void> => {
  return apiClient.patch<any, void>(`/books/${id}/recommended`, isRecommended, {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const toggleExclusive = async (id: string, isExclusive: boolean): Promise<void> => {
  return apiClient.patch<any, void>(`/books/${id}/exclusive`, isExclusive, {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const toggleStatus = async (id: string, status: string): Promise<void> => {
  return apiClient.patch<any, void>(`/books/${id}/status`, `"${status}"`, {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const uploadBookFile = async (file: File, bookId?: string): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  if (bookId) formData.append('bookId', bookId);

  return apiClient.post<any, any>('/Upload/book-file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};
