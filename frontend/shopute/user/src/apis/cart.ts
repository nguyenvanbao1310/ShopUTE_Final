// src/apis/cart.ts
import { api } from "./base";

export type CartItemDTO = {
  id: number;
  productId: number;
  name?: string;
  imageUrl?: string;
  price?: number;        // chỉ để hiển thị
  quantity: number;
  selected: boolean;
};

export type CartDTO = {
  cartId: number;
  totalItems: number;     // số loại sản phẩm
  totalQuantity: number;  // tổng số lượng
  items: CartItemDTO[];
};

type ApiEnvelope<T> = { success: boolean; data: T };
type ApiResp<T> = ApiEnvelope<T> | T;

export async function fetchCart(): Promise<CartDTO> {
  const { data } = await api.get<ApiResp<CartDTO>>("/cart");
  // Hỗ trợ cả 2 kiểu: {success,data} hoặc trả thẳng object
  return (data as any)?.data ?? (data as any);
}

export async function addItem(productId: number, quantity = 1): Promise<void> {
  await api.post("/cart/items", { productId, quantity });
}

export async function updateItem(
  itemId: number,
  patch: { quantity?: number; selected?: boolean }
): Promise<void> {
  await api.patch(`/cart/items/${itemId}`, patch);
}

export async function removeItem(itemId: number): Promise<void> {
  await api.delete(`/cart/items/${itemId}`);
}

export async function clearCart(): Promise<void> {
  await api.delete(`/cart/clear`);
}

export async function toggleSelectAll(selected: boolean): Promise<void> {
  await api.post(`/cart/toggle-select-all`, { selected });
}

export async function mergeGuestCart(deviceId: string): Promise<void> {
  await api.post(`/cart/merge`, { deviceId });
}
