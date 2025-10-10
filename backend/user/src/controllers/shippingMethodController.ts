import { Request, Response } from "express";
import * as shippingMethodService from "../services/shippingMethodService";

// Lấy tất cả shipping methods
export const getAllShippingMethods = async (req: Request, res: Response) => {
  try {
    const methods = await shippingMethodService.getAllShippingMethods();
    res.json({ success: true, data: methods });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Lấy chi tiết shipping method theo id
export const getShippingMethodById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const method = await shippingMethodService.getShippingMethodById(id);
    if (!method) {
      return res
        .status(404)
        .json({ success: false, message: "Shipping method not found" });
    }
    res.json({ success: true, data: method });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Tạo mới shipping method
export const createShippingMethod = async (req: Request, res: Response) => {
  try {
    const method = await shippingMethodService.createShippingMethod(req.body);
    res.status(201).json({ success: true, data: method });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// Cập nhật shipping method
export const updateShippingMethod = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const updated = await shippingMethodService.updateShippingMethod(
      id,
      req.body
    );
    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Shipping method not found" });
    }
    res.json({ success: true, data: updated });
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// Xóa shipping method
export const deleteShippingMethod = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleted = await shippingMethodService.deleteShippingMethod(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Shipping method not found" });
    }
    res.json({ success: true, message: "Deleted successfully" });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
};
