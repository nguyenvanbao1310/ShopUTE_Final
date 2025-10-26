"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { analyticsApi } from "@/lib/analyticsApi"; // ✅ import đúng API đã khai báo

interface ForecastResponse {
  history: { month: string; revenue: number }[];
  forecast: { ds: string; yhat: number }[];
}

export default function ForecastPage() {
  const [data, setData] = useState<
    { month: string; actual?: number; predicted?: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const res: ForecastResponse = await analyticsApi.getForecast(); // ✅ gọi API đã có type
        const merged = [
          ...res.history.map((d) => ({
            month: d.month,
            actual: d.revenue,
          })),
          ...res.forecast.map((d) => ({
            month: d.ds,
            predicted: d.yhat,
          })),
        ];
        setData(merged);
      } catch (error) {
        console.error("❌ Lỗi lấy dự đoán doanh thu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          📈 Dự đoán doanh thu (AI)
        </h2>

        {loading ? (
          <p className="text-gray-500">Đang tải dữ liệu dự đoán...</p>
        ) : data.length === 0 ? (
          <p className="text-gray-500">Không có dữ liệu để hiển thị.</p>
        ) : (
          <ResponsiveContainer width="99%" height={420}>
  <LineChart
    data={data}
    margin={{ top: 20, right: 60, left: 20, bottom: 40 }} // ✅ thêm khoảng trống 2 bên
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis
      dataKey="month"
      angle={-25} // ✅ nghiêng label tháng để không chồng nhau
      textAnchor="end"
      tick={{ fontSize: 12 }}
      interval={0}
      dy={10}
    />
    <YAxis
      width={90} // ✅ mở rộng không gian hiển thị giá trị
      tickFormatter={(value) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
          maximumFractionDigits: 0,
        }).format(Number(value))
      }
    />

              <Tooltip
                formatter={(value) =>
                  new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(Number(value))
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#007bff"
                name="Doanh thu thực tế"
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#ff7300"
                name="Doanh thu dự đoán (AI)"
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
