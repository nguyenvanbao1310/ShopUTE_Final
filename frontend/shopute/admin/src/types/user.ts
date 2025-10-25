export type Role = 'user' | 'admin';

export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender?: boolean | null;
  birthday?: string | null;
  avatar_url?: string | null;
  role: Role;
  isActive: boolean;
  loyaltyPoints: number;
  createdAt: string;
  updatedAt: string;
};

export type UserStats = {
  total: number;
  active: number;
  banned: number;
};

