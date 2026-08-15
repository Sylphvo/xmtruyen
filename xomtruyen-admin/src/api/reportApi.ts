import { apiClient } from './userApi';

export interface Report {
  id: string;
  targetType: string;
  targetId: string;
  reason: string;
  description?: string;
  status: string;
  resolutionNote?: string;
  resolvedBy?: string;
  createdAt: string;
  resolvedAt?: string;
  reporterName: string;
  reporterId?: string;
}

export const getReports = async (): Promise<Report[]> => {
  return apiClient.get<any, Report[]>('/admin/reports');
};

export const getReportDetail = async (id: string): Promise<Report> => {
  return apiClient.get<any, Report>(`/admin/reports/${id}`);
};

export const resolveReport = async (id: string, data: { status: string; resolutionNote?: string }): Promise<Report> => {
  return apiClient.put<any, Report>(`/admin/reports/${id}/resolve`, data);
};
