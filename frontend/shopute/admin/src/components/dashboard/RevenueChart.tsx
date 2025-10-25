'use client';
import React, { useEffect, useState } from 'react';
import { analyticsApi, RevenueResponse } from '@/lib/analyticsApi';

const months = [
  'T1','T2','T3','T4','T5','T6',
  'T7','T8','T9','T10','T11','T12'
];

export const RevenueChart: React.FC = () => {
  const [chartData, setChartData] = useState<number[]>(new Array(12).fill(0));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRevenue() {
      try {
        const data = await analyticsApi.getRevenue();
        const monthly =
          Array.isArray((data as any).monthlyRevenue)
            ? (data as any).monthlyRevenue
            : Array.isArray(data)
            ? data
            : [];

        console.log('📊 API data:', monthly);

        const temp = new Array(12).fill(0);

        monthly.forEach((item: any) => {
  if (!item?.month) return;
  const monthStr = item.month.trim();
  const parts = monthStr.split('-');
  const monthNumber = Number(parts[1]);

  const revenueValue = Number(item.revenue ?? 0);
  if (!isNaN(monthNumber) && monthNumber >= 1 && monthNumber <= 12) {
    temp[monthNumber - 1] = revenueValue;
  }
});


        console.log('📈 Parsed revenue data:', temp);
        setChartData(temp);
      } catch (error) {
        console.error('❌ Lỗi khi tải dữ liệu doanh thu:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRevenue();
  }, []);

  if (loading) {
    return (
      <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm flex items-center justify-center text-gray-500">
        Đang tải biểu đồ doanh thu...
      </div>
    );
  }

  // ⚙️ Tính giá trị lớn nhất, bỏ qua NaN/null
  const validValues = chartData.filter(v => typeof v === 'number' && !isNaN(v));
  const maxRevenue = validValues.length > 0 ? Math.max(...validValues) : 0;
  console.log('💰 Max revenue:', maxRevenue);

  return (
    <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Báo cáo doanh thu</h3>
        <button className="text-gray-400 hover:text-gray-600">⋮</button>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
          <span className="text-gray-600">Doanh thu (VNĐ)</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[22rem] flex items-end justify-between gap-3 px-6">
      {(() => {
        const maxHeightPx = 280; // Chiều cao pixel tối đa cho cột cao nhất
        const scale = maxRevenue > 0 ? maxHeightPx / maxRevenue : 0;

        return chartData.map((value, i) => {
          const barHeight = value * scale;
          const safeHeight = Math.max(barHeight, value > 0 ? 20 : 6); // Cột nhỏ vẫn có tối thiểu 20px

          return (
            <div
              key={i}
              className="flex-1 flex flex-col items-center justify-end gap-2"
            >
              {/* 💰 Label doanh thu */}
              {value > 0 && (
                <span className="text-xs font-semibold text-gray-700 whitespace-nowrap mb-1">
                  {value.toLocaleString('vi-VN')}₫
                </span>
              )}

              {/* 🟣 Cột doanh thu */}
              <div
                className={`w-[60%] rounded-t-lg ${
                  value > 0
                    ? 'bg-gradient-to-t from-purple-600 to-purple-400 shadow-md'
                    : 'bg-gray-200'
                } transition-all duration-700 ease-out`}
                style={{
                  height: `${safeHeight}px`,
                }}
                title={`Tháng ${i + 1}: ${value.toLocaleString('vi-VN')} VNĐ`}
              ></div>

              {/* 📅 Nhãn tháng */}
              <span className="text-xs text-gray-500">{months[i]}</span>
            </div>
          );
        });
      })()}
    </div>
        </div>
  );
};

export default RevenueChart;
