export  const RevenueChart = () => {
  const chartData = [90, 100, 70, 110, 85, 90, 60, 30, 95, 40, 90, 35];
  const months = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];

  return (
    <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Báo cáo doanh thu</h3>
        <button className="text-gray-400 hover:text-gray-600">⋮</button>
      </div>
      <div className="flex gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-purple-600 rounded-full"></span>
          <span className="text-gray-600">Đơn hàng</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-orange-400 rounded-full"></span>
          <span className="text-gray-600">Thu nhập</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          <span className="text-gray-600">Hoàn tiền</span>
        </div>
      </div>
      <div className="h-64 flex items-end justify-between gap-2">
        {chartData.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full bg-purple-600 rounded-t" style={{height: `${h}%`}}></div>
            <span className="text-xs text-gray-500">{months[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RevenueChart;