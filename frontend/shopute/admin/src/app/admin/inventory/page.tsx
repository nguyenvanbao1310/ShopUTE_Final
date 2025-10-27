"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { analyticsApi } from "@/lib/analyticsApi";

interface ForecastAlert {
  productId: number;
  productName: string;
  currentStock: number;
  outOfStockMonth: string;
  predicted_sold: number;
}

export default function InventoryForecastAllPage() {
  const [alerts, setAlerts] = useState<ForecastAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi
      .getInventoryAlerts()
      .then((data) => setAlerts(data))
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          🧠 Cảnh báo tồn kho thông minh (AI)
        </h2>

        {loading ? (
          <p className="text-gray-500">Đang quét dữ liệu sản phẩm...</p>
        ) : alerts.length === 0 ? (
          <p className="text-green-600 font-medium">
            ✅ Tất cả sản phẩm đều đủ hàng!
          </p>
        ) : (
          <div className="space-y-3">
            {alerts.map((a) => (
              <div
                key={a.productId}
                className="border-l-4 border-red-500 bg-red-50 p-4 rounded"
              >
                <p className="text-lg font-semibold text-red-700">
                  ⚠️ {a.productName}
                </p>
                <p className="text-sm text-gray-700">
                  - Tồn kho hiện tại: {a.currentStock} sản phẩm
                </p>
                <p className="text-sm text-gray-700">
                  - Dự kiến hết hàng vào <b>{a.outOfStockMonth}</b> (AI dự đoán
                  bán ~{a.predicted_sold} sp)
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
