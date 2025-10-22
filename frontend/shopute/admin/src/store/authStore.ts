import { User } from '@/types/auth';
import apiClient from '@/lib/api';

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
};

type Listener = () => void;

class AuthStore {
  private state: AuthState = {
    user: null,
    accessToken: null,
    isAuthenticated: false,
  };

  private listeners: Listener[] = [];

  getState(): AuthState {
    return this.state;
  }

  setState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }

  // Actions
  setAuth(user: User, accessToken: string) {
    this.setState({ user, accessToken, isAuthenticated: true });
    apiClient.setAccessToken(accessToken);
    
    // Lưu vào localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  clearAuth() {
    this.setState({ user: null, accessToken: null, isAuthenticated: false });
    apiClient.setAccessToken(null);
    
    // Xóa khỏi localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  }

  // Restore từ localStorage
  restore() {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.setAuth(user, token);
      } catch (error) {
        console.error('Failed to restore auth:', error);
        this.clearAuth();
      }
    }
  }
}

export const authStore = new AuthStore();
export default authStore;