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

export interface BulkUploadChapterResult {
    totalChaptersCreated: number;
    totalChaptersUpdated: number;
    totalPagesCreated: number;
    processedChapters: string[];
    elapsedMilliseconds: number;
    message: string;
}

export interface BulkUploadOptions {
    overwriteExisting?: boolean;
    defaultCoinPrice?: number;
    isLocked?: boolean;
    imagesPerChapter?: number;
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

    deleteAllChapters: async (publicationId: string) => {
        return apiClient.delete<any, any>(`/AdminComicChapter/publication/${publicationId}/chapters`);
    },

    getChapterPages: async (chapterId: string) => {
        return apiClient.get<any, any>(`/AdminComicChapter/${chapterId}/pages`);
    },

    addChapterPage: async (chapterId: string, pageData: Partial<ComicPage>) => {
        return apiClient.post<any, any>(`/AdminComicChapter/${chapterId}/pages`, pageData);
    },

    deleteChapterPage: async (chapterId: string, pageId: string) => {
        return apiClient.delete<any, any>(`/AdminComicChapter/${chapterId}/pages/${pageId}`);
    },

    bulkUploadChapters: async (
        publicationId: string,
        file: File,
        options?: BulkUploadOptions,
        onUploadProgress?: (progressEvent: any) => void
    ) => {
        const formData = new FormData();
        formData.append('file', file);
        if (options?.overwriteExisting !== undefined) {
            formData.append('overwriteExisting', String(options.overwriteExisting));
        }
        if (options?.defaultCoinPrice !== undefined) {
            formData.append('defaultCoinPrice', String(options.defaultCoinPrice));
        }
        if (options?.isLocked !== undefined) {
            formData.append('isLocked', String(options.isLocked));
        }
        if (options?.imagesPerChapter !== undefined) {
            formData.append('imagesPerChapter', String(options.imagesPerChapter));
        }

        return apiClient.post<any, { success: boolean; message: string; data: BulkUploadChapterResult }>(
            `/AdminComicChapter/publication/${publicationId}/bulk-upload`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 600000, // 10 minutes timeout for large archives
                onUploadProgress
            }
        );
    }
};
