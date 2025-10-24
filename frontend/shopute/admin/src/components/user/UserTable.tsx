'use client';

import React from 'react';
import type { User as AdminUser } from '@/types/user';

export function UserTable({
  users,
  updatingId,
  onToggleActive,
}: {
  users: AdminUser[];
  updatingId: number | null;
  onToggleActive: (u: AdminUser) => Promise<void> | void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điểm tích lũy</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((u) => (
            <tr key={u.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`${u.firstName} ${u.lastName}`}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{u.role}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={u.isActive}
                    onClick={() => onToggleActive(u)}
                    disabled={updatingId === u.id}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      u.isActive ? 'bg-green-500 focus:ring-green-500' : 'bg-gray-300 focus:ring-gray-400'
                    } ${updatingId === u.id ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        u.isActive ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.loyaltyPoints}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.createdAt}</td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                Không có người dùng nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
