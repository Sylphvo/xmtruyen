import { apiClient } from './userApi';

export interface BookVideoTask {
  id: string;
  publicationTitle: string;
  status: string;
  progressPercent: number;
  currentStep: string;
  createdAt: string;
  outputVideoUrl: string;
  totalSegments: number;
  completedSegments: number;
  errorMessage?: string;
}

export interface BookVideoSegment {
  id: string;
  taskId: string;
  orderIndex: number;
  textContent: string;
  sceneDescription: string;
  imageUrl: string;
  audioUrl: string;
  audioDurationSeconds: number;
  subtitleText: string;
  status: string;
}

export const bookVideoApi = {
  getTasks: (page = 1, limit = 10) => {
    return apiClient.get('/admin/book-video/list', { params: { page, limit } });
  },

  getTaskStatus: (id: string) => {
    return apiClient.get(`/admin/book-video/${id}/status`);
  },

  getPreview: (id: string) => {
    return apiClient.get(`/admin/book-video/${id}/preview`);
  },

  createTask: (data: any) => {
    return apiClient.post('/admin/book-video/create', data);
  }
};
