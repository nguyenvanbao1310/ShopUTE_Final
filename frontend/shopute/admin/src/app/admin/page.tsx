'use client';

import React from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { TrendingProduct } from '@/components/dashboard/TrendingProduct';
import { SalesByLocation } from '@/components/dashboard/SalesByLocation';
import { BestSellingProducts } from '@/components/dashboard/BestSellingProducts';
import { ShoppingCart, Users, Package } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          title="Tổng đơn hàng"
          value="98.5k"
          trend="up"
          trendValue="1.24%"
          icon={ShoppingCart}
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Khách hàng mới"
          value="12.3k"
          trend="up"
          trendValue="0.87%"
          icon={Users}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Sản phẩm có sẵn"
          value="5,230"
          trend="down"
          trendValue="0.34%"
          icon={Package}
          bgColor="bg-pink-100"
          iconColor="text-pink-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-3 gap-6">
        <RevenueChart />
        <TrendingProduct />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-2 gap-6">
        <SalesByLocation />
        <BestSellingProducts />
      </div>
    </div>
  );
}
