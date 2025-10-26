'use client';
import React, { useEffect, useState } from 'react';
import { analyticsApi, TopProduct } from '@/lib/analyticsApi';

export const TrendingProduct: React.FC = () => {
  const [product, setProduct] = useState<TopProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const data = await analyticsApi.getTopProducts();
        if (data && data.length > 0) {
          setProduct(data[0]); // ✅ Lấy sản phẩm đầu tiên (bán chạy nhất)
        }
      } catch (error) {
        console.error('❌ Lỗi khi tải sản phẩm xu hướng:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTrending();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-center text-gray-500">
        Đang tải sản phẩm xu hướng...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-center text-gray-400">
        Không có sản phẩm xu hướng
      </div>
    );
  }

  // 🔗 Đường dẫn hình ảnh (ghép domain backend)
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8081';
  const imageSrc = product.imageUrl?.startsWith('http')
    ? product.imageUrl
    : `${BASE_URL}${product.imageUrl}`;

  // 💹 Giả lập tỷ lệ tăng trưởng
  const trendValue = (Math.random() * 10 + 3).toFixed(1); // 3–13%

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm text-center">
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Sản phẩm xu hướng</h3>

      {/* Trend badge */}
      <div className="bg-green-50 text-green-600 text-xs font-medium px-3 py-1 rounded-full inline-block mb-4">
        +{trendValue}% so với tuần trước
      </div>

      {/* Hình ảnh sản phẩm */}
      <div className="flex justify-center mb-4">
        <div className="w-48 h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-4xl font-bold">🛍️</span>
          )}
        </div>
      </div>

      {/* Tên + giá */}
      <h4 className="font-semibold text-gray-800 mb-1 truncate">{product.name}</h4>

      {/* Nếu bạn có thêm giá trong DB thì hiển thị */}
      <div className="flex items-center justify-center gap-2">
        <span className="text-xl font-bold text-gray-800">
          {product.price
            ? `${Number(product.price).toLocaleString('vi-VN')}đ`
            : '—'}
        </span>
      </div>
    </div>
  );
};

export default TrendingProduct;
