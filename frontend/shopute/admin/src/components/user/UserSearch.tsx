'use client';

import React from 'react';
import { InputField } from '@/components/ui/InputField';
import type { UsersFilters } from '@/hooks/useUsers';

export function UserSearch({
  filters,
  setFilters,
  loading,
  onSearch,
}: {
  filters: UsersFilters;
  setFilters: React.Dispatch<React.SetStateAction<UsersFilters>>;
  loading: boolean;
  onSearch: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSearch} className="bg-white rounded-xl p-4 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        <div className="md:col-span-2">
          <InputField
            label="Tìm theo tên hoặc email"
            placeholder="Nhập tên hoặc email..."
            value={filters.name}
            onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
          <select
            value={filters.role}
            onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value as UsersFilters['role'] }))}
            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition border-gray-300"
          >
            <option value="">Tất cả</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value as UsersFilters['status'] }))}
            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition border-gray-300"
          >
            <option value="">Tất cả</option>
            <option value="active">Đang hoạt động</option>
            <option value="banned">Đã bị ban</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full md:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? 'Đang tìm...' : 'Tìm kiếm'}
          </button>
        </div>
      </div>
    </form>
  );
}

