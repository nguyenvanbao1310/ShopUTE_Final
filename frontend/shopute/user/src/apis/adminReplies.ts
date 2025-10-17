import axios, { AxiosHeaders } from 'axios';

// Admin backend base URL (NestJS admin). Adjust if different.
export const ADMIN_BASE_URL = process.env.ADMIN_API_BASE || 'http://localhost:8081/api';

function getToken(): string | undefined {
  try {
    const t =
      localStorage.getItem('token') ||
      localStorage.getItem('accessToken') ||
      undefined;
    return typeof t === 'string' && t.trim() ? t : undefined;
  } catch {
    return undefined;
  }
}

export const adminApi = axios.create({
  baseURL: ADMIN_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

adminApi.interceptors.request.use((config) => {
  const headers = config.headers as AxiosHeaders;
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return config;
});

export type ReplyItem = {
  id: number;
  ratingId: number;
  adminUserId: number | null;
  adminName: string | null;
  message: string;
  createdAt: string;
};

export async function fetchReplies(ratingId: number): Promise<ReplyItem[]> {
  const { data } = await adminApi.get(`/ratings/${ratingId}/replies`);
  return (data?.data ?? data) as ReplyItem[];
}

export async function createReply(ratingId: number, message: string): Promise<ReplyItem> {
  const { data } = await adminApi.post(`/ratings/${ratingId}/replies`, { message });
  return (data?.data ?? data) as ReplyItem;
}

