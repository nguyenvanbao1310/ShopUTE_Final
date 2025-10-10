export interface ShippingMethod {
  id: number;
  name: string;
  fee: string;              // Sequelize DECIMAL => string
  estimatedDays?: string | null; // ví dụ: "2-3 ngày"
}
