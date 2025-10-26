import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectSelectedItems } from "../../store/cartSlice";
import { couponApi } from "../../apis/counponApi";
import type { Coupon } from "../../types/counpon";

interface CouponSectionProps {
  onSelectCoupon?: (coupon: Coupon | null) => void;
}
  
const CouponSection = ({ onSelectCoupon }: CouponSectionProps) => {
  const selectedItems = useSelector(selectSelectedItems);
  const [showCoupons, setShowCoupons] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState(false);

  // Tính tổng giá trị đơn hàng được chọn
  const orderTotal = selectedItems.reduce(
    (sum: number, it: { price: number; quantity: number }) =>
      sum + it.price * it.quantity,
    0
  );

  // Fetch coupon hợp lệ khi show hoặc orderTotal thay đổi
  useEffect(() => {
    if (!showCoupons || orderTotal === 0) return;
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const res = await couponApi.getValid(orderTotal);
        setCoupons(res);
      } catch (e) {
        console.error("Failed to fetch coupons:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, [showCoupons, orderTotal]);

  // Khi chọn coupon thì set state + gọi callback
  const handleSelectCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    onSelectCoupon?.(coupon);
    setShowCoupons(false);
  };

  const handleRemoveCoupon = () => {
    setSelectedCoupon(null);
    onSelectCoupon?.(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-amber-50 px-6 py-4 border-b border-amber-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-amber-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 5a3 3 0 015-2.236A3 3 0 0115 5a3 3 0 013 3v6a3 3 0 01-3 3H5a3 3 0 01-3-3V8a3 3 0 013-3zm4 2H5a1 1 0 00-1 1v6a1 1 0 001 1h4V7zm2 10h4a1 1 0 001-1V8a1 1 0 00-1-1h-4v10z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Mã giảm giá</h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {selectedCoupon ? (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">
                    {selectedCoupon.code}
                  </span>
                  <span className="text-sm bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                    {selectedCoupon.type === "PERCENT"
                      ? `-${selectedCoupon.value}%`
                      : `-${Number(selectedCoupon.value).toLocaleString()}₫`}
                  </span>
                </div>
                {selectedCoupon.maxDiscountValue && selectedCoupon.type === "PERCENT" && (
                  <p className="text-sm text-gray-600">
                    Giảm tối đa: {Number(selectedCoupon.maxDiscountValue).toLocaleString()}₫
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => setShowCoupons(true)}
                  className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-200"
                >
                  Đổi
                </button>
                <button
                  onClick={handleRemoveCoupon}
                  className="w-8 h-8 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowCoupons(true)}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
          >
            Chọn hoặc nhập mã coupon
          </button>
        )}
      </div>

      {/* Modal chọn coupon */}
      {showCoupons && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Chọn coupon</h3>
              <button
                onClick={() => setShowCoupons(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600">Đang tải voucher...</p>
                  </div>
                </div>
              ) : coupons.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0115 5a3 3 0 013 3v6a3 3 0 01-3 3H5a3 3 0 01-3-3V8a3 3 0 013-3zm4 2H5a1 1 0 00-1 1v6a1 1 0 001 1h4V7zm2 10h4a1 1 0 001-1V8a1 1 0 00-1-1h-4v10z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <p className="text-gray-500">Không có voucher phù hợp</p>
                </div>
              ) : (
                coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                      selectedCoupon?.id === coupon.id
                        ? "border-gray-400 bg-gray-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => handleSelectCoupon(coupon)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">
                            {coupon.code}
                          </span>
                          <span className="text-sm bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                            {coupon.type === "PERCENT"
                              ? `-${coupon.value}%`
                              : `-${Number(coupon.value).toLocaleString()}₫`}
                          </span>
                        </div>

                        {coupon.maxDiscountValue && coupon.type === "PERCENT" && (
                          <p className="text-xs text-gray-600 mb-1">
                            Giảm tối đa: {Number(coupon.maxDiscountValue).toLocaleString()}₫
                          </p>
                        )}
                        {coupon.minOrderAmount && (
                          <p className="text-xs text-gray-600 mb-1">
                            Đơn tối thiểu: {Number(coupon.minOrderAmount).toLocaleString()}₫
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          HSD: {new Date(coupon.expiresAt).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      {selectedCoupon?.id === coupon.id && (
                        <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 ml-3">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponSection;