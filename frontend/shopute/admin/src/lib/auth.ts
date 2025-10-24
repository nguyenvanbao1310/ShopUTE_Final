import apiClient from './api';
import type {
  LoginDto,
  LoginResponse,
  RegisterDto,
  RegisterResponse,
  RefreshResponse,
} from '@/types/auth';

export const authApi = {
  register: async (data: RegisterDto): Promise<RegisterResponse> => {
    return apiClient.post<RegisterResponse>('/auth/register', data);
  },

  // Đăng nhập
  login: async (data: LoginDto): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    // Lưu access token vào client
    apiClient.setAccessToken(response.access);
    return response;
  },

  // Refresh token
  refresh: async (): Promise<RefreshResponse> => {
    return apiClient.post<RefreshResponse>('/auth/refresh');
  },

  // Đăng xuất
  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/auth/logout');
    // Xóa access token
    apiClient.setAccessToken(null);
    return response;
  },
};

export default authApi;