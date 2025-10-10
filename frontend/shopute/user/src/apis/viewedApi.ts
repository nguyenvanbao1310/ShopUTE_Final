// src/apis/viewedApi.ts
import { api } from "./base";

export const viewedApi = {
  // Lấy danh sách sản phẩm đã xem
  getViewedProducts: () => api.get("/viewed"),

  // Thêm sản phẩm vào danh sách đã xem
  addViewedProduct: (productId: number) => api.post(`/viewed/${productId}`),
  removeViewedProduct: (productId: number) =>
    api.delete(`/viewed/${productId}`),
};
