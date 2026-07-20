import { apiClient, type PaginatedResponse } from './userApi';
import type { ITopic } from '../types/topic';

export interface GetTopicsParams {
  searchKeyword?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  isDescending?: boolean;
}

export interface SaveTopicRequest {
  name: string;
}

export const getTopics = async (params?: GetTopicsParams): Promise<PaginatedResponse<ITopic>> => {
  return apiClient.get<any, PaginatedResponse<ITopic>>('/topics', { params });
};

export const getTopicById = async (id: number): Promise<ITopic> => {
  return apiClient.get<any, ITopic>(`/topics/${id}`);
};

export const createTopic = async (data: SaveTopicRequest): Promise<ITopic> => {
  return apiClient.post<any, ITopic>('/topics', data);
};

export const updateTopic = async (id: number, data: SaveTopicRequest): Promise<void> => {
  return apiClient.put<any, void>(`/topics/${id}`, data);
};

export const deleteTopic = async (id: number): Promise<void> => {
  return apiClient.delete<any, void>(`/topics/${id}`);
};
