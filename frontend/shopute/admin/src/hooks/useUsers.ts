'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import apiClient from '@/lib/api';
import type { User as AdminUser, Role, UserStats } from '@/types/user';

export type UsersFilters = {
  name: string;
  role: '' | Role;
  status: '' | 'active' | 'banned';
};

export function useUsers() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [filters, setFilters] = useState<UsersFilters>({ name: '', role: '', status: '' });

  const fetchStats = useCallback(async () => {
    const data = await apiClient.get<UserStats>('/users/stats');
    setStats(data);
  }, []);

  const fetchUsers = useCallback(async (f: UsersFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (f.name.trim()) params.set('name', f.name.trim());
      if (f.role) params.set('role', f.role);
      if (f.status) params.set('isActive', f.status === 'active' ? 'true' : 'false');
      const qs = params.toString();
      const endpoint = qs ? `/users/search?${qs}` : '/users';
      const data = await apiClient.get<AdminUser[]>(endpoint);
      setUsers(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const onSearch = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      await fetchUsers(filters);
    },
    [filters, fetchUsers],
  );

  const onToggleActive = useCallback(
    async (u: AdminUser) => {
      setUpdatingId(u.id);
      try {
        await apiClient.patch(`/users/${u.id}/status`, { isActive: !u.isActive });
        setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, isActive: !x.isActive } : x)));
        setStats((prev) =>
          prev
            ? {
                total: prev.total,
                active: prev.active + (!u.isActive ? 1 : -1),
                banned: prev.banned + (!u.isActive ? -1 : 1),
              }
            : prev,
        );
      } finally {
        setUpdatingId(null);
      }
    },
    [],
  );

  useEffect(() => {
    fetchStats();
    fetchUsers(filters);
  }, []);

  const statCards = useMemo(
    () => ({
      total: stats?.total ?? null,
      active: stats?.active ?? null,
      banned: stats?.banned ?? null,
    }),
    [stats],
  );

  return {
    // state
    stats,
    statCards,
    users,
    loading,
    updatingId,
    filters,
    // actions
    setFilters,
    fetchStats,
    fetchUsers,
    onSearch,
    onToggleActive,
  };
}
