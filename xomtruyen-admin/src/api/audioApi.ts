import axios from 'axios';

// Get token from auth context or localStorage
const getAuthToken = () => localStorage.getItem('token');

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface AudioJob {
  id: string;
  publicationId: string;
  sourceType: string;
  status: string;
  totalSegments: number;
  processedSegments: number;
  errorMessage?: string;
  createdAt: string;
}

export interface VoiceProfile {
  id: string;
  displayName: string;
  voiceType: string;
  gender: string;
  ttsProvider: string;
  ttsVoiceId: string;
  isActive: boolean;
}

export interface CharacterVoiceMapping {
  id: string;
  publicationId: string;
  characterName: string;
  voiceProfileId: string;
  notes?: string;
}

export const audioApi = {
  // Jobs
  getJobs: (publicationId?: string) => 
    api.get<AudioJob[]>('/api/admin/audio/jobs', { params: { publicationId } }),
  getJobProgress: (id: string) => 
    api.get<AudioJob>(`/api/admin/audio/jobs/${id}/progress`),
  createJobFromBookChapter: (data: { publicationId: string, sourceChapterIds: string[] }) =>
    api.post<AudioJob>('/api/admin/audio/jobs/from-book-chapters', data),
  startJob: (id: string) => 
    api.post(`/api/admin/audio/jobs/${id}/start`),
  getJobSegments: (id: string) => 
    api.get(`/api/admin/audio/jobs/${id}/segments`),
  updateSegment: (id: string, data: any) => 
    api.patch(`/api/admin/audio/segments/${id}`, data),
  publishJob: (id: string) => 
    api.post(`/api/admin/audio/jobs/${id}/publish`),

  // Voices
  getVoices: () => 
    api.get<VoiceProfile[]>('/api/admin/audio/voices'),
  createVoice: (data: Partial<VoiceProfile>) => 
    api.post<VoiceProfile>('/api/admin/audio/voices', data),
  updateVoice: (id: string, data: Partial<VoiceProfile>) => 
    api.put<VoiceProfile>(`/api/admin/audio/voices/${id}`, data),
  deleteVoice: (id: string) => 
    api.delete(`/api/admin/audio/voices/${id}`),

  // Character Mappings
  getCharacterMappings: (publicationId: string) => 
    api.get<CharacterVoiceMapping[]>(`/api/admin/audio/characters`, { params: { publicationId } }),
  createCharacterMapping: (data: Partial<CharacterVoiceMapping>) => 
    api.post<CharacterVoiceMapping>('/api/admin/audio/characters', data),
  updateCharacterMapping: (id: string, data: Partial<CharacterVoiceMapping>) => 
    api.put<CharacterVoiceMapping>(`/api/admin/audio/characters/${id}`, data),
  deleteCharacterMapping: (id: string) => 
    api.delete(`/api/admin/audio/characters/${id}`),
};
