import { api } from "./base";
import { Coupon } from "../types/counpon";

export const couponApi = {
  getAll: async (): Promise<Coupon[]> => {
    const { data } = await api.get("/coupons");
    return data.data;
  },
  getValid: async (orderTotal: number): Promise<Coupon[]> => {
    const { data } = await api.get("/coupons/valid", {
      params: { orderTotal},
    });
    return data.data;
  },
  getByCode: async (code: string): Promise<Coupon | null> => {
    const { data } = await api.get(`/coupons/${code}`);
    return data.data;
  },
  create: async (payload: {
    code: string;
    userId?: number;
    type: "PERCENT" | "AMOUNT";
    value: string;
    minOrderAmount?: string;
    maxDiscountValue?: string;
    expiresAt: string;
  }) => {
    const { data } = await api.post("/coupons", payload);
    return data.data;
  },

  update: async (
    id: number,
    payload: Partial<{
      code: string;
      type: "PERCENT" | "AMOUNT";
      value: string;
      minOrderAmount?: string;
      maxDiscountValue?: string;
      expiresAt: string;
      isUsed?: boolean;
    }>
  ) => {
    const { data } = await api.put(`/coupons/${id}`, payload);
    return data.data;
  },

  /** 🗑️ Xoá coupon */
  remove: async (id: number) => {
    const { data } = await api.delete(`/coupons/${id}`);
    return data.data;
  },
};