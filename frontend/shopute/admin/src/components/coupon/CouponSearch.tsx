'use client';

import React from 'react';
import { InputField } from '@/components/ui/InputField';
import type { CouponFilters } from '@/types/coupon';

export function CouponSearch({
  filters,
  setFilters,
}: {
  filters: CouponFilters;
  setFilters: React.Dispatch<React.SetStateAction<CouponFilters>>;
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="md:col-span-2">
          <InputField
            label="Tìm theo mã"
            placeholder="Nhập mã voucher..."
            value={filters.code}
            onChange={(e) => setFilters((f) => ({ ...f, code: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phân loại</label>
          <select
            value={filters.type}
            onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value as CouponFilters['type'] }))}
            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition border-gray-300"
          >
            <option value="">Tất cả</option>
            <option value="PERCENT">Theo %</option>
            <option value="AMOUNT">Theo số tiền</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value as CouponFilters['status'] }))}
            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition border-gray-300"
          >
            <option value="">Tất cả</option>
            <option value="valid">Còn hoạt động</option>
            <option value="expired">Hết hạn</option>
          </select>
        </div>
      </div>
    </div>
  );
}

