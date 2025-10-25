'use client';

export type CouponType = 'PERCENT' | 'AMOUNT';

export interface Coupon {
  id: number;
  code: string;
  userId: number | null;
  type: CouponType;
  value: number; // backend admin entity uses number
  minOrderAmount: number | null;
  maxDiscountValue: number | null;
  expiresAt: string | null; // ISO string from API
  isUsed: boolean;
  usedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateCouponInput = {
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount?: number | null;
  maxDiscountValue?: number | null;
  createdAt?: string | null; // ISO
  expiresAt?: string | null; // ISO
};

export type UpdateCouponInput = Partial<CreateCouponInput>;

export type CouponFilters = {
  code: string;
  type: '' | CouponType;
  status: '' | 'valid' | 'expired';
};

export function formatCurrencyVND(n: number | null | undefined) {
  if (n == null) return '-';
  try {
    return new Intl.NumberFormat('vi-VN').format(n) + '₫';
  } catch {
    return `${n}₫`;
  }
}

export function formatDateRangeVi(start?: string | null, end?: string | null) {
  const fmt = (d?: string | null) =>
    d ? new Date(d).toLocaleString('vi-VN') : '—';
  return `${fmt(start)} - ${fmt(end)}`;
}

export function couponIsValid(c: Pick<Coupon, 'expiresAt'>) {
  if (!c.expiresAt) return true;
  const now = Date.now();
  return new Date(c.expiresAt).getTime() >= now;
}

