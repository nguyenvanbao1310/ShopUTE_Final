import React, { useEffect, useState } from "react";
import Layout from "../layouts/MainLayout";
import {
  getUserOrders,
  cancelPendingOrder,
  requestCancelOrder,
  payOrderCOD,
} from "../apis/orderApi";
import type { Order, CancelOrderResponse } from "../types/order";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-gray-400",
  CONFIRMED: "bg-blue-400",
  PREPARING: "bg-purple-400",
  SHIPPED: "bg-yellow-400",
  COMPLETED: "bg-green-500",
  CANCELLED: "bg-red-500",
  CANCEL_REQUESTED: "bg-orange-400",
};

const STATUS_ORDER = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "SHIPPED",
  "COMPLETED",
  "CANCEL_REQUESTED",
  "CANCELLED",
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value
  );

const formatDateTime = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function OrderList() {
  const IMAGE_BASE_URL = process.env.REACT_APP_API_IMAGE_URL;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  const STATUS_FILTERS = [
    { key: "ALL", label: "Tất cả" },
    { key: "PENDING", label: "Chờ xác nhận" },
    { key: "CONFIRMED", label: "Đã xác nhận" },
    { key: "PREPARING", label: "Đang chuẩn bị" },
    { key: "SHIPPED", label: "Đang giao" },
    { key: "COMPLETED", label: "Hoàn thành" },
    { key: "CANCEL_REQUESTED", label: "Yêu cầu hủy" },
    { key: "CANCELLED", label: "Đã hủy" },
  ];

  const toggleExpand = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getUserOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPending = async (orderId: number) => {
    try {
      const result: CancelOrderResponse = await cancelPendingOrder(orderId);
      if (result.type === "cancelled" && result.order) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: "CANCELLED" } : o
          )
        );
      }
    } catch {
      alert("Cannot cancel this order");
    }
  };

  const handleOpenRequestModal = (orderId: number) => {
    setCurrentOrderId(orderId);
    setReason("");
    setModalOpen(true);
  };

  const handleSubmitRequest = async () => {
    if (!reason || currentOrderId === null) return;

    try {
      const result: CancelOrderResponse = await requestCancelOrder(
        currentOrderId,
        reason
      );
      if (result.type === "request") {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === currentOrderId ? { ...o, status: "CANCEL_REQUESTED" } : o
          )
        );
        alert(result.message);
      }
    } catch {
      alert("Cannot request cancel for this order");
    } finally {
      setModalOpen(false);
      setCurrentOrderId(null);
      setReason("");
    }
  };

  const handlePayCOD = async (orderId: number) => {
    try {
      await payOrderCOD(orderId);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status: "COMPLETED", paymentStatus: "PAID" }
            : o
        )
      );
    } catch {
      alert("Cannot pay this order");
    }
  };

  const getProgressSegments = (status: string) =>
    STATUS_ORDER.map((s) => ({
      status: s,
      filled: STATUS_ORDER.indexOf(s) <= STATUS_ORDER.indexOf(status),
      color: STATUS_COLORS[s] || "bg-gray-200",
    }));

  const canCancelPending = (order: Order) =>
    order.status === "PENDING" &&
    (new Date().getTime() - new Date(order.createdAt).getTime()) / 1000 / 60 <
      30;

  const filteredOrders =
    filterStatus === "ALL"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  return (
    <Layout>
      <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Đơn hàng của tôi
          </h1>

          {/* Status Filter */}
          <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              {STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setFilterStatus(filter.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    filterStatus === filter.key
                      ? "bg-blue-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                  {filter.key !== "ALL" && (
                    <span className="ml-1.5 text-xs">
                      ({orders.filter((o) => o.status === filter.key).length})
                    </span>
                  )}
                  {filter.key === "ALL" && (
                    <span className="ml-1.5 text-xs">({orders.length})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Đang tải đơn hàng...</p>
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-500 text-lg">
                {filterStatus === "ALL"
                  ? "Chưa có đơn hàng nào."
                  : `Không có đơn hàng nào ở trạng thái "${
                      STATUS_FILTERS.find((f) => f.key === filterStatus)?.label
                    }".`}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md bg-white transition-all mb-4"
              >
                {/* Compact Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-gray-200">
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-base font-bold text-gray-800">
                        #{order.code}
                      </h2>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          STATUS_COLORS[order.status] || "bg-gray-400"
                        } text-white`}
                      >
                        {order.status.replace("_", " ")}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          order.paymentStatus === "PAID"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDateTime(order.createdAt)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        {formatCurrency(order.finalAmount ?? order.totalAmount)}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-sm font-medium whitespace-nowrap"
                    >
                      {expandedOrderId === order.id ? "Thu gọn" : "Chi tiết"}
                    </button>
                  </div>
                </div>

                {/* Compact Products List */}
                <div className="mt-3 space-y-2">
                  {order.OrderDetails.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 py-2">
                      <img
                        src={`${IMAGE_BASE_URL}/${item.Product.thumbnailUrl}`}
                        alt={item.Product.name}
                        className="w-12 h-12 object-cover rounded border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-800 truncate">
                          {item.Product.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatCurrency(item.Product.price)} × {item.quantity}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-800">
                        {formatCurrency(item.subtotal)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex h-2 w-full rounded-full overflow-hidden bg-gray-200">
                    {getProgressSegments(order.status).map((seg) => (
                      <div
                        key={seg.status}
                        className={`flex-1 transition-all duration-300 ${
                          seg.filled ? seg.color : "bg-gray-200"
                        }`}
                        title={seg.status.replace("_", " ")}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {canCancelPending(order) && (
                    <button
                      className="px-4 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm font-medium"
                      onClick={() => handleCancelPending(order.id)}
                    >
                      Hủy đơn
                    </button>
                  )}
                  {order.status === "CONFIRMED" && (
                    <button
                      className="px-4 py-1.5 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors text-sm font-medium"
                      onClick={() => handleOpenRequestModal(order.id)}
                    >
                      Yêu cầu hủy
                    </button>
                  )}
                </div>

                {/* Expanded Details */}
                {expandedOrderId === order.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4 animate-fadeIn">
                    {/* Order Info & Delivery Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Order Info */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h3 className="font-semibold text-gray-700 text-sm mb-2">
                          Thông tin đơn hàng
                        </h3>
                        <div className="space-y-1.5 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tạm tính:</span>
                            <span className="font-medium">
                              {formatCurrency(order.totalAmount)}
                            </span>
                          </div>
                          {(order.discountAmount ?? 0) > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Giảm giá (Coupon):</span>
                              <span className="font-medium">
                                -{formatCurrency(order.discountAmount ?? 0)}
                              </span>
                            </div>
                          )}
                          {(order.usedPoints ?? 0) > 0 && (
                            <div className="flex justify-between text-purple-600">
                              <span>
                                Điểm thưởng ({order.usedPoints} điểm):
                              </span>
                              <span className="font-medium">
                                -
                                {formatCurrency(
                                  order.pointsDiscountAmount ?? 0
                                )}
                              </span>
                            </div>
                          )}
                          {(order.shippingFee ?? 0) > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">
                                Phí vận chuyển:
                              </span>
                              <span className="font-medium">
                                {formatCurrency(order.shippingFee ?? 0)}
                              </span>
                            </div>
                          )}
                          <div className="pt-1.5 border-t border-gray-300">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-gray-800">
                                Tổng cộng:
                              </span>
                              <span className="font-bold text-lg text-blue-600">
                                {formatCurrency(
                                  order.finalAmount ?? order.totalAmount
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Delivery Info */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h3 className="font-semibold text-gray-700 text-sm mb-2">
                          Thông tin giao hàng
                        </h3>
                        <div className="space-y-1.5 text-sm">
                          <div>
                            <div className="text-xs text-gray-500">
                              Phương thức thanh toán
                            </div>
                            <div className="font-medium text-gray-800">
                              {order.paymentMethod}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">
                              Địa chỉ giao hàng
                            </div>
                            <div className="font-medium text-gray-800">
                              {order.deliveryAddress}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <div>
                              <div className="text-xs text-gray-500">
                                Ngày tạo
                              </div>
                              <div className="text-xs font-medium">
                                {formatDateTime(order.createdAt)}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">
                                Cập nhật
                              </div>
                              <div className="text-xs font-medium">
                                {formatDateTime(order.updatedAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shipping & Coupon - Compact */}
                    <div className="flex flex-wrap gap-2">
                      {order.shippingMethod && (
                        <div className="bg-blue-50 border border-blue-200 rounded px-3 py-2 text-sm">
                          <span className="text-blue-700">
                            🚚 {order.shippingMethod.name}
                          </span>
                          {order.shippingMethod.estimatedDays && (
                            <span className="text-gray-600 ml-2">
                              • {order.shippingMethod.estimatedDays}
                            </span>
                          )}
                        </div>
                      )}

                      {order.coupon && (
                        <div className="bg-green-50 border border-green-200 rounded px-3 py-2 text-sm">
                          <span className="text-green-700">🎟️ Mã: </span>
                          <span className="font-mono font-bold text-green-800">
                            {order.coupon.code}
                          </span>
                        </div>
                      )}

                      {(order.usedPoints ?? 0) > 0 && (
                        <div className="bg-purple-50 border border-purple-200 rounded px-3 py-2 text-sm">
                          <span className="text-purple-700">
                            ⭐ Dùng {order.usedPoints} điểm
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Note */}
                    {order.note && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <h3 className="font-semibold text-yellow-800 text-sm mb-1">
                          📝 Ghi chú
                        </h3>
                        <p className="text-sm text-gray-700 italic">
                          {order.note}
                        </p>
                      </div>
                    )}

                    {/* Progress Details */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <h3 className="font-semibold text-gray-700 text-sm mb-2">
                        Tiến trình đơn hàng
                      </h3>
                      <div className="grid grid-cols-7 gap-1 text-xs text-center">
                        {STATUS_ORDER.map((s) => (
                          <div
                            key={s}
                            className={`${
                              order.status === s
                                ? "font-bold text-blue-600"
                                : "text-gray-500"
                            }`}
                          >
                            {s
                              .replace("_", " ")
                              .split(" ")
                              .map((word, i) => (
                                <div key={i}>{word}</div>
                              ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Lý do yêu cầu hủy đơn
            </h2>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              placeholder="Nhập lý do của bạn..."
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                onClick={() => setModalOpen(false)}
              >
                Hủy
              </button>
              <button
                className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
                onClick={handleSubmitRequest}
              >
                Gửi yêu cầu
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
