import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5172/api',
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor for auth
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==========================================
// TYPES
// ==========================================

export interface Role {
  id: number;
  name: string;
  description?: string;
}

export interface UserRole {
  userId: string;
  roleId: number;
  roleName: string;
  assignedBy?: string;
  assignedAt: string;
  reason?: string;
}

export interface AssignRoleRequest {
  roleId: number;
  reason?: string;
}

// ==========================================
// API METHODS
// ==========================================

export const getRoles = async (): Promise<Role[]> => {
  const response = await apiClient.get<Role[]>('/admin/roles');
  return response.data;
};

export const getUserRoles = async (userId: string): Promise<UserRole[]> => {
  const response = await apiClient.get<UserRole[]>(`/admin/users/${userId}/roles`);
  return response.data;
};

export const assignRole = async (userId: string, request: AssignRoleRequest): Promise<void> => {
  await apiClient.post(`/admin/users/${userId}/roles`, request);
};

export const removeRole = async (userId: string, roleId: number, reason?: string): Promise<void> => {
  await apiClient.delete(`/admin/users/${userId}/roles/${roleId}`, {
    data: { reason }
  });
};

export const getPermissions = async (): Promise<any[]> => {
  const response = await apiClient.get<any[]>('/admin/permissions');
  return response.data;
};

export const getAuditLogs = async (userId?: string): Promise<any[]> => {
  const response = await apiClient.get<any[]>('/admin/audit-logs', {
    params: { userId }
  });
  return response.data;
};
