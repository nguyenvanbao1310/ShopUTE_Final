'use client';

import React, { useEffect, useState } from 'react';
import { StatCard } from '@/components/dashboard/StatCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { TrendingProduct } from '@/components/dashboard/TrendingProduct';
import { SalesByLocation } from '@/components/dashboard/SalesByLocation';
import { BestSellingProducts } from '@/components/dashboard/BestSellingProducts';
import { ShoppingCart, Users, Package } from 'lucide-react';

// 🔹 Kiểu dữ liệu chuẩn cho mỗi thẻ thống kê
interface StatState {
  value: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
}

export default function DashboardPage() {
  // 📦 State lưu dữ liệu
  const [stats, setStats] = useState<{
    totalOrders: StatState;
    newCustomers: StatState;
    availableProducts: StatState;
  }>({
    totalOrders: { value: '0', trend: 'neutral', trendValue: '0%' },
    newCustomers: { value: '0', trend: 'neutral', trendValue: '0%' },
    availableProducts: { value: '0', trend: 'neutral', trendValue: '0%' },
  });

  // 📊 Gọi API backend
  useEffect(() => {
    async function fetchStats() {
      try {
        // 🟣 1. Gọi API tổng đơn hàng
        const ordersRes = await fetch('http://localhost:8081/api/analytics/orders');
        const ordersData = await ordersRes.json();

        // 🟢 2. Gọi API khách hàng mới
        const customersRes = await fetch('http://localhost:8081/api/analytics/customers');
        const customersData = await customersRes.json();

        // 🟠 Sản phẩm có sẵn
        const productsRes = await fetch('http://localhost:8081/api/analytics/products');
        const productsData = await productsRes.json();

        // ✅ 4. Cập nhật state
        setStats({
          totalOrders: {
            value: ordersData.totalOrders?.toString() || '0',
            trend: (ordersData.trend as 'up' | 'down' | 'neutral') || 'neutral',
            trendValue: `${Math.abs(Number(ordersData.trendValue || 0)).toFixed(2)}%`,
          },
          newCustomers: {
            value:
              customersData.newCustomers?.toString() ||
              customersData.newUsers?.toString() ||
              '0',
            trend:
              (customersData.trend as 'up' | 'down' | 'neutral') || 'neutral',
            trendValue: `${Math.abs(
              Number(customersData.trendValue || 0)
            ).toFixed(2)}%`,
          },
         availableProducts: {
          value: productsData.availableProducts?.toString() || '0',
          trend: (productsData.trend as 'up' | 'down' | 'neutral') || 'neutral',
          trendValue: `${Math.abs(Number(productsData.trendValue || 0)).toFixed(2)}%`,
        },
        });
      } catch (error) {
        console.error('Lỗi khi tải thống kê:', error);
      }
    }

    fetchStats();
  }, []);

  // 🧩 Giao diện dashboard
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <StatCard
          title="Tổng đơn hàng"
          value={stats.totalOrders.value}
          trend={stats.totalOrders.trend}
          trendValue={stats.totalOrders.trendValue}
          icon={ShoppingCart}
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatCard
          title="Khách hàng mới"
          value={stats.newCustomers.value}
          trend={stats.newCustomers.trend}
          trendValue={stats.newCustomers.trendValue}
          icon={Users}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Sản phẩm có sẵn"
          value={stats.availableProducts.value}
          trend={stats.availableProducts.trend}
          trendValue={stats.availableProducts.trendValue}
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
