import { apiClient } from './userApi';

export interface FileItem {
  name: string;
  path: string;
  size: number;
  createdAt: string;
}

export const getFiles = async (subDirectory: string = 'raw-uploads'): Promise<{ success: boolean; data: FileItem[] }> => {
  return apiClient.get<any, { success: boolean; data: FileItem[] }>('/Upload/files', {
    params: { subDirectory }
  });
};

export const deleteFile = async (fileName: string, subDirectory: string = 'raw-uploads'): Promise<{ success: boolean; message: string }> => {
  return apiClient.delete<any, { success: boolean; message: string }>(`/Upload/files/${fileName}`, {
    params: { subDirectory }
  });
};
