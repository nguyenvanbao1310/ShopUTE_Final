import apiClient from "./api";

export type RevenueResponse = {
  currentRevenue: number;
  trend: string;
  trendValue: number;
  monthlyRevenue: { month: string; revenue: number | string | null }[];
};
export type CashFlowData = {
  shipping: number;
  completed: number;
  total: number;
};
export type ForecastResponse = {
  history: { month: string; revenue: number }[];
  forecast: { ds: string; yhat: number }[];
};
export type TopProduct = {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  totalSold: number;
};
export type LocationSales = {
  name: string;
  percent: number;
};
// 📦 Inventory forecast
export type InventoryForecastItem = {
  month: string;
  predicted_sold: number;
  predicted_stock: number;
};

export type InventoryAlert = {
  productId: number;
  productName: string;
  currentStock: number;
  outOfStockMonth: string;
  predicted_sold: number;
};
export const analyticsApi = {
  // 📊 Lấy doanh thu theo tháng
  async getRevenue(): Promise<RevenueResponse> {
    return apiClient.get<RevenueResponse>("/analytics/revenue");
  },
  // 💰 Dòng tiền
  async getCashflow(): Promise<CashFlowData> {
    return apiClient.get<CashFlowData>("/analytics/cashflow");
  },

  // 👥 Khách hàng mới
  async getNewCustomers(): Promise<{ newUsers: number }> {
    return apiClient.get<{ newUsers: number }>("/analytics/customers");
  },

  // 🏆 Top sản phẩm bán chạy
  async getTopProducts(): Promise<TopProduct[]> {
    return apiClient.get<TopProduct[]>("/analytics/top-products");
  },
  async getSalesByLocation(): Promise<LocationSales[]> {
    return apiClient.get<LocationSales[]>("/analytics/sales-by-location");
  },
  async getForecast(): Promise<ForecastResponse> {
    return apiClient.get<ForecastResponse>("/analytics/forecast");
  },
  // 📦 Dự đoán tồn kho cho 1 sản phẩm
  async getInventoryForecast(productId: number): Promise<{
    history: { month: string; sold: number; stock: number }[];
    forecast: InventoryForecastItem[];
  }> {
    return apiClient.get(
      `/analytics/inventory-forecast?productId=${productId}`
    );
  },

  // 🧠 Dự đoán tồn kho (tất cả sản phẩm – cảnh báo sắp hết)
  async getInventoryAlerts(): Promise<InventoryAlert[]> {
    return apiClient.get<InventoryAlert[]>("/analytics/inventory-forecast/all");
  },
};
