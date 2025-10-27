// inventory-alert.type.ts
export interface InventoryAlert {
  productId: number;
  productName: string;
  currentStock: number;
  outOfStockMonth: string;
  predicted_sold: number;
  alertLevel?: 'HIGH' | 'MEDIUM' | 'LOW'; // Thêm mức độ cảnh báo
}