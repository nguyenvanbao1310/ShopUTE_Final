import { api } from "./base";
import { Voucher } from "../types/voucher";
export const voucherApi = {
  getAll: async (): Promise<Voucher[]> => {
    const { data } = await api.get("/vouchers");
    return data.data;
  },

  getValid: async (orderTotal: number): Promise<Voucher[]> => {
    const { data } = await api.get("/vouchers/valid", {
      params: { orderTotal },
    });
    return data.data;
  },

  getByCode: async (code: string): Promise<Voucher | null> => {
    const { data } = await api.get(`/vouchers/${code}`);
    return data.data;
  },
    create: async (payload: {
    code: string;
    description?: string;
    discountType: "PERCENT" | "FIXED"; 
    discountValue: string;
    minOrderValue?: string;
    expiredAt: string;
    }) => {
    const { data } = await api.post("/vouchers", payload);
    return data.data;
  },
   update: async (
    id: number,
    payload: Partial<{
      code: string;
      discountType: "PERCENT" | "FIXED";
      discountValue: string;
      minOrderValue?: string;
      expiredAt: string;
    }>
  ) => {
    const { data } = await api.put(`/vouchers/${id}`, payload);
    return data.data;
  },

  remove: async (id: number) => {
    const { data } = await api.delete(`/vouchers/${id}`);
    return data.data;
  },
};