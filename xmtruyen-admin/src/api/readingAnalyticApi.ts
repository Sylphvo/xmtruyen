import { apiClient } from './userApi';

export interface ReadingLog {
  id: string;
  readAt: string;
  readingDurationSeconds: number;
  country?: string;
  deviceInfo?: string;
  publicationTitle: string;
  formatType: string;
  userName: string;
  isGuest: boolean;
}

export interface ChartData {
  date: string;
  count: number;
  totalDuration: number;
}

export interface TopPublication {
  publicationId: string;
  title: string;
  readCount: number;
  avgDuration: number;
}

export interface AnalyticsResponse {
  recentLogs: ReadingLog[];
  chartData: ChartData[];
  topPublications: TopPublication[];
}

export const getReadingAnalytics = async (days: number = 7): Promise<AnalyticsResponse> => {
  return apiClient.get<any, AnalyticsResponse>(`/admin/analytics/reading?days=${days}`);
};
