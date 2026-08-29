import { apiClient } from './userApi';

export interface EmailTemplate {
  code: string;
  subject: string;
  bodyHtml: string;
  description?: string;
  variables?: string;
  updatedAt: string;
  updatedBy?: string;
}

export const getTemplates = async (): Promise<EmailTemplate[]> => {
  return apiClient.get<any, EmailTemplate[]>('/admin/email-templates');
};

export const createTemplate = async (data: Omit<EmailTemplate, 'updatedAt' | 'updatedBy'>): Promise<EmailTemplate> => {
  return apiClient.post<any, EmailTemplate>('/admin/email-templates', data);
};

export const updateTemplate = async (code: string, data: Omit<EmailTemplate, 'code' | 'updatedAt' | 'updatedBy'>): Promise<EmailTemplate> => {
  return apiClient.put<any, EmailTemplate>(`/admin/email-templates/${code}`, data);
};

export const deleteTemplate = async (code: string): Promise<any> => {
  return apiClient.delete<any, any>(`/admin/email-templates/${code}`);
};
