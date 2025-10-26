'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authStore } from '../store/authStore';
import { authApi } from '../lib/auth';
import type { LoginDto, RegisterDto, ApiError } from '@/types/auth';

export function useAuth() {
  const [state, setState] = useState(authStore.getState());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Subscribe to store changes
    const unsubscribe = authStore.subscribe(() => {
      setState(authStore.getState());
    });

    // Restore auth từ localStorage
    authStore.restore();

    return unsubscribe;
  }, []);

  const login = async (data: LoginDto) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authApi.login(data);
      authStore.setAuth(response.user, response.access);

      router.push('/admin');
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      let message: string = 'Đăng nhập thất bại';

      if (Array.isArray(apiError.message)) {
        message = apiError.message[0];
      } else if (typeof apiError.message === 'string') {
        message = apiError.message;
      }

      // ✅ Nếu BE trả "Tài khoản chưa được xác thực" hoặc "OTP đã hết hạn"
      if (
        message.includes('OTP') ||
        message.includes('xác thực') ||
        message.includes('hết hạn')
      ) {
        setError(message);
        // 👉 chuyển đến trang verify OTP
        localStorage.setItem('pending_email', data.email);
        setTimeout(() => router.push('/auth/verify'), 1000);
        return;
      }

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterDto) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authApi.register(data);
      localStorage.setItem('pending_email', data.email);
     router.push('/auth/verify');
      
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      const message = Array.isArray(apiError.message)
        ? apiError.message[0]
        : apiError.message;
      setError(message || 'Đăng ký thất bại');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authStore.clearAuth();
      router.push('/login');
    }
  };
  const verifyOtp = async (email: string, otp: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.verifyOtp(email, otp);
      // ✅ Thành công → chuyển hướng login
      setTimeout(() => router.push('/auth/login'), 1000);
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      let message = 'Xác thực OTP thất bại';
      if (Array.isArray(apiError.message)) message = apiError.message[0];
      else if (typeof apiError.message === 'string') message = apiError.message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authApi.refresh();
      const currentUser = authStore.getState().user;
      
      if (currentUser) {
        authStore.setAuth(currentUser, response.access);
      }
      
      return response;
    } catch (error) {
      // Nếu refresh thất bại, logout
      authStore.clearAuth();
      router.push('/auth/login');
      throw error;
    }
  };
  const resendOtp = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.resendOtp(email);
      return response;
    }
    catch (err) {
      const apiError = err as ApiError;
      let message = 'Gửi lại OTP thất bại';
      if (Array.isArray(apiError.message)) message = apiError.message[0];
      else if (typeof apiError.message === 'string') message = apiError.message;
      setError(message);
      throw err;
    }
  };

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    refreshToken,
    verifyOtp,
    resendOtp,
  };
}