import { apiClient } from './userApi';

export interface Transaction {
  id: string;
  userId: string;
  userEmail: string | null;
  amount: number;
  coinAmount: number | null;
  transactionType: string;
  paymentMethod: string | null;
  status: string;
  note: string | null;
  createdAt: string;
  completedAt: string | null;
  planName: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface GetTransactionsParams {
  userId?: string;
  transactionType?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export const getTransactions = async (params?: GetTransactionsParams): Promise<PaginatedResponse<Transaction>> => {
  return apiClient.get<any, PaginatedResponse<Transaction>>('/admin/transactions', { params });
};

export const getRevenueSummary = async (): Promise<{ totalRevenue: number; todayRevenue: number }> => {
  return apiClient.get<any, { totalRevenue: number; todayRevenue: number }>('/admin/transactions/revenue-summary');
};

export const approveTransaction = async (id: string): Promise<{ message: string }> => {
  return apiClient.patch<any, { message: string }>(`/admin/transactions/${id}/approve`, {});
};
