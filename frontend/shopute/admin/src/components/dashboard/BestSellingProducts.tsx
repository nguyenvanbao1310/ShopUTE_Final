'use client';
import React, { useEffect, useState } from 'react';
import { analyticsApi, TopProduct } from '@/lib/analyticsApi';

export const BestSellingProducts: React.FC = () => {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopProducts() {
      try {
        const data = await analyticsApi.getTopProducts();
        setProducts(data || []);
      } catch (error) {
        console.error('❌ Lỗi khi tải danh sách sản phẩm bán chạy:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTopProducts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-center text-gray-500">
        Đang tải danh sách sản phẩm bán chạy...
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-center text-gray-400">
        Không có dữ liệu sản phẩm bán chạy
      </div>
    );
  }

  // 💡 Base URL backend (tự động thêm nếu imageUrl chưa có http)
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8081';

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Sản phẩm bán chạy</h3>
        <button className="text-gray-400 hover:text-gray-600">⋮</button>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="space-y-4">
        {products.map((item, i) => {
          // ✅ Nếu backend trả /images/... thì tự nối domain
          const imageSrc = item.imageUrl?.startsWith('http')
            ? item.imageUrl
            : `${BASE_URL}${item.imageUrl}`;

          return (
            <div
              key={item.id || i}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all"
            >
              <div className="flex items-center gap-3">
                {/* ✅ Hiển thị ảnh thật */}
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">No Img</span>
                  )}
                </div>

                {/* Tên + số lượng */}
                <div>
                  <p className="font-medium text-gray-800 truncate max-w-[150px]">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">{item.totalSold} đã bán</p>
                </div>
              </div>

              {/* Doanh thu (giả lập hoặc từ DB nếu có) */}
              <span className="font-semibold text-gray-800">
                {(item.price).toLocaleString('vi-VN')}₫
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BestSellingProducts;
