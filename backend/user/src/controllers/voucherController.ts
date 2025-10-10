import * as voucherService from "../services/voucherService";
import { Request, Response } from "express";

export const createVoucher = async (req: Request, res: Response) => {
  try {
    const voucher = await voucherService.createVoucher(req.body);
    return res.status(201).json({ success: true, data: voucher });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

/** Lấy tất cả voucher */
export const getAllVouchers = async (req: Request, res: Response) => {
  try {
    const vouchers = await voucherService.getAllVouchers();
    return res.json({ success: true, data: vouchers });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/** Lấy voucher theo code */
export const getVoucherByCode = async (req: Request, res: Response) => {
  try {
    const  code  = req.params.code as string;
    const voucher = await voucherService.getVoucherByCode(code);
    if (!voucher) {
      return res.status(404).json({ success: false, message: "Voucher not found" });
    }
    return res.json({ success: true, data: voucher });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/** Lấy voucher còn hạn, sắp xếp theo giá trị giảm cho đơn hàng */
export const getValidVouchers = async (req: Request, res: Response) => {
  try {
    const orderTotal = Number(req.query.orderTotal ?? 0);
    const vouchers = await voucherService.getBestVouchersForOrder(orderTotal);
    return res.json({ success: true, data: vouchers });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/** Cập nhật voucher */
export const updateVoucher = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const voucher = await voucherService.updateVoucher(id, req.body);
    if (!voucher) {
      return res.status(404).json({ success: false, message: "Voucher not found" });
    }
    return res.json({ success: true, data: voucher });
  } catch (err: any) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

/** Xoá voucher */
export const deleteVoucher = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const deleted = await voucherService.deleteVoucher(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Voucher not found" });
    }
    return res.json({ success: true, message: "Voucher deleted successfully" });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};