import { apiClient } from './userApi';

export interface BookChapter {
  id: string;
  publicationId: string;
  chapterNumber: number;
  title?: string;
  content?: string;
  isLocked: boolean;
  coinPrice?: number;
  viewCount?: number;
  createdAt?: string;
  contentPreview?: string;
}

export const getChapters = async (publicationId: string): Promise<BookChapter[]> => {
  return apiClient.get<any, BookChapter[]>(`/admin/book-chapters?publicationId=${publicationId}`);
};

export const getChapter = async (id: string): Promise<BookChapter> => {
  return apiClient.get<any, BookChapter>(`/admin/book-chapters/${id}`);
};

export const createChapter = async (data: Partial<BookChapter>): Promise<BookChapter> => {
  return apiClient.post<any, BookChapter>('/admin/book-chapters', data);
};

export const updateChapter = async (id: string, data: Partial<BookChapter>): Promise<BookChapter> => {
  return apiClient.put<any, BookChapter>(`/admin/book-chapters/${id}`, data);
};

export const deleteChapter = async (id: string): Promise<any> => {
  return apiClient.delete<any, any>(`/admin/book-chapters/${id}`);
};
