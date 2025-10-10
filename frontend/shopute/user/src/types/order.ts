// src/types/order.ts
export interface Product {
  id: number;
  name: string;
  price: number; // <-- nên để number thay vì string
  thumbnailUrl: string;
}

export interface OrderDetail {
  id: number;
  Product: Product;
  quantity: number;
  subtotal: number; // <-- đổi từ string -> number
}

export interface Order {
  id: number;
  code: string;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "CANCELLED"
    | "SHIPPED"
    | "COMPLETED"
    | "CANCEL_REQUESTED";
  paymentMethod: string;
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  totalAmount: number; // <-- đổi từ string -> number
  deliveryAddress: string;
  OrderDetails: OrderDetail[];
  createdAt: string; // <-- thêm
  updatedAt: string; // <-- thêm
}
export interface CancelOrderResponse {
  type: "cancelled" | "request";
  order?: Order; // khi type === "cancelled"
  message?: string; // khi type === "request"
}
export const POINTS_TO_VND_RATE = 1000;
export const DEFAULT_PAYMENT_METHOD = "COD";

export const PAYMENT_METHODS = [
  { 
    id: "COD", 
    label: "Thanh toán khi nhận hàng",
    desc: "Trả tiền mặt khi nhận hàng"
  },
  { 
    id: "VNPAY", 
    label: "Ví VNPAY",
    desc: "Thanh toán qua ví điện tử VNPAY"
  },
] as const;

export const ORDER_STATUS = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  CONFIRMED: "CONFIRMED",
  SHIPPING: "SHIPPING",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED"
} as const;