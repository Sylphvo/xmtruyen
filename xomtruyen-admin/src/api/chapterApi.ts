import { apiClient } from './userApi';

export interface ComicChapter {
    id: string;
    publicationId: string;
    chapterNumber: number;
    title?: string;
    isLocked: boolean;
    coinPrice?: number;
    viewCount?: number;
    createdAt?: string;
    imageCount: number;
}

export interface ComicPage {
    id: string;
    comicChapterId: string;
    imageUrl: string;
    orderIndex: number;
}

export const chapterApi = {
    getChaptersByPublication: async (publicationId: string) => {
        return apiClient.get<any, any>(`/AdminComicChapter/publication/${publicationId}`);
    },

    getChapterById: async (chapterId: string) => {
        return apiClient.get<any, any>(`/AdminComicChapter/${chapterId}`);
    },

    createChapter: async (data: Partial<ComicChapter>) => {
        return apiClient.post<any, any>(`/AdminComicChapter`, data);
    },

    updateChapter: async (chapterId: string, data: Partial<ComicChapter>) => {
        return apiClient.put<any, any>(`/AdminComicChapter/${chapterId}`, data);
    },

    deleteChapter: async (chapterId: string) => {
        return apiClient.delete<any, any>(`/AdminComicChapter/${chapterId}`);
    },

    getChapterPages: async (chapterId: string) => {
        return apiClient.get<any, any>(`/AdminComicChapter/${chapterId}/pages`);
    },

    addChapterPage: async (chapterId: string, pageData: Partial<ComicPage>) => {
        return apiClient.post<any, any>(`/AdminComicChapter/${chapterId}/pages`, pageData);
    },

    deleteChapterPage: async (chapterId: string, pageId: string) => {
        return apiClient.delete<any, any>(`/AdminComicChapter/${chapterId}/pages/${pageId}`);
    }
};
