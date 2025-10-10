// Định nghĩa enum cho trạng thái đơn hàng
export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PREPARING = "PREPARING",
  SHIPPED = "SHIPPED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  CANCEL_REQUESTED = "CANCEL_REQUESTED",
}

// Định nghĩa enum cho trạng thái thanh toán
export enum PaymentStatus {
  UNPAID = "UNPAID",
  PAID = "PAID",
  REFUNDED = "REFUNDED",
}
