import { apiClient } from './userApi';

export interface CoinPackage {
  id: string;
  name: string;
  coinAmount: number;
  bonusCoins: number;
  priceVND: number;
  isPopular: boolean;
  isActive: boolean;
  orderIndex: number;
  createdAt: string;
}

export type SaveCoinPackageRequest = Omit<CoinPackage, 'id' | 'createdAt'>;

export const getAllCoinPackages = async (): Promise<CoinPackage[]> => {
  return apiClient.get<any, CoinPackage[]>('/admin/coin-packages');
};

export const createCoinPackage = async (data: SaveCoinPackageRequest): Promise<CoinPackage> => {
  return apiClient.post<any, CoinPackage>('/admin/coin-packages', data);
};

export const updateCoinPackage = async (id: string, data: SaveCoinPackageRequest): Promise<CoinPackage> => {
  return apiClient.put<any, CoinPackage>(`/admin/coin-packages/${id}`, data);
};

export const deleteCoinPackage = async (id: string): Promise<any> => {
  return apiClient.delete<any, any>(`/admin/coin-packages/${id}`);
};
