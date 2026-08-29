import axios from 'axios';
const API_BASE_URL = 'http://localhost:5000';

export interface AudioChapter {
  id: string;
  publicationId: string;
  sourceChapterId: string;
  title: string;
  duration: number; // in seconds
  fileSize: number;
  isLocked: boolean;
  coinPrice: number;
  orderIndex: number;
  createdAt: string;
}

const audioApi = axios.create({
  baseURL: `${API_BASE_URL}/api/client/audio`,
  withCredentials: true // Assuming we use cookies or it will be intercepted for tokens
});

// Using a token interceptor if token exists in localStorage (typical for xmtruyen client)
audioApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const audioService = {
  getAudioChapters: async (publicationId: string): Promise<AudioChapter[]> => {
    const response = await audioApi.get(`/chapters`, {
      params: { publicationId }
    });
    return response.data;
  },

  getStreamUrl: (chapterId: string): string => {
    // Return the full URL for the <audio> src attribute
    // Note: The audio tag doesn't natively send Authorization headers easily via src,
    // so in a real scenario we might need to use cookies for stream auth, 
    // or pass a short-lived token in the URL query string: ?token=xxx
    const token = localStorage.getItem('token');
    if (token) {
      return `${API_BASE_URL}/api/client/audio/${chapterId}/stream?token=${encodeURIComponent(token)}`;
    }
    return `${API_BASE_URL}/api/client/audio/${chapterId}/stream`;
  }
};
