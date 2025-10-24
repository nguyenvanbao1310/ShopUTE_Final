"use client";

import React from "react";
import { useUsers } from "@/hooks/useUsers";
import { UserStats } from "@/components/user/UserStats";
import { UserSearch } from "@/components/user/UserSearch";
import { UserTable } from "@/components/user/UserTable";

export default function AdminUsersPage() {
  const {
    stats,
    statCards,
    users,
    loading,
    updatingId,
    filters,
    setFilters,
    onSearch,
    onToggleActive,
  } = useUsers();

  return (
    <div className="space-y-6">
      <UserStats
        total={statCards.total}
        active={statCards.active}
        banned={statCards.banned}
      />
      <UserSearch
        filters={filters}
        setFilters={setFilters}
        loading={loading}
        onSearch={onSearch}
      />
      <UserTable
        users={users}
        updatingId={updatingId}
        onToggleActive={onToggleActive}
      />
    </div>
  );
}
