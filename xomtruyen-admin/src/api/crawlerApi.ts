import { apiClient } from './userApi';

export interface CrawlJob {
  id: string;
  sourceName: string;
  targetUrl: string;
  status: string;
  totalItems: number;
  crawledItems: number;
  errorMessage?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export type StartCrawlRequest = Pick<CrawlJob, 'sourceName' | 'targetUrl'>;

export const getAllCrawlJobs = async (): Promise<CrawlJob[]> => {
  return apiClient.get<any, CrawlJob[]>('/admin/crawlers');
};

export const startCrawlJob = async (data: StartCrawlRequest): Promise<CrawlJob> => {
  return apiClient.post<any, CrawlJob>('/admin/crawlers/start', data);
};

export const deleteCrawlJob = async (id: string): Promise<any> => {
  return apiClient.delete<any, any>(`/admin/crawlers/${id}`);
};
