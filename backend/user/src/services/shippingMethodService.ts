import ShippingMethod from "../models/ShippingMethod";
import { ShippingMethodAttributes  } from "../types/shippingMethod";

export const createShippingMethod = async (
  data: Omit<ShippingMethodAttributes, "id">
) => {
  return await ShippingMethod.create(data);
};

// Lấy tất cả shipping methods
export const getAllShippingMethods = async () => {
  return await ShippingMethod.findAll();
};

// Lấy chi tiết theo ID
export const getShippingMethodById = async (id: number) => {
  return await ShippingMethod.findByPk(id);
};

// Cập nhật shipping method
export const updateShippingMethod = async (
  id: number,
  data: Partial<ShippingMethodAttributes>
) => {
  const method = await ShippingMethod.findByPk(id);
  if (!method) return null;
  return await method.update(data);
};

// Xóa shipping method
export const deleteShippingMethod = async (id: number) => {
  const method = await ShippingMethod.findByPk(id);
  if (!method) return null;
  await method.destroy();
  return true;
};