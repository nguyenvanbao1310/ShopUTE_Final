import { useSelector, useDispatch } from "react-redux";
import { selectSelectedItems, CartItemDTO } from "../../store/cartSlice";
import { Voucher } from "../../types/voucher";
import { ShippingMethod } from "../../types/shippingMethod";
import { Address } from "../../types/address";
import { createOrder, payWithMomo } from "../../apis/orderApi";
import { RootState, AppDispatch } from "../../store/store";
import { updateProfile } from "../../store/authSlice";
import { useOrderCalculation } from "../../hooks/useOrderCalculation";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface OrderSummaryProps {
  voucher: Voucher | null;
  paymentMethod: string;
  shippingMethod: ShippingMethod | null;
  address: Address | null;
  usedPoints?: number;
}

const OrderSummary = ({ 
  voucher, 
  paymentMethod, 
  shippingMethod, 
  address, 
  usedPoints = 0 
}: OrderSummaryProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectSelectedItems) as CartItemDTO[];
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();
  // States cho loading và errors
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string>("");

  // Sử dụng custom hook để tính toán
  const calculation = useOrderCalculation({
    items,
    voucher,
    shippingMethod,
    usedPoints
  });

  const validateOrder = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!address) {
      errors.push("Vui lòng chọn địa chỉ nhận hàng");
    }
    if (!shippingMethod) {
      errors.push("Vui lòng chọn phương thức vận chuyển");
    }
    if (items.length === 0) {
      errors.push("Giỏ hàng trống");
    }
    if (!user) {
      errors.push("Vui lòng đăng nhập để tiếp tục");
    }
    if (usedPoints > (user?.loyaltyPoints ?? 0)) {
      errors.push("Số điểm sử dụng vượt quá số điểm hiện có");
    }

    // Thêm errors từ calculation
    errors.push(...calculation.errors);

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handlePlaceOrder = async () => {
    const validation = validateOrder();
    
    if (!validation.isValid) {
      setOrderError(validation.errors.join('\n'));
      return;
    }

    setIsPlacingOrder(true);
    setOrderError("");

    try {
      const orderPayload = {
        code: "ORD" + Date.now(),
        deliveryAddress: `${address!.street}, ${address!.ward}, ${address!.province}`,
        shippingMethodId: shippingMethod!.id,
        paymentMethod,
        voucherId: voucher?.id ?? null,
        usedPoints,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      };
      
      // Gọi API tạo đơn hàng
      const response = await createOrder(orderPayload);
      if (paymentMethod === "COD") {
        // Cập nhật điểm loyalty nếu có sử dụng
        if (usedPoints > 0 && user) {
          dispatch(updateProfile({
            loyaltyPoints: user.loyaltyPoints - usedPoints
          }));
        }
        
        navigate(`/checkout/complete?orderId=${response.order.code}`);
        console.log("Order:", response.order);
      } else if (paymentMethod === "MOMO") {
        // Gọi API thanh toán MoMo
        const momoResponse = await payWithMomo(response.order.id);
        
        // Cập nhật điểm trước khi redirect
        if (usedPoints > 0 && user) {
          dispatch(updateProfile({
            loyaltyPoints: user.loyaltyPoints - usedPoints
          }));
        }
        
        // Redirect to MoMo payment
        window.location.href = momoResponse.payUrl;
      }

    } catch (error: any) {
      console.error("Đặt hàng lỗi:", error);
      
      // Xử lý error message
      let errorMessage = "Đặt hàng thất bại. Vui lòng thử lại.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setOrderError(errorMessage);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="sticky top-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
        {/* Loading overlay */}
        {isPlacingOrder && (
          <div className="absolute inset-0 bg-white/90 rounded-lg flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-blue-600 font-medium">Đang xử lý đơn hàng...</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Tóm tắt đơn hàng</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 relative z-10">
          {/* Error message */}
          {orderError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                <div>
                  <p className="text-red-800 text-sm font-medium">Có lỗi xảy ra:</p>
                  <p className="text-red-700 text-sm whitespace-pre-line">{orderError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Order Details */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Tổng tiền hàng</span>
              <span className="font-medium text-gray-900">{calculation.subtotal.toLocaleString()}₫</span>
            </div>
            
            {calculation.shippingFee > 0 && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="font-medium text-gray-900">
                  {calculation.shippingFee.toLocaleString()}₫
                </span>
              </div>
            )}
            
            {calculation.discount > 0 && voucher && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Giảm giá ({voucher.code})</span>
                <span className="font-medium text-red-600">
                  -{calculation.discount.toLocaleString()}₫
                </span>
              </div>
            )}
            
            {calculation.discountFromPoints > 0 && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Giảm giá từ điểm ({usedPoints} điểm)</span>
                <span className="font-medium text-red-600">
                  -{calculation.discountFromPoints.toLocaleString()}₫
                </span>
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Tổng thanh toán
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  {calculation.finalTotal.toLocaleString()}₫
                </span>
              </div>
            </div>
          </div>

          {/* Validation warnings */}
          {!calculation.isValidOrder && calculation.errors.length > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                <div>
                  <p className="text-yellow-800 text-sm font-medium">Cảnh báo:</p>
                  <ul className="text-yellow-700 text-sm list-disc list-inside">
                    {calculation.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder || !calculation.isValidOrder}
            className={`w-full py-4 rounded-lg text-lg font-semibold transition-all duration-200 ${
              isPlacingOrder || !calculation.isValidOrder
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {isPlacingOrder ? "Đang xử lý..." : "Đặt hàng ngay"}
          </button>

          {/* Payment method info */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              Phương thức: {paymentMethod}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;