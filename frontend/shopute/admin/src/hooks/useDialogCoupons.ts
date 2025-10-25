'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import type { Coupon, CreateCouponInput } from '@/types/coupon';

// Vietnam time zone (UTC+07:00) with concise helpers
const VN_TZ_MS = 7 * 60 * 60 * 1000;
const toVNInput = (iso?: string | null) => (iso ? new Date(new Date(iso).getTime() + VN_TZ_MS).toISOString().slice(0, 16) : '');
const fromVNInput = (v?: string | null) => (v ? new Date(new Date(v + 'Z').getTime() - VN_TZ_MS).toISOString() : null);

function initialForm(initial?: Partial<Coupon> | null): CreateCouponInput {
  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  return {
    code: initial?.code ?? '',
    type: (initial?.type as any) ?? 'PERCENT',
    value: (initial?.value as any) ?? 0,
    minOrderAmount: (initial?.minOrderAmount as any) ?? null,
    maxDiscountValue: (initial?.maxDiscountValue as any) ?? null,
    createdAt: initial?.createdAt ?? now.toISOString(),
    expiresAt: initial?.expiresAt ?? in30Days.toISOString(),
  };
}

export function useDialogCoupons({
  open,
  initial,
  saving,
  onSubmit,
  onClose,
}: {
  open: boolean;
  initial?: Partial<Coupon> | null;
  saving?: boolean;
  onSubmit: (data: CreateCouponInput) => Promise<any> | any;
  onClose: () => void;
}) {
  const [form, setForm] = useState<CreateCouponInput>(() => initialForm(initial));

  useEffect(() => {
    if (open) setForm(initialForm(initial));
  }, [open, initial]);

  const isEdit = !!(initial && (initial as any).id);
  const title = useMemo(() => (isEdit ? 'Chỉnh sửa voucher' : 'Thêm voucher'), [isEdit]);

  const createdAtInput = toVNInput(form.createdAt);
  const expiresAtInput = toVNInput(form.expiresAt);

  const setCreatedAtInput = useCallback((v: string) => setForm((f) => ({ ...f, createdAt: fromVNInput(v) })), []);
  const setExpiresAtInput = useCallback((v: string) => setForm((f) => ({ ...f, expiresAt: fromVNInput(v) })), []);

  const canSubmit = useMemo(() => !!form.code.trim() && !saving, [form.code, saving]);

  const handleSubmit = useCallback(async () => {
    await onSubmit(form);
    onClose();
  }, [form, onSubmit, onClose]);

  return {
    form,
    setForm,
    isEdit,
    title,
    createdAtInput,
    expiresAtInput,
    setCreatedAtInput,
    setExpiresAtInput,
    canSubmit,
    handleSubmit,
  };
}
