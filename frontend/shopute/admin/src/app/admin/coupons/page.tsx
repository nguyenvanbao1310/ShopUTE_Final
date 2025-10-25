"use client";

import React from "react";
import { useCoupons } from "@/hooks/useCoupons";
import { CouponSearch } from "@/components/coupon/CouponSearch";
import { CouponTable } from "@/components/coupon/CouponTable";
import { CouponDialog } from "@/components/coupon/CouponDialog";
import type { Coupon } from "@/types/coupon";

export default function AdminCouponsPage() {
  const { coupons, loading, saving, filters, setFilters, createCoupon, updateCoupon } = useCoupons();

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Coupon | null>(null);

  return (
    <div className="space-y-6">
      <CouponSearch filters={filters} setFilters={setFilters} />
      <CouponTable
        coupons={coupons}
        onAdd={() => {
          setEditing(null);
          setOpen(true);
        }}
        onRowClick={(c) => {
          setEditing(c);
          setOpen(true);
        }}
      />

      <CouponDialog
        open={open}
        saving={saving}
        initial={editing ?? undefined}
        onClose={() => setOpen(false)}
        onSubmit={async (data) => {
          if (editing) {
            await updateCoupon(editing.id, data);
          } else {
            await createCoupon(data);
          }
        }}
      />
    </div>
  );
}

