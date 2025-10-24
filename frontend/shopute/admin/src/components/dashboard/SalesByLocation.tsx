export const SalesByLocation = () => {
  const locations = [
    {name: 'TP. Hồ Chí Minh', percent: 70, color: 'bg-purple-600'},
    {name: 'Hà Nội', percent: 85, color: 'bg-orange-400'},
    {name: 'Đà Nẵng', percent: 60, color: 'bg-blue-500'},
    {name: 'Cần Thơ', percent: 50, color: 'bg-green-500'}
  ];

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
              <span className="font-semibold">{item.percent}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className={`${item.color} h-2 rounded-full`} style={{width: `${item.percent}%`}}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SalesByLocation;