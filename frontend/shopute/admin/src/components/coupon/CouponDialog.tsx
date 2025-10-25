'use client';

import React from 'react';
import { InputField } from '@/components/ui/InputField';
import type { Coupon, CreateCouponInput } from '@/types/coupon';
import { useDialogCoupons } from '@/hooks/useDialogCoupons';

export function CouponDialog({
  open,
  onClose,
  onSubmit,
  initial,
  saving,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCouponInput) => Promise<any> | any;
  initial?: Partial<Coupon> | null;
  saving?: boolean;
}) {
  const {
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
  } = useDialogCoupons({ open, initial, saving, onSubmit, onClose });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-xl shadow-xl w-full max-w-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border hover:bg-gray-50"
            disabled={saving}
          >
            Đóng
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <InputField
              label="Mã voucher"
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phân loại</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as any }))}
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition border-gray-300"
            >
              <option value="PERCENT">Theo %</option>
              <option value="AMOUNT">Theo số tiền</option>
            </select>
          </div>
          <InputField
            label={form.type === 'PERCENT' ? 'Giá trị (%)' : 'Giá trị (₫)'}
            type="number"
            value={form.value}
            onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))}
          />
          <InputField
            label="Giá trị tối thiểu (₫)"
            type="number"
            value={form.minOrderAmount ?? ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, minOrderAmount: e.target.value === '' ? null : Number(e.target.value) }))
            }
          />
          <InputField
            label="Giá trị tối đa (₫)"
            type="number"
            value={form.maxDiscountValue ?? ''}
            onChange={(e) =>
              setForm((f) => ({ ...f, maxDiscountValue: e.target.value === '' ? null : Number(e.target.value) }))
            }
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu</label>
            <input
              type="datetime-local"
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition border-gray-300"
              value={createdAtInput}
              onChange={(e) => setCreatedAtInput(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ngày hết hạn</label>
            <input
              type="datetime-local"
              className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition border-gray-300"
              value={expiresAtInput}
              onChange={(e) => setExpiresAtInput(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border hover:bg-gray-50"
            disabled={saving}
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            disabled={!canSubmit}
          >
            {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo mới'}
          </button>
        </div>
      </div>
    </div>
  );
}

