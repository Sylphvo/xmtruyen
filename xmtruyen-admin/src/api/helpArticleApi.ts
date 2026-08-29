import { apiClient } from './userApi';

export interface HelpArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  contentHtml: string;
  viewCount: number;
  orderIndex: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  authorName?: string;
}

export const getArticles = async (): Promise<HelpArticle[]> => {
  return apiClient.get<any, HelpArticle[]>('/admin/help-articles');
};

export const getArticle = async (id: string): Promise<HelpArticle> => {
  return apiClient.get<any, HelpArticle>(`/admin/help-articles/${id}`);
};

export const createArticle = async (data: Partial<HelpArticle>): Promise<HelpArticle> => {
  return apiClient.post<any, HelpArticle>('/admin/help-articles', data);
};

export const updateArticle = async (id: string, data: Partial<HelpArticle>): Promise<HelpArticle> => {
  return apiClient.put<any, HelpArticle>(`/admin/help-articles/${id}`, data);
};

export const deleteArticle = async (id: string): Promise<any> => {
  return apiClient.delete<any, any>(`/admin/help-articles/${id}`);
};
