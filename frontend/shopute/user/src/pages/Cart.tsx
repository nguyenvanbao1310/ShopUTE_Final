import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../store/store";
import {
  clearCart,
  fetchCart,
  selectAll,
  selectCart,
  selectCartBadge,
  selectCartStatus,
  unselectAll,
} from "../store/cartSlice";
import CartItem from "../components/cart/CartItem";
import MainLayout from "../layouts/MainLayout";

const CartPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector(selectCart);
  const badge = useSelector(selectCartBadge); // số LOẠI
  const status = useSelector(selectCartStatus);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const summary = useMemo(() => {
    const items = cart?.items ?? [];
    const selectedItems = items.filter((it) => it.selected);
    const selectedAmount = selectedItems.reduce((s, it) => s + it.price * it.quantity, 0);
    const selectedQty = selectedItems.reduce((s, it) => s + it.quantity, 0);

    return {
      totalItems: cart?.totalItems ?? items.length,               // số LOẠI
      totalQuantity: cart?.totalQuantity ?? items.reduce((s, it) => s + it.quantity, 0),
      selectedItems: selectedItems.length,
      selectedQty,
      selectedAmount,
    };
  }, [cart]);

  if (status === "loading" && !cart) {
    return (
      <MainLayout>
        <div className="py-12 text-center text-gray-500">Đang tải giỏ hàng…</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-semibold mb-2">Giỏ hàng</h1>
        <p className="text-sm text-gray-500 mb-4">
          Tổng số <b>{badge}</b> loại sản phẩm trong giỏ (hiển thị trên badge).
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-2 mb-4">
              <button className="px-3 py-1.5 border rounded" onClick={() => dispatch(selectAll())}>
                Chọn tất cả
              </button>
              <button className="px-3 py-1.5 border rounded" onClick={() => dispatch(unselectAll())}>
                Bỏ chọn tất cả
              </button>
              <button className="ml-auto px-3 py-1.5 border rounded text-red-600" onClick={() => dispatch(clearCart())}>
                Xoá toàn bộ
              </button>
            </div>

            {!cart?.items?.length ? (
              <div className="py-8 text-center text-gray-500">Giỏ hàng trống.</div>
            ) : (
              cart.items.map((it) => <CartItem key={it.id} item={it} />)
            )}
          </div>

          <aside className="bg-white rounded-lg shadow p-4 h-fit sticky top-24">
            <h2 className="text-lg font-semibold mb-3">Tóm tắt</h2>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Tổng loại</span>
                <span>{summary.totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Tổng số lượng</span>
                <span>{summary.totalQuantity}</span>
              </div>
              <div className="flex justify-between">
                <span>Đã chọn</span>
                <span>
                  {summary.selectedItems} loại / {summary.selectedQty} sp
                </span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t mt-2">
                <span>Tạm tính</span>
                <span>{summary.selectedAmount.toLocaleString("vi-VN")}₫</span>
              </div>
            </div>
            <button className="mt-4 w-full bg-green-600 text-white rounded-lg py-2 hover:bg-green-700 disabled:opacity-50"
              disabled={summary.selectedItems === 0}
              onClick={() => navigate("/checkout")}
            >
              Thanh toán
            </button>
            <p className="mt-3 text-xs text-gray-500">
              *Giá trong giỏ chỉ mang tính hiển thị. Tổng thanh toán tính theo sản phẩm được chọn.
            </p>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;
