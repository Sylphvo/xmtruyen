import { apiClient, type PaginatedResponse } from './userApi';

export const getTables = async (): Promise<string[]> => {
  return apiClient.get<any, string[]>('/ManagerDB/tables');
};

export interface TableSchemaColumn {
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey?: boolean;
}

export const getTableSchema = async (tableName: string): Promise<TableSchemaColumn[]> => {
  return apiClient.get<any, TableSchemaColumn[]>(`/ManagerDB/${tableName}/schema`);
};

export const getTableData = async (tableName: string, page: number = 1, pageSize: number = 100): Promise<PaginatedResponse<any>> => {
  return apiClient.get<any, PaginatedResponse<any>>(`/ManagerDB/${tableName}`, {
    params: { page, pageSize }
  });
};

export const insertRow = async (tableName: string, data: any): Promise<any> => {
  return apiClient.post<any, any>(`/ManagerDB/${tableName}`, data);
};

export const updateRow = async (tableName: string, id: string | number, data: any): Promise<any> => {
  return apiClient.put<any, any>(`/ManagerDB/${tableName}/${id}`, data);
};

export const deleteRow = async (tableName: string, id: string | number): Promise<any> => {
  return apiClient.delete<any, any>(`/ManagerDB/${tableName}/${id}`);
};
