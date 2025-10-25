'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import apiClient from '@/lib/api';
import type { Coupon, CouponFilters, CreateCouponInput, UpdateCouponInput } from '@/types/coupon';

export function useCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState<CouponFilters>({ code: '', type: '', status: '' });

  const fetchCoupons = useCallback(async (f: CouponFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (f.code.trim()) params.set('code', f.code.trim());
      if (f.type) params.set('type', f.type);
      if (f.status) params.set('valid', f.status === 'valid' ? 'true' : 'false');
      const qs = params.toString();
      const endpoint = qs ? `/coupons/search?${qs}` : '/coupons';
      const data = await apiClient.get<Coupon[]>(endpoint);
      setCoupons(data);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchCoupons(filters);
  }, []);

  // Debounced filter search
  useEffect(() => {
    const t = setTimeout(() => fetchCoupons(filters), 400);
    return () => clearTimeout(t);
  }, [filters, fetchCoupons]);

  const createCoupon = useCallback(async (input: CreateCouponInput) => {
    setSaving(true);
    try {
      const { code, type, value, minOrderAmount, maxDiscountValue, expiresAt, createdAt } = input;
      const payload: any = { code, type, value };
      if (typeof minOrderAmount === 'number') payload.minOrderAmount = minOrderAmount;
      if (typeof maxDiscountValue === 'number') payload.maxDiscountValue = maxDiscountValue;
      if (expiresAt) payload.expiresAt = expiresAt;
      if (createdAt) payload.createdAt = createdAt;
      const data = await apiClient.post<Coupon>('/coupons', payload);
      setCoupons((prev) => [data, ...prev]);
      return data;
    } finally {
      setSaving(false);
    }
  }, []);

  const updateCoupon = useCallback(async (id: number, input: UpdateCouponInput) => {
    setSaving(true);
    try {
      const { code, type, value, minOrderAmount, maxDiscountValue, expiresAt, createdAt } = input;
      const payload: any = {};
      if (typeof code === 'string') payload.code = code;
      if (type === 'PERCENT' || type === 'AMOUNT') payload.type = type;
      if (typeof value === 'number') payload.value = value;
      if (typeof minOrderAmount === 'number') payload.minOrderAmount = minOrderAmount;
      if (typeof maxDiscountValue === 'number') payload.maxDiscountValue = maxDiscountValue;
      if (expiresAt) payload.expiresAt = expiresAt;
      if (createdAt) payload.createdAt = createdAt;
      const data = await apiClient.patch<Coupon>(`/coupons/${id}`, payload);
      setCoupons((prev) => prev.map((c) => (c.id === id ? (data ?? c) : c)));
      return data;
    } finally {
      setSaving(false);
    }
  }, []);

  const removeCoupon = useCallback(async (id: number) => {
    await apiClient.delete<void>(`/coupons/${id}`);
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const state = useMemo(
    () => ({ coupons, loading, saving, filters }),
    [coupons, loading, saving, filters],
  );

  return {
    ...state,
    setFilters,
    fetchCoupons,
    createCoupon,
    updateCoupon,
    removeCoupon,
  };
}
