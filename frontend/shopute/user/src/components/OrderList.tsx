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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
  const [reason, setReason] = useState("");

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

  return (
    <Layout>
      <div className="p-6 space-y-8">
        {loading ? (
          <p className="text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 shadow-sm space-y-4 bg-white"
            >
              {/* order header */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Order #{order.code}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.paymentStatus === "PAID"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>

              {/* order details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  {order.OrderDetails.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 border-b py-2"
                    >
                      <img
                        src={item.Product.thumbnailUrl}
                        alt={item.Product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{item.Product.name}</div>
                        <div className="text-gray-500 text-sm">
                          Quantity: {item.quantity} - Total:{" "}
                          {formatCurrency(item.subtotal)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div>
                    <strong>Total:</strong> {formatCurrency(order.totalAmount)}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`px-2 py-1 rounded text-white text-xs font-bold ${
                        STATUS_COLORS[order.status] || "bg-gray-400"
                      }`}
                    >
                      {order.status.replace("_", " ")}
                    </span>
                  </div>
                  <div>
                    <strong>Payment method:</strong> {order.paymentMethod}
                  </div>
                  <div>
                    <strong>Delivery:</strong> {order.deliveryAddress}
                  </div>
                  <div>
                    <strong>Created At:</strong>{" "}
                    {formatDateTime(order.createdAt)}
                  </div>
                  <div>
                    <strong>Updated At:</strong>{" "}
                    {formatDateTime(order.updatedAt)}
                  </div>
                </div>
              </div>

              {/* progress bar */}
              <div className="mt-2">
                <div className="flex h-2 w-full rounded overflow-hidden">
                  {getProgressSegments(order.status).map((seg) => (
                    <div
                      key={seg.status}
                      className={`flex-1 ${
                        seg.filled ? seg.color : "bg-gray-200"
                      }`}
                      title={seg.status.replace("_", " ")}
                    ></div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1 font-bold">
                  {STATUS_ORDER.map((s) => (
                    <span key={s} className="truncate">
                      {s.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </div>

              {/* status message */}
              {order.status === "CANCELLED" && (
                <div className="text-red-500 font-semibold mt-2">
                  Order Cancelled
                </div>
              )}
              {order.status === "CANCEL_REQUESTED" && (
                <div className="text-orange-500 font-semibold mt-2">
                  Cancellation Requested
                </div>
              )}

              {/* action buttons */}
              <div className="flex gap-3 mt-3">
                {canCancelPending(order) && (
                  <button
                    className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => handleCancelPending(order.id)}
                  >
                    Cancel
                  </button>
                )}
                {order.status === "CONFIRMED" && (
                  <button
                    className="px-4 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                    onClick={() => handleOpenRequestModal(order.id)}
                  >
                    Request Cancel
                  </button>
                )}
                {order.status === "PENDING" && (
                  <button
                    className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => handlePayCOD(order.id)}
                  >
                    Pay COD
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* modal for cancel request */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-96 p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Enter reason for cancel request
            </h2>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border rounded p-2 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Type your reason here..."
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleSubmitRequest}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
