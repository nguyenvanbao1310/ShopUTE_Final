import { api } from "./base";
import { ShippingMethod } from "../types/shippingMethod";

export const shippingMethodApi = {
  getAll: async (): Promise<ShippingMethod[]> => {
    const { data } = await api.get("/shipping-methods");
    return data.data;
  },
  getById: async (id: number): Promise<ShippingMethod> => {
    const { data } = await api.get(`/shipping-methods/${id}`);
    return data.data;
  },
  create: async (payload: Omit<ShippingMethod, "id" | "createdAt" | "updatedAt">) => {
    const { data } = await api.post("/shipping-methods", payload);
    return data.data;
  },
  update: async (id: number, payload: Partial<ShippingMethod>) => {
    const { data } = await api.put(`/shipping-methods/${id}`, payload);
    return data.data;
  },
  remove: async (id: number) => {
    const { data } = await api.delete(`/shipping-methods/${id}`);
    return data.data;
  },
};
