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

export interface ChartSeries {
  labels: string[];
  data: number[];
}

export const getEngagementStats = async () =>
  apiClient.get('/admin/stats/engagement');

export const getUsersChart = async (days: number = 30): Promise<ChartSeries> =>
  apiClient.get<any, ChartSeries>('/admin/stats/chart/users', { params: { days } });

export const getRevenueChart = async (days: number = 30): Promise<ChartSeries> =>
  apiClient.get<any, ChartSeries>('/admin/stats/chart/revenue', { params: { days } });

export const getReadsChart = async (days: number = 30): Promise<ChartSeries> =>
  apiClient.get<any, ChartSeries>('/admin/stats/chart/reads', { params: { days } });

export const getRecentActivity = async (limit: number = 20) =>
  apiClient.get('/admin/stats/recent-activity', { params: { limit } });
