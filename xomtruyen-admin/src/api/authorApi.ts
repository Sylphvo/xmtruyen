import { apiClient } from './userApi';

export interface Author {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  website?: string;
  twitter?: string;
  createdAt: string;
  publicationCount?: number;
}

export const getAuthors = async (): Promise<Author[]> => {
  return apiClient.get<any, Author[]>('/admin/authors');
};

export const getAuthorDetail = async (id: string): Promise<Author> => {
  return apiClient.get<any, Author>(`/admin/authors/${id}`);
};

export const createAuthor = async (data: Omit<Author, 'id' | 'createdAt' | 'publicationCount'>): Promise<Author> => {
  return apiClient.post<any, Author>('/admin/authors', data);
};

export const updateAuthor = async (id: string, data: Omit<Author, 'id' | 'createdAt' | 'publicationCount'>): Promise<Author> => {
  return apiClient.put<any, Author>(`/admin/authors/${id}`, data);
};

export const deleteAuthor = async (id: string): Promise<any> => {
  return apiClient.delete<any, any>(`/admin/authors/${id}`);
};
