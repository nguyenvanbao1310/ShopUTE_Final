import { ApiError } from '@/types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081/api';

class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  getAccessToken() {
    return this.accessToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    // Lazy-restore access token from localStorage on first use (client-side)
    if (!this.accessToken && typeof window !== 'undefined') {
      const t = window.localStorage?.getItem?.('access_token');
      if (t) this.setAccessToken(t);
    }
    
    const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', 
      });

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          statusCode: response.status,
          message: response.statusText,
        }));
        throw error;
      }

      // Parse body safely: allow empty body (e.g. PATCH/204)
      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();
      if (!text) {
        return undefined as T;
      }
      if (contentType.includes('application/json')) {
        return JSON.parse(text) as T;
      }
      return text as unknown as T;
    } catch (error) {
      if ((error as ApiError).statusCode) {
        throw error;
      }
      throw {
        statusCode: 500,
        message: (error as Error).message || 'Network error',
      } as ApiError;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: options?.method ?? 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_URL);
export default apiClient;
