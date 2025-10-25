'use client';
import React, { useEffect, useState } from 'react';
import { analyticsApi } from '@/lib/analyticsApi';

interface LocationSales {
  name: string;
  percent: number;
}

export const SalesByLocation: React.FC = () => {
  const [locations, setLocations] = useState<LocationSales[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSalesByLocation() {
      try {
        const data = await analyticsApi.getSalesByLocation();
        setLocations(data || []);
      } catch (error) {
        console.error('❌ Lỗi khi tải doanh số theo địa điểm:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSalesByLocation();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-center text-gray-500">
        Đang tải doanh số theo địa điểm...
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-center text-gray-400">
        Không có dữ liệu doanh số theo địa điểm
      </div>
    );
  }

  const colors = ['bg-purple-600', 'bg-orange-400', 'bg-blue-500', 'bg-green-500', 'bg-pink-500', 'bg-yellow-400'];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Doanh số theo địa điểm</h3>
        <button className="text-gray-400 hover:text-gray-600">⋮</button>
      </div>

      <div className="space-y-4">
        {locations.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-700">{item.name}</span>
              <span className="font-semibold text-gray-800">{item.percent}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className={`${colors[i % colors.length]} h-2 transition-all duration-500`}
                style={{ width: `${item.percent}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesByLocation;
