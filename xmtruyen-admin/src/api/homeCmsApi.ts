import { apiClient } from './userApi';

export interface Banner {
  id: string;
  imageUrl: string;
  linkUrl?: string;
  title?: string;
  subtitle?: string;
  isActive: boolean;
  orderIndex: number;
  position: string;
  createdAt: string;
}

export interface HomeSection {
  id: string;
  title: string;
  description?: string;
  type: string;
  isActive: boolean;
  orderIndex: number;
  publicationIds?: string;
  queryType?: string;
  itemLimit: number;
  createdAt: string;
}

// Banners API
export const getBanners = async (): Promise<Banner[]> => {
  return apiClient.get<any, Banner[]>('/admin/banners');
};

export const createBanner = async (data: Omit<Banner, 'id' | 'createdAt'>): Promise<Banner> => {
  return apiClient.post<any, Banner>('/admin/banners', data);
};

export const updateBanner = async (id: string, data: Omit<Banner, 'id' | 'createdAt'>): Promise<Banner> => {
  return apiClient.put<any, Banner>(`/admin/banners/${id}`, data);
};

export const deleteBanner = async (id: string): Promise<any> => {
  return apiClient.delete<any, any>(`/admin/banners/${id}`);
};

// HomeSections API
export const getHomeSections = async (): Promise<HomeSection[]> => {
  return apiClient.get<any, HomeSection[]>('/admin/home-sections');
};

export const createHomeSection = async (data: Omit<HomeSection, 'id' | 'createdAt'>): Promise<HomeSection> => {
  return apiClient.post<any, HomeSection>('/admin/home-sections', data);
};

export const updateHomeSection = async (id: string, data: Omit<HomeSection, 'id' | 'createdAt'>): Promise<HomeSection> => {
  return apiClient.put<any, HomeSection>(`/admin/home-sections/${id}`, data);
};

export const deleteHomeSection = async (id: string): Promise<any> => {
  return apiClient.delete<any, any>(`/admin/home-sections/${id}`);
};
