// orderApi.ts
import { api } from "./base";
import type { CancelOrderResponse, Order } from "../types/order";

export async function getUserOrders(): Promise<Order[]> {
  const res = await api.get<{ orders: Order[] }>("/order/user");
  return res.data.orders;
}

export const cancelPendingOrder = async (
  orderId: number
): Promise<CancelOrderResponse> => {
  const { data } = await api.post("/order/cancel-pending", { orderId });
  return data;
};

export const requestCancelOrder = async (
  orderId: number,
  reason: string
): Promise<CancelOrderResponse> => {
  const { data } = await api.post("/order/cancel-request", { orderId, reason });
  return data;
};

export async function payOrderCOD(orderId: number): Promise<void> {
  await api.post("/order/pay-cod", { orderId });
}
export async function createOrder(data: any): Promise<{ order: Order; details: any[] }> {
  const res = await api.post("/order/create", data); 
  return res.data; 
}

export async function payWithMomo(orderId: number): Promise<{ payUrl: string }> {
  const res = await api.post("/order/pay-momo", { orderId });
  return res.data; // { payUrl }
}