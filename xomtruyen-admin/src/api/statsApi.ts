import { apiClient } from './userApi';

export interface OverviewStats {
  publications: {
    total: number;
    text: number;
    comic: number;
  };
  users: {
    total: number;
    active: number;
    vip: number;
    newToday: number;
  };
  chapters: {
    totalComic: number;
    totalBook: number;
  };
  revenue: {
    today: number;
  };
}

export interface TopPublication {
  id: string;
  title: string;
  coverImageUrl: string | null;
  viewCount: number;
  averageRating: number;
}

export const getOverviewStats = async (): Promise<OverviewStats> => {
  return apiClient.get<any, OverviewStats>('/admin/stats/overview');
};

export const getTopPublications = async (limit: number = 10): Promise<TopPublication[]> => {
  return apiClient.get<any, TopPublication[]>('/admin/stats/top-publications', {
    params: { limit }
  });
};
