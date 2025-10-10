// src/apis/addressApi.ts
import { api } from "./base";
import {Address }from "../types/address";
export const addressApi = {
  getAll: async (): Promise<Address[]> => {
    const { data } = await api.get("/address");
    return data.data;
  },
  create: async (payload: {
    street: string;
    ward: string;
    province: string;
    phone: string;
    isDefault?: boolean;
  }) => {
    const { data } = await api.post("/address/create", payload);
    return data.data;
  },
  update: async (
    id: number,
    payload: {
      street: string;
      ward: string;
      province: string;
      phone: string;
      isDefault?: boolean;
    }
  ) => {
    const { data } = await api.put(`/address/${id}`, payload);
    return data.data;
  },
  remove: async (id: number) => {
    const { data } = await api.delete(`/address/${id}`);
    return data.data;
  },
};
