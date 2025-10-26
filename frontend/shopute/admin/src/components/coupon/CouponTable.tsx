'use client';

import React from 'react';
import type { Coupon } from '@/types/coupon';
import { couponIsValid, formatCurrencyVND, formatDateRangeVi } from '@/types/coupon';

export function CouponTable({
  coupons,
  onAdd,
  onRowClick,
}: {
  coupons: Coupon[];
  onAdd: () => void;
  onRowClick: (c: Coupon) => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-4 flex items-center">
        <h3 className="text-base font-semibold">Danh sách mã giảm giá</h3>
        <button
          className="ml-auto px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          onClick={onAdd}
        >
          Thêm voucher
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã voucher</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá trị</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tối thiểu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tối đa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hạn sử dụng</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {coupons.map((c) => {
              const valid = couponIsValid(c);
              return (
                <tr
                  key={c.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onRowClick(c)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {c.type === 'PERCENT' ? `${c.value}%` : formatCurrencyVND(c.value)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrencyVND(c.minOrderAmount ?? null)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrencyVND(c.maxDiscountValue ?? null)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDateRangeVi(c.createdAt, c.expiresAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    { (c as any)?.isUsed === true || (c as any)?.isUsed === 1 ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                        Đã sử dụng
                      </span>
                    ) : valid ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Còn hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Hết hạn
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
            {coupons.length === 0 && (
              <tr>
                <td className="px-6 py-6 text-center text-sm text-gray-500" colSpan={6}>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

