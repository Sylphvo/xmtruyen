import { useState } from "react";
import axios, { AxiosError } from "axios";
import type { TLoginRequest, TRegisterRequest, ApiResponse, TUser } from "../types/index";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5172";

  const login = async (data: TLoginRequest): Promise<ApiResponse<TUser>> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<ApiResponse<TUser>>(`${baseUrl}/api/Auth/login`, data);
      const result = response.data;
      if (!result.success) {
        throw new Error(result.message || "Đăng nhập thất bại");
      }
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Lỗi kết nối";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: TRegisterRequest): Promise<ApiResponse<null>> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<ApiResponse<null>>(`${baseUrl}/api/Auth/register`, data);
      const result = response.data;
      if (!result.success) {
        throw new Error(result.message || "Đăng ký thất bại");
      }
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Lỗi kết nối";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  
  const forgotPassword = async (email: string): Promise<ApiResponse<string>> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<ApiResponse<string>>(`${baseUrl}/api/Auth/forgot-password`, { email });
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Lỗi kết nối";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (data: any): Promise<ApiResponse<string>> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<ApiResponse<string>>(`${baseUrl}/api/Auth/reset-password`, data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Lỗi kết nối";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { login, register, forgotPassword, resetPassword, loading, error };
}

