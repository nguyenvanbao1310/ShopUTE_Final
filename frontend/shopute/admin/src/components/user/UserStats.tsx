'use client';

import React from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Users as UsersIcon, ShieldBan } from 'lucide-react';

export function UserStats({
  total,
  active,
  banned,
}: {
  total: number | null;
  active: number | null;
  banned: number | null;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        title="Tổng người dùng"
        value={total !== null ? String(total) : '—'}
        trend="up"
        trendValue={''}
        icon={UsersIcon}
        bgColor="bg-blue-100"
        iconColor="text-blue-600"
      />
      <StatCard
        title="Đang hoạt động"
        value={active !== null ? String(active) : '—'}
        trend="up"
        trendValue={''}
        icon={UsersIcon}
        bgColor="bg-green-100"
        iconColor="text-green-600"
      />
      <StatCard
        title="Đã bị ban"
        value={banned !== null ? String(banned) : '—'}
        trend="up"
        trendValue={''}
        icon={ShieldBan}
        bgColor="bg-red-100"
        iconColor="text-red-600"
      />
    </div>
  );
}

