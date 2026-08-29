import { apiClient } from './userApi';

export interface SystemConfig {
  key: string;
  value: string;
  description?: string;
  category: string;
  dataType: string;
  updatedAt: string;
  updatedBy?: string;
}

export const getConfigs = async (): Promise<SystemConfig[]> => {
  return apiClient.get<any, SystemConfig[]>('/admin/configs');
};

export const createConfig = async (data: Omit<SystemConfig, 'updatedAt' | 'updatedBy'>): Promise<SystemConfig> => {
  return apiClient.post<any, SystemConfig>('/admin/configs', data);
};

export const updateConfig = async (key: string, data: Omit<SystemConfig, 'key' | 'updatedAt' | 'updatedBy'>): Promise<SystemConfig> => {
  return apiClient.put<any, SystemConfig>(`/admin/configs/${key}`, data);
};

export const deleteConfig = async (key: string): Promise<any> => {
  return apiClient.delete<any, any>(`/admin/configs/${key}`);
};
