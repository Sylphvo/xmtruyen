import { apiClient } from './userApi';
import { type IBook as Publication } from '../types/book';

export interface TranslationJob {
  id: string;
  publicationId: string;
  publication?: Publication;
  sourceLanguage: string;
  targetLanguage: string;
  status: string;
  totalChapters: number;
  totalPages: number;
  totalTextBlocks: number;
  processedPages: number;
  errorMessage?: string;
  createdBy?: string;
  createdAt: string;
  completedAt?: string;
  chapters?: TranslationChapter[];
}

export interface TranslationChapter {
  id: string;
  jobId: string;
  chapterNumber: number;
  title?: string;
  status: string;
  pageCount: number;
  textBlockCount: number;
  createdAt: string;
  pages?: TranslationPage[];
}

export interface TranslationPage {
  id: string;
  chapterId: string;
  pageNumber: number;
  rawImageUrl: string;
  translatedImageUrl?: string;
  ocrStatus: string;
  typesetStatus: string;
  textBlocks?: TextBlock[];
}

export interface TextBlock {
  id: string;
  pageId: string;
  bboxX: number;
  bboxY: number;
  bboxWidth: number;
  bboxHeight: number;
  originalText: string;
  translatedText?: string;
  textType: string;
  fontStyle: string;
  ocrConfidence?: number;
  isManualEdit: boolean;
}

export interface TranslationGlossary {
  id: string;
  sourceText: string;
  targetText: string;
  sourceLanguage: string;
  targetLanguage: string;
  category?: string;
  publicationId?: string;
  createdAt?: string;
}

// APIs
export const getTranslationJobs = async (): Promise<TranslationJob[]> => {
  return apiClient.get<any, TranslationJob[]>('/admin/translation/jobs');
};

export const getTranslationJobDetail = async (id: string): Promise<TranslationJob> => {
  return apiClient.get<any, TranslationJob>(`/admin/translation/jobs/${id}`);
};

export const createTranslationJob = async (data: { publicationId: string; sourceLanguage: string; targetLanguage: string }): Promise<TranslationJob> => {
  return apiClient.post<any, TranslationJob>('/admin/translation/jobs', data);
};

export const getTranslationChapter = async (id: string): Promise<TranslationChapter> => {
  return apiClient.get<any, TranslationChapter>(`/admin/translation/chapters/${id}`);
};

export const getGlossaries = async (): Promise<TranslationGlossary[]> => {
  return apiClient.get<any, TranslationGlossary[]>('/admin/translation/glossary');
};

export const createGlossary = async (data: Omit<TranslationGlossary, 'id' | 'createdAt'>): Promise<TranslationGlossary> => {
  return apiClient.post<any, TranslationGlossary>('/admin/translation/glossary', data);
};
