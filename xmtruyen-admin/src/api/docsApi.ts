import { apiClient, type PaginatedResponse } from './userApi';

export interface IDocument {
  id: number;
  workspaceId: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  contentMarkdown: string;
  ownerId?: number;
  ownerName?: string;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface GetDocsParams {
  search?: string;
  type?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDesc?: boolean;
}

export interface SaveDocRequest {
  workspaceId?: string; // Only needed for create
  title: string;
  slug: string;
  type: string;
  contentMarkdown: string;
}

export const getDocs = async (resource: string, params?: GetDocsParams): Promise<PaginatedResponse<IDocument>> => {
  return apiClient.get<any, PaginatedResponse<IDocument>>(`/admin/${resource}/docs`, { params });
};

export const getDocById = async (id: number): Promise<IDocument> => {
  return apiClient.get<any, IDocument>(`/admin/docs/${id}`);
};

export const createDoc = async (data: SaveDocRequest): Promise<{ id: number }> => {
  return apiClient.post<any, { id: number }>('/admin/docs', data);
};

export const updateDoc = async (id: number, data: SaveDocRequest): Promise<void> => {
  return apiClient.put<any, void>(`/admin/docs/${id}`, data);
};

export const publishDoc = async (id: number): Promise<void> => {
  return apiClient.post<any, void>(`/admin/docs/${id}/publish`);
};

export const archiveDoc = async (id: number): Promise<void> => {
  return apiClient.post<any, void>(`/admin/docs/${id}/archive`);
};

export const deleteDoc = async (id: number): Promise<void> => {
  return apiClient.delete<any, void>(`/admin/docs/${id}`);
};
