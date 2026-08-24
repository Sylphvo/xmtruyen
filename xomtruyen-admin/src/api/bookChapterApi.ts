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

export const deleteAllChapters = async (publicationId: string): Promise<{ deletedCount: number }> => {
  return apiClient.delete<any, { deletedCount: number }>(`/admin/book-chapters/publication/${publicationId}/all`);
};

export const reorderChapters = async (chapters: Array<{ id: string; chapterNumber: number }>): Promise<void> => {
  return apiClient.patch<any, void>('/admin/book-chapters/reorder', chapters);
};

export const bulkCreateChapters = async (
  publicationId: string,
  chapters: Array<Pick<BookChapter, 'chapterNumber' | 'title' | 'content' | 'isLocked' | 'coinPrice'>>
): Promise<BookChapter[]> => {
  return apiClient.post<any, BookChapter[]>(`/admin/book-chapters/publication/${publicationId}/bulk-create`, chapters);
};
