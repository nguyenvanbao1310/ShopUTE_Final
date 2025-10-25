
export interface RegisterDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: string;
}

export interface LoginResponse {
  user: User;
  access: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface RefreshResponse {
  access: string;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}