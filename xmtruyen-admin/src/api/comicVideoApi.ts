import { apiClient } from './userApi';

export interface CreateComicVideoTaskRequest {
  publicationId: string;
  chapterIds: string[];
  language: string;
  voiceId: string;
  speechRate: string;
  resolution: string;
  transition: string;
  narrationSource: string;
  addSubtitles: boolean;
  backgroundMusicUrl?: string;
  backgroundMusicVolume?: number;
}

export const comicVideoApi = {
  createTask: (data: CreateComicVideoTaskRequest) => {
    return apiClient.post('/admin/comic-video/create', data);
  },
  
  getList: (page = 1, limit = 10) => {
    return apiClient.get('/admin/comic-video/list', { params: { page, limit } });
  },
  
  getStatus: (id: string) => {
    return apiClient.get(`/admin/comic-video/${id}/status`);
  },
  
  getPreview: (id: string) => {
    return apiClient.get(`/admin/comic-video/${id}/preview`);
  }
};
