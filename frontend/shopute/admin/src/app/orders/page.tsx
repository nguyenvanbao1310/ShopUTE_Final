"use client";

import React, { useEffect, useState } from "react";
import { orderApi, Order } from "@/lib/orderApi";
import { AdminButton } from "@/components/ui/AdminButton";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AdminLayout from "../admin/layout";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🧭 Phân trang
  const [page, setPage] = useState(1);
  const [limit] = useState(7);
  const [total, setTotal] = useState(0);

  // 🧾 Load danh sách đơn hàng có phân trang
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data, total } = await orderApi.getAll(page, limit, search);
        setOrders(data);
        setTotal(total);
      } catch (err) {
        console.error("❌ Lỗi tải đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [page, limit, search]);

  const badgeColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700";
      case "UNPAID":
        return "bg-gray-100 text-gray-600";
      case "REFUNDED":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case "COMPLETED":
        return "text-green-600";
      case "SHIPPED":
        return "text-blue-600";
      case "PENDING":
        return "text-orange-600";
      case "CANCELLED":
        return "text-red-600";
      case "CONFIRMED":
        return "text-indigo-600";
      default:
        return "text-gray-600";
    }
  };

  const handleViewOrder = async (order: Order) => {
    try {
      setLoading(true);
      const fullOrder = await orderApi.getById(order.id);
      setSelectedOrder(fullOrder);
      setOpen(true);
    } catch (err) {
      console.error("❌ Lỗi tải chi tiết đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Danh sách đơn hàng</h2>
          <Input
            placeholder="🔍 Tìm theo mã đơn hoặc địa chỉ..."
            className="w-72"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
          />
        </div>

        {/* 🧾 Bảng danh sách đơn */}
        <div className="overflow-x-auto bg-white rounded-xl shadow border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 border-b">
              <tr>
                <th className="p-3 text-left">Mã đơn</th>
                <th className="p-3 text-left">Mã KH</th>
                <th className="p-3 text-left">Địa chỉ</th>
                <th className="p-3 text-left">Thanh toán</th>
                <th className="p-3 text-left">Trạng thái</th>
                <th className="p-3 text-right">Tổng tiền</th>
                <th className="p-3 text-left">Ngày tạo</th>
                <th className="p-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {!loading &&
                orders.map((o) => (
                  <tr key={o.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">#{o.code || o.id}</td>
                    <td className="p-3">{o.userId}</td>
                    <td className="p-3">{o.deliveryAddress}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${badgeColor(
                          o.paymentStatus
                        )}`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className={`p-3 font-medium ${statusColor(o.status)}`}>
                      {o.status}
                    </td>
                    <td className="p-3 font-semibold text-right">
                      {Number(o.totalAmount).toLocaleString("vi-VN")}₫
                    </td>
                    <td className="p-3">
                      {new Date(o.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="p-3 text-center">
                      <AdminButton
                        variant="secondary"
                        onClick={() => handleViewOrder(o)}
                      >
                        👁
                      </AdminButton>
                    </td>
                  </tr>
                ))}

              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 p-6">
                    Không có đơn hàng nào phù hợp.
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 p-6">
                    ⏳ Đang tải dữ liệu...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🔢 PHÂN TRANG */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={`px-3 py-1 rounded border ${
                page === 1
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              ← Trước
            </button>
            <span className="text-gray-700">
              Trang <b>{page}</b> / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className={`px-3 py-1 rounded border ${
                page >= totalPages
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              Sau →
            </button>
          </div>
        )}
      </div>

      {/* 💬 Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="!max-w-none !w-[95vw] !h-[90vh] p-8 bg-gray-50 overflow-y-auto rounded-2xl shadow-lg">
            <div
              id="order-pdf-content"
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <DialogHeader>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                      🧾 Đơn hàng #{selectedOrder.code || selectedOrder.id}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                      Ngày tạo:{" "}
                      {new Date(selectedOrder.createdAt).toLocaleString(
                        "vi-VN"
                      )}
                    </DialogDescription>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                      onClick={async () => {
                        const element =
                          document.getElementById("order-pdf-content");
                        if (!element) return;

                        const { jsPDF } = await import("jspdf");
                        const html2canvas = (await import("html2canvas-pro"))
                          .default;

                        // Tạo ảnh từ phần nội dung muốn export
                        const canvas = await html2canvas(element, {
                          scale: 2,
                          useCORS: true,
                        });
                        const imgData = canvas.toDataURL("image/png");

                        const pdf = new jsPDF("p", "mm", "a4");
                        const imgProps = pdf.getImageProperties(imgData);
                        const pdfWidth = pdf.internal.pageSize.getWidth();
                        const pdfHeight =
                          (imgProps.height * pdfWidth) / imgProps.width;

                        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
                        pdf.save(
                          `order-${selectedOrder.code || selectedOrder.id}.pdf`
                        );
                      }}
                    >
                      📄 Xuất PDF
                    </button>
                    {selectedOrder.status === "CANCEL_REQUESTED" && (
                      <div className="flex gap-3">
                        <button
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          onClick={async () => {
                            if (!confirm("Xác nhận hủy đơn hàng này?")) return;
                            try {
                              await orderApi.updateStatus(
                                selectedOrder.id,
                                "CANCELLED"
                              );
                              alert("✅ Đã hủy đơn hàng thành công!");
                              setSelectedOrder({
                                ...selectedOrder,
                                status: "CANCELLED",
                              });
                            } catch (err) {
                              console.error(err);
                              alert("❌ Lỗi khi hủy đơn hàng");
                            }
                          }}
                        >
                          ❌ Xác nhận hủy đơn
                        </button>

                        <button
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                          onClick={async () => {
                            if (!confirm("Từ chối yêu cầu hủy đơn hàng này?"))
                              return;
                            try {
                              await orderApi.updateStatus(
                                selectedOrder.id,
                                "CONFIRMED"
                              );
                              alert("✅ Đã từ chối yêu cầu hủy!");
                              setSelectedOrder({
                                ...selectedOrder,
                                status: "CONFIRMED",
                              });
                            } catch (err) {
                              console.error(err);
                              alert("❌ Lỗi khi cập nhật trạng thái");
                            }
                          }}
                        >
                          ↩️ Từ chối yêu cầu hủy
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-3 gap-8">
                {/* ============ TRÁI ============ */}
                <div className="col-span-2 space-y-8">
                  {/* Chi tiết sản phẩm */}
                  <div className="bg-white rounded-xl border shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                      🛍️ Chi tiết sản phẩm
                    </h3>
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 text-gray-600 border-b">
                        <tr>
                          <th className="p-3 text-left font-medium">
                            Sản phẩm
                          </th>
                          <th className="p-3 text-right font-medium">Giá</th>
                          <th className="p-3 text-center font-medium">SL</th>
                          <th className="p-3 text-right font-medium">Tổng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.details?.map((d: any) => (
                          <tr
                            key={d.id}
                            className="border-b last:border-none hover:bg-gray-50"
                          >
                            <td className="p-3 flex items-center gap-3">
                              <img
                                src={
                                  d.product?.thumbnailUrl
                                    ? `${process.env.NEXT_PUBLIC_API_BASE_IMAGE_URL}/${d.product.thumbnailUrl}`
                                    : "/images/avatar-placeholder.png"
                                }
                                onError={(e) =>
                                  (e.currentTarget.src =
                                    "/images/avatar-placeholder.png")
                                }
                                alt="Ảnh"
                                className="w-12 h-12 rounded-lg border object-cover"
                              />
                              <div>
                                <p className="font-medium text-gray-800">
                                  {d.product?.name || "Không có tên"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {d.product?.brand || ""}
                                </p>
                              </div>
                            </td>
                            <td className="p-3 text-right text-gray-700">
                              {Number(d.product?.price || 0).toLocaleString(
                                "vi-VN"
                              )}
                              ₫
                            </td>
                            <td className="p-3 text-center text-gray-700">
                              {d.quantity}
                            </td>
                            <td className="p-3 text-right font-semibold text-gray-900">
                              {Number(d.subtotal || 0).toLocaleString("vi-VN")}₫
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Tổng kết */}
                    <div className="mt-6 text-right text-sm text-gray-700 space-y-1">
                      {(() => {
                        const subTotal = Number(selectedOrder.totalAmount || 0);
                        const discount = Number(
                          selectedOrder.discountAmount || 0
                        );
                        const shipping = Number(selectedOrder.shippingFee || 0);
                        const vat = Math.round(
                          (subTotal - discount + shipping) * 0.03
                        ); // 3%
                        const grandTotal = subTotal - discount + shipping + vat;

                        return (
                          <>
                            <p>
                              <span className="font-medium">Tạm tính:</span>{" "}
                              {subTotal.toLocaleString("vi-VN")}₫
                            </p>
                            <p>
                              <span className="font-medium">Giảm giá:</span>{" "}
                              {discount > 0
                                ? `-${discount.toLocaleString("vi-VN")}₫`
                                : "0₫"}
                            </p>
                            <p>
                              <span className="font-medium">
                                Phí vận chuyển:
                              </span>{" "}
                              {shipping.toLocaleString("vi-VN")}₫
                            </p>
                            <p>
                              <span className="font-medium">VAT (3%):</span>{" "}
                              {vat.toLocaleString("vi-VN")}₫
                            </p>
                            <hr className="my-2 border-gray-200" />
                            <p className="text-lg font-bold text-indigo-700">
                              Tổng cộng: {grandTotal.toLocaleString("vi-VN")}₫
                            </p>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Trạng thái đơn hàng */}
                  <div className="bg-white rounded-xl border shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                      🚦 Trạng thái đơn hàng
                    </h3>
                    <div className="space-y-3 text-sm">
                      {[
                        { key: "PENDING", label: "🕒 Đang chờ xác nhận" },
                        { key: "CONFIRMED", label: "✅ Đã xác nhận" },
                        { key: "PREPARING", label: "📦 Đang chuẩn bị hàng" },
                        { key: "SHIPPED", label: "🚚 Đang giao hàng" },
                        { key: "COMPLETED", label: "🎉 Hoàn tất" },
                        {
                          key: "CANCEL_REQUESTED",
                          label: "⚠️ Khách yêu cầu hủy",
                        },
                        { key: "CANCELLED", label: "❌ Đã hủy" },
                      ].map((s) => (
                        <div
                          key={s.key}
                          className="flex items-center gap-3 transition"
                        >
                          <div
                            className={`w-4 h-4 rounded-full border ${
                              selectedOrder.status === s.key
                                ? "bg-green-500 border-green-500"
                                : "bg-gray-200 border-gray-300"
                            }`}
                          ></div>
                          <span
                            className={`${
                              selectedOrder.status === s.key
                                ? "font-semibold text-green-700"
                                : "text-gray-600"
                            }`}
                          >
                            {s.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ============ PHẢI ============ */}
                <div className="space-y-6">
                  {/* Khách hàng */}
                  <div className="bg-white border rounded-xl p-5 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">
                      👤 Khách hàng
                    </h3>
                    <div className="flex items-center gap-4">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_BASE_IMAGE_URL}/uploads/avatar/avatar-placeholder.jpg`}
                        onError={(e) =>
                          (e.currentTarget.src = `${process.env.NEXT_PUBLIC_API_BASE_IMAGE_URL}/uploads/avatar/avatar-placeholder.jpg`)
                        }
                        className="w-16 h-16 rounded-full border object-cover shadow-sm"
                        alt="avatar"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedOrder.user
                            ? `Tên khách hàng: ${selectedOrder.user.firstName} ${selectedOrder.user.lastName}`
                            : `Khách hàng #${selectedOrder.userId}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          Email: {selectedOrder.user?.email || "—"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Số điện thoại: {selectedOrder.user?.phone || "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Địa chỉ */}
                  <div className="bg-white border rounded-xl p-5 shadow-sm">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">
                      📍 Địa chỉ giao hàng
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {selectedOrder.deliveryAddress || "Không có địa chỉ"}
                    </p>
                  </div>

                  {/* Thanh toán */}
                  <div className="bg-white border rounded-xl p-5 shadow-sm">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">
                      💳 Thanh toán
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong className="text-gray-700">Phương thức:</strong>{" "}
                        {selectedOrder.paymentMethod || "Không có"}
                      </p>
                      <p>
                        <strong className="text-gray-700">Trạng thái:</strong>{" "}
                        <span
                          className={`font-medium ${
                            selectedOrder.paymentStatus === "PAID"
                              ? "text-green-600"
                              : "text-gray-600"
                          }`}
                        >
                          {selectedOrder.paymentStatus}
                        </span>
                      </p>
                      <p>
                        <strong className="text-gray-700">
                          Ngày thanh toán:
                        </strong>{" "}
                        {new Date(selectedOrder.createdAt).toLocaleString(
                          "vi-VN"
                        )}
                      </p>
                      <p>
                        <strong className="text-gray-700">Số tiền:</strong>{" "}
                        <span className="font-semibold text-indigo-700">
                          {Number(
                            selectedOrder.totalAmount || 0
                          ).toLocaleString("vi-VN")}
                          ₫
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
}
