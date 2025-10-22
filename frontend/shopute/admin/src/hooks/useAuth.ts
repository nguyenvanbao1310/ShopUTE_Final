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
      const message = Array.isArray(apiError.message)
        ? apiError.message[0]
        : apiError.message;
      setError(message || 'Đăng nhập thất bại');
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
      
      // Sau khi đăng ký thành công, tự động đăng nhập
     router.push('/auth/login');
      
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

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    refreshToken,
  };
}