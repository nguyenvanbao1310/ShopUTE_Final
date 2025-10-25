export  const BestSellingProducts = () => {
  const products = [
    {name: 'Áo thun basic', sales: 1234, revenue: '12.5M'},
    {name: 'Quần jean slim', sales: 987, revenue: '9.8M'},
    {name: 'Váy dài maxi', sales: 856, revenue: '8.5M'},
    {name: 'Áo khoác hoodie', sales: 743, revenue: '7.4M'}
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Sản phẩm bán chạy</h3>
        <button className="text-gray-400 hover:text-gray-600">⋮</button>
      </div>
      <div className="space-y-4">
        {products.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500">{item.sales} đã bán</p>
              </div>
            </div>
            <span className="font-semibold text-gray-800">{item.revenue}đ</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellingProducts;
