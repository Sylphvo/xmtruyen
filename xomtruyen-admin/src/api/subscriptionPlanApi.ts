import { apiClient } from './userApi';

export interface ISubscriptionPlan {
  id: number;
  name: string;
  price: number;
  durationDays: number;
  isUnlimited: boolean;
  maxChaptersPerDay: number | null;
  removeAds: boolean;
}

export interface SaveSubscriptionPlanRequest {
  name: string;
  price: number;
  durationDays: number;
  isUnlimited: boolean;
  maxChaptersPerDay?: number | null;
  removeAds: boolean;
}

export const getPlans = async (): Promise<ISubscriptionPlan[]> => {
  return apiClient.get<any, ISubscriptionPlan[]>('/plans');
};

export const createPlan = async (data: SaveSubscriptionPlanRequest): Promise<ISubscriptionPlan> => {
  return apiClient.post<any, ISubscriptionPlan>('/plans', data);
};

export const updatePlan = async (id: number, data: SaveSubscriptionPlanRequest): Promise<ISubscriptionPlan> => {
  return apiClient.put<any, ISubscriptionPlan>(`/plans/${id}`, data);
};

export const deletePlan = async (id: number): Promise<any> => {
  return apiClient.delete<any, any>(`/plans/${id}`);
};
