import { apiClient } from './userApi';

export interface Promotion {
  id: string;
  code: string;
  description: string;
  discountPercent: number;
  maxDiscountAmount: number;
  minPurchaseAmount: number;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
}

export type SavePromotionRequest = Omit<Promotion, 'id' | 'createdAt' | 'usedCount'>;

export const getAllPromotions = async (): Promise<Promotion[]> => {
  return apiClient.get<any, Promotion[]>('/admin/promotions');
};

export const createPromotion = async (data: SavePromotionRequest): Promise<Promotion> => {
  return apiClient.post<any, Promotion>('/admin/promotions', data);
};

export const updatePromotion = async (id: string, data: SavePromotionRequest): Promise<Promotion> => {
  return apiClient.put<any, Promotion>(`/admin/promotions/${id}`, data);
};

export const deletePromotion = async (id: string): Promise<any> => {
  return apiClient.delete<any, any>(`/admin/promotions/${id}`);
};
