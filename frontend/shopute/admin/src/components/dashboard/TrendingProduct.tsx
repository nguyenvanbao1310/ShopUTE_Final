export  const TrendingProduct = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Sản phẩm xu hướng</h3>
      <div className="bg-green-50 text-green-600 text-xs font-medium px-3 py-1 rounded-full inline-block mb-4">
        8.5% Hơn tuần trước
      </div>
      <div className="flex justify-center mb-4">
        <div className="w-48 h-48 bg-gradient-to-br from-green-600 to-green-800 rounded-2xl flex items-center justify-center text-white text-4xl font-bold">
          👕
        </div>
      </div>
      <h4 className="font-semibold text-gray-800 mb-1">Áo thun premium</h4>
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-gray-800">299.000đ</span>
        <span className="text-sm text-gray-400 line-through">399.000đ</span>
      </div>
    </div>
  );
};
