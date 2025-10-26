import apiClient from "./api";

export type Order = {
  id: number;
  userId: number;
  user?: UserInfo; // ✅ thêm để tránh lỗi
  details?: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: "UNPAID" | "PAID" | "REFUNDED";
  note?: string;
  createdAt: string;
  updatedAt: string;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "SHIPPED"
    | "COMPLETED"
    | "CANCELLED"
    | "CANCEL_REQUESTED";
  deliveryAddress: string;
  discountAmount: number;
  shippingFee: number;
  finalAmount: number;
  usedPoints: number;
  pointsDiscountAmount: number;
  voucherId?: number | null;
  shippingMethodId?: number | null;
  code: string;
};

export type OrderItem = {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
};

export type UserInfo = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export const orderApi = {
  getAll: async (page = 1, limit = 7, search = "") => {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      search,
    });

    // Fetch wrapper đã tự parse JSON -> trả về object luôn
    return apiClient.get<{
      data: Order[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/orders?${query.toString()}`);
  },

  async getById(id: number): Promise<Order> {
    return apiClient.get<Order>(`/orders/${id}`);
  },

  async updateStatus(id: number, status: Order["status"]): Promise<Order> {
    return apiClient.patch<Order>(`/orders/status/${id}`, { status });
  },
};
