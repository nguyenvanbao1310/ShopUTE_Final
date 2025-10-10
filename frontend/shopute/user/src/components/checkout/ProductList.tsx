import { CartItemDTO } from "../../store/cartSlice";
import { useSelector } from "react-redux";
import { selectSelectedItems } from "../../store/cartSlice";

const ProductList = () => {
  const items = useSelector(selectSelectedItems) as CartItemDTO[];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Sản phẩm đã chọn
            </h2>
          </div>
          <span className="bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
            {items.length} sản phẩm
          </span>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="p-6">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              {/* Hình ảnh */}
              <div className="flex-shrink-0">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </div>

              {/* Thông tin sản phẩm */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Đơn giá: {item.price.toLocaleString()}₫
                </p>
              </div>

              {/* Số lượng và tổng */}
              <div className="flex-shrink-0 text-right">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    x{item.quantity}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {(item.price * item.quantity).toLocaleString()}₫
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tổng cộng */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-base font-medium text-gray-900">
              Tổng tạm tính
            </span>
            <span className="text-xl font-bold text-blue-600">
              {items
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toLocaleString()}₫
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;