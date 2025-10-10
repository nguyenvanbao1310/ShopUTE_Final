import { useLocation, Link } from "react-router-dom"; // Use Link from react-router-dom for internal navigation
import { CheckCircleIcon, CubeIcon, HomeIcon } from '@heroicons/react/24/solid'; // Example icons from Heroicons

const OrderComplete = () => {
  const query = new URLSearchParams(useLocation().search);
  const code = query.get("code");
  
  // Use a placeholder date/time to make the interface look realistic
  const orderTime = new Date().toLocaleString('vi-VN', { 
    hour: '2-digit', 
    minute: '2-digit', 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 md:p-10 rounded-xl shadow-2xl max-w-xl w-full text-center border-t-8 border-emerald-500">
        {/* --- Header: Success Icon and Message --- */}
        <div className="flex flex-col items-center mb-6">
          <CheckCircleIcon className="w-16 h-16 text-emerald-500 mb-3 animate-pulse" />
          <h1 className="text-3xl font-extrabold text-gray-800">
            Đặt hàng thành công!
          </h1>
          <p className="text-lg text-gray-500 mt-1">
            Đơn hàng của bạn đã được tiếp nhận.
          </p>
        </div>

        {/* --- Order Details Section --- */}
        <div className="border border-dashed border-gray-300 p-4 rounded-lg bg-emerald-50 bg-opacity-50 mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center text-gray-600 font-medium">
              <CubeIcon className="w-5 h-5 mr-2 text-emerald-600" /> Mã đơn hàng:
            </span>
            <span className="font-bold text-xl text-emerald-700 font-mono select-all">
              {code || "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Thời gian đặt:</span>
            <span>{orderTime}</span>
          </div>
        </div>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Cảm ơn bạn đã mua sắm tại <span className="font-bold text-gray-800">UTEShop</span>. Chúng tôi sẽ gửi thông tin chi tiết qua email cho bạn. Bạn có thể theo dõi trạng thái đơn hàng trong phần quản lý đơn hàng.
        </p>

        {/* --- Action Buttons --- */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/orders"
            className="flex-1 flex items-center justify-center px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition duration-150 shadow-md hover:shadow-lg"
          >
            <CubeIcon className="w-5 h-5 mr-2" /> Xem đơn hàng
          </Link>
          <Link
            to="/"
            className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition duration-150"
          >
            <HomeIcon className="w-5 h-5 mr-2" /> Về trang chủ
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default OrderComplete;